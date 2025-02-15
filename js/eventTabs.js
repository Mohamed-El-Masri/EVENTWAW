/* filepath: /C:/Users/HP/Desktop/EventWAW - scratch/clone/EVENTWAW/js/eventTabs.js */

document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.event-section-tab');
    const contents = document.querySelectorAll('.tab-content');

    const switchTab = (targetTab) => {
        const targetData = targetTab.dataset.tab;
        
        // Update active states
        tabs.forEach(tab => tab.classList.remove('active'));
        contents.forEach(content => content.classList.remove('active'));
        
        targetTab.classList.add('active');
        document.getElementById(targetData).classList.add('active');
    };

    // Event listeners
    tabs.forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab));
    });

    // Initialize first tab
    if (tabs.length) switchTab(tabs[0]);
});

function initMap() {
    const location = { lat: 34.0522, lng: -118.2437 };
    const mapOptions = {
        zoom: 14,
        center: location,
        styles: [
            {
                "featureType": "all",
                "elementType": "geometry.fill",
                "stylers": [{ "weight": "2.00" }]
            },
            {
                "featureType": "all",
                "elementType": "geometry.stroke",
                "stylers": [{ "color": "#9c9c9c" }]
            }
            // Add more styles as needed
        ]
    };
    
    const map = new google.maps.Map(document.getElementById('map'), mapOptions);
    
    const marker = new google.maps.Marker({
        position: location,
        map: map,
        title: 'Event Location',
        animation: google.maps.Animation.DROP
    });

    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div class="map-info-window">
                <h5>LA Convention Center</h5>
                <p>1201 S Figueroa St, Los Angeles</p>
            </div>
        `
    });

    marker.addListener('click', () => {
        infoWindow.open(map, marker);
    });
}