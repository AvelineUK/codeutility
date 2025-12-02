document.addEventListener('DOMContentLoaded', () => {
    const inputTextarea = document.getElementById('input');
    const charCount = document.getElementById('charCount');
    const charNoSpaceCount = document.getElementById('charNoSpaceCount');
    const wordCount = document.getElementById('wordCount');
    const lineCount = document.getElementById('lineCount');
    const sentenceCount = document.getElementById('sentenceCount');
    const paragraphCount = document.getElementById('paragraphCount');
    const readingTime = document.getElementById('readingTime');
    const speakingTime = document.getElementById('speakingTime');
    const clearBtn = document.getElementById('clearBtn');

    // Update counts on input
    inputTextarea.addEventListener('input', updateCounts);

    // Clear button
    clearBtn.addEventListener('click', () => {
        inputTextarea.value = '';
        updateCounts();
        inputTextarea.focus();
    });

    // Update all counts
    function updateCounts() {
        const text = inputTextarea.value;
        
        // Character count
        charCount.textContent = text.length.toLocaleString();
        
        // Character count (no spaces)
        const noSpaces = text.replace(/\s/g, '');
        charNoSpaceCount.textContent = noSpaces.length.toLocaleString();
        
        // Word count
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        const wordCountNum = text.trim() === '' ? 0 : words.length;
        wordCount.textContent = wordCountNum.toLocaleString();
        
        // Line count
        const lines = text.split('\n');
        const lineCountNum = text === '' ? 0 : lines.length;
        lineCount.textContent = lineCountNum.toLocaleString();
        
        // Sentence count
        // Split on . ! ? followed by space or end of string
        const sentences = text
            .split(/[.!?]+/)
            .filter(sentence => sentence.trim().length > 0);
        sentenceCount.textContent = sentences.length.toLocaleString();
        
        // Paragraph count
        const paragraphs = text
            .split(/\n\n+/)
            .filter(para => para.trim().length > 0);
        const paragraphCountNum = text.trim() === '' ? 0 : paragraphs.length;
        paragraphCount.textContent = paragraphCountNum.toLocaleString();
        
        // Reading time (average 200 words per minute)
        const readingMinutes = Math.ceil(wordCountNum / 200);
        if (readingMinutes === 0) {
            readingTime.textContent = '0 min';
        } else if (readingMinutes === 1) {
            readingTime.textContent = '1 min';
        } else {
            readingTime.textContent = `${readingMinutes} min`;
        }
        
        // Speaking time (average 150 words per minute)
        const speakingMinutes = Math.ceil(wordCountNum / 150);
        if (speakingMinutes === 0) {
            speakingTime.textContent = '0 min';
        } else if (speakingMinutes === 1) {
            speakingTime.textContent = '1 min';
        } else {
            speakingTime.textContent = `${speakingMinutes} min`;
        }
    }

    // Initialize counts
    updateCounts();
});
