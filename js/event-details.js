document.addEventListener('DOMContentLoaded', function() {
    try {
        // Get event data
        const eventData = getEventData();
        if (!eventData) {
            throw new Error('No event data found');
        }

        console.log('Retrieved event data:', eventData);
        
        // Update page content
        updatePageContent(eventData);
        
    } catch (error) {
        console.error('Error loading event details:', error);
        showErrorMessage(error.message);
    }
});

function getEventData() {
    // Try getting data from sessionStorage first
    const sessionData = sessionStorage.getItem('selectedEvent');
    if (sessionData) {
        try {
            return JSON.parse(sessionData);
        } catch (e) {
            console.error('Error parsing session data:', e);
        }
    }

    // Fallback to localStorage
    const localData = localStorage.getItem('lastViewedEvent');
    if (localData) {
        try {
            return JSON.parse(localData);
        } catch (e) {
            console.error('Error parsing local data:', e);
        }
    }

    return null;
}

function updatePageContent(event) {
    try {
        // Update page title
        document.title = `EVENTWAW | ${event.title}`;

        // Update breadcrumb
        updateElement('.page-title-bar h1', event.title);
        updateElement('.breadcrumb .item-current', event.title);

        // Update main content
        const mainImage = document.querySelector('.eventMAinContent img');
        if (mainImage && event.images?.main) {
            mainImage.src = event.images.main.startsWith('http') 
                ? event.images.main 
                : `https://event-backend-project.vercel.app/${event.images.main}`;
            mainImage.alt = event.title;
        }

        updateElement('.eventDiscription', event.description);

        // Update tags
        if (event.tags && Array.isArray(event.tags)) {
            const tagsContainer = document.querySelector('.eventTags');
            if (tagsContainer) {
                tagsContainer.innerHTML = `
                    <span>Tags:</span>
                    ${event.tags.map(tag => `<a href="#">${tag}</a>`).join('')}
                `;
            }
        }

        // Update event details sidebar
        updateEventDetails({
            'Start Date': formatDate(event.schedule.startDate),
            'End Date': formatDate(event.schedule.endDate),
            'Door Time': event.schedule.doorTime,
            'Location': event.locationDetails.location,
            'Venue': event.locationDetails.venue,
            'Address': event.locationDetails.address,
            'Category': event.category,
            'Phone': event.contactInfo?.phone || 'N/A',
            'Email': event.contactInfo?.email || 'N/A'
        });

    } catch (error) {
        console.error('Error updating content:', error);
        showErrorMessage('Error updating event details');
    }
}

function updateElement(selector, content) {
    const element = document.querySelector(selector);
    if (element && content) {
        element.textContent = content;
    }
}

function formatDate(dateString) {
    if (!dateString) return 'TBA';
    try {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (e) {
        return dateString;
    }
}

function updateEventDetails(details) {
    const container = document.querySelector('.eventDetails');
    if (!container) return;

    let html = '<h2>Event Details</h2>';
    
    for (const [label, value] of Object.entries(details)) {
        if (value) {
            html += `
                <div class="detail-item">
                    <i class="bi ${getIconClass(label)}"></i>
                    <div class="detail-content">
                        <p class="label">${label}</p>
                        <p class="value">${value}</p>
                    </div>
                </div>
            `;
        }
    }

    container.innerHTML = html;
}

function getIconClass(label) {
    const iconMap = {
        'Start Date': 'bi-calendar3',
        'End Date': 'bi-calendar3',
        'Door Time': 'bi-clock',
        'Location': 'bi-geo-alt',
        'Venue': 'bi-building',
        'Address': 'bi-geo',
        'Category': 'bi-tag',
        'Phone': 'bi-telephone',
        'Email': 'bi-envelope'
    };
    return iconMap[label] || 'bi-info-circle';
}

function showErrorMessage(message) {
    const errorHTML = `
        <div class="alert alert-danger text-center my-5">
            <h4>Error Loading Event</h4>
            <p>${message}</p>
            <p>Redirecting to home page in 5 seconds...</p>
        </div>
    `;

    const mainContent = document.querySelector('.eventMAinContent');
    if (mainContent) {
        mainContent.innerHTML = errorHTML;
    }

    // Set a longer timeout before redirecting
    setTimeout(() => {
        window.location.href = 'home.html';
    }, 5000);
}
