package Procesos.software.gestion_pagos_educativos.controller;

import Procesos.software.gestion_pagos_educativos.config.JwtUtil;
import Procesos.software.gestion_pagos_educativos.model.entity.*;
import Procesos.software.gestion_pagos_educativos.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class PagoControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EstudianteRepository estudianteRepository;

    @Autowired
    private ConceptoPagoRepository conceptoPagoRepository;

    @Autowired
    private DeudaRepository deudaRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    private String token;
    private Long deudaId;

    @BeforeEach
    void setUp() {
        usuarioRepository.deleteAll();
        estudianteRepository.deleteAll();
        conceptoPagoRepository.deleteAll();
        deudaRepository.deleteAll();

        Usuario padre = new Usuario();
        padre.setNombreCompleto("Padre Test");
        padre.setEmail("padre@test.com");
        padre.setPassword(passwordEncoder.encode("password123"));
        padre.setRol("parent");
        padre.setActivo(true);
        padre = usuarioRepository.save(padre);

        token = jwtUtil.generateToken(padre.getId(), padre.getEmail(), padre.getRol());

        Estudiante estudiante = new Estudiante();
        estudiante.setNombreCompleto("Estudiante Test");
        estudiante.setGrado("5to");
        estudiante.setSeccion("A");
        estudiante.setCodigoEstudiante("TEST001");
        estudiante.setUsuario(padre);
        estudiante = estudianteRepository.save(estudiante);

        ConceptoPago concepto = new ConceptoPago();
        concepto.setNombre("Pensión Mensual");
        concepto.setMontoBase(new BigDecimal("450.00"));
        concepto.setActivo(true);
        concepto = conceptoPagoRepository.save(concepto);

        Deuda deuda = new Deuda();
        deuda.setEstudiante(estudiante);
        deuda.setConceptoPago(concepto);
        deuda.setMontoTotal(new BigDecimal("450.00"));
        deuda.setSaldoPendiente(new BigDecimal("450.00"));
        deuda.setFechaVencimiento(LocalDate.now().plusDays(30));
        deuda.setEstado("PENDIENTE");
        deuda.setAnioAcademico(2024);
        deuda = deudaRepository.save(deuda);
        deudaId = deuda.getId();
    }

    @Test
    void testRealizarPagoExitoso() throws Exception {
        mockMvc.perform(post("/pagos/realizar")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"deudaId\":" + deudaId + ",\"monto\":450.00,\"metodoPago\":\"EFECTIVO\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.reciboId").isNumber());
    }

    @Test
    void testRealizarPagoSinAuth() throws Exception {
        mockMvc.perform(post("/pagos/realizar")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"deudaId\":" + deudaId + ",\"monto\":450.00}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void testRealizarPagoMontoNegativo() throws Exception {
        mockMvc.perform(post("/pagos/realizar")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"deudaId\":" + deudaId + ",\"monto\":-100.00}"))
                .andExpect(status().isBadRequest());
    }
}
