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
        return selected ? selected.value : 'decimal';
    }

    // Text to ASCII
    encodeBtn.addEventListener('click', () => {
        const input = inputTextarea.value;
        
        if (!input) {
            showToast('Please enter some text to convert');
            return;
        }
        
        const format = getSelectedFormat();
        const codes = [];
        
        try {
            for (let i = 0; i < input.length; i++) {
                const code = input.charCodeAt(i);
                
                switch (format) {
                    case 'decimal':
                        codes.push(code);
                        break;
                    case 'octal':
                        codes.push(code.toString(8));
                        break;
                }
            }
            
            outputTextarea.value = codes.join(' ');
        } catch (error) {
            showToast('Error converting text to ASCII');
        }
    });

    // ASCII to Text
    decodeBtn.addEventListener('click', () => {
        const input = inputTextarea.value.trim();
        
        if (!input) {
            showToast('Please enter ASCII codes to decode');
            return;
        }
        
        try {
            const format = getSelectedFormat();
            
            // Parse codes (space or comma separated)
            const codes = input.split(/[\s,]+/).filter(c => c.length > 0);
            
            if (!codes || codes.length === 0) {
                showToast('No valid codes found');
                return;
            }
            
            let result = '';
            
            codes.forEach(code => {
                let charCode;
                
                switch (format) {
                    case 'decimal':
                        charCode = parseInt(code, 10);
                        break;
                    case 'octal':
                        charCode = parseInt(code, 8);
                        break;
                }
                
                if (!isNaN(charCode) && charCode >= 0 && charCode <= 127) {
                    result += String.fromCharCode(charCode);
                }
            });
            
            if (result) {
                outputTextarea.value = result;
            } else {
                showToast('Could not decode ASCII codes. Check your format.');
            }
        } catch (error) {
            showToast('Error decoding ASCII codes');
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
