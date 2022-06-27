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


//this function will allow us add items into the our localStorageDB to pass over to our cart page.
function addToCartClicked(event) {
    let button = event.target
    let shopItemPropertys = button.parentElement.parentElement.parentElement.parentElement
    let h4 = shopItemPropertys.getElementsByClassName('title')[0].innerText
    let img = shopItemPropertys.getElementsByClassName('product__img')[0].src
    let price = shopItemPropertys.getElementsByClassName('price')[0].innerText
    let cartItem = {cartItemImg: img, cartItemH4: h4, cartItemPrice: price}
    saveToLocalStorage(cartItem)
}
function saveToLocalStorage(cartItem) {
    let cartRow = document.getElementsByClassName('cart__container')
    let newCartRow = document.createElement('div')
    newCartRow.classList.add('cart__row')
  
    localStorage.setItem("cartItem", JSON.stringify(cartItem))
    let extractItem = JSON.parse(window.localStorage.getItem('cartItem'))
  
    console.log(extractItem)

    newCartRow.innerHTML = `
            <img class="product__img"
                src="${extractItem.cartItemImg}'
            alt="">
            <div class="description__container">
                <div id="product__description">
                    <h4>${extractItem.cartItemH4}</h4>
                    <p class="total__price">${extractItem.cartItemPrice}</p>
                    <input class="item__quantity" type="number" value="1">
                    <button class="remove__btn"><a class="remove__button" href="#">Remove</a></button>
                </div>
            </div> `
    console.log(newCartRow)
    cartRow.appendChild(newCartRow)
}



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


