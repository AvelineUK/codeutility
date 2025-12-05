document.addEventListener('DOMContentLoaded', () => {
    const currentUuid = document.getElementById('currentUuid');
    const generateBtn = document.getElementById('generateBtn');
    const generateMultipleBtn = document.getElementById('generateMultipleBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const historyDiv = document.getElementById('history');

    let uuidHistory = [];

    // Generate single UUID
    generateBtn.addEventListener('click', () => {
        const uuid = crypto.randomUUID();
        currentUuid.value = uuid;
        addToHistory(uuid);
    });

    // Generate 10 UUIDs
    generateMultipleBtn.addEventListener('click', () => {
        for (let i = 0; i < 10; i++) {
            const uuid = crypto.randomUUID();
            addToHistory(uuid);
        }
        // Set the last one as current
        if (uuidHistory.length > 0) {
            currentUuid.value = uuidHistory[0];
        }
    });

    // Clear history
    clearBtn.addEventListener('click', () => {
        uuidHistory = [];
        currentUuid.value = '';
        updateHistoryDisplay();
    });

    // Copy to clipboard
    copyBtn.addEventListener('click', () => {
        const uuid = currentUuid.value;
        
        if (!uuid) {
            showToast('Generate a UUID first!');
            return;
        }
        
        navigator.clipboard.writeText(uuid)
            .then(() => {
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy to Clipboard';
                }, 2000);
            })
            .catch(() => {
                currentUuid.select();
                document.execCommand('copy');
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy to Clipboard';
                }, 2000);
            });
    });

    // Add UUID to history
    function addToHistory(uuid) {
        // Add to beginning of array
        uuidHistory.unshift(uuid);
        
        // Keep only last 10
        if (uuidHistory.length > 10) {
            uuidHistory = uuidHistory.slice(0, 10);
        }
        
        updateHistoryDisplay();
    }

    // Update history display
    function updateHistoryDisplay() {
        if (uuidHistory.length === 0) {
            historyDiv.innerHTML = '<em style="color: #a3a3a3;">No UUIDs generated yet...</em>';
            return;
        }
        
        historyDiv.innerHTML = uuidHistory
            .map(uuid => `<div class="history-row">
                <span>${uuid}</span>
                <button class="history-copy-btn" data-uuid="${uuid}">Copy</button>
            </div>`)
            .join('');
        
        // Add click handlers to copy buttons
        document.querySelectorAll('.history-copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const uuid = e.target.getAttribute('data-uuid');
                navigator.clipboard.writeText(uuid)
                    .then(() => {
                        e.target.textContent = 'Copied!';
                        setTimeout(() => {
                            e.target.textContent = 'Copy';
                        }, 2000);
                    })
                    .catch(() => {
                        showToast('Failed to copy');
                    });
            });
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

    // Generate one UUID on page load
    generateBtn.click();
});
