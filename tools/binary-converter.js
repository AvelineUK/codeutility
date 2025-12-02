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

    // Text to Binary
    encodeBtn.addEventListener('click', () => {
        const input = inputTextarea.value;
        
        if (!input) {
            showToast('Please enter some text to convert');
            return;
        }
        
        const format = getSelectedFormat();
        const binaryValues = [];
        
        try {
            for (let i = 0; i < input.length; i++) {
                const binary = input.charCodeAt(i).toString(2).padStart(8, '0');
                binaryValues.push(binary);
            }
            
            let result = '';
            
            switch (format) {
                case 'space':
                    result = binaryValues.join(' ');
                    break;
                case 'continuous':
                    result = binaryValues.join('');
                    break;
            }
            
            outputTextarea.value = result;
        } catch (error) {
            showToast('Error converting text to binary');
        }
    });

    // Binary to Text
    decodeBtn.addEventListener('click', () => {
        const input = inputTextarea.value.trim();
        
        if (!input) {
            showToast('Please enter binary string to decode');
            return;
        }
        
        try {
            let binaryValues = [];
            
            // Auto-detect format
            if (input.includes(' ')) {
                // Space separated
                binaryValues = input.split(/\s+/).filter(b => b.length > 0);
            } else {
                // Continuous - split into 8-bit chunks
                binaryValues = input.match(/.{1,8}/g);
            }
            
            if (!binaryValues || binaryValues.length === 0) {
                showToast('No valid binary values found');
                return;
            }
            
            let result = '';
            
            binaryValues.forEach(binary => {
                // Remove any non-binary characters
                const cleanBinary = binary.replace(/[^01]/g, '');
                
                if (cleanBinary.length > 0) {
                    const decimal = parseInt(cleanBinary, 2);
                    if (!isNaN(decimal)) {
                        result += String.fromCharCode(decimal);
                    }
                }
            });
            
            if (result) {
                outputTextarea.value = result;
            } else {
                showToast('Could not decode binary string');
            }
        } catch (error) {
            showToast('Error decoding binary string');
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
