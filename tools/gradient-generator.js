document.addEventListener('DOMContentLoaded', () => {
    const gradientPreview = document.getElementById('gradientPreview');
    const cssOutput = document.getElementById('cssOutput');
    const typeRadios = document.querySelectorAll('input[name="gradientType"]');
    const directionInput = document.getElementById('direction');
    const color1Input = document.getElementById('color1');
    const color2Input = document.getElementById('color2');
    const copyBtn = document.getElementById('copyBtn');
    const presetBtns = document.querySelectorAll('.preset-btn');

    // Update gradient
    function updateGradient() {
        const type = document.querySelector('input[name="gradientType"]:checked').value;
        const direction = directionInput.value;
        const color1 = color1Input.value;
        const color2 = color2Input.value;

        let css;
        
        if (type === 'linear') {
            css = `linear-gradient(${direction}deg, ${color1}, ${color2})`;
        } else {
            css = `radial-gradient(circle, ${color1}, ${color2})`;
        }

        gradientPreview.style.background = css;
        cssOutput.value = `background: ${css};`;
    }

    // Event listeners
    typeRadios.forEach(radio => {
        radio.addEventListener('change', updateGradient);
    });

    directionInput.addEventListener('input', updateGradient);
    color1Input.addEventListener('input', updateGradient);
    color2Input.addEventListener('input', updateGradient);

    // Preset buttons
    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            color1Input.value = btn.getAttribute('data-color1');
            color2Input.value = btn.getAttribute('data-color2');
            updateGradient();
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
    updateGradient();
});
