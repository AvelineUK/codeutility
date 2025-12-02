document.addEventListener('DOMContentLoaded', () => {
    const colorCountSlider = document.getElementById('colorCount');
    const colorCountValue = document.getElementById('colorCountValue');
    const generateBtn = document.getElementById('generateBtn');
    const copyAllBtn = document.getElementById('copyAllBtn');
    const paletteDisplay = document.getElementById('paletteDisplay');

    let currentPalette = [];

    // Update color count display
    colorCountSlider.addEventListener('input', (e) => {
        colorCountValue.textContent = e.target.value;
    });

    // Generate random color
    function generateRandomColor() {
        const array = new Uint8Array(3);
        crypto.getRandomValues(array);
        
        const r = array[0];
        const g = array[1];
        const b = array[2];
        
        return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
    }

    // Generate palette
    function generatePalette() {
        const count = parseInt(colorCountSlider.value);
        currentPalette = [];
        
        for (let i = 0; i < count; i++) {
            currentPalette.push(generateRandomColor());
        }
        
        displayPalette();
    }

    // Display palette
    function displayPalette() {
        paletteDisplay.innerHTML = '';
        
        currentPalette.forEach((color, index) => {
            const colorBox = document.createElement('div');
            colorBox.className = 'color-box';
            colorBox.style.backgroundColor = color;
            
            const colorInfo = document.createElement('div');
            colorInfo.className = 'color-info';
            
            const colorHex = document.createElement('div');
            colorHex.className = 'color-hex';
            colorHex.textContent = color.toUpperCase();
            
            const copyBtn = document.createElement('button');
            copyBtn.className = 'color-copy-btn';
            copyBtn.textContent = 'Copy';
            copyBtn.onclick = (e) => {
                e.stopPropagation();
                copyColor(color, copyBtn);
            };
            
            colorInfo.appendChild(colorHex);
            colorInfo.appendChild(copyBtn);
            colorBox.appendChild(colorInfo);
            
            // Click anywhere on box to copy
            colorBox.onclick = () => {
                copyColor(color, copyBtn);
            };
            
            paletteDisplay.appendChild(colorBox);
        });
    }

    // Copy single color
    function copyColor(color, button) {
        navigator.clipboard.writeText(color.toUpperCase())
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

    // Copy all colors
    copyAllBtn.addEventListener('click', () => {
        if (currentPalette.length === 0) {
            showToast('Generate a palette first!');
            return;
        }
        
        const allColors = currentPalette.map(c => c.toUpperCase()).join(', ');
        
        navigator.clipboard.writeText(allColors)
            .then(() => {
                copyAllBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyAllBtn.textContent = 'Copy All Hex Codes';
                }, 2000);
            })
            .catch(() => {
                showToast('Failed to copy');
            });
    });

    // Generate button
    generateBtn.addEventListener('click', () => {
        generatePalette();
    });

    // Keyboard shortcut: Space to generate
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
            e.preventDefault();
            generateBtn.click();
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

    // Generate initial palette
    generatePalette();
});
