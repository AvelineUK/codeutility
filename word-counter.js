document.addEventListener('DOMContentLoaded', () => {
    const inputTextarea = document.getElementById('input');
    const wordCount = document.getElementById('wordCount');
    const uniqueWords = document.getElementById('uniqueWords');
    const avgWordLength = document.getElementById('avgWordLength');
    const longestWord = document.getElementById('longestWord');
    const shortestWord = document.getElementById('shortestWord');
    const charCount = document.getElementById('charCount');
    const topWords = document.getElementById('topWords');
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
        
        // Word count
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        const wordCountNum = text.trim() === '' ? 0 : words.length;
        wordCount.textContent = wordCountNum.toLocaleString();
        
        if (wordCountNum === 0) {
            // Reset everything if no words
            uniqueWords.textContent = '0';
            avgWordLength.textContent = '0';
            longestWord.textContent = '-';
            shortestWord.textContent = '-';
            topWords.innerHTML = '<em style="color: #a3a3a3;">Start typing to see the most frequently used words...</em>';
            readingTime.textContent = '0 min';
            speakingTime.textContent = '0 min';
            return;
        }
        
        // Clean words (remove punctuation for analysis)
        const cleanWords = words.map(word => word.toLowerCase().replace(/[^\w]/g, '')).filter(word => word.length > 0);
        
        // Unique words
        const uniqueWordSet = new Set(cleanWords);
        uniqueWords.textContent = uniqueWordSet.size.toLocaleString();
        
        // Average word length
        const totalLength = cleanWords.reduce((sum, word) => sum + word.length, 0);
        const avgLength = totalLength / cleanWords.length;
        avgWordLength.textContent = avgLength.toFixed(1);
        
        // Longest word
        const longest = cleanWords.reduce((longest, word) => 
            word.length > longest.length ? word : longest
        , '');
        longestWord.textContent = longest;
        
        // Shortest word
        const shortest = cleanWords.reduce((shortest, word) => 
            word.length < shortest.length ? word : shortest
        , cleanWords[0] || '');
        shortestWord.textContent = shortest;
        
        // Top 5 most common words
        const wordFrequency = {};
        cleanWords.forEach(word => {
            wordFrequency[word] = (wordFrequency[word] || 0) + 1;
        });
        
        const sortedWords = Object.entries(wordFrequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
        
        if (sortedWords.length > 0) {
            topWords.innerHTML = sortedWords
                .map(([word, count]) => `<strong>${word}</strong>: ${count} ${count === 1 ? 'time' : 'times'}`)
                .join('<br>');
        }
        
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
