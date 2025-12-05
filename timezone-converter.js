document.addEventListener('DOMContentLoaded', () => {
    const sourceDate = document.getElementById('sourceDate');
    const sourceTimezone = document.getElementById('sourceTimezone');
    const convertBtn = document.getElementById('convertBtn');
    const nowBtn = document.getElementById('nowBtn');
    const clearBtn = document.getElementById('clearBtn');
    const results = document.getElementById('results');
    const placeholder = document.getElementById('placeholder');
    const utcTime = document.getElementById('utcTime');
    const targetTimezones = document.getElementById('targetTimezones');

    // Popular timezones to show
    const displayTimezones = [
        { name: 'Eastern Time (US)', zone: 'America/New_York' },
        { name: 'Central Time (US)', zone: 'America/Chicago' },
        { name: 'Mountain Time (US)', zone: 'America/Denver' },
        { name: 'Pacific Time (US)', zone: 'America/Los_Angeles' },
        { name: 'London', zone: 'Europe/London' },
        { name: 'Paris/Berlin', zone: 'Europe/Paris' },
        { name: 'Tokyo', zone: 'Asia/Tokyo' },
        { name: 'Sydney', zone: 'Australia/Sydney' }
    ];

    // Use current time
    nowBtn.addEventListener('click', () => {
        const now = new Date();
        sourceDate.value = formatDateTimeLocal(now);
        convert();
    });

    // Convert button
    convertBtn.addEventListener('click', convert);

    // Clear button
    clearBtn.addEventListener('click', () => {
        sourceDate.value = '';
        results.style.display = 'none';
        placeholder.style.display = 'block';
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

    // Convert function
    function convert() {
        if (!sourceDate.value) {
            showToast('Please select a date and time');
            return;
        }

        // Parse the input date
        const inputDate = new Date(sourceDate.value);
        
        // Get the source timezone
        const sourceTZ = sourceTimezone.value;
        
        // Convert to UTC
        const utcDate = new Date(inputDate.toLocaleString('en-US', { timeZone: sourceTZ }));
        
        // Display UTC time
        utcTime.textContent = new Date(sourceDate.value).toLocaleString('en-US', {
            timeZone: 'UTC',
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
        });
        
        // Convert to all target timezones
        let html = '';
        displayTimezones.forEach(tz => {
            const converted = new Date(sourceDate.value).toLocaleString('en-US', {
                timeZone: tz.zone,
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZoneName: 'short'
            });
            
            html += `<div style="margin-bottom: 12px; padding: 16px; background: #ffffff; border-radius: 6px;"><p style="font-size: 0.9rem; color: #737373; margin-bottom: 8px;">${tz.name}</p><p style="font-size: 1rem; color: #171717; font-weight: 500;">${converted}</p></div>`;
        });
        
        targetTimezones.innerHTML = html;
        
        // Show results
        results.style.display = 'block';
        placeholder.style.display = 'none';
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
