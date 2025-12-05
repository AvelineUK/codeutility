document.addEventListener('DOMContentLoaded', () => {
    const currentTimestamp = document.getElementById('currentTimestamp');
    const currentDate = document.getElementById('currentDate');
    const copyCurrentBtn = document.getElementById('copyCurrentBtn');
    
    const timestampInput = document.getElementById('timestampInput');
    const convertToDateBtn = document.getElementById('convertToDateBtn');
    const timestampResult = document.getElementById('timestampResult');
    const timestampOutput = document.getElementById('timestampOutput');
    const copyTimestampBtn = document.getElementById('copyTimestampBtn');
    
    const dateInput = document.getElementById('dateInput');
    const convertToTimestampBtn = document.getElementById('convertToTimestampBtn');
    const dateResult = document.getElementById('dateResult');
    const dateOutput = document.getElementById('dateOutput');
    const copyDateBtn = document.getElementById('copyDateBtn');

    // Update current timestamp every second
    function updateCurrentTimestamp() {
        const now = Math.floor(Date.now() / 1000);
        currentTimestamp.value = now;
        currentDate.textContent = new Date().toUTCString();
    }
    
    updateCurrentTimestamp();
    setInterval(updateCurrentTimestamp, 1000);

    // Copy current timestamp
    copyCurrentBtn.addEventListener('click', () => {
        copyToClipboard(currentTimestamp.value, copyCurrentBtn);
    });

    // Convert timestamp to date
    convertToDateBtn.addEventListener('click', () => {
        const timestamp = parseInt(timestampInput.value);
        
        if (isNaN(timestamp)) {
            showToast('Please enter a valid timestamp');
            return;
        }
        
        try {
            // Handle both seconds and milliseconds
            const ts = timestamp > 9999999999 ? timestamp : timestamp * 1000;
            const date = new Date(ts);
            
            if (isNaN(date.getTime())) {
                showToast('Invalid timestamp');
                return;
            }
            
            timestampOutput.value = date.toUTCString();
            timestampResult.style.display = 'block';
        } catch (error) {
            showToast('Error converting timestamp');
        }
    });

    // Copy timestamp result
    copyTimestampBtn.addEventListener('click', () => {
        copyToClipboard(timestampOutput.value, copyTimestampBtn);
    });

    // Convert date to timestamp
    convertToTimestampBtn.addEventListener('click', () => {
        const dateValue = dateInput.value;
        
        if (!dateValue) {
            showToast('Please select a date and time');
            return;
        }
        
        try {
            const date = new Date(dateValue);
            const timestamp = Math.floor(date.getTime() / 1000);
            
            dateOutput.value = timestamp;
            dateResult.style.display = 'block';
        } catch (error) {
            showToast('Error converting date');
        }
    });

    // Copy date result
    copyDateBtn.addEventListener('click', () => {
        copyToClipboard(dateOutput.value, copyDateBtn);
    });

    // Set current date/time as default
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const localTime = new Date(now.getTime() - offset);
    dateInput.value = localTime.toISOString().slice(0, 16);

    // Copy to clipboard helper
    function copyToClipboard(text, button) {
        navigator.clipboard.writeText(text)
            .then(() => {
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.textContent = originalText;
                }, 2000);
            })
            .catch(() => {
                showToast('Failed to copy');
            });
    }

    // Keyboard shortcuts
    timestampInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            convertToDateBtn.click();
        }
    });

    dateInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            convertToTimestampBtn.click();
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
