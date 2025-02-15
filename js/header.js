
document.addEventListener('DOMContentLoaded', () => {
    const avatar = document.querySelector('.avatar');
    const dropdownMenu = document.querySelector('.register-login-logut-profile ul');
    
    // Toggle dropdown on avatar click
    avatar.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle('show');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!dropdownMenu.contains(e.target) && !avatar.contains(e.target)) {
            dropdownMenu.classList.remove('show');
        }
    });
    
    // Close dropdown on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            dropdownMenu.classList.remove('show');
        }
    });
});
