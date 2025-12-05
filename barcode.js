document.addEventListener('DOMContentLoaded', () => {
    const inputField = document.getElementById('input');
    const formatSelect = document.getElementById('format');
    const displayValueCheckbox = document.getElementById('displayValue');
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const clearBtn = document.getElementById('clearBtn');
    const barcodeDisplay = document.getElementById('barcodeDisplay');
    const barcodeContainer = document.getElementById('barcodeContainer');

    // Generate barcode
    generateBtn.addEventListener('click', () => {
        const input = inputField.value.trim();
        const format = formatSelect.value;
        const displayValue = displayValueCheckbox.checked;

        if (!input) {
            showToast('Please enter content to generate a barcode');
            return;
        }

        // Check if JsBarcode is loaded
        if (typeof JsBarcode === 'undefined') {
            showToast('Barcode library is still loading. Please try again in a moment.');
            return;
        }

        try {
            // Clear previous barcode
            barcodeContainer.innerHTML = '<svg id="barcode"></svg>';

            // Generate new barcode
            JsBarcode('#barcode', input, {
                format: format,
                displayValue: displayValue,
                width: 2,
                height: 100,
                margin: 10,
                valid: function(valid) {
                    if (!valid) {
                        throw new Error('Invalid barcode for selected format');
                    }
                }
            });

            barcodeDisplay.style.display = 'block';
            downloadBtn.style.display = 'inline-block';
        } catch (error) {
            showToast(error.message || 'Invalid input for selected format');
            console.error('Barcode error:', error);
        }
    });

    // Download barcode
    downloadBtn.addEventListener('click', () => {
        const svg = document.getElementById('barcode');
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);

            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'barcode.png';
                a.click();
                URL.revokeObjectURL(url);
            });
        };

        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    });

    // Clear
    clearBtn.addEventListener('click', () => {
        inputField.value = '';
        barcodeContainer.innerHTML = '';
        barcodeDisplay.style.display = 'none';
        downloadBtn.style.display = 'none';
        inputField.focus();
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
});
