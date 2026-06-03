const API_AUTH_URL = 'http://localhost:8080/api/auth';

async function login(email, password) {
    const btn = document.getElementById('loginBtn');
    const originalText = btn ? btn.innerHTML : '';
    if (btn) {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iniciando...';
        btn.disabled = true;
    }

    try {
        const response = await fetch(`${API_AUTH_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const userData = await response.json();

            if (userData.success) {
                const session = {
                    id: userData.id,
                    nombre: userData.nombre,
                    email: userData.email,
                    rol: userData.rol,
                    token: userData.token,
                    loginTime: new Date().toISOString()
                };

                localStorage.setItem('authSession', JSON.stringify(session));

                mostrarToast('Inicio de sesión exitoso', 'success');

                setTimeout(() => {
                    if (userData.rol === 'admin') {
                        window.location.href = 'admin/dashboard.html';
                    } else {
                        window.location.href = 'parent/dashboard.html';
                    }
                }, 500);
                return;
            }
        }

        mostrarToast('Credenciales incorrectas', 'error');
    } catch (error) {
        console.error('Error de conexión:', error);
        mostrarToast('Error de conexión con el servidor', 'error');
    } finally {
        if (btn) {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }
}

function obtenerSesion() {
    try {
        const stored = localStorage.getItem('authSession');
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error('Error leyendo sesión:', e);
    }
    return null;
}

function cerrarSesion() {
    localStorage.removeItem('authSession');
    const current = window.location.href;
    if (current.includes('/admin/') || current.includes('/parent/')) {
        window.location.href = '../login.html';
    } else {
        window.location.href = 'login.html';
    }
}

function verificarRol(rolRequerido) {
    const session = obtenerSesion();
    if (!session || session.rol !== rolRequerido) {
        const current = window.location.href;
        if (current.includes('/admin/') || current.includes('/parent/')) {
            window.location.href = '../login.html';
        } else {
            window.location.href = 'login.html';
        }
        return false;
    }
    return true;
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
