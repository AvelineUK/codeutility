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
            // btoa() is built-in browser function for Base64 encoding
            const encoded = btoa(input);
            outputTextarea.value = encoded;
            // No success notification needed
        } catch (error) {
            showToast('Error: Unable to encode. The text may contain invalid characters.');
        }
    });

    // Decode button
    decodeBtn.addEventListener('click', () => {
        const input = inputTextarea.value;
        
        if (!input.trim()) {
            showToast('Please enter Base64 text to decode');
            return;
        }
        
        try {
            // atob() decodes Base64
            const decoded = atob(input);
            outputTextarea.value = decoded;
            // No success notification needed
        } catch (error) {
            showToast('Error: Invalid Base64 string');
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
