document.addEventListener('DOMContentLoaded', () => {
    const inputTextarea = document.getElementById('input');
    const outputTextarea = document.getElementById('output');
    const encodeBtn = document.getElementById('encodeBtn');
    const decodeBtn = document.getElementById('decodeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');

    // Get selected format
    function getSelectedFormat() {
        const selected = document.querySelector('input[name="format"]:checked');
        return selected ? selected.value : 'space';
    }

    // Text to Hex
    encodeBtn.addEventListener('click', () => {
        const input = inputTextarea.value;
        
        if (!input) {
            showToast('Please enter some text to convert');
            return;
        }
        
        const format = getSelectedFormat();
        const hexValues = [];
        
        try {
            for (let i = 0; i < input.length; i++) {
                const hex = input.charCodeAt(i).toString(16).toUpperCase().padStart(2, '0');
                hexValues.push(hex);
            }
            
            let result = '';
            
            switch (format) {
                case 'space':
                    result = hexValues.join(' ');
                    break;
                case '0x':
                    result = hexValues.map(h => '0x' + h).join(' ');
                    break;
                case 'continuous':
                    result = hexValues.join('');
                    break;
                case 'colon':
                    result = hexValues.join(':');
                    break;
            }
            
            outputTextarea.value = result;
        } catch (error) {
            showToast('Error converting text to hex');
        }
    });

    // Hex to Text
    decodeBtn.addEventListener('click', () => {
        const input = inputTextarea.value.trim();
        
        if (!input) {
            showToast('Please enter hex string to decode');
            return;
        }
        
        try {
            let hexValues = [];
            
            // Auto-detect format and extract hex values
            if (input.includes('0x')) {
                // 0x format
                hexValues = input.match(/0x[0-9A-Fa-f]{1,2}/g);
                if (hexValues) {
                    hexValues = hexValues.map(h => h.substring(2));
                }
            } else if (input.includes(':')) {
                // Colon separated
                hexValues = input.split(':').filter(h => h.length > 0);
            } else if (input.includes(' ')) {
                // Space separated
                hexValues = input.split(/\s+/).filter(h => h.length > 0);
            } else {
                // Continuous - split into pairs
                hexValues = input.match(/.{1,2}/g);
            }
            
            if (!hexValues || hexValues.length === 0) {
                showToast('No valid hex values found');
                return;
            }
            
            let result = '';
            
            hexValues.forEach(hex => {
                const decimal = parseInt(hex, 16);
                if (!isNaN(decimal)) {
                    result += String.fromCharCode(decimal);
                }
            });
            
            if (result) {
                outputTextarea.value = result;
            } else {
                showToast('Could not decode hex string');
            }
        } catch (error) {
            showToast('Error decoding hex string');
        }
    });

    // Clear button
    clearBtn.addEventListener('click', () => {
        inputTextarea.value = '';
        outputTextarea.value = '';
        inputTextarea.focus();
    });

    // Copy to clipboard
    copyBtn.addEventListener('click', () => {
        const output = outputTextarea.value;
        
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
                outputTextarea.select();
                document.execCommand('copy');
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy to Clipboard';
                }, 2000);
            });
    });

    // Keyboard shortcut: Ctrl+Enter to encode
    inputTextarea.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            encodeBtn.click();
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
