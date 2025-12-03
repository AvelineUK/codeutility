document.addEventListener('DOMContentLoaded', () => {
    const inputTextarea = document.getElementById('input');
    const outputTextarea = document.getElementById('output');
    const minifyBtn = document.getElementById('minifyBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const mangle = document.getElementById('mangle');
    const compress = document.getElementById('compress');
    const originalSize = document.getElementById('originalSize');
    const minifiedSize = document.getElementById('minifiedSize');
    const savedBytes = document.getElementById('savedBytes');
    const savedPercent = document.getElementById('savedPercent');

    // Minify button
    minifyBtn.addEventListener('click', minifyCode);

    // Clear button
    clearBtn.addEventListener('click', () => {
        inputTextarea.value = '';
        outputTextarea.value = '';
        resetStats();
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

    // Keyboard shortcut: Ctrl+Enter to minify
    inputTextarea.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            minifyBtn.click();
        }
    });

    // Minify code function
    async function minifyCode() {
        const input = inputTextarea.value;
        
        if (!input.trim()) {
            showToast('Please enter some JavaScript code to minify');
            return;
        }
        
        try {
            const result = await Terser.minify(input, {
                mangle: mangle.checked,
                compress: compress.checked
            });
            
            if (result.error) {
                throw result.error;
            }
            
            outputTextarea.value = result.code;
            updateStats(input, result.code);
        } catch (error) {
            showToast('Error: ' + error.message);
            resetStats();
        }
    }

    // Update compression stats
    function updateStats(original, minified) {
        const originalBytes = new Blob([original]).size;
        const minifiedBytes = new Blob([minified]).size;
        const saved = originalBytes - minifiedBytes;
        const percent = originalBytes > 0 ? ((saved / originalBytes) * 100).toFixed(1) : 0;
        
        originalSize.textContent = formatBytes(originalBytes);
        minifiedSize.textContent = formatBytes(minifiedBytes);
        savedBytes.textContent = formatBytes(saved);
        savedPercent.textContent = percent + '%';
    }

    // Reset stats
    function resetStats() {
        originalSize.textContent = '0';
        minifiedSize.textContent = '0';
        savedBytes.textContent = '0';
        savedPercent.textContent = '0%';
    }

    // Format bytes to human-readable
    function formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
