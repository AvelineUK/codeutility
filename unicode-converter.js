document.addEventListener('DOMContentLoaded', () => {
    const inputTextarea = document.getElementById('input');
    const outputTextarea = document.getElementById('output');
    const encodeBtn = document.getElementById('encodeBtn');
    const decodeBtn = document.getElementById('decodeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const formatRadios = document.querySelectorAll('input[name="format"]');

    // Get selected format
    function getSelectedFormat() {
        const selected = document.querySelector('input[name="format"]:checked');
        return selected ? selected.value : 'U+';
    }

    // Text to Unicode
    encodeBtn.addEventListener('click', () => {
        const input = inputTextarea.value;
        
        if (!input.trim()) {
            showToast('Please enter some text to convert');
            return;
        }
        
        const format = getSelectedFormat();
        let result = '';
        
        try {
            for (let i = 0; i < input.length; i++) {
                const codePoint = input.codePointAt(i);
                
                // Handle surrogate pairs (emoji, etc.)
                if (codePoint > 0xFFFF) {
                    i++; // Skip the next character as it's part of the pair
                }
                
                switch (format) {
                    case 'U+':
                        result += 'U+' + codePoint.toString(16).toUpperCase().padStart(4, '0') + ' ';
                        break;
                    case '\\u':
                        if (codePoint <= 0xFFFF) {
                            result += '\\u' + codePoint.toString(16).toUpperCase().padStart(4, '0');
                        } else {
                            // Surrogate pair for characters beyond BMP
                            const high = Math.floor((codePoint - 0x10000) / 0x400) + 0xD800;
                            const low = ((codePoint - 0x10000) % 0x400) + 0xDC00;
                            result += '\\u' + high.toString(16).toUpperCase().padStart(4, '0');
                            result += '\\u' + low.toString(16).toUpperCase().padStart(4, '0');
                        }
                        break;
                }
            }
            
            outputTextarea.value = result.trim();
        } catch (error) {
            showToast('Error converting text to Unicode');
        }
    });

    // Unicode to Text
    decodeBtn.addEventListener('click', () => {
        const input = inputTextarea.value.trim();
        
        if (!input) {
            showToast('Please enter Unicode code points to decode');
            return;
        }
        
        try {
            let result = '';
            
            // Detect format and parse accordingly
            if (input.includes('U+')) {
                // U+ format
                const codes = input.match(/U\+[0-9A-Fa-f]+/g);
                if (codes) {
                    codes.forEach(code => {
                        const hex = code.substring(2);
                        result += String.fromCodePoint(parseInt(hex, 16));
                    });
                }
            } else if (input.includes('\\u')) {
                // \u format
                const codes = input.match(/\\u[0-9A-Fa-f]{4}/g);
                if (codes) {
                    // Handle surrogate pairs
                    let i = 0;
                    while (i < codes.length) {
                        const code = parseInt(codes[i].substring(2), 16);
                        
                        // Check if it's a high surrogate
                        if (code >= 0xD800 && code <= 0xDBFF && i + 1 < codes.length) {
                            const nextCode = parseInt(codes[i + 1].substring(2), 16);
                            if (nextCode >= 0xDC00 && nextCode <= 0xDFFF) {
                                // Combine surrogate pair
                                const codePoint = ((code - 0xD800) * 0x400) + (nextCode - 0xDC00) + 0x10000;
                                result += String.fromCodePoint(codePoint);
                                i += 2;
                                continue;
                            }
                        }
                        
                        result += String.fromCharCode(code);
                        i++;
                    }
                }
            } else {
                showToast('Could not detect format. Use U+ or \\u format.');
                return;
            }
            
            if (result) {
                outputTextarea.value = result;
            } else {
                showToast('Could not parse Unicode format.');
            }
        } catch (error) {
            showToast('Error decoding Unicode. Check your format.');
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
