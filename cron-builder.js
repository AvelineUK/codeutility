document.addEventListener('DOMContentLoaded', () => {
    const cronExpression = document.getElementById('cronExpression');
    const cronDescription = document.getElementById('cronDescription');
    const copyBtn = document.getElementById('copyBtn');
    const nextRunsList = document.getElementById('nextRunsList');

    // Initialize
    updateCronExpression();

    // Add listeners to all inputs
    document.querySelectorAll('input[type="radio"], input[type="number"], input[type="checkbox"], select').forEach(input => {
        input.addEventListener('change', updateCronExpression);
        input.addEventListener('input', updateCronExpression);
    });

    // Copy button
    copyBtn.addEventListener('click', () => {
        const expression = cronExpression.textContent;
        
        navigator.clipboard.writeText(expression)
            .then(() => {
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy Expression';
                }, 2000);
            })
            .catch(() => {
                showToast('Failed to copy');
            });
    });

    function updateCronExpression() {
        const minute = getMinuteValue();
        const hour = getHourValue();
        const day = getDayValue();
        const month = getMonthValue();
        const weekday = getWeekdayValue();

        const expression = `${minute} ${hour} ${day} ${month} ${weekday}`;
        cronExpression.textContent = expression;

        // Update individual field displays
        document.getElementById('minuteValue').textContent = minute;
        document.getElementById('hourValue').textContent = hour;
        document.getElementById('dayValue').textContent = day;
        document.getElementById('monthValue').textContent = month;
        document.getElementById('weekdayValue').textContent = weekday;

        // Generate description
        const description = generateDescription(minute, hour, day, month, weekday);
        cronDescription.textContent = description;

        // Calculate next runs
        calculateNextRuns(minute, hour, day, month, weekday);
    }

    function getMinuteValue() {
        const selected = document.querySelector('input[name="minute"]:checked').value;
        
        if (selected === '*') return '*';
        if (selected === 'specific') return document.getElementById('minuteSpecificValue').value;
        if (selected === 'everyX') return `*/${document.getElementById('minuteEveryXValue').value}`;
        if (selected === 'range') {
            const start = document.getElementById('minuteRangeStart').value;
            const end = document.getElementById('minuteRangeEnd').value;
            return `${start}-${end}`;
        }
        return '*';
    }

    function getHourValue() {
        const selected = document.querySelector('input[name="hour"]:checked').value;
        
        if (selected === '*') return '*';
        if (selected === 'specific') return document.getElementById('hourSpecificValue').value;
        if (selected === 'everyX') return `*/${document.getElementById('hourEveryXValue').value}`;
        if (selected === 'range') {
            const start = document.getElementById('hourRangeStart').value;
            const end = document.getElementById('hourRangeEnd').value;
            return `${start}-${end}`;
        }
        return '*';
    }

    function getDayValue() {
        const selected = document.querySelector('input[name="day"]:checked').value;
        
        if (selected === '*') return '*';
        if (selected === 'specific') return document.getElementById('daySpecificValue').value;
        if (selected === 'everyX') return `*/${document.getElementById('dayEveryXValue').value}`;
        if (selected === 'L') return 'L';
        return '*';
    }

    function getMonthValue() {
        const selected = document.querySelector('input[name="month"]:checked').value;
        
        if (selected === '*') return '*';
        if (selected === 'specific') return document.getElementById('monthSpecificValue').value;
        if (selected === 'multiple') {
            const months = [];
            for (let i = 1; i <= 12; i++) {
                if (document.getElementById(`month${i}`).checked) {
                    months.push(i);
                }
            }
            return months.length > 0 ? months.join(',') : '*';
        }
        return '*';
    }

    function getWeekdayValue() {
        const selected = document.querySelector('input[name="weekday"]:checked').value;
        
        if (selected === '*') return '*';
        if (selected === 'specific') return document.getElementById('weekdaySpecificValue').value;
        if (selected === '1-5') return '1-5';
        if (selected === '0,6') return '0,6';
        if (selected === 'multiple') {
            const days = [];
            for (let i = 0; i <= 6; i++) {
                if (document.getElementById(`weekday${i}`).checked) {
                    days.push(i);
                }
            }
            return days.length > 0 ? days.join(',') : '*';
        }
        return '*';
    }

    function generateDescription(minute, hour, day, month, weekday) {
        let parts = [];

        // Time part
        let timePart = '';
        if (minute === '*' && hour === '*') {
            timePart = 'Every minute';
        } else if (minute.startsWith('*/')) {
            const interval = minute.substring(2);
            if (hour === '*') {
                timePart = `Every ${interval} minutes`;
            } else {
                timePart = `Every ${interval} minutes, ` + getHourDescription(hour);
            }
        } else if (minute.includes('-')) {
            timePart = `Minutes ${minute}, ` + getHourDescription(hour);
        } else {
            const min = minute === '*' ? 'every minute' : `minute ${minute}`;
            timePart = `At ${min}` + (hour !== '*' ? ', ' + getHourDescription(hour) : '');
        }

        parts.push(timePart);

        // Day part
        if (day !== '*' || weekday !== '*') {
            if (weekday === '1-5') {
                parts.push('on weekdays (Monday through Friday)');
            } else if (weekday === '0,6') {
                parts.push('on weekends (Saturday and Sunday)');
            } else if (weekday !== '*') {
                parts.push('on ' + getWeekdayDescription(weekday));
            } else if (day === 'L') {
                parts.push('on the last day of the month');
            } else if (day.startsWith('*/')) {
                parts.push(`every ${day.substring(2)} days`);
            } else if (day !== '*') {
                parts.push(`on day ${day} of the month`);
            }
        }

        // Month part
        if (month !== '*') {
            parts.push('in ' + getMonthDescription(month));
        }

        return parts.join(', ');
    }

    function getHourDescription(hour) {
        if (hour === '*') return 'every hour';
        if (hour.startsWith('*/')) return `every ${hour.substring(2)} hours`;
        if (hour.includes('-')) {
            const [start, end] = hour.split('-');
            return `between ${formatHour(start)} and ${formatHour(end)}`;
        }
        return `at ${formatHour(hour)}`;
    }

    function getWeekdayDescription(weekday) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        if (weekday.includes(',')) {
            const nums = weekday.split(',').map(n => parseInt(n));
            return nums.map(n => days[n]).join(', ');
        }
        return days[parseInt(weekday)];
    }

    function getMonthDescription(month) {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
        if (month.includes(',')) {
            const nums = month.split(',').map(n => parseInt(n) - 1);
            return nums.map(n => months[n]).join(', ');
        }
        return months[parseInt(month) - 1];
    }

    function formatHour(hour) {
        const h = parseInt(hour);
        if (h === 0) return '12:00 AM';
        if (h < 12) return `${h}:00 AM`;
        if (h === 12) return '12:00 PM';
        return `${h - 12}:00 PM`;
    }

    function calculateNextRuns(minute, hour, day, month, weekday) {
        try {
            const runs = getNextRuns(minute, hour, day, month, weekday, 5);
            nextRunsList.innerHTML = runs.map(date => 
                `<li>${date.toLocaleString('en-US', { 
                    weekday: 'short', 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric', 
                    hour: '2-digit', 
                    minute: '2-digit',
                    second: '2-digit'
                })}</li>`
            ).join('');
        } catch (e) {
            nextRunsList.innerHTML = '<li>Unable to calculate next runs for this expression</li>';
        }
    }

    function getNextRuns(minute, hour, day, month, weekday, count) {
        const runs = [];
        let current = new Date();
        current.setSeconds(0);
        current.setMilliseconds(0);
        current.setMinutes(current.getMinutes() + 1); // Start from next minute

        let iterations = 0;
        const maxIterations = 10000; // Prevent infinite loops

        while (runs.length < count && iterations < maxIterations) {
            iterations++;

            if (matchesCron(current, minute, hour, day, month, weekday)) {
                runs.push(new Date(current));
            }

            // Move to next minute
            current.setMinutes(current.getMinutes() + 1);
        }

        return runs;
    }

    function matchesCron(date, minute, hour, day, month, weekday) {
        // Check minute
        if (!matchesField(date.getMinutes(), minute, 0, 59)) return false;

        // Check hour
        if (!matchesField(date.getHours(), hour, 0, 23)) return false;

        // Check month
        if (!matchesField(date.getMonth() + 1, month, 1, 12)) return false;

        // Check day of month
        if (day === 'L') {
            // Last day of month
            const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
            if (date.getDate() !== lastDay) return false;
        } else if (day !== '*') {
            if (!matchesField(date.getDate(), day, 1, 31)) return false;
        }

        // Check day of week
        if (weekday !== '*') {
            if (!matchesField(date.getDay(), weekday, 0, 6)) return false;
        }

        return true;
    }

    function matchesField(value, pattern, min, max) {
        if (pattern === '*') return true;

        // Handle step values (*/n)
        if (pattern.startsWith('*/')) {
            const step = parseInt(pattern.substring(2));
            return value % step === 0;
        }

        // Handle ranges (n-m)
        if (pattern.includes('-')) {
            const [start, end] = pattern.split('-').map(n => parseInt(n));
            return value >= start && value <= end;
        }

        // Handle lists (n,m,o)
        if (pattern.includes(',')) {
            const values = pattern.split(',').map(n => parseInt(n));
            return values.includes(value);
        }

        // Single value
        return value === parseInt(pattern);
    }

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
