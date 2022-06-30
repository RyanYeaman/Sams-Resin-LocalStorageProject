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
}

//this function removes items from the cart and updates the total price when removing items from the cart.
function removeItem(event) {
    const buttonClicked = event.target
    buttonClicked.parentElement.parentElement.parentElement.remove(document.getElementsByClassName('cart__row')[0])
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

function extractCartItem(cartItem) {
    cartItem = JSON.parse(window.localStorage.getItem('cartItem'))  
    
    // i have to come back and get the localStorage data to set inside of an element.
    let cartRow = document.getElementsByClassName('cart__container')[0]
    let newCartRow = document.createElement('div')
    newCartRow.classList.add('cart__row')
    newCartRow.innerHTML = `
            <img class="product__img"
                src="${cartItem.cartItemImg}'
            alt="">
            <div class="description__container">
                <h4>${cartItem.cartItemH4}</h4>
                <p class="total__price">${cartItem.cartItemPrice}</p>
                <input class="item__quantity" type="number" value="1">
                <button class="remove__btn"><a class="remove__button" href="#">Remove</a></button>
            </div> `
    cartRow.append(newCartRow)
    updateTotal()
}