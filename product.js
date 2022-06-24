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
    let removeItemButton = document.getElementsByClassName('remove__btn')
    for (let i = 0; i < removeItemButton.length; i++) {
        const button = removeItemButton[i]
        button.addEventListener('click', removeItem)
    }

    let quantityInputs = document.querySelectorAll('.item__quantity')
    for (let inputs of quantityInputs) {
        inputs.addEventListener('change', quantityChanged)
    }

    let addToCartButton = document.getElementsByClassName('display__btn')
    for (let buttons of addToCartButton) {
        buttons.addEventListener('click', addToCartClicked)
    }
}


//this function will allow us add items into the cart.
function addToCartClicked(event) {
    let button = event.target
    let shopItem = button.parentElement.parentElement.parentElement.parentElement
    let cartDisplay = shopItem.getElementsByClassName('product__page--display')
    let h4 = shopItem.getElementsByClassName('title')[0].innerText
    let img = shopItem.getElementsByClassName('product__img')[0].src
    let price = shopItem.getElementsByClassName('price')[0].innerText
    let removeButton = shopItem.getElementsByClassName('remove__button')
    console.log(cartDisplay, img, h4, price, removeButton)
    addItemToCart(cartDisplay, img, h4, price, removeButton)

}

function addItemToCart(cartDisplay, img, h4, price, removeButton) {
    const saveToLocalStorage = () => {
        localStorage.setItem('Display', cartDisplay)
    }

    saveToLocalStorage.addEventListener('click', saveToLocalStorage)
}

// function addItemToCart(cartDisplay, img, h4, price, removeButton) {
//     let cartRow = document.createElement('div')
//     let cartItems = document.getElementsByClassName('cart__row')[0]
//     let cartRowContent = `
//         <div class="product__page--display">
//             <img class="product__img" src="https://images.unsplash.com/photo-1640385034419-9634b8b01c71?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2069&q=80"
//             alt="">
//             <div class="description__container--product">
//                 <div id="product__description product__page--description">
//                     <h4 class="title">Ocean Table</h4>
//                     <p class="price">$299.99</p>
//                     <button class="display__btn product__page--btn"><a class="display__button" href="#">Add
//                         To Cart</a></button>
//                 </div>
//             </div>
//         </div>`
//     cartRow.innerHTML = cartRowContent
//     cartItems.append(cartRow)
// }


//this function removes items from the cart and updates the total price when removing items from the cart.
function removeItem(event) {
    const buttonClicked = event.target
    buttonClicked.parentElement.parentElement.parentElement.parentElement.remove(document.getElementsByClassName('car__row'))
    updateTotal()
}


//this function allows the total price to be updated when the quantity ipout is updated 
function quantityChanged(event) {
    let input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateTotal()
}


// This Function updates the total Price of the cart.
function updateTotal() {
    const cartContainer = document.getElementsByClassName('cart__container')[0]
    const cartRow = cartContainer.getElementsByClassName('cart__row')
    let totalPrice = 0
    for (let cartRows of cartRow) {
        let totalCartPrice = cartRows.getElementsByClassName('total__price')[0]
        let quantityElement = cartRows.getElementsByClassName('item__quantity')[0]
        let price = parseFloat(totalCartPrice.innerText.replace('$', ''))
        let quantity = quantityElement.value
        totalPrice = totalPrice + (price * quantity)
    }

    document.getElementById('total__amount').innerText = 'TOTAL:' + ' ' + '$' + totalPrice.toFixed(2)
}


// localStorage because i still need to educate myself on back-end development.
const productItem = document.querySelectorAll('.product__page--display')
console.log(productItem)


