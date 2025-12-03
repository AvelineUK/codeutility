document.addEventListener('DOMContentLoaded', () => {
    const tsInput = document.getElementById('tsInput');
    const jsOutput = document.getElementById('jsOutput');
    const consoleOutput = document.getElementById('consoleOutput');
    const compileBtn = document.getElementById('compileBtn');
    const compileOnlyBtn = document.getElementById('compileOnlyBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');

    let compiledJS = '';

    // Check if TypeScript is loaded
    if (typeof ts === 'undefined') {
        showToast('TypeScript compiler is loading... Please wait a moment and try again.');
        // Retry check after a delay
        setTimeout(() => {
            if (typeof ts === 'undefined') {
                consoleOutput.innerHTML = '<div class="console-entry console-error">❌ Failed to load TypeScript compiler. Please refresh the page.</div>';
            }
        }, 3000);
    }

    // Compile & Run
    compileBtn.addEventListener('click', () => {
        compileTypeScript(true);
    });

    // Compile Only
    compileOnlyBtn.addEventListener('click', () => {
        compileTypeScript(false);
    });

    // Clear all
    clearBtn.addEventListener('click', () => {
        tsInput.value = '';
        jsOutput.value = '';
        consoleOutput.innerHTML = '';
        compiledJS = '';
        tsInput.focus();
    });

    // Copy JavaScript
    copyBtn.addEventListener('click', () => {
        if (!jsOutput.value) {
            showToast('Nothing to copy! Compile some TypeScript first.');
            return;
        }

        navigator.clipboard.writeText(jsOutput.value)
            .then(() => {
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy JavaScript';
                }, 2000);
            })
            .catch(() => {
                jsOutput.select();
                document.execCommand('copy');
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy JavaScript';
                }, 2000);
            });
    });

    // Keyboard shortcut: Ctrl+Enter to compile and run
    tsInput.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            compileTypeScript(true);
        }
    });

    function compileTypeScript(runAfterCompile) {
        const code = tsInput.value.trim();

        if (!code) {
            showToast('Please enter some TypeScript code to compile');
            return;
        }

        // Check if TypeScript is loaded
        if (typeof ts === 'undefined') {
            showToast('TypeScript compiler is still loading... Please wait.');
            return;
        }

        // Clear previous output
        jsOutput.value = '';
        consoleOutput.innerHTML = '';

        addConsoleEntry('info', `=== Compilation started at ${new Date().toLocaleTimeString()} ===`);

        try {
            // Compile TypeScript to JavaScript
            const result = ts.transpileModule(code, {
                compilerOptions: {
                    module: ts.ModuleKind.ES2015,
                    target: ts.ScriptTarget.ES2015,
                    noImplicitAny: false,
                    removeComments: false,
                    preserveConstEnums: true,
                    sourceMap: false
                }
            });

            compiledJS = result.outputText;
            jsOutput.value = compiledJS;

            // Check for diagnostics (errors/warnings)
            if (result.diagnostics && result.diagnostics.length > 0) {
                result.diagnostics.forEach(diagnostic => {
                    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
                    addConsoleEntry('warn', `⚠️ ${message}`);
                });
            } else {
                addConsoleEntry('info', '✓ Compilation successful');
            }

            // Run the compiled JavaScript if requested
            if (runAfterCompile) {
                addConsoleEntry('info', '=== Executing compiled code ===');
                runCompiledCode(compiledJS);
            }

        } catch (error) {
            addConsoleEntry('error', `❌ Compilation Error: ${error.message}`);
            if (error.stack) {
                addConsoleEntry('error', error.stack, true);
            }
        }
    }

    function runCompiledCode(code) {
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

            // If code returns a value (and didn't log anything much), show it
            if (result !== undefined) {
                addConsoleEntry('return', `↳ ${formatValue(result)}`);
            }

            addConsoleEntry('info', `=== Execution completed ===`);
        } catch (error) {
            addConsoleEntry('error', `❌ Runtime Error: ${error.message}`);
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
