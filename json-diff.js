document.addEventListener('DOMContentLoaded', () => {
    const input1 = document.getElementById('input1');
    const input2 = document.getElementById('input2');
    const compareBtn = document.getElementById('compareBtn');
    const clearBtn = document.getElementById('clearBtn');
    const resultsCard = document.getElementById('resultsCard');
    const diffOutput = document.getElementById('diffOutput');
    const addedCount = document.getElementById('addedCount');
    const removedCount = document.getElementById('removedCount');
    const changedCount = document.getElementById('changedCount');

    // Compare button
    compareBtn.addEventListener('click', compareJSON);

    // Clear button
    clearBtn.addEventListener('click', () => {
        input1.value = '';
        input2.value = '';
        resultsCard.style.display = 'none';
        input1.focus();
    });

    // Compare JSON
    function compareJSON() {
        const json1Text = input1.value;
        const json2Text = input2.value;
        
        if (!json1Text.trim() || !json2Text.trim()) {
            showToast('Please enter both JSON objects to compare');
            return;
        }
        
        try {
            const obj1 = JSON.parse(json1Text);
            const obj2 = JSON.parse(json2Text);
            
            const differences = findDifferences(obj1, obj2);
            displayDifferences(differences);
            
            resultsCard.style.display = 'block';
        } catch (error) {
            showToast('Error: Invalid JSON - ' + error.message);
        }
    }

    // Find differences between two objects
    function findDifferences(obj1, obj2, path = '') {
        const diffs = [];
        
        // Check all keys in obj1
        for (const key in obj1) {
            if (obj1.hasOwnProperty(key)) {
                const currentPath = path ? `${path}.${key}` : key;
                
                if (!obj2.hasOwnProperty(key)) {
                    // Key removed
                    diffs.push({
                        type: 'removed',
                        path: currentPath,
                        oldValue: obj1[key]
                    });
                } else if (typeof obj1[key] === 'object' && obj1[key] !== null && 
                           typeof obj2[key] === 'object' && obj2[key] !== null &&
                           !Array.isArray(obj1[key]) && !Array.isArray(obj2[key])) {
                    // Both are objects, recurse
                    diffs.push(...findDifferences(obj1[key], obj2[key], currentPath));
                } else if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
                    // Value changed
                    diffs.push({
                        type: 'changed',
                        path: currentPath,
                        oldValue: obj1[key],
                        newValue: obj2[key]
                    });
                }
            }
        }
        
        // Check for new keys in obj2
        for (const key in obj2) {
            if (obj2.hasOwnProperty(key) && !obj1.hasOwnProperty(key)) {
                const currentPath = path ? `${path}.${key}` : key;
                diffs.push({
                    type: 'added',
                    path: currentPath,
                    newValue: obj2[key]
                });
            }
        }
        
        return diffs;
    }

    // Display differences
    function displayDifferences(diffs) {
        let added = 0;
        let removed = 0;
        let changed = 0;
        
        if (diffs.length === 0) {
            diffOutput.innerHTML = '<p style="color: #16a34a; font-weight: 600;">✓ No differences found - JSON objects are identical</p>';
            addedCount.textContent = '0';
            removedCount.textContent = '0';
            changedCount.textContent = '0';
            return;
        }
        
        let html = '';
        
        diffs.forEach(diff => {
            if (diff.type === 'added') {
                added++;
                html += `<div class="diff-line diff-added"><strong>${escapeHtml(diff.path)}:</strong> ${escapeHtml(JSON.stringify(diff.newValue))}</div>`;
            } else if (diff.type === 'removed') {
                removed++;
                html += `<div class="diff-line diff-removed"><strong>${escapeHtml(diff.path)}:</strong> ${escapeHtml(JSON.stringify(diff.oldValue))}</div>`;
            } else if (diff.type === 'changed') {
                changed++;
                html += `<div class="diff-line"><strong>${escapeHtml(diff.path)}:</strong> <span class="diff-removed">${escapeHtml(JSON.stringify(diff.oldValue))}</span> → <span class="diff-added">${escapeHtml(JSON.stringify(diff.newValue))}</span></div>`;
            }
        });
        
        diffOutput.innerHTML = html;
        addedCount.textContent = added;
        removedCount.textContent = removed;
        changedCount.textContent = changed;
    }

    // Escape HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
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
