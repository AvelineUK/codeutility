document.addEventListener('DOMContentLoaded', () => {
    const inputTextarea = document.getElementById('input');
    const outputTextarea = document.getElementById('output');
    const convertBtn = document.getElementById('convertBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const prettyPrintCheckbox = document.getElementById('prettyPrint');

    // Parse CSV to array
    function parseCSV(csv) {
        const lines = [];
        let currentLine = [];
        let currentField = '';
        let inQuotes = false;
        
        for (let i = 0; i < csv.length; i++) {
            const char = csv[i];
            const nextChar = csv[i + 1];
            
            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    // Escaped quote
                    currentField += '"';
                    i++; // Skip next quote
                } else {
                    // Toggle quote mode
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                // End of field
                currentLine.push(currentField.trim());
                currentField = '';
            } else if ((char === '\n' || char === '\r') && !inQuotes) {
                // End of line
                if (currentField || currentLine.length > 0) {
                    currentLine.push(currentField.trim());
                    if (currentLine.some(field => field !== '')) {
                        lines.push(currentLine);
                    }
                    currentLine = [];
                    currentField = '';
                }
                // Skip \r\n combination
                if (char === '\r' && nextChar === '\n') {
                    i++;
                }
            } else {
                currentField += char;
            }
        }
        
        // Add last field and line
        if (currentField || currentLine.length > 0) {
            currentLine.push(currentField.trim());
            if (currentLine.some(field => field !== '')) {
                lines.push(currentLine);
            }
        }
        
        return lines;
    }

    // Convert value to appropriate type
    function convertValue(value) {
        // Empty string
        if (value === '') return '';
        
        // Boolean
        if (value.toLowerCase() === 'true') return true;
        if (value.toLowerCase() === 'false') return false;
        
        // Number
        if (!isNaN(value) && value.trim() !== '') {
            return Number(value);
        }
        
        // String
        return value;
    }

    // Convert CSV to JSON
    convertBtn.addEventListener('click', () => {
        const input = inputTextarea.value.trim();
        
        if (!input) {
            showToast('Please enter CSV data to convert');
            return;
        }
        
        try {
            const lines = parseCSV(input);
            
            if (lines.length < 2) {
                showToast('CSV must have at least a header row and one data row');
                return;
            }
            
            // First line is headers
            const headers = lines[0];
            
            // Convert remaining lines to objects
            const result = [];
            for (let i = 1; i < lines.length; i++) {
                const obj = {};
                const values = lines[i];
                
                for (let j = 0; j < headers.length; j++) {
                    const key = headers[j];
                    const value = values[j] !== undefined ? values[j] : '';
                    obj[key] = convertValue(value);
                }
                
                result.push(obj);
            }
            
            // Format output
            const prettyPrint = prettyPrintCheckbox.checked;
            const json = prettyPrint 
                ? JSON.stringify(result, null, 2)
                : JSON.stringify(result);
            
            outputTextarea.value = json;
            
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
