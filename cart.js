const menu = document.querySelector("#mobile__menu");
const mainMenu = document.querySelector(".navbar__content");

menu.addEventListener("click", () => {
	menu.classList.toggle("is-active");
	mainMenu.classList.toggle("active");
});

if (document.readyState == "loading") {
	document.addEventListener("DOMContentLoaded", ready);
} else {
	ready();
}

function ready() {
	let removeItemButton = document.getElementsByClassName("remove__btn");
	for (let i = 0; i < removeItemButton.length; i++) {
		const button = removeItemButton[i];
		button.addEventListener("click", removeItem);
	}

	let quantityInputs = document.querySelectorAll(".item__quantity");
	for (let inputs of quantityInputs) {
		inputs.addEventListener("change", quantityChanged);
	}

	// check for existing cart
	const existingCart = JSON.parse(localStorage.getItem("cart"));

	if (existingCart) {
		// set cart quantity
		document.getElementById("cart-qty").innerHTML = `${existingCart.length}`;
	}

	setInitialCart();
	consolidateCart();
}

//this function removes items from the cart and updates the total price when removing items from the cart.
function removeItem(event) {
	const buttonClicked = event.target;
	buttonClicked.parentElement.parentElement.parentElement.remove(document.getElementsByClassName("cart__row")[0]);
	updateTotal();
}

//this function allows the total price to be updated when the quantity ipout is updated
function quantityChanged(event) {
	let input = event.target;
	if (isNaN(input.value) || input.value <= 0) {
		input.value = 1;
	}
	updateTotal();
}

// This Function updates the total Price of the cart.
function updateTotal() {
	const cartContainer = document.getElementsByClassName("cart__container")[0];
	const cartRow = cartContainer.getElementsByClassName("cart__row");
	let totalPrice = 0;
	for (let cartRows of cartRow) {
		let totalCartPrice = cartRows.getElementsByClassName("total__price")[0];
		let quantityElement = cartRows.getElementsByClassName("item__quantity")[0];
		let price = parseFloat(totalCartPrice.innerText.replace("$", ""));
		let quantity = quantityElement.value;
		totalPrice = totalPrice + price * quantity;
	}

	document.getElementById("total__amount").innerText = "TOTAL:" + " " + "$" + totalPrice.toFixed(2);
}

function extractCartItem(cartItem) {
	cartItem = JSON.parse(window.localStorage.getItem("cartItem"));

	// i have to come back and get the localStorage data to set inside of an element.
	let cartRow = document.getElementsByClassName("cart__container")[0];
	let newCartRow = document.createElement("div");
	newCartRow.classList.add("cart__row");
	newCartRow.innerHTML = `
            <img class="product__img"
                src="${cartItem.cartItemImg}'
            alt="">
            <div class="description__container">
                <h4>${cartItem.cartItemH4}</h4>
                <p class="total__price">${cartItem.cartItemPrice}</p>
                <input class="item__quantity" type="number" value="1">
                <button class="remove__btn"><a class="remove__button" href="#">Remove</a></button>
            </div> `;
	cartRow.append(newCartRow);
	updateTotal();
}


// FIRST VERSION OF HANDLING CART ---- lists out all added items in the cart individually, but does track quantity under the same item if updated in cart
// Note:  I did include a second set of functions that consolidate the same-named items under one entry below just incase that is more ideal to how this cart should work.
function setInitialCart() {
	const cartContainer = document.getElementById("cart-container");
	const totalSpan = document.querySelector("#total__amount span");

	let total = 0;

	const existingCart = JSON.parse(localStorage.getItem("cart"));
	if (existingCart) {
		// removed existing children
		cartContainer.replaceChildren("");
		// used this kind of for loop for the index number specifically
		for (let i = 0; i < existingCart.length; i++) {
            // added .qty on cart objects in other functions, so this is multiplying by that or 1 if .qty does not exist
			total += (Number.parseFloat(existingCart[i].cartItemPrice.slice(1)) * (existingCart[i]?.qty ?? 1));
			// add id attribute, interpolated info where needed, and added onclick to the remove button
			cartContainer.insertAdjacentHTML(
				"beforeend",
				`<div id='cart-item-${i}' class='cart__row'>
                    <img class='product__img' src=${existingCart[i].cartItemImg} alt='' />
                    <div class='description__container'>
                        <h4>${existingCart[i].cartItemH4}</h4>
                        <p class='total__price'>${existingCart[i].cartItemPrice}</p>
                        <input id='cart-item-${i}-input' class='item__quantity' type='number' min='1' value='${existingCart[i]?.qty ?? 1}' />
                        <button class='remove__btn' onclick="removeAndUpdateCart(${i})">
                            <a class='remove__button' href='#'>
                                Remove
                            </a>
                        </button>
                    </div>
                </div>`
			);
			// add input event listener here (since I was having issues adding it inline above)
			document.getElementById(`cart-item-${i}-input`).addEventListener("change", (e) => modifyCart(i, e.target.value));
		}

		totalSpan.innerHTML = `${total.toFixed(2)}`;
	}
}

function removeAndUpdateCart(index) {
	let updatedTotal = 0;
	// get existing cart state
	const existingCart = JSON.parse(localStorage.getItem("cart"));
	// modifies the actual existingCart variable in place and removes one element starting at the given index
	existingCart.splice(index, 1);
	// update localStorage with new state
	localStorage.setItem("cart", JSON.stringify(existingCart));

	// if you want to check
	// console.log(JSON.parse(localStorage.getItem("cart")));

	for (let product of existingCart) {
		updatedTotal += Number.parseFloat(product.cartItemPrice.slice(1));
	}

	// remove item to from DOM
	document.getElementById(`cart-item-${index}`).remove();
	// update total
	document.querySelector("#total__amount span").innerHTML = `${updatedTotal.toFixed(2)}`;
	// update cart quantity
	document.getElementById("cart-qty").innerHTML = `${existingCart.length}`;
	// window.location.reload();
}

function modifyCart(i, value) {
	let total = 0;
	let quantity = 0;
	const existingCart = JSON.parse(localStorage.getItem("cart"));
    // update quantity on cart item 
	existingCart[i].qty = value;
	// persist
	localStorage.setItem("cart", JSON.stringify(existingCart));

	for (const item of existingCart) {
		total += Number.parseFloat(item.cartItemPrice.slice(1)) * (item?.qty ?? 1);
        // the + in front of (item?... in the next line forces a type conversion if possible (i.e. from string to number, so we don't get a NaN)
		quantity += +(item?.qty ?? 1);
	}

	// update total
	document.querySelector("#total__amount span").innerHTML = `${total.toFixed(2)}`;
	// update cart quantity
	document.getElementById("cart-qty").innerHTML = `${quantity}`;
}


// SECOND VERSION OF HANDLING CART  --  example where duplicate-named cart items are consolidated under one entry.
// --------
// Note: this is not meant to work in conjunction with the above version of handling the cart.... It initially sets values based off of above cart's local storage, 
// but then tracks it's own values seperately, so it's values can become out of sync with the first implementation of cart items. I included it because I wasn't sure 
// exactly how the cart should behave, but thought it may be useful to include anyway. 

// --------

function consolidateCart() {
	const cartContainer = document.getElementById("consolidated-cart-example");
	const totalSpan = document.querySelector("#total__consolidated span");

	let total = 0;
	let quantity = 0;
	let consolidated = [];

	const existingCart = JSON.parse(localStorage.getItem("cart"));

	if (existingCart) {
        // checking each value of cart 
		for (const item of existingCart) {
            // look to see if our consolidated array has a matching entry
			const existingIndex = consolidated.findIndex((entry) => entry.cartItemH4 === item.cartItemH4);
            // if existing index is found (i.e. will not a number greater than -1), add item quantity or 1
			if (existingIndex > -1) {
				consolidated[existingIndex].qty += +(item?.qty ?? 1);
			} else {  // push "new" type/named object to consolidated
				consolidated.push({ ...item, qty: +(item?.qty ?? 1) });
			}

            // add to quantity & total sums
			quantity += +(item?.qty ?? 1);
			total += Number.parseFloat(item.cartItemPrice.slice(1)) * (item?.qty ?? 1);
		}

		// set consolidated values to localStorage (used different name to keep seperate for example)
		localStorage.setItem("consolidatedCart", JSON.stringify(consolidated));
		// populate consolidated example in another div below the first cart container 
		for (let i = 0; i < consolidated.length; i++) {
			const product = consolidated[i];
			cartContainer.insertAdjacentHTML(
				"beforeend",
				`<div id='product-${i}' class='cart__row'>
		            <img class='product__img' src=${product.cartItemImg} alt='' />
		            <div class='description__container'>
		                <h4>${product.cartItemH4}</h4>
		                <p class='total__price'>${product.cartItemPrice}</p>
		                <input id='product-${i}-input' class='item__quantity' type='number' min='1' value='${product.qty}' />
		                <button class='remove__btn' onclick="removeConsolidated(${i})">
		                    <a class='remove__button' href='#'>
		                        Remove
		                    </a>
		                </button>
		            </div>
		        </div>`
			);

			const input = document.getElementById(`product-${i}-input`);
			input.addEventListener("change", () => modifyConsolidated(i, input.value));
		}

        // update total in DOM (added value next to original value) -- should match cart value initially
		totalSpan.innerHTML = `${total.toFixed(2)}`;
	}
}

function modifyConsolidated(index, value) {
	let total = 0;
	let quantity = 0;
	const totalSpan = document.querySelector("#total__consolidated span");
	const existingConsolidated = JSON.parse(localStorage.getItem("consolidatedCart"));

	// update quantity
	existingConsolidated[index].qty = value;
	// persist to local storage
	localStorage.setItem("consolidatedCart", JSON.stringify(existingConsolidated));

	// get updated numbers
	for (const item of existingConsolidated) {
		total += Number.parseFloat(item.cartItemPrice.slice(1)) * item.qty;
		quantity += +item.qty;
	}

	// set new total in DOM
	totalSpan.innerHTML = `${total.toFixed(2)}`;
	// update cart quantity
	document.getElementById("cart-qty").innerHTML = `${quantity}`;
}

function removeConsolidated(i) {
	let total = 0;
	let quantity = 0;
	const totalSpan = document.querySelector("#total__consolidated span");

	// saved results of consolidated to the following localStorage (just to keep things separate for the sake of examples)
	const existingConsolidated = JSON.parse(localStorage.getItem("consolidatedCart"));
	// remove the item using matching index (i) for the starting point
	existingConsolidated.splice(i, 1);
	// persist to local storage
	localStorage.setItem("consolidatedCart", JSON.stringify(existingConsolidated));

	// get updated calculations
	for (const item of existingConsolidated) {
		total += Number.parseFloat(item.cartItemPrice.slice(1)) * item.qty;
		quantity += item.qty;
	}

	// remove all item entry from DOM
	document.getElementById(`product-${i}`).remove();
	// set new total in DOM
	totalSpan.innerHTML = `${total.toFixed(2)}`;
	// update cart quantity  --- cart quantity overrides so may be out of sync from other cart example
	document.getElementById("cart-qty").innerHTML = `${quantity}`;
}
