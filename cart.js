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
    // let removeItemButton = document.getElementsByClassName('remove__btn')
    // for (let i = 0; i < removeItemButton.length; i++) {
    //     const button = removeItemButton[i]
    //     button.addEventListener('click', removeItem)
    // }

    // let quantityInputs = document.querySelectorAll('.item__quantity')
    // for (let inputs of quantityInputs) {
    //     inputs.addEventListener('change', quantityChanged)
    // }

    //checking for existing cart.
    const existingCart = JSON.parse(localStorage.getItem("cart"));

    if (existingCart) {
        // set cart quantity
        document.getElementById("cart-qty").innerHTML = `${existingCart.length}`;
    }

    setIntialCart()
}

//this function removes items from the cart and updates the total price when removing items from the cart.
// function removeItem(event) {
//     const buttonClicked = event.target
//     buttonClicked.parentElement.parentElement.parentElement.remove(document.getElementsByClassName('cart__row')[0])
//     updateTotal()
// }

// //this function allows the total price to be updated when the quantity ipout is updated 
// function quantityChanged(event) {
//     let input = event.target
//     if (isNaN(input.value) || input.value <= 0) {
//         input.value = 1
//     }
//     updateTotal()
// }

// This Function updates the total Price of the cart.
// function updateTotal() {
//     const cartContainer = document.getElementsByClassName('cart__container')[0]
//     const cartRow = cartContainer.getElementsByClassName('cart__row')
//     let totalPrice = 0
//     for (let cartRows of cartRow) {
//         let totalCartPrice = cartRows.getElementsByClassName('total__price')[0]
//         let quantityElement = cartRows.getElementsByClassName('item__quantity')[0]
//         let price = parseFloat(totalCartPrice.innerText.replace('$', ''))
//         let quantity = quantityElement.value
//         totalPrice = totalPrice + (price * quantity)
//     }

//     document.getElementById('total__amount').innerText = 'TOTAL:' + ' ' + '$' + totalPrice.toFixed(2)
// }


function setIntialCart() {
    const cartContainer = document.getElementById("cart-container");
    const totalPrice = document.querySelector("#total__amount span");

    // we have to make a variable that equals an empty array, this is where we will consolidate our cart items
    let quantity = 0;
    let total = 0;
    let consolidated = [];

    const existingCart = JSON.parse(localStorage.getItem("cart"));

    if (existingCart) {
        for (const items of existingCart) {

            //check for matching entry values that triple equal items value
            const existingIndex = consolidated.findIndex((entry) => entry.cartItemH4 === items.cartItemH4);
            //if the existingIndex is greater then -1 that mean there was a match.
            if (existingIndex > -1) {
                // add quantity to existingIndex.
                consolidated[existingIndex].qty += +(items?.qty ?? 1);
            } else {
                // if no match then we need to push "items" as a new/type object and add a aditional param to add quantity. 
                consolidated.push({ ...items, qty: items?.qty ?? 1 });
            }
            quantity += +(items?.qty ?? 1);
            total += convertPriceType(items.cartItemPrice) * (items?.qty ?? 1);
        }


        // we want to set the consolidated cart into the localStorage.
        localStorage.setItem("cart", JSON.stringify(consolidated));


        for (let i = 0; i < consolidated.length; i++) {
            const product = consolidated[i];
            cartContainer.insertAdjacentHTML(
                "beforeend",
                `<div id="product-${i}" class="cart__row">
                <img class="product__img" src="${product.cartItemImg}" alt="">
                <div class="description__container">
                    <h4>${product.cartItemH4}</h4>
                    <p class="total__price">${typeof product.cartItemPrice === "string" ? product.cartItemPrice : "$".concat(product.cartItemPrice)}</p>
                    <input id="product-${i}-input" class="item__quantity" type="number" value="${product.qty}" />
                    <button class="remove__btn" onclick="removeConsolidated(${i})">
                        <a class="remove__button" href="#">Remove</a>
                    </button>
                </div>
                </div>`
            );
            // assign the input element inside of a variable
            const input = document.getElementById(`product-${i}-input`);
            // add eventLisener to listen for any change in value.
            input.addEventListener("change", () => modifyConsolidated(i, input.value));
        }

        //UPDATE THE TOTAL PRICE OF THE CART.
        totalPrice.innerHTML = `${total.toFixed(2)}`;
        document.querySelector("#cart-qty").innerHTML = `${quantity}`
    }
}

// we need to build the modifyConsolidated functions out side of the setIntialCart.
function modifyConsolidated(index, value) {

    //asign total and quantity 
    let total = 0;
    let quantity = 0;

    //use the DOM to get total pice and consolidatedCart
    const totalPrice = document.querySelector("#total__amount span");
    const existingConsolidated = JSON.parse(localStorage.getItem("cart"));

    //make the items.qty inside of the existingConsolidated equal value 
    existingConsolidated[index].qty = value;

    //persist to the localStorage
    localStorage.setItem("cart", JSON.stringify(existingConsolidated));

    //loop over the all the existing items in existingConsolidated 
    for (const items of existingConsolidated) {
        // update new total and quantity.
        total += convertPriceType(items.cartItemPrice) * (items?.qty ?? 1);
        quantity += +items.qty;
    }

    // set new total and quantity.
    totalPrice.innerHTML = `${total.toFixed(2)}`;
    document.querySelector("#cart-qty").innerHTML = `${quantity}`;

}

function removeConsolidated(i) {
    let total = 0;
    let quantity = 0;

    const totalPrice = document.querySelector("#total__amount span");

    const existingCart = JSON.parse(localStorage.getItem("cart"));

    if (existingCart) {
        existingCart.slice(i, 1);
        
        localStorage.setItem("cart", JSON.stringify(existingCart))
    }

    for (const items of existingCart) {
        total += Number.parseFloat(items.cartItemPrice.slice(1) * items?.qty ?? 1);
        quantity += items.qty;
    }
    //remove cartItem from the DOM
    document.getElementById(`product-${i}`).remove();
    //update the totalPrice
    totalPrice.innerHTML = `${total.toFixed(2)}`;
    //update the cart counter
    document.getElementById("cart-qty").innerHTML = `${quantity}`;
}


function convertPriceType(price) {
    return typeof price === "string" ? Number.parseFloat(price.slice(1)) : price;
}