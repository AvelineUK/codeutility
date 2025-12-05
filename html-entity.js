document.addEventListener('DOMContentLoaded', () => {
    const inputTextarea = document.getElementById('input');
    const outputTextarea = document.getElementById('output');
    const encodeBtn = document.getElementById('encodeBtn');
    const decodeBtn = document.getElementById('decodeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');

    // HTML entities map
    const htmlEntities = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '¢': '&cent;',
        '£': '&pound;',
        '¥': '&yen;',
        '€': '&euro;',
        '©': '&copy;',
        '®': '&reg;',
        '™': '&trade;',
        '§': '&sect;',
        '¶': '&para;',
        '°': '&deg;',
        '±': '&plusmn;',
        '×': '&times;',
        '÷': '&divide;',
        '¼': '&frac14;',
        '½': '&frac12;',
        '¾': '&frac34;',
        'À': '&Agrave;',
        'Á': '&Aacute;',
        'Â': '&Acirc;',
        'Ã': '&Atilde;',
        'Ä': '&Auml;',
        'Å': '&Aring;',
        'Æ': '&AElig;',
        'Ç': '&Ccedil;',
        'È': '&Egrave;',
        'É': '&Eacute;',
        'Ê': '&Ecirc;',
        'Ë': '&Euml;',
        'Ì': '&Igrave;',
        'Í': '&Iacute;',
        'Î': '&Icirc;',
        'Ï': '&Iuml;',
        'Ñ': '&Ntilde;',
        'Ò': '&Ograve;',
        'Ó': '&Oacute;',
        'Ô': '&Ocirc;',
        'Õ': '&Otilde;',
        'Ö': '&Ouml;',
        'Ø': '&Oslash;',
        'Ù': '&Ugrave;',
        'Ú': '&Uacute;',
        'Û': '&Ucirc;',
        'Ü': '&Uuml;',
        'Ý': '&Yacute;',
        'à': '&agrave;',
        'á': '&aacute;',
        'â': '&acirc;',
        'ã': '&atilde;',
        'ä': '&auml;',
        'å': '&aring;',
        'æ': '&aelig;',
        'ç': '&ccedil;',
        'è': '&egrave;',
        'é': '&eacute;',
        'ê': '&ecirc;',
        'ë': '&euml;',
        'ì': '&igrave;',
        'í': '&iacute;',
        'î': '&icirc;',
        'ï': '&iuml;',
        'ñ': '&ntilde;',
        'ò': '&ograve;',
        'ó': '&oacute;',
        'ô': '&ocirc;',
        'õ': '&otilde;',
        'ö': '&ouml;',
        'ø': '&oslash;',
        'ù': '&ugrave;',
        'ú': '&uacute;',
        'û': '&ucirc;',
        'ü': '&uuml;',
        'ý': '&yacute;',
        'ÿ': '&yuml;',
        ' ': '&nbsp;'
    };

    // Encode button
    encodeBtn.addEventListener('click', () => {
        const input = inputTextarea.value;
        
        if (!input.trim()) {
            showToast('Please enter some text to encode');
            return;
        }
        
        const encoded = encodeHtmlEntities(input);
        outputTextarea.value = encoded;
    });

    // Decode button
    decodeBtn.addEventListener('click', () => {
        const input = inputTextarea.value;
        
        if (!input.trim()) {
            showToast('Please enter HTML entities to decode');
            return;
        }
        
        const decoded = decodeHtmlEntities(input);
        outputTextarea.value = decoded;
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

    // Encode HTML entities function
    function encodeHtmlEntities(text) {
        return text.replace(/[&<>"']/g, (char) => htmlEntities[char] || char)
                   .replace(/[\u00A0-\u9999]/g, (char) => {
                       if (htmlEntities[char]) {
                           return htmlEntities[char];
                       }
                       return '&#' + char.charCodeAt(0) + ';';
                   });
    }

    // Decode HTML entities function
    function decodeHtmlEntities(text) {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = text;
        return textarea.value;
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
});
