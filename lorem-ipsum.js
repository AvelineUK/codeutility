document.addEventListener('DOMContentLoaded', () => {
    const countSlider = document.getElementById('count');
    const countValue = document.getElementById('countValue');
    const typeRadios = document.querySelectorAll('input[name="type"]');
    const startWithLorem = document.getElementById('startWithLorem');
    const generateBtn = document.getElementById('generateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const outputTextarea = document.getElementById('output');
    const copyBtn = document.getElementById('copyBtn');

    // Lorem Ipsum word bank
    const loremWords = [
        'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
        'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
        'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
        'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
        'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
        'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
        'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
        'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
    ];

    const loremStart = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit';

    // Update count display
    countSlider.addEventListener('input', (e) => {
        countValue.textContent = e.target.value;
    });

    // Generate button
    generateBtn.addEventListener('click', () => {
        const count = parseInt(countSlider.value);
        const type = document.querySelector('input[name="type"]:checked').value;
        const useLoremStart = startWithLorem.checked;
        
        let text = '';
        
        if (type === 'paragraphs') {
            text = generateParagraphs(count, useLoremStart);
        } else if (type === 'sentences') {
            text = generateSentences(count, useLoremStart);
        } else if (type === 'words') {
            text = generateWords(count, useLoremStart);
        }
        
        outputTextarea.value = text;
    });

    // Clear button
    clearBtn.addEventListener('click', () => {
        outputTextarea.value = '';
        outputTextarea.focus();
    });

    // Copy to clipboard
    copyBtn.addEventListener('click', () => {
        const output = outputTextarea.value;
        
        if (!output) {
            showToast('Generate some text first!');
            return;
        }
        
        navigator.clipboard.writeText(output)
            .then(() => {
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy to Clipboard';
                }, 2000);
            })
            .catch(() => {
                outputTextarea.select();
                document.execCommand('copy');
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy to Clipboard';
                }, 2000);
            });
    });

    // Generate random word from the word bank
    function getRandomWord() {
        return loremWords[Math.floor(Math.random() * loremWords.length)];
    }

    // Generate a sentence (5-15 words)
    function generateSentence() {
        const wordCount = Math.floor(Math.random() * 11) + 5; // 5-15 words
        const words = [];
        
        for (let i = 0; i < wordCount; i++) {
            words.push(getRandomWord());
        }
        
        // Capitalize first word
        words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
        
        return words.join(' ') + '.';
    }

    // Generate words
    function generateWords(count, useLoremStart) {
        const words = [];
        
        if (useLoremStart) {
            words.push(...loremStart.replace(/,/g, '').replace(/\./g, '').split(' '));
        }
        
        while (words.length < count) {
            words.push(getRandomWord());
        }
        
        // Capitalize first word
        if (words.length > 0) {
            words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
        }
        
        return words.slice(0, count).join(' ') + '.';
    }

    // Generate sentences
    function generateSentences(count, useLoremStart) {
        const sentences = [];
        
        if (useLoremStart) {
            sentences.push(loremStart + '.');
        }
        
        while (sentences.length < count) {
            sentences.push(generateSentence());
        }
        
        return sentences.slice(0, count).join(' ');
    }

    // Generate paragraphs
    function generateParagraphs(count, useLoremStart) {
        const paragraphs = [];
        
        for (let i = 0; i < count; i++) {
            const sentenceCount = Math.floor(Math.random() * 5) + 4; // 4-8 sentences per paragraph
            const paragraph = [];
            
            if (i === 0 && useLoremStart) {
                paragraph.push(loremStart + '.');
                for (let j = 1; j < sentenceCount; j++) {
                    paragraph.push(generateSentence());
                }
            } else {
                for (let j = 0; j < sentenceCount; j++) {
                    paragraph.push(generateSentence());
                }
            }
            
            paragraphs.push(paragraph.join(' '));
        }
        
        return paragraphs.join('\n\n');
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

    // Generate on page load
    generateBtn.click();
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