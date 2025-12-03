document.addEventListener('DOMContentLoaded', () => {
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    const calculateBtn = document.getElementById('calculateBtn');
    const todayBtn = document.getElementById('todayBtn');
    const clearBtn = document.getElementById('clearBtn');
    const totalDays = document.getElementById('totalDays');
    const totalHours = document.getElementById('totalHours');
    const totalMinutes = document.getElementById('totalMinutes');
    const totalSeconds = document.getElementById('totalSeconds');
    const breakdown = document.getElementById('breakdown');

    // Set default dates to today
    setToday();

    // Calculate button
    calculateBtn.addEventListener('click', calculateDifference);

    // Today button
    todayBtn.addEventListener('click', setToday);

    // Clear button
    clearBtn.addEventListener('click', () => {
        startDate.value = '';
        endDate.value = '';
        resetResults();
    });

    // Auto-calculate on date change
    startDate.addEventListener('change', calculateDifference);
    endDate.addEventListener('change', calculateDifference);

    // Set both dates to today
    function setToday() {
        const now = new Date();
        const formatted = formatDateTimeLocal(now);
        startDate.value = formatted;
        endDate.value = formatted;
        calculateDifference();
    }

    // Format date for datetime-local input
    function formatDateTimeLocal(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    // Calculate difference
    function calculateDifference() {
        if (!startDate.value || !endDate.value) {
            return;
        }

        const start = new Date(startDate.value);
        const end = new Date(endDate.value);
        
        // Calculate difference in milliseconds
        const diffMs = Math.abs(end - start);
        
        // Convert to different units
        const seconds = Math.floor(diffMs / 1000);
        const minutes = Math.floor(diffMs / (1000 * 60));
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        // Update totals
        totalDays.textContent = days.toLocaleString();
        totalHours.textContent = hours.toLocaleString();
        totalMinutes.textContent = minutes.toLocaleString();
        totalSeconds.textContent = seconds.toLocaleString();
        
        // Calculate breakdown
        const breakdownDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const breakdownHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const breakdownMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const breakdownSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);
        
        // Build breakdown text
        const parts = [];
        if (breakdownDays > 0) parts.push(`${breakdownDays} day${breakdownDays !== 1 ? 's' : ''}`);
        if (breakdownHours > 0) parts.push(`${breakdownHours} hour${breakdownHours !== 1 ? 's' : ''}`);
        if (breakdownMinutes > 0) parts.push(`${breakdownMinutes} minute${breakdownMinutes !== 1 ? 's' : ''}`);
        if (breakdownSeconds > 0) parts.push(`${breakdownSeconds} second${breakdownSeconds !== 1 ? 's' : ''}`);
        
        breakdown.textContent = parts.length > 0 ? parts.join(', ') : '0 seconds';
    }

    // Reset results
    function resetResults() {
        totalDays.textContent = '0';
        totalHours.textContent = '0';
        totalMinutes.textContent = '0';
        totalSeconds.textContent = '0';
        breakdown.textContent = '-';
    }

    // Initial calculation
    calculateDifference();
});
