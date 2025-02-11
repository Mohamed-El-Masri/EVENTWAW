function addToCart(itemName, itemPrice) {  
    const toast = document.getElementById('toast');  
    toast.innerText = `${itemName} added to cart for ${itemPrice}!`;  
    toast.className = "toast show";  

    setTimeout(() => {  
        toast.className = toast.className.replace("show", "");  
    }, 3000); // Hide after 3 seconds  
}