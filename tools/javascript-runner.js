document.addEventListener('DOMContentLoaded', () => {
    const codeInput = document.getElementById('codeInput');
    const consoleOutput = document.getElementById('consoleOutput');
    const runBtn = document.getElementById('runBtn');
    const clearCodeBtn = document.getElementById('clearCodeBtn');
    const clearConsoleBtn = document.getElementById('clearConsoleBtn');

    // Run code
    runBtn.addEventListener('click', runCode);

    // Clear code
    clearCodeBtn.addEventListener('click', () => {
        codeInput.value = '';
        codeInput.focus();
    });

    // Clear console
    clearConsoleBtn.addEventListener('click', () => {
        consoleOutput.innerHTML = '';
    });

    // Keyboard shortcut: Ctrl+Enter to run
    codeInput.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            runCode();
        }
    });

    function runCode() {
        const code = codeInput.value.trim();
        
        if (!code) {
            showToast('Please enter some JavaScript code to run');
            return;
        }

        // Clear previous output
        consoleOutput.innerHTML = '';

        // Add execution timestamp
        addConsoleEntry('info', `=== Execution started at ${new Date().toLocaleTimeString()} ===`);

        // Capture console methods
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        const originalInfo = console.info;

        // Override console methods
        console.log = (...args) => {
            addConsoleEntry('log', formatArgs(args));
            originalLog.apply(console, args);
        };

        console.error = (...args) => {
            addConsoleEntry('error', formatArgs(args));
            originalError.apply(console, args);
        };

        console.warn = (...args) => {
            addConsoleEntry('warn', formatArgs(args));
            originalWarn.apply(console, args);
        };

        console.info = (...args) => {
            addConsoleEntry('info', formatArgs(args));
            originalInfo.apply(console, args);
        };

        try {
            // Execute code in isolated scope
            const result = (function() {
                'use strict';
                return eval(code);
            })();

            // If code returns a value (and didn't log anything), show it
            if (result !== undefined && consoleOutput.children.length === 1) {
                addConsoleEntry('return', `↳ ${formatValue(result)}`);
            }

            addConsoleEntry('info', `=== Execution completed ===`);
        } catch (error) {
            addConsoleEntry('error', `❌ ${error.name}: ${error.message}`);
            if (error.stack) {
                addConsoleEntry('error', error.stack, true);
            }
        } finally {
            // Restore original console methods
            console.log = originalLog;
            console.error = originalError;
            console.warn = originalWarn;
            console.info = originalInfo;
        }
    }

    function addConsoleEntry(type, message, isStack = false) {
        const entry = document.createElement('div');
        entry.className = `console-entry console-${type}`;
        
        if (isStack) {
            entry.style.fontSize = '0.85rem';
            entry.style.opacity = '0.8';
            entry.style.marginLeft = '20px';
        }
        
        // Escape HTML to prevent XSS
        const escaped = String(message)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
        
        entry.innerHTML = escaped;
        consoleOutput.appendChild(entry);
        
        // Auto-scroll to bottom
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    }

    function formatArgs(args) {
        return args.map(arg => formatValue(arg)).join(' ');
    }

    function formatValue(value) {
        if (value === null) return 'null';
        if (value === undefined) return 'undefined';
        if (typeof value === 'string') return value;
        if (typeof value === 'function') return `[Function: ${value.name || 'anonymous'}]`;
        if (typeof value === 'symbol') return value.toString();
        if (Array.isArray(value)) {
            return '[' + value.map(formatValue).join(', ') + ']';
        }
        if (typeof value === 'object') {
            try {
                return JSON.stringify(value, null, 2);
            } catch (e) {
                return '[Object]';
            }
        }
        return String(value);
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
