document.addEventListener('DOMContentLoaded', () => {
    const currentPassword = document.getElementById('currentPassword');
    const lengthSlider = document.getElementById('length');
    const lengthValue = document.getElementById('lengthValue');
    const uppercaseCheckbox = document.getElementById('uppercase');
    const lowercaseCheckbox = document.getElementById('lowercase');
    const numbersCheckbox = document.getElementById('numbers');
    const symbolsCheckbox = document.getElementById('symbols');
    const generateBtn = document.getElementById('generateBtn');
    const generateMultipleBtn = document.getElementById('generateMultipleBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const historyDiv = document.getElementById('history');

    let passwordHistory = [];

    // Character sets
    const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
    const NUMBERS = '0123456789';
    const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    // Update length display
    lengthSlider.addEventListener('input', (e) => {
        lengthValue.textContent = e.target.value;
    });

    // Generate single password
    generateBtn.addEventListener('click', () => {
        const password = generatePassword();
        if (password) {
            currentPassword.value = password;
            addToHistory(password);
        }
    });

    // Generate 5 passwords
    generateMultipleBtn.addEventListener('click', () => {
        const passwords = [];
        for (let i = 0; i < 5; i++) {
            const password = generatePassword();
            if (password) {
                passwords.push(password);
            }
        }
        
        // Add all passwords to history at once
        passwords.forEach(password => addToHistory(password));
        
        // Set the last one as current
        if (passwords.length > 0) {
            currentPassword.value = passwords[passwords.length - 1];
        }
    });

    // Clear history
    clearBtn.addEventListener('click', () => {
        passwordHistory = [];
        currentPassword.value = '';
        updateHistoryDisplay();
    });

    // Copy to clipboard
    copyBtn.addEventListener('click', () => {
        const password = currentPassword.value;
        
        if (!password) {
            showToast('Generate a password first!');
            return;
        }
        
        navigator.clipboard.writeText(password)
            .then(() => {
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy to Clipboard';
                }, 2000);
            })
            .catch(() => {
                currentPassword.select();
                document.execCommand('copy');
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy to Clipboard';
                }, 2000);
            });
    });

    // Generate password function
    function generatePassword() {
        const length = parseInt(lengthSlider.value);
        
        // Safeguard: ensure minimum length
        if (length < 8 || isNaN(length)) {
            return null;
        }
        
        let charset = '';
        
        // Build charset based on selected options
        if (uppercaseCheckbox.checked) charset += UPPERCASE;
        if (lowercaseCheckbox.checked) charset += LOWERCASE;
        if (numbersCheckbox.checked) charset += NUMBERS;
        if (symbolsCheckbox.checked) charset += SYMBOLS;
        
        // Validate at least one option is selected
        if (charset === '') {
            showToast('Please select at least one character type!');
            return null;
        }
        
        // Generate password using crypto.getRandomValues for security
        const array = new Uint32Array(length);
        crypto.getRandomValues(array);
        
        let password = '';
        for (let i = 0; i < length; i++) {
            password += charset[array[i] % charset.length];
        }
        
        // Final validation: ensure password is correct length
        if (password.length !== length) {
            return null;
        }
        
        return password;
    }

    // Add password to history
    function addToHistory(password) {
        // Add to beginning of array
        passwordHistory.unshift(password);
        
        // Keep only last 10
        if (passwordHistory.length > 10) {
            passwordHistory = passwordHistory.slice(0, 10);
        }
        
        updateHistoryDisplay();
    }

    // Update history display
    function updateHistoryDisplay() {
        if (passwordHistory.length === 0) {
            historyDiv.innerHTML = '<em style="color: #a3a3a3;">No passwords generated yet...</em>';
            return;
        }
        
        historyDiv.innerHTML = passwordHistory
            .map((password, index) => {
                // HTML-escape the password for safe display
                const displayPassword = password
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#39;');
                
                return `<div class="history-row">
                    <span>${displayPassword}</span>
                    <button class="history-copy-btn" data-index="${index}">Copy</button>
                </div>`;
            })
            .join('');
        
        // Add click handlers to copy buttons
        document.querySelectorAll('.history-copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                const password = passwordHistory[index];
                navigator.clipboard.writeText(password)
                    .then(() => {
                        e.target.textContent = 'Copied!';
                        setTimeout(() => {
                            e.target.textContent = 'Copy';
                        }, 2000);
                    })
                    .catch(() => {
                        showToast('Failed to copy');
                    });
            });
        });
    }

    // Toast notification function (errors only)
    function showToast(message) {
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    // Generate one password on page load
    generateBtn.click();
});
