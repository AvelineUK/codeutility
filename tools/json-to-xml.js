document.addEventListener('DOMContentLoaded', () => {
    const inputTextarea = document.getElementById('input');
    const outputTextarea = document.getElementById('output');
    const convertBtn = document.getElementById('convertBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const rootElement = document.getElementById('rootElement');
    const includeDeclaration = document.getElementById('includeDeclaration');

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

    // Convert JSON to XML
    function convertJSON() {
        const input = inputTextarea.value;
        
        if (!input.trim()) {
            showToast('Please enter some JSON to convert');
            return;
        }
        
        try {
            // Parse JSON
            const obj = JSON.parse(input);
            
            // Get root element name
            const rootName = rootElement.value.trim() || 'root';
            
            // Convert to XML
            let xml = '';
            
            // Add XML declaration
            if (includeDeclaration.checked) {
                xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
            }
            
            // Convert object to XML
            xml += jsonToXml(obj, rootName, 0);
            
            outputTextarea.value = xml;
        } catch (error) {
            showToast('Error: Invalid JSON - ' + error.message);
        }
    }

    // Convert JSON object to XML string
    function jsonToXml(obj, tagName, indent) {
        const indentStr = '  '.repeat(indent);
        let xml = '';
        
        if (obj === null || obj === undefined) {
            return indentStr + `<${tagName}/>\n`;
        }
        
        if (typeof obj !== 'object') {
            // Primitive value
            const escaped = escapeXml(String(obj));
            return indentStr + `<${tagName}>${escaped}</${tagName}>\n`;
        }
        
        if (Array.isArray(obj)) {
            // Array - create multiple elements with same tag name
            obj.forEach(item => {
                xml += jsonToXml(item, tagName, indent);
            });
            return xml;
        }
        
        // Object
        xml += indentStr + `<${tagName}>\n`;
        
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];
                xml += jsonToXml(value, key, indent + 1);
            }
        }
        
        xml += indentStr + `</${tagName}>\n`;
        
        return xml;
    }

    // Escape special XML characters
    function escapeXml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
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
