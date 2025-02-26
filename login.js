document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessageElement = document.getElementById('errorMessage');

    let validator = {
        isValidAll: true,
        validationMessage: {
            username: { isValid: true, message: '' },
            password: { isValid: true, message: '' }
        }
    };

    Object.freeze(validator);
    function addValidator() {
        const validators = {
            username: [['required', true], ['maxlength', 40], ['minlength', 5]],
            password: [['required', true], ['minlength', 8], ['maxlength', 15]]
        };

        validators.username.forEach(attr => usernameInput.setAttribute(attr[0], attr[1]));
        validators.password.forEach(attr => passwordInput.setAttribute(attr[0], attr[1]));
    }

    function validate() {
        validator.isValidAll = true;
        validator.validationMessage.username.isValid = true;
        validator.validationMessage.username.message = '';
        validator.validationMessage.password.isValid = true;
        validator.validationMessage.password.message = '';

        if (!usernameInput.checkValidity()) {
            usernameInput.style.background = 'red';
            validator.isValidAll = false;
            validator.validationMessage.username.isValid = false;
            validator.validationMessage.username.message = usernameInput.validationMessage;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;
        if (!passwordRegex.test(passwordInput.value)) {
            passwordInput.style.background = 'red';
            validator.isValidAll = false;
            validator.validationMessage.password.isValid = false;
            validator.validationMessage.password.message = 'Password harus mengandung huruf besar, kecil, angka, dan simbol spesial.';
        }
    }

    function sanitizeInput(input) {
        return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    addValidator();
    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const username = sanitizeInput(usernameInput.value);
        const password = sanitizeInput(passwordInput.value);

        validate();

        if (!validator.isValidAll) {
            errorMessageElement.textContent = validator.validationMessage.username.message || validator.validationMessage.password.message;
            return;
        }

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const result = await response.json();
            if (response.ok) {
                errorMessageElement.textContent = '';
                alert('Login berhasil!');
            } else {
                errorMessageElement.textContent = result.message || 'Terjadi kesalahan. Coba lagi.';
            }
        } catch (error) {
            errorMessageElement.textContent = 'Terjadi kesalahan saat menghubungi server.';
        }
    });

    document.addEventListener('contextmenu', event => event.preventDefault());
    document.addEventListener('keydown', event => {
        if (event.ctrlKey && (event.key === 'U' || event.key === 'I' || event.key === 'J' || event.key === 'C')) {
            event.preventDefault();
        }
    });

    setInterval(function() {
        if (window.outerHeight - window.innerHeight > 100 || window.outerWidth - window.innerWidth > 100) {
            document.body.innerHTML = "<h1>Access Denied</h1>";
        }
    }, 1000);
});