document.addEventListener('DOMContentLoaded', () => {
    const flexContainer = document.getElementById('flexContainer');
    const flexDirection = document.getElementById('flexDirection');
    const justifyContent = document.getElementById('justifyContent');
    const alignItems = document.getElementById('alignItems');
    const flexWrap = document.getElementById('flexWrap');
    const alignContent = document.getElementById('alignContent');
    const gap = document.getElementById('gap');
    const itemCount = document.getElementById('itemCount');
    const cssOutput = document.getElementById('cssOutput');
    const copyBtn = document.getElementById('copyBtn');

    // Update on any change
    flexDirection.addEventListener('change', updateFlex);
    justifyContent.addEventListener('change', updateFlex);
    alignItems.addEventListener('change', updateFlex);
    flexWrap.addEventListener('change', updateFlex);
    alignContent.addEventListener('change', updateFlex);
    gap.addEventListener('input', updateFlex);
    itemCount.addEventListener('input', updateItems);

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

    // Update flex container
    function updateFlex() {
        const container = flexContainer;
        
        // Apply styles
        container.style.display = 'flex';
        container.style.flexDirection = flexDirection.value;
        container.style.justifyContent = justifyContent.value;
        container.style.alignItems = alignItems.value;
        container.style.flexWrap = flexWrap.value;
        container.style.alignContent = alignContent.value;
        container.style.gap = gap.value + 'px';

        // Generate CSS
        const css = `.flex-container {
  display: flex;
  flex-direction: ${flexDirection.value};
  justify-content: ${justifyContent.value};
  align-items: ${alignItems.value};
  flex-wrap: ${flexWrap.value};
  align-content: ${alignContent.value};
  gap: ${gap.value}px;
}`;

        cssOutput.value = css;
    }

    // Update items
    function updateItems() {
        const count = parseInt(itemCount.value) || 5;
        const currentCount = flexContainer.children.length;

        if (count > currentCount) {
            // Add items
            for (let i = currentCount; i < count; i++) {
                const item = document.createElement('div');
                item.className = 'flex-item';
                item.textContent = i + 1;
                flexContainer.appendChild(item);
            }
        } else if (count < currentCount) {
            // Remove items
            while (flexContainer.children.length > count) {
                flexContainer.removeChild(flexContainer.lastChild);
            }
        }
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
    updateFlex();
});
