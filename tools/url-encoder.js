document.addEventListener('DOMContentLoaded', () => {
    const inputTextarea = document.getElementById('input');
    const outputTextarea = document.getElementById('output');
    const encodeBtn = document.getElementById('encodeBtn');
    const decodeBtn = document.getElementById('decodeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');

    // Encode button
    encodeBtn.addEventListener('click', () => {
        const input = inputTextarea.value;
        
        if (!input.trim()) {
            showToast('Please enter some text to encode');
            return;
        }
        
        try {
            // encodeURIComponent() encodes all characters except: A-Z a-z 0-9 - _ . ! ~ * ' ( )
            const encoded = encodeURIComponent(input);
            outputTextarea.value = encoded;
        } catch (error) {
            showToast('Error: Unable to encode the text');
        }
    });

    // Decode button
    decodeBtn.addEventListener('click', () => {
        const input = inputTextarea.value;
        
        if (!input.trim()) {
            showToast('Please enter URL-encoded text to decode');
            return;
        }
        
        try {
            // decodeURIComponent() decodes URL-encoded text
            const decoded = decodeURIComponent(input);
            outputTextarea.value = decoded;
        } catch (error) {
            showToast('Error: Invalid URL-encoded string');
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
                // Visual feedback without notification
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy to Clipboard';
                }, 2000);
            })
            .catch(() => {
                // Fallback for older browsers
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
        // Remove any existing toasts
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        // Trigger animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300); // Wait for fade-out animation
        }, 3000);
    }
});
