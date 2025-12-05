document.addEventListener('DOMContentLoaded', () => {
    const inputTextarea = document.getElementById('input');
    const camelCaseOutput = document.getElementById('camelCase');
    const pascalCaseOutput = document.getElementById('pascalCase');
    const snakeCaseOutput = document.getElementById('snakeCase');
    const kebabCaseOutput = document.getElementById('kebabCase');
    const constantCaseOutput = document.getElementById('constantCase');
    const dotCaseOutput = document.getElementById('dotCase');
    const titleCaseOutput = document.getElementById('titleCase');
    const sentenceCaseOutput = document.getElementById('sentenceCase');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtns = document.querySelectorAll('.copy-btn');

    // Auto-convert on input
    inputTextarea.addEventListener('input', () => {
        const input = inputTextarea.value;
        
        if (!input.trim()) {
            clearAllOutputs();
            return;
        }

        convertAllCases(input);
    });

    // Clear button
    clearBtn.addEventListener('click', () => {
        inputTextarea.value = '';
        clearAllOutputs();
        inputTextarea.focus();
    });

    // Copy buttons
    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const targetInput = document.getElementById(targetId);
            copyToClipboard(targetInput.value, btn);
        });
    });

    // Convert all cases
    function convertAllCases(text) {
        // Split text into words (handle various formats)
        const words = splitIntoWords(text);

        camelCaseOutput.value = toCamelCase(words);
        pascalCaseOutput.value = toPascalCase(words);
        snakeCaseOutput.value = toSnakeCase(words);
        kebabCaseOutput.value = toKebabCase(words);
        constantCaseOutput.value = toConstantCase(words);
        dotCaseOutput.value = toDotCase(words);
        titleCaseOutput.value = toTitleCase(words);
        sentenceCaseOutput.value = toSentenceCase(words);
    }

    // Split input into words (handles camelCase, PascalCase, snake_case, kebab-case, etc.)
    function splitIntoWords(text) {
        return text
            // Split on non-alphanumeric characters
            .split(/[^a-zA-Z0-9]+/)
            // Split on camelCase/PascalCase boundaries
            .flatMap(word => word.split(/(?=[A-Z])(?<=[a-z])|(?=[A-Z][a-z])(?<=[A-Z]{2})/))
            // Filter out empty strings
            .filter(word => word.length > 0)
            // Convert all to lowercase for processing
            .map(word => word.toLowerCase());
    }

    // Conversion functions
    function toCamelCase(words) {
        if (words.length === 0) return '';
        return words[0] + words.slice(1).map(capitalize).join('');
    }

    function toPascalCase(words) {
        return words.map(capitalize).join('');
    }

    function toSnakeCase(words) {
        return words.join('_');
    }

    function toKebabCase(words) {
        return words.join('-');
    }

    function toConstantCase(words) {
        return words.map(w => w.toUpperCase()).join('_');
    }

    function toDotCase(words) {
        return words.join('.');
    }

    function toTitleCase(words) {
        return words.map(capitalize).join(' ');
    }

    function toSentenceCase(words) {
        if (words.length === 0) return '';
        return capitalize(words[0]) + (words.length > 1 ? ' ' + words.slice(1).join(' ') : '');
    }

    // Helper: Capitalize first letter
    function capitalize(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }

    // Clear all outputs
    function clearAllOutputs() {
        camelCaseOutput.value = '';
        pascalCaseOutput.value = '';
        snakeCaseOutput.value = '';
        kebabCaseOutput.value = '';
        constantCaseOutput.value = '';
        dotCaseOutput.value = '';
        titleCaseOutput.value = '';
        sentenceCaseOutput.value = '';
    }

    // Copy to clipboard helper
    function copyToClipboard(text, button) {
        if (!text) {
            showToast('Nothing to copy!');
            return;
        }
        
        navigator.clipboard.writeText(text)
            .then(() => {
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.textContent = 'Copy';
                }, 2000);
            })
            .catch(() => {
                showToast('Failed to copy');
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
