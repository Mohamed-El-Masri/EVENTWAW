document.addEventListener('DOMContentLoaded', function() {
    // Initialize Isotope
    var grid = new Isotope('.events-grid', {
        itemSelector: '.event-item',
        layoutMode: 'fitRows'
    });

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            let filterValue = this.getAttribute('data-filter');
            grid.arrange({ filter: filterValue });

            // Update active button
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    // Search functionality
    document.getElementById('searchEvents').addEventListener('keyup', function() {
        let searchText = this.value.toLowerCase();
        document.querySelectorAll('.event-item').forEach(item => {
            let title = item.querySelector('h3').textContent.toLowerCase();
            if(title.includes(searchText)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
        grid.arrange();
    });
});