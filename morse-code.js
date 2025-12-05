document.addEventListener('DOMContentLoaded', () => {
    const inputTextarea = document.getElementById('input');
    const outputTextarea = document.getElementById('output');
    const encodeBtn = document.getElementById('encodeBtn');
    const decodeBtn = document.getElementById('decodeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');

    // Morse code mapping
    const morseCode = {
        'A': '.-',    'B': '-...',  'C': '-.-.',  'D': '-..',   'E': '.',
        'F': '..-.',  'G': '--.',   'H': '....',  'I': '..',    'J': '.---',
        'K': '-.-',   'L': '.-..',  'M': '--',    'N': '-.',    'O': '---',
        'P': '.--.',  'Q': '--.-',  'R': '.-.',   'S': '...',   'T': '-',
        'U': '..-',   'V': '...-',  'W': '.--',   'X': '-..-',  'Y': '-.--',
        'Z': '--..',
        '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
        '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
        '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.',
        '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
        '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-',
        '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.',
        '$': '...-..-', '@': '.--.-.'
    };

    // Reverse mapping for decoding
    const reverseMorseCode = {};
    Object.keys(morseCode).forEach(key => {
        reverseMorseCode[morseCode[key]] = key;
    });

    // Text to Morse
    encodeBtn.addEventListener('click', () => {
        const input = inputTextarea.value.toUpperCase();
        
        if (!input.trim()) {
            showToast('Please enter some text to convert');
            return;
        }
        
        try {
            const words = input.split(' ');
            const morseWords = words.map(word => {
                const chars = word.split('');
                const morseChars = chars.map(char => morseCode[char] || '').filter(m => m);
                return morseChars.join(' ');
            }).filter(w => w);
            
            const result = morseWords.join(' / ');
            
            if (result) {
                outputTextarea.value = result;
            } else {
                showToast('No valid characters to convert');
            }
        } catch (error) {
            showToast('Error converting to Morse code');
        }
    });

    // Morse to Text
    decodeBtn.addEventListener('click', () => {
        const input = inputTextarea.value.trim();
        
        if (!input) {
            showToast('Please enter Morse code to decode');
            return;
        }
        
        try {
            // Split by word separator (/)
            const morseWords = input.split('/').map(w => w.trim());
            
            const textWords = morseWords.map(word => {
                // Split by character separator (space)
                const morseChars = word.split(' ').filter(c => c);
                const textChars = morseChars.map(morse => reverseMorseCode[morse] || '?');
                return textChars.join('');
            });
            
            const result = textWords.join(' ');
            
            if (result) {
                outputTextarea.value = result;
            } else {
                showToast('Could not decode Morse code');
            }
        } catch (error) {
            showToast('Error decoding Morse code');
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
