document.addEventListener('DOMContentLoaded', () => {
    const inputTextarea = document.getElementById('input');
    const outputTextarea = document.getElementById('output');
    const minifyBtn = document.getElementById('minifyBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const statsCard = document.getElementById('statsCard');
    const originalSize = document.getElementById('originalSize');
    const minifiedSize = document.getElementById('minifiedSize');
    const savedBytes = document.getElementById('savedBytes');
    const reduction = document.getElementById('reduction');

    // Minify JSON
    minifyBtn.addEventListener('click', () => {
        const input = inputTextarea.value.trim();
        
        if (!input) {
            showToast('Please enter JSON to minify');
            hideStats();
            return;
        }
        
        try {
            // Parse and stringify without spacing
            const parsed = JSON.parse(input);
            const minified = JSON.stringify(parsed);
            
            outputTextarea.value = minified;
            
            // Calculate stats
            const originalBytes = new Blob([input]).size;
            const minifiedBytes = new Blob([minified]).size;
            const saved = originalBytes - minifiedBytes;
            const reductionPercent = ((saved / originalBytes) * 100).toFixed(1);
            
            // Display stats
            originalSize.textContent = formatBytes(originalBytes);
            minifiedSize.textContent = formatBytes(minifiedBytes);
            savedBytes.textContent = formatBytes(saved);
            reduction.textContent = reductionPercent + '%';
            statsCard.style.display = 'block';
            
        } catch (error) {
            showToast(`Error: ${error.message}`);
            hideStats();
        }
    });

    // Clear button
    clearBtn.addEventListener('click', () => {
        inputTextarea.value = '';
        outputTextarea.value = '';
        hideStats();
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

    // Format bytes to human readable
    function formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    // Hide stats
    function hideStats() {
        statsCard.style.display = 'none';
    }

    // Keyboard shortcut: Ctrl+Enter to minify
    inputTextarea.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            minifyBtn.click();
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
