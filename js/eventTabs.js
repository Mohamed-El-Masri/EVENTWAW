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