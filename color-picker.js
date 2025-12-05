document.addEventListener('DOMContentLoaded', () => {
    const colorPicker = document.getElementById('colorPicker');
    const colorDisplay = document.getElementById('colorDisplay');
    const hexValue = document.getElementById('hexValue');
    const rgbValue = document.getElementById('rgbValue');
    const hslValue = document.getElementById('hslValue');
    const rgbObject = document.getElementById('rgbObject');
    const recentColorsDiv = document.getElementById('recentColors');
    const copyButtons = document.querySelectorAll('.copy-btn');

    let recentColors = [];

    // Convert HEX to RGB
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    // Convert RGB to HSL
    function rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }

    // Update color values
    function updateColorValues(hex) {
        const rgb = hexToRgb(hex);
        if (!rgb) return;

        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

        hexValue.value = hex.toUpperCase();
        rgbValue.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        hslValue.value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
        rgbObject.value = `{ r: ${rgb.r}, g: ${rgb.g}, b: ${rgb.b} }`;

        colorDisplay.style.backgroundColor = hex;

        addToRecent(hex);
    }

    // Add to recent colors
    function addToRecent(hex) {
        // Remove if already exists
        recentColors = recentColors.filter(c => c.toLowerCase() !== hex.toLowerCase());
        
        // Add to beginning
        recentColors.unshift(hex);
        
        // Keep only last 10
        if (recentColors.length > 10) {
            recentColors = recentColors.slice(0, 10);
        }
        
        updateRecentDisplay();
    }

    // Update recent colors display
    function updateRecentDisplay() {
        if (recentColors.length === 0) {
            recentColorsDiv.innerHTML = '<em style="color: #a3a3a3;">No recent colors yet...</em>';
            return;
        }

        recentColorsDiv.innerHTML = recentColors.map(color => {
            return `<div class="recent-color-item" data-color="${color}" style="background-color: ${color};" title="${color.toUpperCase()}"></div>`;
        }).join('');

        // Add click handlers
        document.querySelectorAll('.recent-color-item').forEach(item => {
            item.addEventListener('click', () => {
                const color = item.getAttribute('data-color');
                colorPicker.value = color;
                updateColorValues(color);
            });
        });
    }

    // Color picker change
    colorPicker.addEventListener('input', (e) => {
        updateColorValues(e.target.value);
    });

    // Copy buttons
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const targetInput = document.getElementById(targetId);
            const value = targetInput.value;

            navigator.clipboard.writeText(value)
                .then(() => {
                    button.textContent = 'Copied!';
                    setTimeout(() => {
                        button.textContent = 'Copy';
                    }, 2000);
                })
                .catch(() => {
                    targetInput.select();
                    document.execCommand('copy');
                    button.textContent = 'Copied!';
                    setTimeout(() => {
                        button.textContent = 'Copy';
                    }, 2000);
                });
        });
    });

    // Initialize with default color
    updateColorValues(colorPicker.value);
});
