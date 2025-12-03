document.addEventListener('DOMContentLoaded', () => {
    const inputTextarea = document.getElementById('input');
    const outputTextarea = document.getElementById('output');
    const convertBtn = document.getElementById('convertBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const indentSize = document.getElementById('indentSize');
    const indentValue = document.getElementById('indentValue');

    // Update indent display
    indentSize.addEventListener('input', (e) => {
        indentValue.textContent = e.target.value;
    });

    // Convert button
    convertBtn.addEventListener('click', convertJSON);

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

    // Keyboard shortcut: Ctrl+Enter to convert
    inputTextarea.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            convertBtn.click();
        }
    });

    // Convert JSON to YAML
    function convertJSON() {
        const input = inputTextarea.value;
        
        if (!input.trim()) {
            showToast('Please enter some JSON to convert');
            return;
        }
        
        try {
            // Parse JSON to JavaScript object
            const obj = JSON.parse(input);
            
            // Convert to YAML
            const yaml = jsyaml.dump(obj, {
                indent: parseInt(indentSize.value),
                lineWidth: 80,
                noRefs: true
            });
            
            outputTextarea.value = yaml;
        } catch (error) {
            showToast('Error: Invalid JSON - ' + error.message);
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
