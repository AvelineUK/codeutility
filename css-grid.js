document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('gridContainer');
    const columns = document.getElementById('columns');
    const rows = document.getElementById('rows');
    const columnGap = document.getElementById('columnGap');
    const rowGap = document.getElementById('rowGap');
    const columnSize = document.getElementById('columnSize');
    const rowSize = document.getElementById('rowSize');
    const itemCount = document.getElementById('itemCount');
    const cssOutput = document.getElementById('cssOutput');
    const copyBtn = document.getElementById('copyBtn');

    // Update on any change
    columns.addEventListener('input', updateGrid);
    rows.addEventListener('input', updateGrid);
    columnGap.addEventListener('input', updateGrid);
    rowGap.addEventListener('input', updateGrid);
    columnSize.addEventListener('change', updateGrid);
    rowSize.addEventListener('change', updateGrid);
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

    // Update grid
    function updateGrid() {
        const container = gridContainer;
        const cols = parseInt(columns.value) || 3;
        const rowsVal = parseInt(rows.value) || 2;
        const colGap = parseInt(columnGap.value) || 10;
        const rowGapVal = parseInt(rowGap.value) || 10;
        const colSize = columnSize.value;
        const rowSizeVal = rowSize.value;

        // Generate grid-template-columns
        let gridTemplateColumns;
        if (colSize === 'repeat(auto-fit, minmax(200px, 1fr))') {
            gridTemplateColumns = colSize;
        } else {
            gridTemplateColumns = `repeat(${cols}, ${colSize})`;
        }

        // Generate grid-template-rows
        const gridTemplateRows = `repeat(${rowsVal}, ${rowSizeVal})`;

        // Apply styles
        container.style.display = 'grid';
        container.style.gridTemplateColumns = gridTemplateColumns;
        container.style.gridTemplateRows = gridTemplateRows;
        container.style.gap = `${rowGapVal}px ${colGap}px`;

        // Generate CSS
        const css = `.grid-container {
  display: grid;
  grid-template-columns: ${gridTemplateColumns};
  grid-template-rows: ${gridTemplateRows};
  gap: ${rowGapVal}px ${colGap}px;
}`;

        cssOutput.value = css;
    }

    // Update items
    function updateItems() {
        const count = parseInt(itemCount.value) || 6;
        const currentCount = gridContainer.children.length;

        if (count > currentCount) {
            // Add items
            for (let i = currentCount; i < count; i++) {
                const item = document.createElement('div');
                item.className = 'grid-item';
                item.textContent = i + 1;
                gridContainer.appendChild(item);
            }
        } else if (count < currentCount) {
            // Remove items
            while (gridContainer.children.length > count) {
                gridContainer.removeChild(gridContainer.lastChild);
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
    updateGrid();
});
