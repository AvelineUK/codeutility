document.addEventListener('DOMContentLoaded', () => {
    const patternInput = document.getElementById('pattern');
    const testStringTextarea = document.getElementById('testString');
    const flagGlobal = document.getElementById('flagGlobal');
    const flagCaseInsensitive = document.getElementById('flagCaseInsensitive');
    const flagMultiline = document.getElementById('flagMultiline');
    const matchResults = document.getElementById('matchResults');
    const highlightedOutput = document.getElementById('highlightedOutput');
    const clearBtn = document.getElementById('clearBtn');

    // Test regex on input
    function testRegex() {
        const pattern = patternInput.value;
        const testString = testStringTextarea.value;
        
        if (!pattern) {
            matchResults.innerHTML = '<em style="color: #a3a3a3;">Enter a pattern to test...</em>';
            highlightedOutput.innerHTML = '<em style="color: #a3a3a3;">Matches will be highlighted here...</em>';
            return;
        }
        
        if (!testString) {
            matchResults.innerHTML = '<em style="color: #a3a3a3;">Enter a test string...</em>';
            highlightedOutput.innerHTML = '<em style="color: #a3a3a3;">Matches will be highlighted here...</em>';
            return;
        }
        
        try {
            // Build flags
            let flags = '';
            if (flagGlobal.checked) flags += 'g';
            if (flagCaseInsensitive.checked) flags += 'i';
            if (flagMultiline.checked) flags += 'm';
            
            const regex = new RegExp(pattern, flags);
            const matches = [...testString.matchAll(regex)];
            
            if (matches.length === 0) {
                matchResults.innerHTML = '<div style="color: #dc2626; font-weight: 500;">No matches found</div>';
                highlightedOutput.textContent = testString;
                return;
            }
            
            // Display match results
            let resultsHtml = `<div style="color: #166534; font-weight: 500; margin-bottom: 12px;">Found ${matches.length} match${matches.length !== 1 ? 'es' : ''}</div>`;
            
            matches.forEach((match, index) => {
                resultsHtml += `<div style="margin-bottom: 8px; padding: 8px; background: #ffffff; border-left: 3px solid #3b82f6; border-radius: 4px;">
                    <strong>Match ${index + 1}:</strong> "${escapeHtml(match[0])}"<br>
                    <span style="color: #737373; font-size: 0.85rem;">Position: ${match.index}</span>
                </div>`;
            });
            
            matchResults.innerHTML = resultsHtml;
            
            // Highlight matches in output
            let highlightedText = testString;
            let offset = 0;
            
            matches.forEach(match => {
                const matchText = match[0];
                const startPos = match.index + offset;
                const endPos = startPos + matchText.length;
                
                const before = highlightedText.substring(0, startPos);
                const matchPart = highlightedText.substring(startPos, endPos);
                const after = highlightedText.substring(endPos);
                
                highlightedText = before + '<mark>' + escapeHtml(matchPart) + '</mark>' + after;
                offset += '<mark>'.length + '</mark>'.length;
            });
            
            highlightedOutput.innerHTML = highlightedText;
            
        } catch (error) {
            matchResults.innerHTML = `<div style="color: #dc2626; font-weight: 500;">Invalid regex: ${escapeHtml(error.message)}</div>`;
            highlightedOutput.textContent = testString;
        }
    }

    // Escape HTML for safe display
    function escapeHtml(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // Auto-test on input
    patternInput.addEventListener('input', testRegex);
    testStringTextarea.addEventListener('input', testRegex);
    flagGlobal.addEventListener('change', testRegex);
    flagCaseInsensitive.addEventListener('change', testRegex);
    flagMultiline.addEventListener('change', testRegex);

    // Clear button
    clearBtn.addEventListener('click', () => {
        patternInput.value = '';
        testStringTextarea.value = '';
        matchResults.innerHTML = '<em style="color: #a3a3a3;">Enter a pattern and test string to see matches...</em>';
        highlightedOutput.innerHTML = '<em style="color: #a3a3a3;">Matches will be highlighted here...</em>';
        patternInput.focus();
    });
});
