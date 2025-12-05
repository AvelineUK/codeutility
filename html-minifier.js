document.addEventListener('DOMContentLoaded', () => {
    const inputTextarea = document.getElementById('input');
    const outputTextarea = document.getElementById('output');
    const minifyBtn = document.getElementById('minifyBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const removeComments = document.getElementById('removeComments');
    const collapseWhitespace = document.getElementById('collapseWhitespace');
    const removeAttributes = document.getElementById('removeAttributes');
    const minifyCSS = document.getElementById('minifyCSS');
    const minifyJS = document.getElementById('minifyJS');
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
            showToast('Please enter some HTML code to minify');
            return;
        }
        
        // Check if library loaded
        if (typeof window.minify !== 'function') {
            showToast('Error: Minifier library not loaded. Using basic minification.');
            minifyCodeFallback();
            return;
        }
        
        try {
            const minified = window.minify(input, {
                removeComments: removeComments.checked,
                collapseWhitespace: collapseWhitespace.checked,
                removeAttributeQuotes: removeAttributes.checked,
                removeOptionalTags: removeAttributes.checked,
                minifyCSS: minifyCSS.checked,
                minifyJS: minifyJS.checked,
                removeEmptyAttributes: true,
                collapseBooleanAttributes: true
            });
            
            outputTextarea.value = minified;
            updateStats(input, minified);
        } catch (error) {
            showToast('Error: ' + error.message);
            resetStats();
        }
    }

    // Fallback minification if library fails to load
    function minifyCodeFallback() {
        const input = inputTextarea.value;
        
        try {
            let minified = input;
            
            // Remove comments
            if (removeComments.checked) {
                minified = minified.replace(/<!--[\s\S]*?-->/g, '');
            }
            
            // Collapse whitespace
            if (collapseWhitespace.checked) {
                minified = minified.replace(/^\s+/gm, '');
                minified = minified.replace(/\s+$/gm, '');
                minified = minified.replace(/\s{2,}/g, ' ');
                minified = minified.replace(/>\s+</g, '><');
            }
            
            // Remove optional quotes from attributes
            if (removeAttributes.checked) {
                minified = minified.replace(/=["']([a-zA-Z0-9-_]+)["']/g, '=$1');
            }
            
            // Minify inline CSS
            if (minifyCSS.checked) {
                minified = minified.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (match, css) => {
                    let minifiedCSS = css
                        .replace(/\/\*[\s\S]*?\*\//g, '')
                        .replace(/\s+/g, ' ')
                        .replace(/\s*([{}:;,])\s*/g, '$1')
                        .trim();
                    return match.replace(css, minifiedCSS);
                });
            }
            
            // Minify inline JavaScript
            if (minifyJS.checked) {
                minified = minified.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, (match, js) => {
                    let minifiedJS = js
                        .replace(/\/\/.*$/gm, '')
                        .replace(/\/\*[\s\S]*?\*\//g, '')
                        .replace(/\s+/g, ' ')
                        .trim();
                    return match.replace(js, minifiedJS);
                });
            }
            
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
