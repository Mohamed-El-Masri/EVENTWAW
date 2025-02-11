
document.addEventListener('DOMContentLoaded', () => {
    const calendarBtn = document.querySelector('.calendar-btn');
    const calendarPopup = document.getElementById('calendarPopup');
    const closePopup = document.querySelector('.close-popup');
    
    const eventDetails = {
        title: "LA Beach Picnic",
        start: "2024-07-24T10:00:00",
        end: "2024-07-24T16:00:00",
        location: "LA Beach, California",
        description: "Join us for a wonderful beach picnic event!"
    };

    function generateCalendarUrls(event) {
        return {
            google: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start.replace(/[-:]/g, '')}/${event.end.replace(/[-:]/g, '')}&location=${encodeURIComponent(event.location)}&details=${encodeURIComponent(event.description)}`,
            outlook: `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(event.title)}&startdt=${event.start}&enddt=${event.end}&location=${encodeURIComponent(event.location)}&body=${encodeURIComponent(event.description)}`,
            yahoo: `https://calendar.yahoo.com/?v=60&title=${encodeURIComponent(event.title)}&st=${event.start.replace(/[-:]/g, '')}&et=${event.end.replace(/[-:]/g, '')}&in_loc=${encodeURIComponent(event.location)}&desc=${encodeURIComponent(event.description)}`
        };
    }

    calendarBtn.addEventListener('click', () => {
        calendarPopup.style.display = 'block';
    });

    closePopup.addEventListener('click', () => {
        calendarPopup.style.display = 'none';
    });

    document.querySelectorAll('.calendar-option').forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            const calendarType = e.currentTarget.dataset.calendar;
            const urls = generateCalendarUrls(eventDetails);
            
            if (urls[calendarType]) {
                window.open(urls[calendarType], '_blank');
            } else if (calendarType === 'apple') {
                // For Apple Calendar, download .ics file
                const icsFile = generateICSFile(eventDetails);
                downloadICSFile(icsFile);
            }
        });
    });
});