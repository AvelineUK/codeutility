document.addEventListener('DOMContentLoaded', () => {
    const inputTextarea = document.getElementById('input');
    const sizeSlider = document.getElementById('size');
    const sizeValue = document.getElementById('sizeValue');
    const errorCorrection = document.getElementById('errorCorrection');
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const clearBtn = document.getElementById('clearBtn');
    const qrCodeContainer = document.getElementById('qrCodeContainer');
    
    let currentQRCode = null;

    // Update size display
    sizeSlider.addEventListener('input', (e) => {
        sizeValue.textContent = e.target.value;
    });

    // Generate QR Code
    generateBtn.addEventListener('click', () => {
        const text = inputTextarea.value.trim();
        
        if (!text) {
            showToast('Please enter some text or a URL');
            return;
        }
        
        const size = parseInt(sizeSlider.value);
        const correctionLevel = errorCorrection.value;
        
        // Clear previous QR code
        qrCodeContainer.innerHTML = '';
        
        try {
            // Generate new QR code
            currentQRCode = new QRCode(qrCodeContainer, {
                text: text,
                width: size,
                height: size,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel[correctionLevel]
            });
            
            // Show download button after a brief delay (to ensure QR code is rendered)
            setTimeout(() => {
                downloadBtn.style.display = 'inline-block';
            }, 100);
            
        } catch (error) {
            qrCodeContainer.innerHTML = '<em style="color: #dc2626;">Error generating QR code. Please try different text.</em>';
            showToast('Error generating QR code');
        }
    });

    // Download QR Code
    downloadBtn.addEventListener('click', () => {
        const canvas = qrCodeContainer.querySelector('canvas');
        
        if (!canvas) {
            showToast('No QR code to download');
            return;
        }
        
        // Convert canvas to blob and download
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'qrcode.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    });

    // Clear button
    clearBtn.addEventListener('click', () => {
        inputTextarea.value = '';
        qrCodeContainer.innerHTML = '<em style="color: #a3a3a3;">Your QR code will appear here...</em>';
        downloadBtn.style.display = 'none';
        currentQRCode = null;
        inputTextarea.focus();
    });

    // Keyboard shortcut: Ctrl+Enter to generate
    inputTextarea.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
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
});

document.querySelectorAll('input[type="range"]').forEach(slider => {
  const update = () => {
    const min = Number(slider.min ?? 0);
    const max = Number(slider.max ?? 100);
    const val = Number(slider.value);
    const pct = ( (val - min) / (max - min) ) * 100;
    // Use a percent string for the CSS var
    slider.style.setProperty('--pct', pct + '%');
  };

  slider.addEventListener('input', update, { passive: true });
  // initialize on page load
  update();
});