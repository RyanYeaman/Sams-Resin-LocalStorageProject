const menu = document.querySelector('#mobile__menu');
const mainMenu = document.querySelector('.navbar__content')

menu.addEventListener('click', () => {
    menu.classList.toggle('is-active');
    mainMenu.classList.toggle('active');
})

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {
    let addToCartButton = document.getElementsByClassName('display__btn')
    for (let buttons of addToCartButton) {
        buttons.addEventListener('click', addToCartClicked)
    }

    //checking for exisitng cart
    const exisitingCart = JSON.parse(localStorage.getItem("cart"))

    //setting qty
    if (exisitingCart) {
        document.getElementById("cart-qty").innerHTML = `${exisitingCart.length}`;
    }
    updateCartQty()
}

//this function will allow us add items into the our localStorageDB to pass over to our cart page.


function addToCartClicked(event) {
    let button = event.target
    let shopItemPropertys = button.parentElement.parentElement.parentElement.parentElement
    let h4 = shopItemPropertys.getElementsByClassName('title')[0].innerText
    let img = shopItemPropertys.getElementsByClassName('product__img')[0].src
    let price = shopItemPropertys.getElementsByClassName('price')[0].innerText
    let cartItem = { cartItemImg: img, cartItemH4: h4, cartItemPrice: price }
    saveToLocalStorage(cartItem);
    updateCartQty()
}

function saveToLocalStorage(cartItem) {
    const exisitingCart = JSON.parse(localStorage.getItem("cart"));

    localStorage.setItem("cart", JSON.stringify(exisitingCart ? [...exisitingCart, cartItem] : [cartItem]));

    console.log(cartItem, JSON.parse(localStorage.getItem("cart")));

}

//This function will update the cart-qty.
function updateCartQty() {
    let quantity = 0;

    const cartQty = document.querySelector("#cart-qty");

    const exisitingCart = JSON.parse(localStorage.getItem("cart"));
    
    if(exisitingCart) {
        for(const items of exisitingCart) {
            quantity += +(items.qty);
        }
    }
    cartQty.innerHTML = `${quantity}`
}

//Contact Box Functionailty

const contact = document.getElementById("contact-button");
const contactInfo = document.getElementById("contact-box");
const contactExitButton = document.querySelector(".fa-xmark");

contact.addEventListener("click", () => {
    contactInfo.classList.toggle("contact-info-hidden");
    contactInfo.classList.toggle("contact-info-active");
});

contactExitButton.addEventListener("click", () => {
    contactInfo.classList.remove("contact-info-active");
    contactInfo.classList.add("contact-info-hidden");
})
