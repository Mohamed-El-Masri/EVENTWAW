document.addEventListener('DOMContentLoaded', async function() {
    const API_URL = 'https://event-backend-project.vercel.app/api/users/event/';
    let allEvents = [];
    let currentPage = 1;
    const ITEMS_PER_PAGE = 8;

    // Create skeleton loading cards
    function createSkeletonCards(count = 8) {
        return Array(count).fill().map(() => `
            <div class="upcoming-events__card loading card-skeleton">
                <div class="upcoming-events__card-image"></div>
                <div class="upcoming-events__card-content">
                    <div class="upcoming-events__card-category"></div>
                    <div class="upcoming-events__card-title"></div>
                    <div class="upcoming-events__card-info">
                        <span></span>
                        <span></span>
                    </div>
                    <div class="upcoming-events__card-btn"></div>
                </div>
            </div>
        `).join('');
    }

    // Show loading state
    const eventsGrid = document.querySelector('.upcoming-events__grid');
    if (eventsGrid) {
        eventsGrid.innerHTML = createSkeletonCards();
    }

    // Image loading with lazy loading and blur effect
    function loadImage(url, imageElement) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            
            img.onload = () => {
                imageElement.src = url;
                imageElement.classList.add('loaded');
                resolve(imageElement);
            };
            
            img.onerror = () => {
                imageElement.closest('.upcoming-events__card-image').classList.add('error');
                reject(new Error(`Failed to load image: ${url}`));
            };

            img.src = url;
        });
    }

    // Enhanced fetch with timeout and retry
    async function fetchWithRetry(url, retries = 4) {
        for (let i = 0; i < retries; i++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);
                
                const response = await fetch(url, { signal: controller.signal });
                clearTimeout(timeoutId);
                
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return await response.json();
            } catch (error) {
                if (i === retries - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            }
        }
    }

    async function fetchEvents() {
        try {
            const result = await fetchWithRetry(API_URL);
            if (result.success) {
                return result.data;
            }
            throw new Error(result.message);
        } catch (error) {
            console.error('Error fetching events:', error);
            return [];
        }
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return {
            day: date.getDate(),
            month: date.toLocaleString('default', { month: 'short' }).toUpperCase()
        };
    }

    function renderEvents(events) {
        if (!eventsGrid) return;

        const renderedCards = events.map((event, index) => {
            const startDate = formatDate(event.schedule.startDate);
            const imageUrl = event.images?.main 
                ? `https://event-backend-project.vercel.app/${event.images.main}`
                : '../img/default-event.jpg';
                
            // Create a clean event object for JSON stringify
            const cleanEvent = {
                _id: event._id,
                title: event.title,
                description: event.description,
                category: event.category,
                schedule: event.schedule,
                locationDetails: event.locationDetails,
                contactInfo: event.contactInfo,
                images: event.images,
                map: event.map,
                tags: event.tags
            };

            const eventData = JSON.stringify(cleanEvent).replace(/"/g, '&quot;');
            
            return `
                <div class="upcoming-events__card event-item scroll-animate" 
                     data-animation="fade-up" 
                     data-delay="${200 + (index * 100)}"
                     data-category="${event.category || 'all'}">
                    <div class="upcoming-events__card-image blur-load">
                        <a href="javascript:void(0)" onclick="navigateToEventDetails(${eventData})">
                            <img 
                                src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                                data-src="${imageUrl}"
                                alt="${event.title || 'Event'}"
                                loading="lazy"
                            >
                        </a>
                        <div class="upcoming-events__card-date">
                            <span class="day">${startDate.day}</span>
                            <span class="month">${startDate.month}</span>
                        </div>
                    </div>
                    <div class="upcoming-events__card-content">
                        <div class="upcoming-events__card-category">${event.category || 'Event'}</div>
                        <h3 class="upcoming-events__card-title">
                            <a href="javascript:void(0)" onclick="navigateToEventDetails(${eventData})">
                                ${event.title || 'Untitled Event'}
                            </a>
                        </h3>
                        <div class="upcoming-events__card-info">
                            <span><i class="fas fa-map-marker-alt"></i> ${event.locationDetails.venue}, ${event.locationDetails.location}</span>
                            <span><i class="fas fa-clock"></i> ${event.schedule.doorTime}</span>
                        </div>
                        <a href="javascript:void(0)" class="upcoming-events__card-btn" onclick="navigateToEventDetails(${eventData})">
                            View Details
                        </a>
                    </div>
                </div>
            `;
        }).join('');

        eventsGrid.innerHTML = renderedCards;

        // Reinitialize animations for new content
        const newAnimatedElements = eventsGrid.querySelectorAll('.scroll-animate');
        initializeAnimations(newAnimatedElements);

        // Initialize lazy loading
        const lazyImages = document.querySelectorAll('.upcoming-events__card-image img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    loadImage(img.dataset.src, img)
                        .catch(console.error);
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // Add this helper function
    function initializeAnimations(elements) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.2
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);

        elements.forEach(el => observer.observe(el));
    }

    function setupPagination() {
        const pagination = document.querySelector('.blog-pagination ul');
        pagination.innerHTML = `
            <li><a href="#" class="prev-page"><i class="bi bi-chevron-left"></i></a></li>
            <li><a href="#" class="load-more">Load More</a></li>
            <li><a href="#" class="next-page"><i class="bi bi-chevron-right"></i></a></li>
        `;

        // Load More Click Handler
        pagination.querySelector('.load-more').addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage * ITEMS_PER_PAGE < allEvents.length) {
                currentPage++;
                renderEvents(allEvents.slice(0, currentPage * ITEMS_PER_PAGE));
                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: 'smooth'
                });
            }
        });

        // Previous Page Click Handler
        pagination.querySelector('.prev-page').addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage > 1) {
                currentPage--;
                renderEvents(allEvents.slice(0, currentPage * ITEMS_PER_PAGE));
                window.scrollTo({
                    top: document.querySelector('.upcoming-events').offsetTop,
                    behavior: 'smooth'
                });
            }
        });

        // Next Page Click Handler
        pagination.querySelector('.next-page').addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage * ITEMS_PER_PAGE < allEvents.length) {
                currentPage++;
                renderEvents(allEvents.slice(0, currentPage * ITEMS_PER_PAGE));
                window.scrollTo({
                    top: document.querySelector('.upcoming-events').offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }

    // Initialize
    try {
        allEvents = await fetchEvents();
        renderEvents(allEvents.slice(0, ITEMS_PER_PAGE));
        setupPagination();
    } catch (error) {
        console.error('Failed to initialize events:', error);
        eventsGrid.innerHTML = '<p class="error-message">Failed to load events. Please try again later.</p>';
    }

    function initializeIsotope() {
        const grid = new Isotope('.events-grid', {
            itemSelector: '.event-item',
            layoutMode: 'fitRows'
        });

        // Filter functionality
        document.querySelectorAll('.upcoming-events__filter-btn').forEach(button => {
            button.addEventListener('click', function() {
                const filterValue = this.getAttribute('data-filter');
                grid.arrange({ 
                    filter: filterValue === '*' ? null : `.${filterValue}` 
                });
                
                // Update active state
                document.querySelectorAll('.upcoming-events__filter-btn').forEach(btn => 
                    btn.classList.remove('upcoming-events__filter-btn--active'));
                this.classList.add('upcoming-events__filter-btn--active');
            });
        });
    }

    // Search functionality
    const searchInput = document.querySelector('.upcoming-events__search-input');
    if (searchInput) {
        searchInput.addEventListener('keyup', function() {
            const searchText = this.value.toLowerCase();
            document.querySelectorAll('.event-item').forEach(item => {
                const title = item.querySelector('.upcoming-events__card-title').textContent.toLowerCase();
                const category = item.querySelector('.upcoming-events__card-category').textContent.toLowerCase();
                item.style.display = title.includes(searchText) || category.includes(searchText) ? 'block' : 'none';
            });
        });
    }

    // View Details Function
    window.viewEventDetails = function(eventId) {
        // Implementation for viewing event details
        console.log('Viewing event details for:', eventId);
        // يمكنك إضافة المنطق الخاص بعرض تفاصيل الحدث هنا
    };

    // Navigation Function with Error Handling and Loading State
    window.navigateToEventDetails = function(event) {
        try {
            const preloader = document.querySelector('#preloader');
            if (preloader) {
                preloader.style.visibility = 'visible';
                preloader.style.opacity = '1';
                document.body.classList.add('loading-active');
            }

            // تنظيف وتحضير البيانات
            const cleanEvent = {
                id: event._id,
                title: event.title || 'Untitled Event',
                description: event.description || 'No description available',
                category: event.category || 'Uncategorized',
                schedule: {
                    startDate: event.schedule?.startDate || new Date().toISOString(),
                    endDate: event.schedule?.endDate || new Date().toISOString(),
                    doorTime: event.schedule?.doorTime || '00:00'
                },
                locationDetails: {
                    location: event.locationDetails?.location || 'TBA',
                    venue: event.locationDetails?.venue || 'TBA',
                    address: event.locationDetails?.address || 'TBA'
                },
                contactInfo: {
                    phone: event.contactInfo?.phone || 'N/A',
                    email: event.contactInfo?.email || 'N/A'
                },
                images: {
                    main: event.images?.main || '../img/default-event.jpg',
                    secondary: event.images?.secondary || [],
                    layout: event.images?.layout || []
                },
                tags: Array.isArray(event.tags) ? event.tags : ['Event'],
                map: event.map || { lat: 0, lng: 0 }
            };

            // تخزين البيانات
            sessionStorage.setItem('selectedEvent', JSON.stringify(cleanEvent));
            localStorage.setItem('lastViewedEvent', JSON.stringify(cleanEvent));

            setTimeout(() => {
                window.location.href = 'Event-details.html';
            }, 300);
            
        } catch (error) {
            console.error('Navigation error:', error);
            const preloader = document.querySelector('#preloader');
            if (preloader) {
                preloader.style.visibility = 'hidden';
                preloader.style.opacity = '0';
                document.body.classList.remove('loading-active');
            }
            alert('Error navigating to event details. Please try again.');
        }
    };

    // Analytics tracking function
    function trackEventView(eventId) {
        try {
            const viewsHistory = JSON.parse(localStorage.getItem('eventViewsHistory')) || {};
            viewsHistory[eventId] = viewsHistory[eventId] || [];
            viewsHistory[eventId].push({
                timestamp: new Date().toISOString(),
                userId: getCurrentUserId() // Implement this based on your auth system
            });
            localStorage.setItem('eventViewsHistory', JSON.stringify(viewsHistory));
        } catch (error) {
            console.error('Error tracking event view:', error);
        }
    }

    // Get current user ID (implement based on your auth system)
    function getCurrentUserId() {
        // Example implementation
        return localStorage.getItem('userId') || 'anonymous';
    }
});