document.addEventListener('DOMContentLoaded', () => {
    const radiusPreview = document.getElementById('radiusPreview');
    const cssOutput = document.getElementById('cssOutput');
    const uniformCheckbox = document.getElementById('uniformRadius');
    const uniformControls = document.getElementById('uniformControls');
    const individualControls = document.getElementById('individualControls');
    const allCornersInput = document.getElementById('allCorners');
    const topLeftInput = document.getElementById('topLeft');
    const topRightInput = document.getElementById('topRight');
    const bottomRightInput = document.getElementById('bottomRight');
    const bottomLeftInput = document.getElementById('bottomLeft');
    const copyBtn = document.getElementById('copyBtn');
    const presetBtns = document.querySelectorAll('.preset-btn');
    
    // Value displays
    const allCornersValue = document.getElementById('allCornersValue');
    const topLeftValue = document.getElementById('topLeftValue');
    const topRightValue = document.getElementById('topRightValue');
    const bottomRightValue = document.getElementById('bottomRightValue');
    const bottomLeftValue = document.getElementById('bottomLeftValue');

    // Presets
    const presets = {
        none: { uniform: true, all: 0 },
        small: { uniform: true, all: 4 },
        medium: { uniform: true, all: 8 },
        large: { uniform: true, all: 16 },
        pill: { uniform: true, all: 100 },
        circle: { uniform: true, all: '50%' }
    };

    // Toggle uniform/individual
    uniformCheckbox.addEventListener('change', () => {
        if (uniformCheckbox.checked) {
            uniformControls.style.display = 'block';
            individualControls.style.display = 'none';
        } else {
            uniformControls.style.display = 'none';
            individualControls.style.display = 'block';
        }
        updateRadius();
    });

    // Update radius
    function updateRadius() {
        let css;
        
        if (uniformCheckbox.checked) {
            const value = allCornersInput.value;
            allCornersValue.textContent = value;
            css = `border-radius: ${value}px;`;
            radiusPreview.style.borderRadius = `${value}px`;
        } else {
            const tl = topLeftInput.value;
            const tr = topRightInput.value;
            const br = bottomRightInput.value;
            const bl = bottomLeftInput.value;
            
            topLeftValue.textContent = tl;
            topRightValue.textContent = tr;
            bottomRightValue.textContent = br;
            bottomLeftValue.textContent = bl;
            
            css = `border-radius: ${tl}px ${tr}px ${br}px ${bl}px;`;
            radiusPreview.style.borderRadius = `${tl}px ${tr}px ${br}px ${bl}px`;
        }
        
        cssOutput.value = css;
    }

    // Event listeners
    allCornersInput.addEventListener('input', updateRadius);
    topLeftInput.addEventListener('input', updateRadius);
    topRightInput.addEventListener('input', updateRadius);
    bottomRightInput.addEventListener('input', updateRadius);
    bottomLeftInput.addEventListener('input', updateRadius);

    // Preset buttons
    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const preset = presets[btn.getAttribute('data-preset')];
            
            if (preset.uniform) {
                uniformCheckbox.checked = true;
                uniformControls.style.display = 'block';
                individualControls.style.display = 'none';
                
                if (preset.all === '50%') {
                    // Special handling for circle
                    allCornersInput.value = 200;
                    allCornersValue.textContent = '50%';
                    cssOutput.value = 'border-radius: 50%;';
                    radiusPreview.style.borderRadius = '50%';
                } else {
                    allCornersInput.value = preset.all;
                    updateRadius();
                }
            }
        });
    });

    // Copy CSS
    copyBtn.addEventListener('click', () => {
        const css = cssOutput.value;
        
        if (!css) {
            showToast('Nothing to copy!');
            return;
        }
        
        navigator.clipboard.writeText(css)
            .then(() => {
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy CSS';
                }, 2000);
            })
            .catch(() => {
                cssOutput.select();
                document.execCommand('copy');
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy CSS';
                }, 2000);
            });
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

    // Initialize
    updateRadius();
});
