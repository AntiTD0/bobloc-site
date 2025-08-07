const navbarContainer = document.getElementById('navbar');
const footerContainer = document.getElementById('footer');


async function loadComponent(componentName, container) {
    try {
        const response = await fetch(`/parts/${componentName}.html`);
        if (!response.ok) throw new Error(`Failed to load ${componentName}`);
        container.innerHTML = await response.text();
    } catch (error) {
        console.error(`Error loading ${componentName}:`, error);
        container.innerHTML = `<p>Error loading ${componentName}</p>`;
    }
}


document.addEventListener('DOMContentLoaded', async () => {
    document.body.classList.add('components-loading');
    
    try {
        await Promise.all([
            loadComponent('nav', navbarContainer),
            loadComponent('foot', footerContainer)
        ]);
        
        document.body.classList.remove('components-loading');
        document.body.classList.add('components-ready');
        
        const menuButton = document.querySelector('.menu-button');
        const navLinks = document.querySelector('.nav-links');
        
        if (menuButton && navLinks) {
            menuButton.setAttribute('aria-expanded', 'false');
            menuButton.setAttribute('aria-label', 'Toggle menu');
            menuButton.setAttribute('aria-controls', 'menu');
            navLinks.setAttribute('id', 'menu');
            
            menuButton.addEventListener('click', (e) => {
                e.stopPropagation();
                const isExpanded = navLinks.classList.toggle('active');
                menuButton.setAttribute('aria-expanded', isExpanded.toString());
            });
            
            document.addEventListener('click', (e) => {
                if (!navLinks.contains(e.target) && e.target !== menuButton) {
                    navLinks.classList.remove('active');
                    menuButton.setAttribute('aria-expanded', 'false');
                }
            });
            
            navLinks.addEventListener('click', (e) => {
                if (e.target.tagName === 'A') {
                    setTimeout(() => {
                        navLinks.classList.remove('active');
                        menuButton.setAttribute('aria-expanded', 'false');
                    }, 300);
                }
                e.stopPropagation();
            });
        }
        
    } catch (error) {
        console.error('Initialization error:', error);
    }
});




  


document.querySelectorAll('.toggle').forEach((button, index) => {
  // Ensure unique button IDs
  if (!button.id) button.id = `toggle-${index}`;

  // Get the existing `aria-controls` or generate a new one
  let detailsId = button.getAttribute('aria-controls');
  
  // If no `aria-controls` is set, check if it's an "a-details" case
  if (!detailsId) {
    const isADetails = button.closest('.a-toggle-container') || button.classList.contains('a-toggle');
    detailsId = isADetails ? `a-details-${index}` : `details-${index}`;
    button.setAttribute('aria-controls', detailsId);
    
    // Set the ID on the next sibling (the details div)
    const details = button.nextElementSibling;
    if (details && details.classList.contains('details')) {
      details.id = detailsId;
    }
  }

  // Toggle functionality
  button.addEventListener('click', () => {
    const detailsId = button.getAttribute('aria-controls');
    const details = document.getElementById(detailsId);
    if (!details) return;

    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    
    // Toggle visibility
    details.classList.toggle('show', !isExpanded);
    details.classList.toggle('hide', isExpanded);
    
    // Update button state
    button.setAttribute('aria-expanded', !isExpanded);
    button.querySelector('.show-text').hidden = !isExpanded;
    button.querySelector('.hide-text').hidden = isExpanded;
  });
});









document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('accessory-search');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const accessories = document.querySelectorAll('.accessorie');
  
  function performSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
    
    accessories.forEach(accessory => {
      const title = accessory.querySelector('h2').textContent.toLowerCase();
      const type = accessory.dataset.type;
      
      const matchesSearch = title.includes(searchTerm);
      const matchesFilter = activeFilter === 'all' || type === activeFilter;
      
      if (matchesSearch && matchesFilter) {
        accessory.style.display = 'block';
      } else {
        accessory.style.display = 'none';
      }
    });
  }
  
  searchInput.addEventListener('input', performSearch);
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      performSearch();
    });
  });
});