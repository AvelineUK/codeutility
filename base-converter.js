document.addEventListener('DOMContentLoaded', () => {
    const inputField = document.getElementById('input');
    const outputField = document.getElementById('output');
    const fromBaseInput = document.getElementById('fromBase');
    const toBaseInput = document.getElementById('toBase');
    const convertBtn = document.getElementById('convertBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const allBasesCard = document.getElementById('allBasesCard');
    const binaryValue = document.getElementById('binaryValue');
    const octalValue = document.getElementById('octalValue');
    const decimalValue = document.getElementById('decimalValue');
    const hexValue = document.getElementById('hexValue');
    const quickBtns = document.querySelectorAll('[data-from]');

    // Quick conversion buttons
    quickBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            fromBaseInput.value = btn.getAttribute('data-from');
            toBaseInput.value = btn.getAttribute('data-to');
            if (inputField.value.trim()) {
                convertBtn.click();
            }
        });
    });

    // Convert
    convertBtn.addEventListener('click', () => {
        const input = inputField.value.trim().toUpperCase();
        const fromBase = parseInt(fromBaseInput.value);
        const toBase = parseInt(toBaseInput.value);
        
        if (!input) {
            showToast('Please enter a number to convert');
            return;
        }
        
        if (isNaN(fromBase) || fromBase < 2 || fromBase > 36) {
            showToast('From base must be between 2 and 36');
            return;
        }
        
        if (isNaN(toBase) || toBase < 2 || toBase > 36) {
            showToast('To base must be between 2 and 36');
            return;
        }
        
        try {
            // Validate input contains only valid digits for the from base
            const validChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.slice(0, fromBase);
            for (let char of input) {
                if (!validChars.includes(char)) {
                    showToast(`Invalid digit '${char}' for base ${fromBase}`);
                    return;
                }
            }
            
            // Convert: input base → decimal → output base
            const decimal = parseInt(input, fromBase);
            
            if (isNaN(decimal)) {
                showToast('Invalid number for the selected base');
                return;
            }
            
            const result = decimal.toString(toBase).toUpperCase();
            outputField.value = result;
            
            // Show common bases if input is decimal
            if (fromBase === 10) {
                showAllBases(decimal);
            } else {
                allBasesCard.style.display = 'none';
            }
            
        } catch (error) {
            showToast('Error converting number');
        }
    });

    // Show all common bases
    function showAllBases(decimalNum) {
        binaryValue.textContent = decimalNum.toString(2);
        octalValue.textContent = decimalNum.toString(8);
        decimalValue.textContent = decimalNum.toString(10);
        hexValue.textContent = decimalNum.toString(16).toUpperCase();
        allBasesCard.style.display = 'block';
    }

    // Clear
    clearBtn.addEventListener('click', () => {
        inputField.value = '';
        outputField.value = '';
        allBasesCard.style.display = 'none';
        inputField.focus();
    });

    // Copy to clipboard
    copyBtn.addEventListener('click', () => {
        const output = outputField.value;
        
        if (!output) {
            showToast('Nothing to copy!');
            return;
        }
        
        navigator.clipboard.writeText(output)
            .then(() => {
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy to Clipboard';
                }, 2000);
            })
            .catch(() => {
                outputField.select();
                document.execCommand('copy');
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy to Clipboard';
                }, 2000);
            });
    });

    // Keyboard shortcut: Enter to convert
    inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            convertBtn.click();
        }
    });

    fromBaseInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            convertBtn.click();
        }
    });

    toBaseInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            convertBtn.click();
        }
    });

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
});
