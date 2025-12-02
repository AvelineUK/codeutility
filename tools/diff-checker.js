document.addEventListener('DOMContentLoaded', () => {
    const text1 = document.getElementById('text1');
    const text2 = document.getElementById('text2');
    const ignoreWhitespace = document.getElementById('ignoreWhitespace');
    const ignoreCase = document.getElementById('ignoreCase');
    const compareBtn = document.getElementById('compareBtn');
    const swapBtn = document.getElementById('swapBtn');
    const clearBtn = document.getElementById('clearBtn');
    const diffStats = document.getElementById('diffStats');
    const output1 = document.getElementById('output1');
    const output2 = document.getElementById('output2');

    // Compare texts
    compareBtn.addEventListener('click', () => {
        const str1 = text1.value;
        const str2 = text2.value;
        
        if (!str1 && !str2) {
            showToast('Please enter texts to compare');
            return;
        }
        
        // Process texts based on options
        let processedStr1 = str1;
        let processedStr2 = str2;
        
        if (ignoreCase.checked) {
            processedStr1 = processedStr1.toLowerCase();
            processedStr2 = processedStr2.toLowerCase();
        }
        
        if (ignoreWhitespace.checked) {
            processedStr1 = processedStr1.replace(/\s+/g, ' ').trim();
            processedStr2 = processedStr2.replace(/\s+/g, ' ').trim();
        }
        
        // Split into lines
        const lines1 = processedStr1.split('\n');
        const lines2 = processedStr2.split('\n');
        
        // Calculate diff
        const diff = computeDiff(lines1, lines2);
        
        // Display results
        displayDiff(diff, str1.split('\n'), str2.split('\n'));
    });

    // Swap texts
    swapBtn.addEventListener('click', () => {
        const temp = text1.value;
        text1.value = text2.value;
        text2.value = temp;
    });

    // Clear all
    clearBtn.addEventListener('click', () => {
        text1.value = '';
        text2.value = '';
        diffStats.innerHTML = '<em style="color: #a3a3a3;">Click "Compare Texts" to see differences...</em>';
        output1.innerHTML = '<em style="color: #a3a3a3;">Differences will appear here...</em>';
        output2.innerHTML = '<em style="color: #a3a3a3;">Differences will appear here...</em>';
        text1.focus();
    });

    // Simple line-based diff algorithm
    function computeDiff(lines1, lines2) {
        const diff = [];
        let i = 0;
        let j = 0;
        
        while (i < lines1.length || j < lines2.length) {
            if (i >= lines1.length) {
                // Remaining lines in text2 are added
                diff.push({ type: 'added', line1: null, line2: lines2[j], index2: j });
                j++;
            } else if (j >= lines2.length) {
                // Remaining lines in text1 are removed
                diff.push({ type: 'removed', line1: lines1[i], line2: null, index1: i });
                i++;
            } else if (lines1[i] === lines2[j]) {
                // Lines are the same
                diff.push({ type: 'unchanged', line1: lines1[i], line2: lines2[j], index1: i, index2: j });
                i++;
                j++;
            } else {
                // Lines are different - check if next lines match
                const foundInText2 = lines2.indexOf(lines1[i], j);
                const foundInText1 = lines1.indexOf(lines2[j], i);
                
                if (foundInText2 !== -1 && (foundInText1 === -1 || foundInText2 - j < foundInText1 - i)) {
                    // Line from text1 appears later in text2, so lines in between were added
                    diff.push({ type: 'added', line1: null, line2: lines2[j], index2: j });
                    j++;
                } else if (foundInText1 !== -1) {
                    // Line from text2 appears later in text1, so lines in between were removed
                    diff.push({ type: 'removed', line1: lines1[i], line2: null, index1: i });
                    i++;
                } else {
                    // Lines are simply different (modified)
                    diff.push({ type: 'modified', line1: lines1[i], line2: lines2[j], index1: i, index2: j });
                    i++;
                    j++;
                }
            }
        }
        
        return diff;
    }

    // Display diff results
    function displayDiff(diff, originalLines1, originalLines2) {
        let addedCount = 0;
        let removedCount = 0;
        let modifiedCount = 0;
        
        let html1 = '';
        let html2 = '';
        
        diff.forEach(item => {
            if (item.type === 'unchanged') {
                html1 += `<div class="diff-line">${escapeHtml(originalLines1[item.index1])}</div>`;
                html2 += `<div class="diff-line">${escapeHtml(originalLines2[item.index2])}</div>`;
            } else if (item.type === 'removed') {
                html1 += `<div class="diff-line diff-removed">${escapeHtml(originalLines1[item.index1])}</div>`;
                removedCount++;
            } else if (item.type === 'added') {
                html2 += `<div class="diff-line diff-added">${escapeHtml(originalLines2[item.index2])}</div>`;
                addedCount++;
            } else if (item.type === 'modified') {
                html1 += `<div class="diff-line diff-removed">${escapeHtml(originalLines1[item.index1])}</div>`;
                html2 += `<div class="diff-line diff-added">${escapeHtml(originalLines2[item.index2])}</div>`;
                modifiedCount++;
            }
        });
        
        output1.innerHTML = html1 || '<em style="color: #a3a3a3;">No content</em>';
        output2.innerHTML = html2 || '<em style="color: #a3a3a3;">No content</em>';
        
        // Display stats
        const totalChanges = addedCount + removedCount + modifiedCount;
        
        if (totalChanges === 0) {
            diffStats.innerHTML = '<div style="color: #166534; font-weight: 500;">✓ Texts are identical</div>';
        } else {
            diffStats.innerHTML = `
                <div style="color: #171717; font-weight: 500; margin-bottom: 8px;">${totalChanges} difference${totalChanges !== 1 ? 's' : ''} found</div>
                <div style="display: flex; gap: 20px; font-size: 0.9rem;">
                    <span style="color: #dc2626;">• ${removedCount} removed</span>
                    <span style="color: #16a34a;">• ${addedCount} added</span>
                    <span style="color: #737373;">• ${modifiedCount} modified</span>
                </div>
            `;
        }
    }

    // Escape HTML
    function escapeHtml(text) {
        if (!text) return '';
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // Toast notification
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
