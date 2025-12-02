document.addEventListener('DOMContentLoaded', () => {
    const shadowPreview = document.getElementById('shadowPreview');
    const cssOutput = document.getElementById('cssOutput');
    const offsetXInput = document.getElementById('offsetX');
    const offsetYInput = document.getElementById('offsetY');
    const blurInput = document.getElementById('blur');
    const spreadInput = document.getElementById('spread');
    const shadowColorInput = document.getElementById('shadowColor');
    const opacityInput = document.getElementById('opacity');
    const insetCheckbox = document.getElementById('insetShadow');
    const copyBtn = document.getElementById('copyBtn');
    const presetBtns = document.querySelectorAll('.preset-btn');
    
    // Value displays
    const offsetXValue = document.getElementById('offsetXValue');
    const offsetYValue = document.getElementById('offsetYValue');
    const blurValue = document.getElementById('blurValue');
    const spreadValue = document.getElementById('spreadValue');
    const opacityValue = document.getElementById('opacityValue');

    // Presets
    const presets = {
        subtle: { x: 0, y: 1, blur: 3, spread: 0, color: '#000000', opacity: 10, inset: false },
        medium: { x: 0, y: 4, blur: 8, spread: 0, color: '#000000', opacity: 25, inset: false },
        large: { x: 0, y: 10, blur: 25, spread: 0, color: '#000000', opacity: 20, inset: false },
        inner: { x: 0, y: 2, blur: 4, spread: 0, color: '#000000', opacity: 15, inset: true },
        none: { x: 0, y: 0, blur: 0, spread: 0, color: '#000000', opacity: 0, inset: false }
    };

    // Update shadow
    function updateShadow() {
        const x = offsetXInput.value;
        const y = offsetYInput.value;
        const blur = blurInput.value;
        const spread = spreadInput.value;
        const color = shadowColorInput.value;
        const opacity = opacityInput.value / 100;
        const inset = insetCheckbox.checked;

        // Update displays
        offsetXValue.textContent = x;
        offsetYValue.textContent = y;
        blurValue.textContent = blur;
        spreadValue.textContent = spread;
        opacityValue.textContent = opacityInput.value;

        // Convert hex to rgba
        const r = parseInt(color.substr(1, 2), 16);
        const g = parseInt(color.substr(3, 2), 16);
        const b = parseInt(color.substr(5, 2), 16);
        const rgba = `rgba(${r}, ${g}, ${b}, ${opacity})`;

        // Build shadow
        const insetText = inset ? 'inset ' : '';
        const shadow = `${insetText}${x}px ${y}px ${blur}px ${spread}px ${rgba}`;

        shadowPreview.style.boxShadow = shadow;
        cssOutput.value = `box-shadow: ${shadow};`;
    }

    // Event listeners
    offsetXInput.addEventListener('input', updateShadow);
    offsetYInput.addEventListener('input', updateShadow);
    blurInput.addEventListener('input', updateShadow);
    spreadInput.addEventListener('input', updateShadow);
    shadowColorInput.addEventListener('input', updateShadow);
    opacityInput.addEventListener('input', updateShadow);
    insetCheckbox.addEventListener('change', updateShadow);

    // Preset buttons
    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const preset = presets[btn.getAttribute('data-preset')];
            offsetXInput.value = preset.x;
            offsetYInput.value = preset.y;
            blurInput.value = preset.blur;
            spreadInput.value = preset.spread;
            shadowColorInput.value = preset.color;
            opacityInput.value = preset.opacity;
            insetCheckbox.checked = preset.inset;
            updateShadow();
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
    updateShadow();
});
