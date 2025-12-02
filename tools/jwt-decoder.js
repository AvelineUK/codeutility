document.addEventListener('DOMContentLoaded', () => {
    const inputTextarea = document.getElementById('input');
    const decodeBtn = document.getElementById('decodeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const validationStatus = document.getElementById('validationStatus');
    const statusTitle = document.getElementById('statusTitle');
    const statusMessage = document.getElementById('statusMessage');
    const decodedSections = document.getElementById('decodedSections');
    const headerOutput = document.getElementById('headerOutput');
    const payloadOutput = document.getElementById('payloadOutput');
    const signatureOutput = document.getElementById('signatureOutput');
    const tokenInfo = document.getElementById('tokenInfo');
    const copySectionBtns = document.querySelectorAll('.copy-section-btn');

    // Decode button
    decodeBtn.addEventListener('click', () => {
        const token = inputTextarea.value.trim();
        
        if (!token) {
            showToast('Please enter a JWT token');
            return;
        }
        
        decodeJWT(token);
    });

    // Clear button
    clearBtn.addEventListener('click', () => {
        inputTextarea.value = '';
        validationStatus.style.display = 'none';
        decodedSections.style.display = 'none';
        headerOutput.value = '';
        payloadOutput.value = '';
        signatureOutput.value = '';
        tokenInfo.innerHTML = '';
        inputTextarea.focus();
    });

    // Copy section buttons
    copySectionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            const text = targetElement.value;
            
            if (!text) {
                showToast('Nothing to copy!');
                return;
            }
            
            navigator.clipboard.writeText(text)
                .then(() => {
                    const originalText = btn.textContent;
                    btn.textContent = 'Copied!';
                    setTimeout(() => {
                        btn.textContent = originalText;
                    }, 2000);
                })
                .catch(() => {
                    showToast('Failed to copy');
                });
        });
    });

    // Keyboard shortcut: Ctrl+Enter to decode
    inputTextarea.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            decodeBtn.click();
        }
    });

    // Decode JWT function
    function decodeJWT(token) {
        try {
            // Split token into parts
            const parts = token.split('.');
            
            if (parts.length !== 3) {
                showValidationStatus(false, 'Invalid JWT format. A valid JWT must have three parts separated by dots (.)');
                decodedSections.style.display = 'none';
                return;
            }
            
            const [headerB64, payloadB64, signatureB64] = parts;
            
            // Decode header
            let header;
            try {
                const headerJson = base64UrlDecode(headerB64);
                header = JSON.parse(headerJson);
                headerOutput.value = JSON.stringify(header, null, 2);
            } catch (e) {
                showValidationStatus(false, 'Invalid header encoding. Unable to decode header.');
                decodedSections.style.display = 'none';
                return;
            }
            
            // Decode payload
            let payload;
            try {
                const payloadJson = base64UrlDecode(payloadB64);
                payload = JSON.parse(payloadJson);
                payloadOutput.value = JSON.stringify(payload, null, 2);
            } catch (e) {
                showValidationStatus(false, 'Invalid payload encoding. Unable to decode payload.');
                decodedSections.style.display = 'none';
                return;
            }
            
            // Display signature (as-is, since we can't verify without secret)
            signatureOutput.value = signatureB64;
            
            // Show decoded sections
            decodedSections.style.display = 'block';
            showValidationStatus(true, 'JWT successfully decoded');
            
            // Display token information
            displayTokenInfo(header, payload);
            
        } catch (error) {
            showValidationStatus(false, `Error decoding JWT: ${error.message}`);
            decodedSections.style.display = 'none';
        }
    }

    // Base64 URL decode function
    function base64UrlDecode(str) {
        // Replace URL-safe characters
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        
        // Add padding if needed
        while (base64.length % 4 !== 0) {
            base64 += '=';
        }
        
        // Decode base64
        try {
            return atob(base64);
        } catch (e) {
            throw new Error('Invalid base64 encoding');
        }
    }

    // Display token information
    function displayTokenInfo(header, payload) {
        let infoHtml = '';
        
        // Algorithm
        if (header.alg) {
            infoHtml += `<div><strong>Algorithm:</strong> ${escapeHtml(header.alg)}</div>`;
        }
        
        // Token type
        if (header.typ) {
            infoHtml += `<div><strong>Type:</strong> ${escapeHtml(header.typ)}</div>`;
        }
        
        // Issued at
        if (payload.iat) {
            const iatDate = new Date(payload.iat * 1000);
            infoHtml += `<div><strong>Issued At:</strong> ${iatDate.toLocaleString()} (${payload.iat})</div>`;
        }
        
        // Expiration
        if (payload.exp) {
            const expDate = new Date(payload.exp * 1000);
            const now = new Date();
            const isExpired = expDate < now;
            const expiredClass = isExpired ? 'color: #dc2626;' : 'color: #166534;';
            const expiredText = isExpired ? '(EXPIRED)' : '(Valid)';
            infoHtml += `<div><strong>Expires At:</strong> <span style="${expiredClass}">${expDate.toLocaleString()} ${expiredText}</span> (${payload.exp})</div>`;
        }
        
        // Not before
        if (payload.nbf) {
            const nbfDate = new Date(payload.nbf * 1000);
            infoHtml += `<div><strong>Not Before:</strong> ${nbfDate.toLocaleString()} (${payload.nbf})</div>`;
        }
        
        // Issuer
        if (payload.iss) {
            infoHtml += `<div><strong>Issuer:</strong> ${escapeHtml(payload.iss)}</div>`;
        }
        
        // Subject
        if (payload.sub) {
            infoHtml += `<div><strong>Subject:</strong> ${escapeHtml(payload.sub)}</div>`;
        }
        
        // Audience
        if (payload.aud) {
            const audValue = Array.isArray(payload.aud) ? payload.aud.join(', ') : payload.aud;
            infoHtml += `<div><strong>Audience:</strong> ${escapeHtml(audValue)}</div>`;
        }
        
        // JWT ID
        if (payload.jti) {
            infoHtml += `<div><strong>JWT ID:</strong> ${escapeHtml(payload.jti)}</div>`;
        }
        
        if (infoHtml === '') {
            infoHtml = '<em style="color: #a3a3a3;">No standard claims found in token</em>';
        }
        
        tokenInfo.innerHTML = infoHtml;
    }

    // Escape HTML for safe display
    function escapeHtml(text) {
        if (typeof text !== 'string') {
            text = String(text);
        }
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // Show validation status
    function showValidationStatus(isValid, message) {
        validationStatus.style.display = 'block';
        validationStatus.classList.remove('alert-success', 'alert-error');
        
        if (isValid) {
            validationStatus.classList.add('alert-success');
            statusTitle.textContent = '✓ Valid JWT Structure';
        } else {
            validationStatus.classList.add('alert-error');
            statusTitle.textContent = '✗ Invalid JWT';
        }
        
        statusMessage.textContent = message;
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
