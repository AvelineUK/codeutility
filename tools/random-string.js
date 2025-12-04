document.addEventListener('DOMContentLoaded', () => {
    const currentString = document.getElementById('currentString');
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

    let stringHistory = [];

    // Character sets
    const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
    const NUMBERS = '0123456789';
    const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    // Update length display
    lengthSlider.addEventListener('input', (e) => {
        lengthValue.textContent = e.target.value;
    });

    // Generate random string
    function generateRandomString() {
        const length = parseInt(lengthSlider.value);
        
        let charset = '';
        
        if (uppercaseCheckbox.checked) charset += UPPERCASE;
        if (lowercaseCheckbox.checked) charset += LOWERCASE;
        if (numbersCheckbox.checked) charset += NUMBERS;
        if (symbolsCheckbox.checked) charset += SYMBOLS;
        
        if (charset === '') {
            showToast('Please select at least one character type!');
            return null;
        }
        
        // Generate string using crypto.getRandomValues for security
        const array = new Uint32Array(length);
        crypto.getRandomValues(array);
        
        let string = '';
        for (let i = 0; i < length; i++) {
            string += charset[array[i] % charset.length];
        }
        
        return string;
    }

    // Generate single string
    generateBtn.addEventListener('click', () => {
        const string = generateRandomString();
        if (string) {
            currentString.value = string;
            addToHistory(string);
        }
    });

    // Generate 5 strings
    generateMultipleBtn.addEventListener('click', () => {
        const strings = [];
        for (let i = 0; i < 5; i++) {
            const string = generateRandomString();
            if (string) {
                strings.push(string);
            }
        }
        
        if (strings.length > 0) {
            // Add all strings to history
            strings.forEach(string => addToHistory(string));
            
            // Set the last one as current
            currentString.value = strings[strings.length - 1];
        }
    });

    // Clear history
    clearBtn.addEventListener('click', () => {
        stringHistory = [];
        currentString.value = '';
        updateHistoryDisplay();
    });

    // Copy to clipboard
    copyBtn.addEventListener('click', () => {
        const string = currentString.value;
        
        if (!string) {
            showToast('Generate a string first!');
            return;
        }
        
        navigator.clipboard.writeText(string)
            .then(() => {
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy to Clipboard';
                }, 2000);
            })
            .catch(() => {
                currentString.select();
                document.execCommand('copy');
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy to Clipboard';
                }, 2000);
            });
    });

    // Add string to history
    function addToHistory(string) {
        stringHistory.unshift(string);
        
        if (stringHistory.length > 10) {
            stringHistory = stringHistory.slice(0, 10);
        }
        
        updateHistoryDisplay();
    }

    // Update history display
    function updateHistoryDisplay() {
        if (stringHistory.length === 0) {
            historyDiv.innerHTML = '<em style="color: #a3a3a3;">No strings generated yet...</em>';
            return;
        }
        
        historyDiv.innerHTML = stringHistory
            .map((string, index) => {
                // HTML-escape the string for safe display
                const displayString = string
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#39;');
                
                return `<div class="history-row">
                    <span>${displayString}</span>
                    <button class="history-copy-btn" data-index="${index}">Copy</button>
                </div>`;
            })
            .join('');
        
        // Add click handlers to copy buttons
        document.querySelectorAll('.history-copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                const string = stringHistory[index];
                navigator.clipboard.writeText(string)
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

    // Generate one string on page load
    generateBtn.click();
});

document.querySelectorAll('input[type="range"]').forEach(slider => {
  const update = () => {
    const min = Number(slider.min ?? 0);
    const max = Number(slider.max ?? 100);
    const val = Number(slider.value);
    const pct = ( (val - min) / (max - min) ) * 100;
    // Use a percent string for the CSS var
    slider.style.setProperty('--pct', pct + '%');
  };

  slider.addEventListener('input', update, { passive: true });
  // initialize on page load
  update();
});