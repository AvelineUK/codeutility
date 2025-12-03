document.addEventListener('DOMContentLoaded', () => {
    const inputTextarea = document.getElementById('input');
    const outputTextarea = document.getElementById('output');
    const formatBtn = document.getElementById('formatBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const indentSize = document.getElementById('indentSize');
    const indentValue = document.getElementById('indentValue');
    const singleQuote = document.getElementById('singleQuote');

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
            showToast('Please enter some CSS code to format');
            return;
        }
        
        try {
            const formatted = await prettier.format(input, {
                parser: 'css',
                plugins: prettierPlugins,
                tabWidth: parseInt(indentSize.value),
                singleQuote: singleQuote.checked,
                printWidth: 80
            });
            
            outputTextarea.value = formatted;
        } catch (error) {
            showToast('Error: Invalid CSS syntax - ' + error.message);
        }
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
