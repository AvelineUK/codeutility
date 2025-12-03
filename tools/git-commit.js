document.addEventListener('DOMContentLoaded', () => {
    const typeSelect = document.getElementById('type');
    const scopeInput = document.getElementById('scope');
    const descriptionInput = document.getElementById('description');
    const bodyTextarea = document.getElementById('body');
    const footerTextarea = document.getElementById('footer');
    const breakingCheckbox = document.getElementById('breaking');
    const output = document.getElementById('output');
    const generateBtn = document.getElementById('generateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const charCount = document.getElementById('charCount');

    // Update character count
    descriptionInput.addEventListener('input', () => {
        charCount.textContent = descriptionInput.value.length;
    });

    // Generate button
    generateBtn.addEventListener('click', generateCommitMessage);

    // Clear button
    clearBtn.addEventListener('click', () => {
        typeSelect.value = 'feat';
        scopeInput.value = '';
        descriptionInput.value = '';
        bodyTextarea.value = '';
        footerTextarea.value = '';
        breakingCheckbox.checked = false;
        output.value = '';
        charCount.textContent = '0';
        descriptionInput.focus();
    });

    // Copy to clipboard
    copyBtn.addEventListener('click', () => {
        const message = output.value;
        
        if (!message) {
            showToast('Nothing to copy!');
            return;
        }
        
        navigator.clipboard.writeText(message)
            .then(() => {
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy to Clipboard';
                }, 2000);
            })
            .catch(() => {
                output.select();
                document.execCommand('copy');
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy to Clipboard';
                }, 2000);
            });
    });

    // Generate commit message
    function generateCommitMessage() {
        const type = typeSelect.value;
        const scope = scopeInput.value.trim();
        const description = descriptionInput.value.trim();
        const body = bodyTextarea.value.trim();
        const footer = footerTextarea.value.trim();
        const breaking = breakingCheckbox.checked;
        
        // Validation
        if (!description) {
            showToast('Please enter a description');
            return;
        }
        
        // Build commit message
        let message = '';
        
        // Header: type(scope)!: description
        message += type;
        if (scope) {
            message += `(${scope})`;
        }
        if (breaking) {
            message += '!';
        }
        message += `: ${description}`;
        
        // Body
        if (body) {
            message += '\n\n' + body;
        }
        
        // Footer
        if (footer) {
            message += '\n\n' + footer;
        }
        
        // Add BREAKING CHANGE footer if checkbox is checked but no footer
        if (breaking && !footer.toLowerCase().includes('breaking change')) {
            if (footer) {
                message += '\n\nBREAKING CHANGE: ' + description;
            } else {
                message += '\n\nBREAKING CHANGE: ' + description;
            }
        }
        
        output.value = message;
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
