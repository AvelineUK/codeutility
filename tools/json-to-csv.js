document.addEventListener('DOMContentLoaded', () => {
    const inputTextarea = document.getElementById('input');
    const outputTextarea = document.getElementById('output');
    const convertBtn = document.getElementById('convertBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');

    // Escape CSV field
    function escapeCSVField(field) {
        if (field === null || field === undefined) {
            return '';
        }
        
        const str = String(field);
        
        // If field contains comma, quote, or newline, wrap in quotes and escape quotes
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return '"' + str.replace(/"/g, '""') + '"';
        }
        
        return str;
    }

    // Flatten nested objects
    function flattenObject(obj, prefix = '') {
        const flattened = {};
        
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];
                const newKey = prefix ? `${prefix}.${key}` : key;
                
                if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
                    // Recursively flatten nested objects
                    Object.assign(flattened, flattenObject(value, newKey));
                } else if (Array.isArray(value)) {
                    // Convert arrays to string
                    flattened[newKey] = JSON.stringify(value);
                } else {
                    flattened[newKey] = value;
                }
            }
        }
        
        return flattened;
    }

    // Convert JSON to CSV
    convertBtn.addEventListener('click', () => {
        const input = inputTextarea.value.trim();
        
        if (!input) {
            showToast('Please enter JSON data to convert');
            return;
        }
        
        try {
            const json = JSON.parse(input);
            
            // Validate it's an array
            if (!Array.isArray(json)) {
                showToast('JSON must be an array of objects');
                return;
            }
            
            if (json.length === 0) {
                showToast('JSON array is empty');
                return;
            }
            
            // Flatten all objects
            const flattenedData = json.map(item => flattenObject(item));
            
            // Get all unique keys (headers)
            const allKeys = new Set();
            flattenedData.forEach(item => {
                Object.keys(item).forEach(key => allKeys.add(key));
            });
            const headers = Array.from(allKeys);
            
            // Build CSV
            const csvLines = [];
            
            // Add header row
            csvLines.push(headers.map(h => escapeCSVField(h)).join(','));
            
            // Add data rows
            flattenedData.forEach(item => {
                const row = headers.map(header => {
                    const value = item[header];
                    return escapeCSVField(value);
                });
                csvLines.push(row.join(','));
            });
            
            outputTextarea.value = csvLines.join('\n');
            
        } catch (error) {
            showToast(`Error: ${error.message}`);
        }
    });

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
