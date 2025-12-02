document.addEventListener('DOMContentLoaded', () => {
    const inputTextarea = document.getElementById('input');
    const validateBtn = document.getElementById('validateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const validationResult = document.getElementById('validationResult');
    const resultMessage = document.getElementById('resultMessage');
    const statsCard = document.getElementById('statsCard');
    const objectCount = document.getElementById('objectCount');
    const arrayCount = document.getElementById('arrayCount');
    const keyCount = document.getElementById('keyCount');
    const depthLevel = document.getElementById('depthLevel');

    // Validate JSON
    validateBtn.addEventListener('click', () => {
        const input = inputTextarea.value.trim();
        
        if (!input) {
            showResult('Please enter JSON to validate', false);
            hideStats();
            return;
        }
        
        try {
            const parsed = JSON.parse(input);
            
            // Calculate statistics
            const stats = analyzeJSON(parsed);
            
            showResult('✓ Valid JSON!', true);
            showStats(stats);
        } catch (error) {
            showResult(`✗ Invalid JSON: ${error.message}`, false);
            hideStats();
        }
    });

    // Clear button
    clearBtn.addEventListener('click', () => {
        inputTextarea.value = '';
        hideResult();
        hideStats();
        inputTextarea.focus();
    });

    // Analyze JSON structure
    function analyzeJSON(obj, depth = 0) {
        const stats = {
            objects: 0,
            arrays: 0,
            keys: 0,
            maxDepth: depth
        };
        
        if (obj === null || typeof obj !== 'object') {
            return stats;
        }
        
        if (Array.isArray(obj)) {
            stats.arrays = 1;
            obj.forEach(item => {
                const childStats = analyzeJSON(item, depth + 1);
                stats.objects += childStats.objects;
                stats.arrays += childStats.arrays;
                stats.keys += childStats.keys;
                stats.maxDepth = Math.max(stats.maxDepth, childStats.maxDepth);
            });
        } else {
            stats.objects = 1;
            stats.keys = Object.keys(obj).length;
            
            Object.values(obj).forEach(value => {
                const childStats = analyzeJSON(value, depth + 1);
                stats.objects += childStats.objects;
                stats.arrays += childStats.arrays;
                stats.keys += childStats.keys;
                stats.maxDepth = Math.max(stats.maxDepth, childStats.maxDepth);
            });
        }
        
        return stats;
    }

    // Show validation result
    function showResult(message, isValid) {
        resultMessage.textContent = message;
        validationResult.className = isValid ? 'alert alert-success show' : 'alert alert-error show';
    }

    // Hide validation result
    function hideResult() {
        validationResult.classList.remove('show');
    }

    // Show statistics
    function showStats(stats) {
        objectCount.textContent = stats.objects.toLocaleString();
        arrayCount.textContent = stats.arrays.toLocaleString();
        keyCount.textContent = stats.keys.toLocaleString();
        depthLevel.textContent = stats.maxDepth;
        statsCard.style.display = 'block';
    }

    // Hide statistics
    function hideStats() {
        statsCard.style.display = 'none';
    }

    // Keyboard shortcut: Ctrl+Enter to validate
    inputTextarea.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            validateBtn.click();
        }
    });

    // Auto-validate on input (debounced)
    let validateTimeout;
    inputTextarea.addEventListener('input', () => {
        clearTimeout(validateTimeout);
        validateTimeout = setTimeout(() => {
            if (inputTextarea.value.trim()) {
                validateBtn.click();
            } else {
                hideResult();
                hideStats();
            }
        }, 500);
    });
});
