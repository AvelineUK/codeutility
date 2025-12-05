document.addEventListener('DOMContentLoaded', () => {
    const inputDate = document.getElementById('inputDate');
    const isoInput = document.getElementById('isoInput');
    const toISOBtn = document.getElementById('toISOBtn');
    const fromISOBtn = document.getElementById('fromISOBtn');
    const nowBtn = document.getElementById('nowBtn');
    const clearBtn = document.getElementById('clearBtn');
    const isoOutput = document.getElementById('isoOutput');
    const humanOutput = document.getElementById('humanOutput');
    const timestampOutput = document.getElementById('timestampOutput');
    const copyISO = document.getElementById('copyISO');
    const copyTimestamp = document.getElementById('copyTimestamp');

    // Convert to ISO 8601
    toISOBtn.addEventListener('click', () => {
        if (!inputDate.value) {
            showToast('Please select a date and time');
            return;
        }

        const date = new Date(inputDate.value);
        isoOutput.value = date.toISOString();
    });

    // Convert from ISO 8601
    fromISOBtn.addEventListener('click', () => {
        const isoString = isoInput.value.trim();
        
        if (!isoString) {
            showToast('Please enter an ISO 8601 string');
            return;
        }

        try {
            const date = new Date(isoString);
            
            // Check if date is valid
            if (isNaN(date.getTime())) {
                showToast('Invalid ISO 8601 format');
                return;
            }

            // Human readable format
            humanOutput.textContent = date.toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZoneName: 'short'
            });

            // Unix timestamp
            timestampOutput.value = Math.floor(date.getTime() / 1000);
        } catch (error) {
            showToast('Error parsing ISO 8601 string');
        }
    });

    // Use current time
    nowBtn.addEventListener('click', () => {
        const now = new Date();
        inputDate.value = formatDateTimeLocal(now);
        isoInput.value = now.toISOString();
        
        // Auto-convert both
        toISOBtn.click();
        fromISOBtn.click();
    });

    // Clear all
    clearBtn.addEventListener('click', () => {
        inputDate.value = '';
        isoInput.value = '';
        isoOutput.value = '';
        humanOutput.textContent = '-';
        timestampOutput.value = '';
    });

    // Copy ISO output
    copyISO.addEventListener('click', () => {
        if (!isoOutput.value) {
            showToast('Nothing to copy!');
            return;
        }
        
        navigator.clipboard.writeText(isoOutput.value)
            .then(() => {
                copyISO.textContent = 'Copied!';
                setTimeout(() => {
                    copyISO.textContent = 'Copy';
                }, 2000);
            })
            .catch(() => {
                isoOutput.select();
                document.execCommand('copy');
                copyISO.textContent = 'Copied!';
                setTimeout(() => {
                    copyISO.textContent = 'Copy';
                }, 2000);
            });
    });

    // Copy timestamp output
    copyTimestamp.addEventListener('click', () => {
        if (!timestampOutput.value) {
            showToast('Nothing to copy!');
            return;
        }
        
        navigator.clipboard.writeText(timestampOutput.value)
            .then(() => {
                copyTimestamp.textContent = 'Copied!';
                setTimeout(() => {
                    copyTimestamp.textContent = 'Copy';
                }, 2000);
            })
            .catch(() => {
                timestampOutput.select();
                document.execCommand('copy');
                copyTimestamp.textContent = 'Copied!';
                setTimeout(() => {
                    copyTimestamp.textContent = 'Copy';
                }, 2000);
            });
    });

    // Format date for datetime-local input
    function formatDateTimeLocal(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
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

    // Set current time on load
    nowBtn.click();
});
