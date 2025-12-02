document.addEventListener('DOMContentLoaded', () => {
    const inputTextarea = document.getElementById('input');
    const outputTextarea = document.getElementById('output');
    const indentSlider = document.getElementById('indent');
    const indentValue = document.getElementById('indentValue');
    const sortKeysCheckbox = document.getElementById('sortKeys');
    const formatBtn = document.getElementById('formatBtn');
    const minifyBtn = document.getElementById('minifyBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const validationStatus = document.getElementById('validationStatus');
    const statusTitle = document.getElementById('statusTitle');
    const statusMessage = document.getElementById('statusMessage');

    // Update indent display
    indentSlider.addEventListener('input', (e) => {
        indentValue.textContent = e.target.value;
    });

    // Format button
    formatBtn.addEventListener('click', () => {
        const input = inputTextarea.value.trim();
        
        if (!input) {
            showToast('Please enter some JSON to format');
            return;
        }
        
        try {
            let parsed = JSON.parse(input);
            
            // Sort keys if option is enabled
            if (sortKeysCheckbox.checked) {
                parsed = sortObjectKeys(parsed);
            }
            
            const indent = parseInt(indentSlider.value);
            const formatted = JSON.stringify(parsed, null, indent);
            
            outputTextarea.value = formatted;
            showValidationStatus(true, 'Valid JSON');
        } catch (error) {
            showValidationStatus(false, error.message);
            showToast('Invalid JSON: ' + error.message);
        }
    });

    // Minify button
    minifyBtn.addEventListener('click', () => {
        const input = inputTextarea.value.trim();
        
        if (!input) {
            showToast('Please enter some JSON to minify');
            return;
        }
        
        try {
            const parsed = JSON.parse(input);
            const minified = JSON.stringify(parsed);
            
            outputTextarea.value = minified;
            showValidationStatus(true, 'Valid JSON (minified)');
        } catch (error) {
            showValidationStatus(false, error.message);
            showToast('Invalid JSON: ' + error.message);
        }
    });

    // Clear button
    clearBtn.addEventListener('click', () => {
        inputTextarea.value = '';
        outputTextarea.value = '';
        validationStatus.style.display = 'none';
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

    // Sort object keys recursively
    function sortObjectKeys(obj) {
        if (Array.isArray(obj)) {
            return obj.map(item => sortObjectKeys(item));
        } else if (obj !== null && typeof obj === 'object') {
            const sorted = {};
            Object.keys(obj).sort().forEach(key => {
                sorted[key] = sortObjectKeys(obj[key]);
            });
            return sorted;
        }
        return obj;
    }

    // Show validation status
    function showValidationStatus(isValid, message) {
        validationStatus.style.display = 'block';
        
        if (isValid) {
            validationStatus.style.background = '#f0fdf4';
            validationStatus.style.borderColor = '#bbf7d0';
            statusTitle.style.color = '#166534';
            statusMessage.style.color = '#166534';
            statusTitle.textContent = '✓ Valid JSON';
        } else {
            validationStatus.style.background = '#fef2f2';
            validationStatus.style.borderColor = '#fecaca';
            statusTitle.style.color = '#991b1b';
            statusMessage.style.color = '#991b1b';
            statusTitle.textContent = '✗ Invalid JSON';
        }
        
        statusMessage.textContent = message;
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
