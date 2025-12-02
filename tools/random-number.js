document.addEventListener('DOMContentLoaded', () => {
    const currentNumber = document.getElementById('currentNumber');
    const minInput = document.getElementById('min');
    const maxInput = document.getElementById('max');
    const allowDuplicatesCheckbox = document.getElementById('allowDuplicates');
    const generateBtn = document.getElementById('generateBtn');
    const generateMultipleBtn = document.getElementById('generateMultipleBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const historyDiv = document.getElementById('history');

    let numberHistory = [];

    // Generate a random number between min and max (inclusive)
    function generateRandomNumber(min, max) {
        const range = max - min + 1;
        const randomBuffer = new Uint32Array(1);
        crypto.getRandomValues(randomBuffer);
        return min + (randomBuffer[0] % range);
    }

    // Generate single number
    generateBtn.addEventListener('click', () => {
        const min = parseInt(minInput.value);
        const max = parseInt(maxInput.value);
        
        if (isNaN(min) || isNaN(max)) {
            showToast('Please enter valid minimum and maximum values');
            return;
        }
        
        if (min > max) {
            showToast('Minimum value must be less than or equal to maximum value');
            return;
        }
        
        const number = generateRandomNumber(min, max);
        currentNumber.value = number;
        addToHistory(number);
    });

    // Generate 10 numbers
    generateMultipleBtn.addEventListener('click', () => {
        const min = parseInt(minInput.value);
        const max = parseInt(maxInput.value);
        const allowDuplicates = allowDuplicatesCheckbox.checked;
        
        if (isNaN(min) || isNaN(max)) {
            showToast('Please enter valid minimum and maximum values');
            return;
        }
        
        if (min > max) {
            showToast('Minimum value must be less than or equal to maximum value');
            return;
        }
        
        const range = max - min + 1;
        
        if (!allowDuplicates && range < 10) {
            showToast('Range must be at least 10 numbers when duplicates are not allowed');
            return;
        }
        
        const numbers = [];
        const used = new Set();
        
        for (let i = 0; i < 10; i++) {
            let number;
            let attempts = 0;
            
            do {
                number = generateRandomNumber(min, max);
                attempts++;
                
                // Safety check to prevent infinite loop
                if (attempts > 1000) {
                    showToast('Could not generate unique numbers. Try a larger range.');
                    return;
                }
            } while (!allowDuplicates && used.has(number));
            
            used.add(number);
            numbers.push(number);
        }
        
        // Display all numbers
        currentNumber.value = numbers.join(', ');
        
        // Add all to history
        numbers.forEach(num => addToHistory(num));
    });

    // Clear history
    clearBtn.addEventListener('click', () => {
        numberHistory = [];
        currentNumber.value = '';
        updateHistoryDisplay();
    });

    // Copy to clipboard
    copyBtn.addEventListener('click', () => {
        const number = currentNumber.value;
        
        if (!number) {
            showToast('Generate a number first!');
            return;
        }
        
        navigator.clipboard.writeText(number)
            .then(() => {
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy to Clipboard';
                }, 2000);
            })
            .catch(() => {
                currentNumber.select();
                document.execCommand('copy');
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy to Clipboard';
                }, 2000);
            });
    });

    // Add number to history
    function addToHistory(number) {
        numberHistory.unshift(number);
        
        if (numberHistory.length > 10) {
            numberHistory = numberHistory.slice(0, 10);
        }
        
        updateHistoryDisplay();
    }

    // Update history display
    function updateHistoryDisplay() {
        if (numberHistory.length === 0) {
            historyDiv.innerHTML = '<em style="color: #a3a3a3;">No numbers generated yet...</em>';
            return;
        }
        
        historyDiv.innerHTML = numberHistory
            .map((number, index) => {
                return `<div class="history-row">
                    <span>${number}</span>
                    <button class="history-copy-btn" data-index="${index}">Copy</button>
                </div>`;
            })
            .join('');
        
        // Add click handlers to copy buttons
        document.querySelectorAll('.history-copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                const number = numberHistory[index];
                navigator.clipboard.writeText(number.toString())
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

    // Generate one number on page load
    generateBtn.click();
});
