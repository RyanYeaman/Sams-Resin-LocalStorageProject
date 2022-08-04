let slidePosition = 0;
const slides = document.getElementsByClassName('product__display')
const totalSlides = slides.length;

document.
    getElementById('swipe__right')
    .addEventListener("click", function () {
        nextProduct();
    })

document.
    getElementById('swipe__left')
    .addEventListener("click", function () {
        previousProduct();
    })

// slide will repersent each slide in the variable slides that repersents a HTML collection of all the Slides.
// removing the visible product display and replacing it with the next product display with the class name of hidden in the HTML collection
function updateDisplayCarousel() {
    for (let slide of slides) {
        slide.classList.remove('product__display--visible');
        slide.classList.add('product__display--hidden');
    }

    // this will now add the visible class to the hidden product display so it will be visible on the webpage.
    slides[slidePosition].classList.add("product__display--visible")
}

// what this if statement means is when the slide position equals the last totoalSlides index it will reset the totalSlides equal to 0.
//which will just reset the html collection.
function nextProduct() {
    if (slidePosition === totalSlides - 1) {
        slidePosition = 0;
    } else {
        //this will function will keep incrementing until it reaches the last index.
        slidePosition++;
    }

    updateDisplayCarousel();
}

// what this function will allow out previous button to do is to swap through our html collection in reverse
// if the the slide position hits 0 while decrementing it'l reset to -1 to the end the of the list.;
function previousProduct() {
    if (slidePosition === 0) {
        slidePosition = totalSlides - 1;
    } else {
        slidePosition--;
    }

    updateDisplayCarousel();
}


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
}

//this function will allow us add items into the our localStorageDB to pass over to our cart page.
function addToCartClicked(event) {
    let button = event.target
    let shopItemPropertys = button.parentElement.parentElement.parentElement.parentElement
    let h4 = shopItemPropertys.getElementsByClassName('title')[0].innerText
    let img = shopItemPropertys.getElementsByClassName('product__img')[0].src
    let price = shopItemPropertys.getElementsByClassName('price')[0].innerText
    let cartItem = { cartItemImg: img, cartItemH4: h4, cartItemPrice: price }
    saveToLocalStorage(cartItem)
}

function saveToLocalStorage(cartItem) {
    const exisitingCart = JSON.parse(localStorage.getItem("cart"));

    localStorage.setItem("cart", JSON.stringify(exisitingCart ? [...exisitingCart, cartItem] : [cartItem]));

    console.log(cartItem, JSON.parse(localStorage.getItem("cart")));

    document.getElementById("cart-qty").innerHTML = `${exisitingCart.length}`;
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




