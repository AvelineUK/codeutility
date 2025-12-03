document.addEventListener('DOMContentLoaded', () => {
    renderSidebar();
    initializeSidebarInteractions();
});

function renderSidebar() {
    const sidebarNav = document.querySelector('.sidebar-nav');
    if (!sidebarNav) return;

    // Clear existing content
    sidebarNav.innerHTML = '';

    // Get current page for active state
    const currentPage = window.location.pathname.split('/').pop();

    // Render each category
    TOOL_CATEGORIES.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'nav-category';

        const heading = document.createElement('h3');
        heading.textContent = category.name;
        categoryDiv.appendChild(heading);

        const ul = document.createElement('ul');
        
        category.tools.forEach(tool => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = tool.href;
            a.textContent = tool.name;
            
            // Highlight active page
            if (tool.href === currentPage) {
                a.classList.add('active');
            }
            
            li.appendChild(a);
            ul.appendChild(li);
        });

        categoryDiv.appendChild(ul);
        sidebarNav.appendChild(categoryDiv);
    });

    // Update site name in header/logo
    const siteLogo = document.querySelector('.sidebar-logo');
    if (siteLogo) {
        siteLogo.textContent = SITE_CONFIG.name;
    }

    const mobileLogo = document.querySelector('.mobile-header .site-logo');
    if (mobileLogo) {
        mobileLogo.textContent = SITE_CONFIG.name;
    }

    // Trigger fade-in after content is rendered
    // Small delay ensures DOM is fully painted
    requestAnimationFrame(() => {
        sidebarNav.classList.add('loaded');
        
        // Setup scroll position saving on the nav element (the one that actually scrolls)
        if (sidebarNav) {
            sidebarNav.addEventListener('scroll', () => {
                sessionStorage.setItem('sidebarScrollPos', sidebarNav.scrollTop);
            });
        }
        
        // Restore scroll position from previous page
        // Use setTimeout to ensure sidebar is fully rendered and scrollable
        setTimeout(() => {
            const savedScrollPos = sessionStorage.getItem('sidebarScrollPos');
            if (savedScrollPos && sidebarNav) {
                sidebarNav.scrollTop = parseInt(savedScrollPos);
            }
        }, 50);
    });
}

function initializeSidebarInteractions() {
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const searchInput = document.getElementById('toolSearch');

    // Toggle mobile menu
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            sidebar.classList.toggle('open');
            overlay.classList.toggle('show');
        });
    }

    // Close sidebar when overlay clicked
    if (overlay) {
        overlay.addEventListener('click', () => {
            hamburger.classList.remove('active');
            sidebar.classList.remove('open');
            overlay.classList.remove('show');
        });
    }

    // Search/Filter functionality
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const navCategories = document.querySelectorAll('.nav-category');

            navCategories.forEach(category => {
                const links = category.querySelectorAll('a');
                let hasVisibleLinks = false;

                links.forEach(link => {
                    const text = link.textContent.toLowerCase();
                    if (text.includes(searchTerm)) {
                        link.style.display = 'block';
                        hasVisibleLinks = true;
                    } else {
                        link.style.display = 'none';
                    }
                });

                // Hide category if no links match
                if (hasVisibleLinks) {
                    category.classList.remove('hidden');
                } else {
                    category.classList.add('hidden');
                }
            });
        });
    }

    // Close sidebar on mobile when link clicked
    const navLinks = document.querySelectorAll('.nav-category a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 968) {
                sidebar.classList.remove('open');
                overlay.classList.remove('show');
                if (hamburger) hamburger.classList.remove('active');
            }
        });
    });
}
