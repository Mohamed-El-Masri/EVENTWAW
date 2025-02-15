document.addEventListener('DOMContentLoaded', () => {
    // Initialize animation on elements
    const animatedElements = document.querySelectorAll('.scroll-animate');
    
    // Intersection Observer configuration
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Optional: Unobserve after animation if you want it to occur only once
                if (entry.target.dataset.once === 'true') {
                    observer.unobserve(entry.target);
                }
            } else if (!entry.target.dataset.once) {
                // Remove active class when element is not in view
                // Only if the animation should repeat
                entry.target.classList.remove('active');
            }
        });
    }, observerOptions);

    // Observe all animated elements
    animatedElements.forEach(el => {
        observer.observe(el);
        
        // Add base transition duration if not specified
        if (!el.style.transitionDuration) {
            el.style.transitionDuration = '0.6s';
        }
    });
});
