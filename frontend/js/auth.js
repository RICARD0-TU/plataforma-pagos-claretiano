// ============================================
// SISTEMA DE AUTENTICACIÓN - CORREGIDO
// ============================================

const API_AUTH_URL = 'http://localhost:8080/api/auth';

async function login(email, password) {
    const btn = document.getElementById('loginBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iniciando...';
    btn.disabled = true;

    try {
        // Autenticar con el backend
        const response = await fetch(`${API_AUTH_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const userData = await response.json();
            console.log('Respuesta del login:', userData);
            
            if (userData.success) {
                // Guardar sesión correctamente
                const session = {
                    id: userData.id,
                    nombre: userData.nombre,
                    email: userData.email,
                    rol: userData.rol,
                    token: userData.token,
                    loginTime: new Date().toISOString()
                };
                
                console.log('Guardando sesión:', session);
                localStorage.setItem('authSession', JSON.stringify(session));
                
                mostrarToast('Inicio de sesión exitoso', 'success');
                
                setTimeout(() => {
                    if (userData.rol === 'admin') {
                        window.location.href = '/admin/dashboard.html';
                    } else {
                        window.location.href = '/parent/dashboard.html';
                    }
                }, 500);
                return;
            }
        }
        
        // Fallback: usuarios desde el backend directamente
        const usersResponse = await fetch('http://localhost:8080/api/usuarios');
        const usuarios = await usersResponse.json();
        console.log('Usuarios en BD:', usuarios);
        
        const user = usuarios.find(u => u.email === email && u.password === password);
        
        if (user) {
            const session = {
                id: user.id,
                nombre: user.nombreCompleto,
                email: user.email,
                rol: user.rol || 'parent',
                loginTime: new Date().toISOString()
            };
            console.log('Guardando sesión (fallback):', session);
            localStorage.setItem('authSession', JSON.stringify(session));
            mostrarToast('Inicio de sesión exitoso', 'success');
            
            setTimeout(() => {
                if (session.rol === 'admin') {
                    window.location.href = '/admin/dashboard.html';
                } else {
                    window.location.href = '/parent/dashboard.html';
                }
            }, 500);
        } else {
            mostrarToast('Credenciales incorrectas', 'error');
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        mostrarToast('Error de conexión con el servidor', 'error');
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

function obtenerSesion() {
    try {
        const stored = localStorage.getItem('authSession');
        if (stored) {
            const session = JSON.parse(stored);
            console.log('Sesión obtenida:', session);
            return session;
        }
    } catch (e) {
        console.error('Error leyendo sesión:', e);
    }
    return null;
}

function cerrarSesion() {
    localStorage.removeItem('authSession');
    window.location.href = '/login.html';
}

function mostrarToast(mensaje, tipo) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = mensaje;
        toast.className = `toast ${tipo} show`;
        setTimeout(() => {
            toast.className = 'toast';
        }, 3000);
    }
}

// Event listener para el formulario de login
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            
            if (!email || !password) {
                mostrarToast('Por favor completa todos los campos', 'error');
                return;
            }
            
            await login(email, password);
        });
    }
});