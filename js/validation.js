class Auth {
    static #STORAGE_KEYS = {
        CURRENT_USER: 'currentUser',
        USERS: 'users'
    };

    static isLoggedIn() {
        return localStorage.getItem(this.#STORAGE_KEYS.CURRENT_USER) !== null;
    }

    static getRegisteredUsers() {
        return JSON.parse(localStorage.getItem(this.#STORAGE_KEYS.USERS)) || [];
    }

    static register(userData) {
        const users = this.getRegisteredUsers();
        if (users.some(user => user.email === userData.email)) {
            throw new Error('Email already registered');
        }
        users.push(userData);
        localStorage.setItem(this.#STORAGE_KEYS.USERS, JSON.stringify(users));
    }

    static login(email, password) {
        const users = this.getRegisteredUsers();
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            throw new Error('Invalid credentials');
        }

        localStorage.setItem(this.#STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        this.updateNavigation();
        return true;
    }

    static logout() {
        localStorage.removeItem(this.#STORAGE_KEYS.CURRENT_USER);
        this.updateNavigation();
        window.location.href = 'index.html';
    }

    static updateNavigation() {
        const navElements = {
            profileLink: document.querySelector('.nav-links .profile-link'),
            loginLink: document.querySelector('.nav-links .login-link'),
            navLinks: document.querySelector('.nav-links'),
            existingLogout: document.querySelector('.logout-link')
        };

        if (this.isLoggedIn()) {
            navElements.profileLink.style.display = 'block';
            navElements.loginLink.style.display = 'none';
            
            if (!navElements.existingLogout) {
                const logoutLink = document.createElement('li');
                logoutLink.innerHTML = '<a href="#" class="logout-link">Logout</a>';
                logoutLink.addEventListener('click', this.logout.bind(this));
                navElements.navLinks.appendChild(logoutLink);
            }
        } else {
            navElements.profileLink.style.display = 'none';
            navElements.loginLink.style.display = 'block';
            navElements.existingLogout?.parentElement.remove();
        }
    }
}

class FormHandler {
    static init() {
        const elements = {
            loginForm: document.getElementById('loginForm'),
            registerForm: document.getElementById('registerForm'),
            showRegister: document.getElementById('showRegister'),
            showLogin: document.getElementById('showLogin')
        };

        if (!elements.loginForm && !elements.registerForm) return;

        this.setupFormToggles(elements);
        this.setupFormSubmissions(elements);
        this.setupPasswordToggles();
    }

    static setupFormToggles(elements) {
        elements.showRegister?.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('.login-form').style.display = 'none';
            document.querySelector('.register-form').style.display = 'block';
        });

        elements.showLogin?.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('.login-form').style.display = 'block';
            document.querySelector('.register-form').style.display = 'none';
        });
    }

    static setupFormSubmissions(elements) {
        elements.loginForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                if (Auth.login(email, password)) {
                    window.location.href = 'index.html';
                }
            } catch (error) {
                alert(error.message);
            }
        });

        elements.registerForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            const userData = {
                username: document.getElementById('regUsername').value,
                email: document.getElementById('regEmail').value,
                password: document.getElementById('regPassword').value
            };

            try {
                Auth.register(userData);
                alert('Registration successful! Please login.');
                elements.showLogin.click();
            } catch (error) {
                alert(error.message);
            }
        });
    }

    static setupPasswordToggles() {
        const loginForm = document.querySelector('.login-form');
        if (!loginForm) return;

        const togglePassword = (inputId, button) => {
            button?.addEventListener('click', () => {
                const input = document.getElementById(inputId);
                input.type = input.type === 'password' ? 'text' : 'password';
            });
        };

        togglePassword('password', document.querySelector('.login-form .toggle-password'));
        togglePassword('regPassword', document.querySelector('.register-form .toggle-password'));
    }
}

document.addEventListener('DOMContentLoaded', () => FormHandler.init());
