document.addEventListener('DOMContentLoaded', () => {
    const inputTextarea = document.getElementById('input');
    const outputTextarea = document.getElementById('output');
    const minifyBtn = document.getElementById('minifyBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
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
    function minifyCode() {
        const input = inputTextarea.value;
        
        if (!input.trim()) {
            showToast('Please enter some CSS code to minify');
            return;
        }
        
        try {
            let minified = input;
            
            // Remove comments
            minified = minified.replace(/\/\*[\s\S]*?\*\//g, '');
            
            // Remove whitespace
            minified = minified.replace(/\s+/g, ' ');
            
            // Remove space around special characters
            minified = minified.replace(/\s*([{}:;,>+~])\s*/g, '$1');
            
            // Remove trailing semicolons before closing braces
            minified = minified.replace(/;}/g, '}');
            
            // Shorten hex colors (#ffffff -> #fff)
            minified = minified.replace(/#([0-9a-f])\1([0-9a-f])\2([0-9a-f])\3/gi, '#$1$2$3');
            
            // Remove leading zeros (0.5 -> .5)
            minified = minified.replace(/(\s|:)0+\.(\d+)/g, '$1.$2');
            
            // Remove units from zero values
            minified = minified.replace(/(\s|:)0(px|em|rem|%|vh|vw|cm|mm|in|pt|pc)/g, '$10');
            
            // Trim
            minified = minified.trim();
            
            outputTextarea.value = minified;
            updateStats(input, minified);
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
