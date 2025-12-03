document.addEventListener('DOMContentLoaded', () => {
    const timestampInput = document.getElementById('timestamp');
    const operation = document.getElementById('operation');
    const amount = document.getElementById('amount');
    const unit = document.getElementById('unit');
    const calculateBtn = document.getElementById('calculateBtn');
    const nowBtn = document.getElementById('nowBtn');
    const clearBtn = document.getElementById('clearBtn');
    const resultTimestamp = document.getElementById('resultTimestamp');
    const resultHuman = document.getElementById('resultHuman');
    const resultISO = document.getElementById('resultISO');
    const copyTimestamp = document.getElementById('copyTimestamp');

    // Use current time
    nowBtn.addEventListener('click', () => {
        timestampInput.value = Math.floor(Date.now() / 1000);
        calculate();
    });

    // Calculate button
    calculateBtn.addEventListener('click', calculate);

    // Clear button
    clearBtn.addEventListener('click', () => {
        timestampInput.value = '';
        amount.value = '1';
        resultTimestamp.value = '';
        resultHuman.textContent = '-';
        resultISO.textContent = '-';
    });

    // Copy timestamp
    copyTimestamp.addEventListener('click', () => {
        if (!resultTimestamp.value) {
            showToast('Nothing to copy!');
            return;
        }
        
        navigator.clipboard.writeText(resultTimestamp.value)
            .then(() => {
                copyTimestamp.textContent = 'Copied!';
                setTimeout(() => {
                    copyTimestamp.textContent = 'Copy';
                }, 2000);
            })
            .catch(() => {
                resultTimestamp.select();
                document.execCommand('copy');
                copyTimestamp.textContent = 'Copied!';
                setTimeout(() => {
                    copyTimestamp.textContent = 'Copy';
                }, 2000);
            });
    });

    // Calculate function
    function calculate() {
        const timestamp = parseInt(timestampInput.value);
        const amountVal = parseInt(amount.value) || 0;
        
        if (isNaN(timestamp)) {
            showToast('Please enter a valid Unix timestamp');
            return;
        }
        
        // Convert to milliseconds
        let date = new Date(timestamp * 1000);
        
        // Calculate time offset in milliseconds
        let offset = 0;
        switch (unit.value) {
            case 'seconds':
                offset = amountVal * 1000;
                break;
            case 'minutes':
                offset = amountVal * 60 * 1000;
                break;
            case 'hours':
                offset = amountVal * 60 * 60 * 1000;
                break;
            case 'days':
                offset = amountVal * 24 * 60 * 60 * 1000;
                break;
            case 'weeks':
                offset = amountVal * 7 * 24 * 60 * 60 * 1000;
                break;
            case 'months':
                offset = amountVal * 30 * 24 * 60 * 60 * 1000;
                break;
            case 'years':
                offset = amountVal * 365 * 24 * 60 * 60 * 1000;
                break;
        }
        
        // Apply operation
        if (operation.value === 'add') {
            date = new Date(date.getTime() + offset);
        } else {
            date = new Date(date.getTime() - offset);
        }
        
        // Convert back to Unix timestamp
        const resultUnix = Math.floor(date.getTime() / 1000);
        
        // Update results
        resultTimestamp.value = resultUnix;
        resultHuman.textContent = date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
        });
        resultISO.textContent = date.toISOString();
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
