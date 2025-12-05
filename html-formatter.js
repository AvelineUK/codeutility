document.addEventListener('DOMContentLoaded', () => {
    const inputTextarea = document.getElementById('input');
    const outputTextarea = document.getElementById('output');
    const formatBtn = document.getElementById('formatBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const indentSize = document.getElementById('indentSize');
    const indentValue = document.getElementById('indentValue');
    const wrapAttributes = document.getElementById('wrapAttributes');
    const sortAttributes = document.getElementById('sortAttributes');

    // Update indent display
    indentSize.addEventListener('input', (e) => {
        indentValue.textContent = e.target.value;
    });

    // Format button
    formatBtn.addEventListener('click', formatCode);

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

    // Keyboard shortcut: Ctrl+Enter to format
    inputTextarea.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            formatBtn.click();
        }
    });

    // Format code function
    async function formatCode() {
        const input = inputTextarea.value;
        
        if (!input.trim()) {
            showToast('Please enter some HTML code to format');
            return;
        }
        
        try {
            const formatted = await prettier.format(input, {
                parser: 'html',
                plugins: prettierPlugins,
                tabWidth: parseInt(indentSize.value),
                printWidth: 80,
                htmlWhitespaceSensitivity: 'css',
                singleAttributePerLine: wrapAttributes.checked,
                // Note: Prettier doesn't natively support attribute sorting
                // We'll handle this with a post-process if needed
            });
            
            let result = formatted;
            
            // Post-process: sort attributes if requested
            if (sortAttributes.checked) {
                result = sortHtmlAttributes(result);
            }
            
            outputTextarea.value = result;
        } catch (error) {
            showToast('Error: Invalid HTML syntax - ' + error.message);
        }
    }

    // Sort HTML attributes alphabetically
    function sortHtmlAttributes(html) {
        return html.replace(/<([a-z][a-z0-9]*)\s+([^>]+)>/gi, (match, tagName, attrs) => {
            // Parse attributes
            const attrRegex = /([a-z-]+)(?:="([^"]*)")?/gi;
            const attrList = [];
            let attrMatch;
            
            while ((attrMatch = attrRegex.exec(attrs)) !== null) {
                attrList.push(attrMatch[0]);
            }
            
            // Sort attributes
            attrList.sort((a, b) => {
                const aName = a.split('=')[0];
                const bName = b.split('=')[0];
                return aName.localeCompare(bName);
            });
            
            return `<${tagName} ${attrList.join(' ')}>`;
        });
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

document.querySelectorAll('input[type="range"]').forEach(slider => {
  const update = () => {
    const min = Number(slider.min ?? 0);
    const max = Number(slider.max ?? 100);
    const val = Number(slider.value);
    const pct = ( (val - min) / (max - min) ) * 100;
    // Use a percent string for the CSS var
    slider.style.setProperty('--pct', pct + '%');
  };

  slider.addEventListener('input', update, { passive: true });
  // initialize on page load
  update();
});