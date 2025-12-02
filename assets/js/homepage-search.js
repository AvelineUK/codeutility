document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('toolSearch');
    const toolCategories = document.querySelectorAll('.tool-category');
    const toolCards = document.querySelectorAll('.tool-card');
    const noResults = document.getElementById('noResults');
    const clearSearchLink = document.getElementById('clearSearch');

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            filterTools(searchTerm);
        });
    }

    // Clear search link
    if (clearSearchLink) {
        clearSearchLink.addEventListener('click', (e) => {
            e.preventDefault();
            searchInput.value = '';
            filterTools('');
            searchInput.focus();
        });
    }

    function filterTools(searchTerm) {
        let hasVisibleResults = false;

        if (!searchTerm) {
            // No search term - show everything
            toolCategories.forEach(category => category.classList.remove('hidden'));
            toolCards.forEach(card => card.style.display = 'block');
            noResults.classList.add('hidden');
            return;
        }

        // Filter each category
        toolCategories.forEach(category => {
            const cards = category.querySelectorAll('.tool-card');
            let categoryHasVisibleCards = false;

            cards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                const keywords = card.getAttribute('data-keywords') || '';

                // Check if search term matches title, description, or keywords
                const matches = 
                    title.includes(searchTerm) || 
                    description.includes(searchTerm) || 
                    keywords.toLowerCase().includes(searchTerm);

                if (matches) {
                    card.style.display = 'block';
                    categoryHasVisibleCards = true;
                    hasVisibleResults = true;
                } else {
                    card.style.display = 'none';
                }
            });

            // Hide category if no cards are visible
            if (categoryHasVisibleCards) {
                category.classList.remove('hidden');
            } else {
                category.classList.add('hidden');
            }
        });

        // Show/hide "no results" message
        if (hasVisibleResults) {
            noResults.classList.add('hidden');
        } else {
            noResults.classList.remove('hidden');
        }
    }

    // Email signup form handling (placeholder - implement backend later)
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = e.target.querySelector('input[type="email"]').value;
            
            // TODO: Implement actual email capture (Mailchimp, ConvertKit, etc.)
            // For now, just show a message
            alert(`Thanks for your interest! Email signup will be activated soon.\n\nEmail entered: ${email}`);
            
            // Clear form
            e.target.reset();
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Don't prevent default for clearSearch link
            if (href === '#' || this.id === 'clearSearch') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
