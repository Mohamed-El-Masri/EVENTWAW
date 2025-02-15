document.addEventListener('DOMContentLoaded', function() {
    // Remove preloader when page is fully loaded
    const preloader = document.querySelector('#preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.visibility = 'hidden';
            preloader.style.opacity = '0';
            document.body.classList.remove('loading-active');
        }, 500);
    }

    // Get all tab buttons and content
    const tabButtons = document.querySelectorAll('.nav-tabs li');
    const tabContents = document.querySelectorAll('.tab-content');

    // Add click event to each tab button
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button
            button.classList.add('active');

            // Show corresponding content
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');

            // Reinitialize tickets when switching to tickets tab
            if (tabId === 'tickets') {
                initializeTickets();
            }
        });
    });

    // Avatar Change
    const avatarButton = document.querySelector('.change-avatar');
    const avatarInput = document.createElement('input');
    avatarInput.type = 'file';
    avatarInput.accept = 'image/*';

    avatarButton.addEventListener('click', () => {
        avatarInput.click();
    });

    avatarInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                document.querySelector('.profile-avatar img').src = e.target.result;
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    // Form Submission
    const forms = document.querySelectorAll('.settings-form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Add your form submission logic here
            alert('Changes saved successfully!');
        });
    });

    // Delete Account
    const deleteBtn = document.querySelector('.btn-delete-account');
    deleteBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            // Add your delete account logic here
            alert('Account deleted successfully');
        }
    });

    // Fetch ticket data
    fetchTicketData();

    // Filter buttons functionality
    const filterBtns = document.querySelectorAll('.filter-btn');
    const ticketSections = document.querySelectorAll('.tickets-section');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Show corresponding section
            const filter = btn.getAttribute('data-filter');
            ticketSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === `${filter}-events`) {
                    section.classList.add('active');
                }
            });

            // Render tickets for the selected filter with page 1
            renderTickets(filter, 1);
        });
    });

 

    window.writeReview = function(ticketId) {
        alert(`Opening review form for event #${ticketId}`);
        // Add review form logic here
    };

    window.viewDetails = function(eventId) {
        const event = findEventById(eventId);
        if (event) {
            // Update popup content
            document.getElementById('popupEventImage').src = event.image;
            document.getElementById('popupEventDay').textContent = event.date.day;
            document.getElementById('popupEventMonth').textContent = event.date.month;
            document.getElementById('popupEventTitle').textContent = event.title;
            document.getElementById('popupEventTime').textContent = event.time;
            document.getElementById('popupEventLocation').textContent = event.location;
            document.getElementById('popupEventStatus').textContent = event.status;

            // Show popup
            document.querySelector('.ticket-details-popup').classList.add('active');
        }
    };


    // Pagination
    const tickets = [ /* هنا ضع بيانات التذاكر كمصفوفة */ ];
    const ticketsPerPage = 3;
    let currentPage = 1;

    // Event Listeners for View Details buttons
    const viewDetailsButtons = document.querySelectorAll('.btn-view-details');
    const popup = document.querySelector('.ticket-details-popup');
    const closePopup = document.querySelector('.close-popup');

    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const ticketCard = this.closest('.ticket-card');
            showTicketDetails(ticketCard);
        });
    });

    closePopup.addEventListener('click', () => {
        popup.classList.remove('active');
    });

    // Close popup when clicking outside
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.classList.remove('active');
        }
    });

    // Show ticket details in popup
    function showTicketDetails(ticketCard) {
        const popup = document.querySelector('.ticket-details-popup');
        
        try {
            // الحصول على البيانات من البطاقة
            const image = ticketCard.querySelector('.ticket-image img').src;
            const day = ticketCard.querySelector('.ticket-date .day').textContent;
            const month = ticketCard.querySelector('.ticket-date .month').textContent;
            const title = ticketCard.querySelector('h4').textContent;
            const time = ticketCard.querySelector('.fa-clock').parentNode.textContent.trim();
            const location = ticketCard.querySelector('.fa-map-marker-alt').parentNode.textContent.trim();
            const status = ticketCard.querySelector('.ticket-status').textContent;

            // تحديث محتوى الـ popup
            document.getElementById('popupEventImage').src = image;
            document.getElementById('popupEventDay').textContent = day;
            document.getElementById('popupEventMonth').textContent = month;
            document.getElementById('popupEventTitle').textContent = title;
            document.getElementById('popupEventTime').textContent = time;
            document.getElementById('popupEventLocation').textContent = location;
            document.getElementById('popupEventStatus').textContent = status;

            // عرض الـ popup
            popup.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // منع التمرير في الخلفية
        } catch (error) {
            console.error('Error showing ticket details:', error);
        }
    }

    // Download Ticket functionality
    document.querySelector('.ticket-actions-large .btn-download-ticket').addEventListener('click', function() {
        alert('Downloading ticket...');
        // Add your download logic here
    });

    // Add to Calendar functionality
    document.querySelector('.btn-add-calendar').addEventListener('click', function() {
        const title = document.getElementById('popupEventTitle').textContent;
        const date = document.getElementById('popupEventDay').textContent + ' ' + 
                    document.getElementById('popupEventMonth').textContent;
        const time = document.getElementById('popupEventTime').textContent;
        const location = document.getElementById('popupEventLocation').textContent;

        // Create calendar event URL (Google Calendar format)
        const startDate = new Date(`2024 ${date} ${time}`);
        const endDate = new Date(startDate.getTime() + (2 * 60 * 60 * 1000)); // 2 hours duration

        const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate.toISOString().replace(/-|:|\.\d\d\d/g, '')}/${endDate.toISOString().replace(/-|:|\.\d\d\d/g, '')}&location=${encodeURIComponent(location)}`;

        window.open(calendarUrl, '_blank');
    });

    // Initialize tickets
    initializeTickets();
});

// Load and manage ticket data
let ticketsData = null;

// Modified fetchTicketData with better error handling
async function fetchTicketData() {
    try {
        const response = await fetch('../data/tickets.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        ticketsData = await response.json();
        
        // Only try to render if we have data
        if (ticketsData && ticketsData.tickets) {
            renderTickets('upcoming', 1);
        } else {
            console.error('Invalid ticket data structure');
            document.querySelector('#upcoming-events .tickets-grid').innerHTML = 
                '<p>Sorry, we could not load the ticket data. Please try again later.</p>';
        }
    } catch (error) {
        console.error('Error loading ticket data:', error);
        document.querySelector('#upcoming-events .tickets-grid').innerHTML = 
            '<p>Sorry, we could not load the ticket data. Please try again later.</p>';
    }
}

const TICKETS_PER_PAGE = 3;

// Updated renderTickets function
function renderTickets(type, page = 1) {
    const ticketsGrid = document.querySelector(`#${type}-events .tickets-grid`);
    if (!ticketsGrid) {
        console.error(`Tickets grid not found for ${type} events`);
        return;
    }

    if (!ticketsData || !ticketsData.tickets || !ticketsData.tickets[type]) {
        console.error('Tickets data not properly initialized');
        ticketsGrid.innerHTML = '<p>No tickets available</p>';
        return;
    }

    const tickets = ticketsData.tickets[type];
    
    // Calculate pagination
    const startIndex = (page - 1) * TICKETS_PER_PAGE;
    const endIndex = Math.min(startIndex + TICKETS_PER_PAGE, tickets.length);
    const paginatedTickets = tickets.slice(startIndex, endIndex);
    
    // Render tickets
    ticketsGrid.innerHTML = paginatedTickets.map(ticket => `
        <div class="ticket-card ${type === 'past' ? 'past' : ''}">
            <div class="ticket-status ${type === 'past' ? 'past' : ''}">${ticket.status}</div>
            <div class="ticket-image">
                <img src="${ticket.image}" alt="${ticket.title}">
                <div class="ticket-date ${type === 'past' ? 'past' : ''}">
                    <span class="day">${ticket.date.day}</span>
                    <span class="month">${ticket.date.month}</span>
                </div>
            </div>
            <div class="ticket-info">
                <h4>${ticket.title}</h4>
                <div class="event-details">
                    <p><i class="fas fa-clock"></i> ${ticket.time}</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${ticket.location}</p>
                </div>
                <div class="ticket-actions">
                    ${type === 'upcoming' ? `
                        <button class="btn-download-ticket" onclick="downloadTicket(${ticket.id})">
                            <i class="fas fa-download"></i> Download
                        </button>
                    ` : `
                        <button class="btn-review" onclick="writeReview(${ticket.id})">
                            <i class="fas fa-star"></i> Write Review
                        </button>
                    `}
                    <button class="btn-view-details" onclick="viewDetails(${ticket.id})">View Details</button>
                </div>
            </div>
        </div>
    `).join('');

    updatePagination(type, page, tickets.length);
    setTimeout(() => {
        initializePopupListeners(); // إعادة تهيئة مستمعات الأحداث بعد تحديث المحتوى
    }, 0);
}

function updatePagination(type, currentPage, totalItems) {
    const paginationContainer = document.querySelector(`#${type}-events .pagination`);
    const totalPages = Math.ceil(totalItems / TICKETS_PER_PAGE);
    let paginationHTML = '';

    // Previous button
    if (currentPage > 1) {
        paginationHTML += `<button class="page-btn prev" data-page="${currentPage - 1}">
            <i class="fas fa-chevron-left"></i>
        </button>`;
    }

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        // Show first page, last page, current page, and pages around current page
        if (
            i === 1 || 
            i === totalPages || 
            (i >= currentPage - 1 && i <= currentPage + 1)
        ) {
            paginationHTML += `<button class="page-btn ${i === currentPage ? 'active' : ''}" 
                data-page="${i}">${i}</button>`;
        } else if (
            i === currentPage - 2 || 
            i === currentPage + 2
        ) {
            paginationHTML += `<span class="pagination-dots">...</span>`;
        }
    }

    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `<button class="page-btn next" data-page="${currentPage + 1}">
            <i class="fas fa-chevron-right"></i>
        </button>`;
    }

    paginationContainer.innerHTML = paginationHTML;
    attachPaginationListeners(type, totalPages);
}

function attachPaginationListeners(type, totalPages) {
    const paginationContainer = document.querySelector(`#${type}-events .pagination`);
    
    paginationContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.page-btn');
        if (!btn) return;

        let nextPage;
        if (btn.classList.contains('next')) {
            const currentActive = paginationContainer.querySelector('.active');
            const currentPage = parseInt(currentActive.getAttribute('data-page'));
            nextPage = Math.min(currentPage + 1, totalPages);
        } else if (btn.classList.contains('prev')) {
            const currentActive = paginationContainer.querySelector('.active');
            const currentPage = parseInt(currentActive.getAttribute('data-page'));
            nextPage = Math.max(currentPage - 1, 1);
        } else {
            nextPage = parseInt(btn.getAttribute('data-page'));
        }

        if (nextPage) {
            renderTickets(type, nextPage);
        }
    });
}

// Helper function to find event by ID
function findEventById(id) {
    const allEvents = [
        ...ticketsData.tickets.upcoming,
        ...ticketsData.tickets.past
    ];
    return allEvents.find(event => event.id === id);
}

// Close popup functionality
document.querySelector('.close-popup').addEventListener('click', () => {
    document.querySelector('.ticket-details-popup').classList.remove('active');
});

// Close when clicking outside popup
document.querySelector('.ticket-details-popup').addEventListener('click', (e) => {
    if (e.target === document.querySelector('.ticket-details-popup')) {
        document.querySelector('.ticket-details-popup').classList.remove('active');
    }
});

// download ticket functionality
function downloadTicket(ticketId) {
    const ticket = findEventById(ticketId);
    if (ticket) {
        const user = { name: "Ahmed Ali", email: "ahmed@example.com", phone: "0123456789" };
        const seating = { type: "Table", details: "Table 5, 4 seats" };
        loadModulesAndGenerateTicketPDF(user, ticket, seating);
    } else {
        alert('Ticket not found');
    }
}

async function loadModulesAndGenerateTicketPDF(user, event, seating) {
    const jsPDF = (await import('jspdf')).default;
    const QRCode = (await import('qrcode')).default;

    generateTicketPDF(user, event, seating);
}

function generateTicketPDF(user, event, seating) {
    const doc = new jsPDF();
    const qrText = `${user.name} | ${event.title} | ${event.date.day}-${event.date.month} | ${seating.type}: ${seating.details}`;
    
    QRCode.toDataURL(qrText, (err, url) => {
        if (!err) {
            doc.setFontSize(20);
            doc.text("Event Ticket", 80, 10);

            doc.setFontSize(12);
            doc.text(`Name: ${user.name}`, 10, 30);
            doc.text(`Email: ${user.email}`, 10, 40);
            doc.text(`Phone: ${user.phone}`, 10, 50);
            
            doc.text(`Event: ${event.title}`, 10, 70);
            doc.text(`Date: ${event.date.day} ${event.date.month}`, 10, 80);
            doc.text(`Time: ${event.time}`, 10, 90);
            doc.text(`Location: ${event.location}`, 10, 100);
            doc.text(`Status: ${event.status}`, 10, 110);
            
            doc.text(`Seating: ${seating.type}`, 10, 130);
            doc.text(`Details: ${seating.details}`, 10, 140);
            
            doc.addImage(url, 'PNG', 130, 30, 50, 50);
            doc.save("event_ticket.pdf");
        }
    });
}

// Example Usage:
const user = { name: "Ahmed Ali", email: "ahmed@example.com", phone: "0123456789" };
const event = { title: "Summer Music Festival", date: { day: "15", month: "JUL" }, time: "7:00 PM", location: "Central Park", status: "Upcoming" };
const seating = { type: "Table", details: "Table 5, 4 seats" };
document.querySelector(".btn-download-ticket").addEventListener("click", async () => {
    await loadModulesAndGenerateTicketPDF(user, event, seating);
});

// Handle page refresh and navigation
window.addEventListener('beforeunload', () => {
    const preloader = document.querySelector('#preloader');
    if (preloader) {
        preloader.style.visibility = 'visible';
        preloader.style.opacity = '1';
        document.body.classList.add('loading-active');
    }
});

function initializeTickets() {
    const tickets = document.querySelectorAll('.ticket-card');
    
    tickets.forEach((ticket, index) => {
        // Add loading state initially
        ticket.classList.add('loading');
        
        // Simulate loading delay with progressive timing
        setTimeout(() => {
            ticket.classList.remove('loading');
            ticket.classList.add('loaded');
        }, 500 + (index * 200)); // Progressive delay for each card
    });
}

function switchTab(tabId) {
    // ...existing tab switching code...

    // Reinitialize tickets when switching to tickets tab
    if (tabId === 'tickets') {
        initializeTickets();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const navTabs = document.querySelectorAll('.nav-tabs li');
    const tabContents = document.querySelectorAll('.tab-content');

    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            navTabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Filter buttons functionality
    const filterBtns = document.querySelectorAll('.filter-btn');
    const ticketSections = document.querySelectorAll('.tickets-section');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all filter buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Show/hide relevant ticket sections
            const filterValue = btn.getAttribute('data-filter');
            ticketSections.forEach(section => {
                if (section.id === `${filterValue}-events`) {
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            });
        });
    });

    // Pagination functionality
    const paginationBtns = document.querySelectorAll('.page-btn');
    const ticketsPerPage = 3; // Number of tickets to show per page

    paginationBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.classList.contains('next')) {
                // Handle next page logic
                const currentPage = document.querySelector('.page-btn.active');
                const nextPage = currentPage.nextElementSibling;
                if (nextPage && !nextPage.classList.contains('next')) {
                    currentPage.classList.remove('active');
                    nextPage.classList.add('active');
                    updateTicketsDisplay(parseInt(nextPage.getAttribute('data-page')));
                }
            } else {
                // Handle number page click
                paginationBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                updateTicketsDisplay(parseInt(this.getAttribute('data-page')));
            }
        });
    });

    function updateTicketsDisplay(pageNumber) {
        const activeSection = document.querySelector('.tickets-section.active');
        const tickets = activeSection.querySelectorAll('.ticket-card');
        const startIndex = (pageNumber - 1) * ticketsPerPage;
        const endIndex = startIndex + ticketsPerPage;

        tickets.forEach((ticket, index) => {
            if (index >= startIndex && index < endIndex) {
                ticket.style.display = 'block';
            } else {
                ticket.style.display = 'none';
            }
        });
    }

    // Initialize first page
    updateTicketsDisplay(1);

    // Ticket Details Popup functionality
    const viewDetailsButtons = document.querySelectorAll('.btn-view-details');
    const popup = document.querySelector('.ticket-details-popup');
    const closePopup = document.querySelector('.close-popup');

    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const ticketCard = e.target.closest('.ticket-card');
            updatePopupContent(ticketCard);
            popup.style.display = 'flex';
        });
    });

    closePopup.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    function updatePopupContent(ticketCard) {
        const image = ticketCard.querySelector('.ticket-image img').src;
        const title = ticketCard.querySelector('h4').textContent;
        const time = ticketCard.querySelector('.fas.fa-clock').parentElement.textContent;
        const location = ticketCard.querySelector('.fas.fa-map-marker-alt').parentElement.textContent;
        const status = ticketCard.querySelector('.ticket-status').textContent;
        const day = ticketCard.querySelector('.day').textContent;
        const month = ticketCard.querySelector('.month').textContent;

        document.getElementById('popupEventImage').src = image;
        document.getElementById('popupEventTitle').textContent = title;
        document.getElementById('popupEventTime').textContent = time.trim();
        document.getElementById('popupEventLocation').textContent = location.trim();
        document.getElementById('popupEventStatus').textContent = status;
        document.getElementById('popupEventDay').textContent = day;
        document.getElementById('popupEventMonth').textContent = month;
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...

    // تحسين وظيفة عرض التذاكر
    function renderTickets(type, page = 1) {
        const ticketsGrid = document.querySelector(`#${type}-events .tickets-grid`);
        const ticketsSection = document.querySelector(`#${type}-events`);
        
        if (!ticketsGrid || !ticketsSection) return;

        // التأكد من أن القسم مرئي قبل تحديث المحتوى
        ticketsSection.style.display = 'block';
        
        const tickets = getTicketsByType(type);
        const startIndex = (page - 1) * TICKETS_PER_PAGE;
        const endIndex = startIndex + TICKETS_PER_PAGE;
        const paginatedTickets = tickets.slice(startIndex, endIndex);

        // إضافة فئة loading أثناء تحديث المحتوى
        ticketsGrid.classList.add('loading');
        
        setTimeout(() => {
            ticketsGrid.innerHTML = paginatedTickets.map(ticket => `
                <div class="ticket-card ${type === 'past' ? 'past' : ''}" style="display: block;">
                    <div class="ticket-status ${type === 'past' ? 'past' : ''}">${ticket.status}</div>
                    <div class="ticket-image">
                        <img src="${ticket.image}" alt="${ticket.title}">
                        <div class="ticket-date">
                            <span class="day">${ticket.date.day}</span>
                            <span class="month">${ticket.date.month}</span>
                        </div>
                    </div>
                    <div class="ticket-info">
                        <h4>${ticket.title}</h4>
                        <div class="event-details">
                            <p><i class="fas fa-clock"></i> ${ticket.time}</p>
                            <p><i class="fas fa-map-marker-alt"></i> ${ticket.location}</p>
                        </div>
                        <div class="ticket-actions">
                            ${type === 'upcoming' 
                                ? `<button class="btn-download-ticket"><i class="fas fa-download"></i> Download</button>` 
                                : `<button class="btn-review"><i class="fas fa-star"></i> Write Review</button>`
                            }
                            <button class="btn-view-details">View Details</button>
                        </div>
                    </div>
                </div>
            `).join('');

            // إزالة فئة loading بعد اكتمال التحديث
            ticketsGrid.classList.remove('loading');
            updatePagination(type, page, tickets.length);
            attachTicketEventListeners();
        }, 300);
    }

    // تحسين وظيفة الفلترة
    function initializeFilter() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const ticketSections = document.querySelectorAll('.tickets-section');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filterValue = btn.getAttribute('data-filter');
                
                // تحديث الأزرار النشطة
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // إخفاء جميع الأقسام أولاً
                ticketSections.forEach(section => {
                    section.style.display = 'none';
                });

                // عرض القسم المطلوب
                const targetSection = document.getElementById(`${filterValue}-events`);
                if (targetSection) {
                    targetSection.style.display = 'block';
                    renderTickets(filterValue, 1); // إعادة تحميل التذاكر للقسم المحدد
                }
            });
        });
    }

    // تحسين وظيفة التصفح
    function updatePagination(type, currentPage, totalItems) {
        const paginationContainer = document.querySelector(`#${type}-events .pagination`);
        if (!paginationContainer) return;

        const totalPages = Math.ceil(totalItems / TICKETS_PER_PAGE);
        let paginationHTML = '';

        if (totalPages > 1) {
            // زر السابق
            if (currentPage > 1) {
                paginationHTML += `<button class="page-btn prev" data-page="${currentPage - 1}">
                    <i class="fas fa-chevron-left"></i>
                </button>`;
            }

            // أزرار الصفحات
            for (let i = 1; i <= totalPages; i++) {
                paginationHTML += `<button class="page-btn ${i === currentPage ? 'active' : ''}" 
                    data-page="${i}">${i}</button>`;
            }

            // زر التالي
            if (currentPage < totalPages) {
                paginationHTML += `<button class="page-btn next" data-page="${currentPage + 1}">
                    <i class="fas fa-chevron-right"></i>
                </button>`;
            }
        }

        paginationContainer.innerHTML = paginationHTML;
        attachPaginationListeners(type, totalPages);
    }

    // إضافة مستمعي الأحداث للتصفح
    function attachPaginationListeners(type, totalPages) {
        const paginationContainer = document.querySelector(`#${type}-events .pagination`);
        
        paginationContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.page-btn');
            if (!btn) return;

            const currentPage = parseInt(btn.getAttribute('data-page'));
            if (!isNaN(currentPage)) {
                renderTickets(type, currentPage);
            }
        });
    }

    // تهيئة الصفحة
    function initializePage() {
        initializeFilter();
        renderTickets('upcoming', 1); // عرض التذاكر القادمة افتراضياً
    }

    // بدء تشغيل الصفحة
    initializePage();
});

// إضافة CSS جديد للتحكم في العرض
const style = document.createElement('style');
style.textContent = `
    .tickets-grid {
        opacity: 1;
        transition: opacity 0.3s ease;
    }
    .tickets-grid.loading {
        opacity: 0.5;
    }
    .ticket-card {
        opacity: 1;
        transform: translateY(0);
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
    .ticket-card.hidden {
        opacity: 0;
        transform: translateY(20px);
    }
`;
document.head.appendChild(style);

// تحديث مستمعات الأحداث للـ popup
function initializePopupListeners() {
    const viewDetailsButtons = document.querySelectorAll('.btn-view-details');
    const popup = document.querySelector('.ticket-details-popup');
    const closePopup = document.querySelector('.close-popup');

    // إضافة مستمع الحدث لكل زر عرض التفاصيل
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', () => {
            const ticketCard = button.closest('.ticket-card');
            if (ticketCard) {
                showTicketDetails(ticketCard);
            }
        });
    });

    // إغلاق الـ popup عند الضغط على زر الإغلاق
    if (closePopup) {
        closePopup.addEventListener('click', () => {
            popup.style.display = 'none';
            document.body.style.overflow = 'auto'; // إعادة تمكين التمرير
        });
    }

    // إغلاق الـ popup عند النقر خارج المحتوى
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // ...existing initialization code...
    
    initializePopupListeners(); // تهيئة مستمعات الأحداث عند تحميل الصفحة
});

// إضافة CSS للـ popup
const popupStyles = document.createElement('style');
popupStyles.textContent = `
    .ticket-details-popup {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1000;
        justify-content: center;
        align-items: center;
    }

    .ticket-details-popup.active {
        display: flex !important;
    }

    .popup-content {
        background-color: white;
        padding: 20px;
        border-radius: 8px;
        position: relative;
        max-width: 90%;
        width: 600px;
        max-height: 90vh;
        overflow-y: auto;
    }

    .close-popup {
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
        padding: 5px;
        z-index: 1;
    }

    .close-popup:hover {
        opacity: 0.8;
    }
`;
document.head.appendChild(popupStyles);
