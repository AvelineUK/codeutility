document.addEventListener('DOMContentLoaded', () => {
    const jsonInput = document.getElementById('jsonInput');
    const queryInput = document.getElementById('queryInput');
    const output = document.getElementById('output');
    const testBtn = document.getElementById('testBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');

    // Test button
    testBtn.addEventListener('click', testQuery);

    // Clear button
    clearBtn.addEventListener('click', () => {
        jsonInput.value = '';
        queryInput.value = '';
        output.value = '';
        jsonInput.focus();
    });

    // Copy to clipboard
    copyBtn.addEventListener('click', () => {
        const result = output.value;
        
        if (!result) {
            showToast('Nothing to copy!');
            return;
        }
        
        navigator.clipboard.writeText(result)
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

    // Keyboard shortcut: Enter in query field to test
    queryInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            testBtn.click();
        }
    });

    // Test query function
    function testQuery() {
        const jsonText = jsonInput.value;
        const query = queryInput.value;
        
        if (!jsonText.trim()) {
            showToast('Please enter JSON data');
            return;
        }
        
        if (!query.trim()) {
            showToast('Please enter a JMESPath query');
            return;
        }
        
        try {
            // Parse JSON
            const data = JSON.parse(jsonText);
            
            // Execute JMESPath query
            const result = jmespath.search(data, query);
            
            // Format result as JSON
            output.value = JSON.stringify(result, null, 2);
        } catch (error) {
            showToast('Error: ' + error.message);
            output.value = '';
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
