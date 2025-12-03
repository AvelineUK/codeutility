document.addEventListener('DOMContentLoaded', () => {
    const imageUpload = document.getElementById('imageUpload');
    const originalInfo = document.getElementById('originalInfo');
    const resizeOptions = document.getElementById('resizeOptions');
    const actionButtons = document.getElementById('actionButtons');
    const previewSection = document.getElementById('previewSection');
    const originalWidth = document.getElementById('originalWidth');
    const originalHeight = document.getElementById('originalHeight');
    const originalSize = document.getElementById('originalSize');
    const newWidth = document.getElementById('newWidth');
    const newHeight = document.getElementById('newHeight');
    const maintainRatio = document.getElementById('maintainRatio');
    const quality = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const format = document.getElementById('format');
    const resizeBtn = document.getElementById('resizeBtn');
    const resetBtn = document.getElementById('resetBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const previewCanvas = document.getElementById('previewCanvas');
    const newWidthDisplay = document.getElementById('newWidthDisplay');
    const newHeightDisplay = document.getElementById('newHeightDisplay');
    const newSize = document.getElementById('newSize');

    let originalImage = null;
    let originalAspectRatio = 1;

    // Update quality display
    quality.addEventListener('input', () => {
        qualityValue.textContent = quality.value;
    });

    // Image upload
    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                originalImage = img;
                originalAspectRatio = img.width / img.height;

                // Display original info
                originalWidth.textContent = img.width;
                originalHeight.textContent = img.height;
                originalSize.textContent = formatBytes(file.size);

                // Set default resize dimensions
                newWidth.value = img.width;
                newHeight.value = img.height;

                // Show sections
                originalInfo.style.display = 'block';
                resizeOptions.style.display = 'block';
                actionButtons.style.display = 'flex';
                previewSection.style.display = 'none';
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });

    // Maintain aspect ratio
    newWidth.addEventListener('input', () => {
        if (maintainRatio.checked && originalImage) {
            newHeight.value = Math.round(newWidth.value / originalAspectRatio);
        }
    });

    newHeight.addEventListener('input', () => {
        if (maintainRatio.checked && originalImage) {
            newWidth.value = Math.round(newHeight.value * originalAspectRatio);
        }
    });

    // Resize button
    resizeBtn.addEventListener('click', () => {
        if (!originalImage) {
            showToast('Please upload an image first');
            return;
        }

        const width = parseInt(newWidth.value) || originalImage.width;
        const height = parseInt(newHeight.value) || originalImage.height;

        // Create canvas and resize
        const canvas = previewCanvas;
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(originalImage, 0, 0, width, height);

        // Update display
        newWidthDisplay.textContent = width;
        newHeightDisplay.textContent = height;

        // Estimate size (rough approximation)
        const dataURL = canvas.toDataURL(format.value, quality.value / 100);
        const estimatedSize = Math.round((dataURL.length * 3) / 4);
        newSize.textContent = formatBytes(estimatedSize);

        // Show preview
        previewSection.style.display = 'block';
    });

    // Reset button
    resetBtn.addEventListener('click', () => {
        imageUpload.value = '';
        originalImage = null;
        originalInfo.style.display = 'none';
        resizeOptions.style.display = 'none';
        actionButtons.style.display = 'none';
        previewSection.style.display = 'none';
    });

    // Download button
    downloadBtn.addEventListener('click', () => {
        const canvas = previewCanvas;
        const dataURL = canvas.toDataURL(format.value, quality.value / 100);

        // Create download link
        const link = document.createElement('a');
        const extension = format.value.split('/')[1];
        link.download = `resized-image.${extension}`;
        link.href = dataURL;
        link.click();
    });

    // Format bytes
    function formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
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
});
