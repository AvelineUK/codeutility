document.addEventListener('DOMContentLoaded', () => {
    const inputTextarea = document.getElementById('input');
    const outputTextarea = document.getElementById('output');
    const convertBtn = document.getElementById('convertBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');

    // Convert button
    convertBtn.addEventListener('click', convertXML);

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

    // Convert XML to JSON
    function convertXML() {
        const input = inputTextarea.value;
        
        if (!input.trim()) {
            showToast('Please enter some XML to convert');
            return;
        }
        
        try {
            // Parse XML using DOMParser
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(input, 'text/xml');
            
            // Check for parsing errors
            const parserError = xmlDoc.querySelector('parsererror');
            if (parserError) {
                throw new Error('Invalid XML syntax');
            }
            
            // Convert XML DOM to JSON object
            const result = xmlToJson(xmlDoc);
            
            // Format as JSON string
            const json = JSON.stringify(result, null, 2);
            
            outputTextarea.value = json;
        } catch (error) {
            showToast('Error: Invalid XML - ' + error.message);
        }
    }
    
    // Convert XML DOM to JSON object
    function xmlToJson(xml) {
        let obj = {};
        
        if (xml.nodeType === 1) { // Element node
            // Handle attributes
            if (xml.attributes.length > 0) {
                obj['@attributes'] = {};
                for (let i = 0; i < xml.attributes.length; i++) {
                    const attr = xml.attributes[i];
                    obj['@attributes'][attr.nodeName] = attr.nodeValue;
                }
            }
        } else if (xml.nodeType === 3) { // Text node
            obj = xml.nodeValue.trim();
        }
        
        // Handle child nodes
        if (xml.hasChildNodes()) {
            for (let i = 0; i < xml.childNodes.length; i++) {
                const child = xml.childNodes[i];
                const nodeName = child.nodeName;
                
                // Skip text nodes that are just whitespace
                if (child.nodeType === 3 && !child.nodeValue.trim()) {
                    continue;
                }
                
                if (child.nodeType === 3) {
                    // Text node
                    const text = child.nodeValue.trim();
                    if (text) {
                        if (Object.keys(obj).length === 0) {
                            obj = text;
                        } else {
                            obj['#text'] = text;
                        }
                    }
                } else {
                    // Element node
                    if (typeof obj[nodeName] === 'undefined') {
                        obj[nodeName] = xmlToJson(child);
                    } else {
                        // If property already exists, convert to array
                        if (!Array.isArray(obj[nodeName])) {
                            obj[nodeName] = [obj[nodeName]];
                        }
                        obj[nodeName].push(xmlToJson(child));
                    }
                }
            }
        }
        
        return obj;
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
