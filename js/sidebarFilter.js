// for price range slider functionality

document.addEventListener('DOMContentLoaded', function() {
    const rangeSlider = document.querySelector('.range-slider');
    const priceCurrent = document.querySelector('.price-current');
    
    rangeSlider.addEventListener('input', function() {
      priceCurrent.textContent = '$' + this.value;
    });
  });



  document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const filterForm = document.querySelector('.sidebar-filter');
    const eventCards = document.querySelectorAll('.upcoming-events__card');
    const clearFiltersBtn = document.querySelector('.clear-filters');
    const sortDropdown = document.querySelector('.dropdown');
    const resultsCount = document.querySelector('.shorting-title');
    
    // Sorting functionality
    const sortingOptions = {
        'most-rated': (a, b) => b.dataset.rating - a.dataset.rating,
        'most-viewed': (a, b) => b.dataset.views - a.dataset.views,
        'newest': (a, b) => new Date(b.dataset.date) - new Date(a.dataset.date)
    };

    // Filter events based on selected criteria
    const filterEvents = () => {
        const selectedCategories = [...document.querySelectorAll('input[name="category"]:checked')]
            .map(input => input.value);
        
        let visibleCount = 0;
        
        eventCards.forEach(card => {
            const category = card.querySelector('.upcoming-events__card-category').textContent;
            const isVisible = selectedCategories.length === 0 || selectedCategories.includes(category);
            
            card.style.display = isVisible ? 'flex' : 'none';
            if(isVisible) visibleCount++;
        });
        
        // Update results count
        resultsCount.textContent = `${visibleCount} Results`;
    };

    // Sort events
    const sortEvents = (sortType) => {
        const cardsArray = [...eventCards];
        const sortedCards = cardsArray.sort(sortingOptions[sortType]);
        
        const container = document.querySelector('.upcoming-events__grid');
        container.innerHTML = '';
        sortedCards.forEach(card => container.appendChild(card));
    };

    // Event Listeners
    filterForm.addEventListener('change', filterEvents);
    
    clearFiltersBtn.addEventListener('click', () => {
        // Reset all form inputs
        filterForm.reset();
        // Show all events
        eventCards.forEach(card => card.style.display = 'flex');
        // Reset results count
        resultsCount.textContent = `${eventCards.length} Results`;
    });

    // Sorting dropdown listeners
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const sortType = e.target.dataset.sort;
            document.querySelector('.selection').textContent = e.target.textContent;
            sortEvents(sortType);
        });
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const dropdownBtn = document.querySelector('.dropdown-btn');
    const dropdownContent = document.querySelector('.dropdown-content');
    const selection = document.querySelector('.selection');

    // Toggle dropdown
    dropdownBtn.addEventListener('click', () => {
        dropdownContent.classList.toggle('show');
    });

    // Handle option selection
    dropdownContent.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            selection.textContent = e.target.textContent;
            dropdownContent.classList.remove('show');
            
            // Trigger sort functionality
            const sortType = e.target.dataset.sort;
            sortEvents(sortType);
        }
    });

    // Close dropdown when clicking outside
    window.addEventListener('click', (e) => {
        if (!e.target.closest('.custom-dropdown')) {
            dropdownContent.classList.remove('show');
        }
    });
});

const slider = document.getElementById('slider');  
slider.addEventListener('input', function() {  
    const value = (this.value - this.min) / (this.max - this.min) * 100;  
    this.style.setProperty('--value', value + '%');  
});  

// Set initial value color
const initialValue = (slider.value - slider.min) / (slider.max - slider.min) * 100;
slider.style.setProperty('--value', initialValue + '%');