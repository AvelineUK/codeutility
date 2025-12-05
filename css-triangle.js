document.addEventListener('DOMContentLoaded', () => {
    const direction = document.getElementById('direction');
    const width = document.getElementById('width');
    const height = document.getElementById('height');
    const color = document.getElementById('color');
    const triangle = document.getElementById('triangle');
    const cssOutput = document.getElementById('cssOutput');
    const copyBtn = document.getElementById('copyBtn');

    // Update triangle on any change
    direction.addEventListener('change', updateTriangle);
    width.addEventListener('input', updateTriangle);
    height.addEventListener('input', updateTriangle);
    color.addEventListener('input', updateTriangle);

    // Copy to clipboard
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
                    copyBtn.textContent = 'Copy to Clipboard';
                }, 2000);
            })
            .catch(() => {
                cssOutput.select();
                document.execCommand('copy');
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy to Clipboard';
                }, 2000);
            });
    });

    // Update triangle function
    function updateTriangle() {
        const dir = direction.value;
        const w = parseInt(width.value) || 100;
        const h = parseInt(height.value) || 80;
        const c = color.value;

        let css = '';
        let styles = {};

        // Calculate border styles based on direction
        switch (dir) {
            case 'up':
                styles = {
                    width: '0',
                    height: '0',
                    borderLeft: `${w / 2}px solid transparent`,
                    borderRight: `${w / 2}px solid transparent`,
                    borderBottom: `${h}px solid ${c}`
                };
                css = `.triangle-up {
  width: 0;
  height: 0;
  border-left: ${w / 2}px solid transparent;
  border-right: ${w / 2}px solid transparent;
  border-bottom: ${h}px solid ${c};
}`;
                break;
            case 'down':
                styles = {
                    width: '0',
                    height: '0',
                    borderLeft: `${w / 2}px solid transparent`,
                    borderRight: `${w / 2}px solid transparent`,
                    borderTop: `${h}px solid ${c}`
                };
                css = `.triangle-down {
  width: 0;
  height: 0;
  border-left: ${w / 2}px solid transparent;
  border-right: ${w / 2}px solid transparent;
  border-top: ${h}px solid ${c};
}`;
                break;
            case 'left':
                styles = {
                    width: '0',
                    height: '0',
                    borderTop: `${h / 2}px solid transparent`,
                    borderBottom: `${h / 2}px solid transparent`,
                    borderRight: `${w}px solid ${c}`
                };
                css = `.triangle-left {
  width: 0;
  height: 0;
  border-top: ${h / 2}px solid transparent;
  border-bottom: ${h / 2}px solid transparent;
  border-right: ${w}px solid ${c};
}`;
                break;
            case 'right':
                styles = {
                    width: '0',
                    height: '0',
                    borderTop: `${h / 2}px solid transparent`,
                    borderBottom: `${h / 2}px solid transparent`,
                    borderLeft: `${w}px solid ${c}`
                };
                css = `.triangle-right {
  width: 0;
  height: 0;
  border-top: ${h / 2}px solid transparent;
  border-bottom: ${h / 2}px solid transparent;
  border-left: ${w}px solid ${c};
}`;
                break;
        }

        // Apply styles to preview
        triangle.style.width = styles.width;
        triangle.style.height = styles.height;
        triangle.style.borderLeft = styles.borderLeft || 'none';
        triangle.style.borderRight = styles.borderRight || 'none';
        triangle.style.borderTop = styles.borderTop || 'none';
        triangle.style.borderBottom = styles.borderBottom || 'none';

        // Update CSS output
        cssOutput.value = css;
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

    // Initial update
    updateTriangle();
});
