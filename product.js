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
	let addToCartButton = document.getElementsByClassName("display__btn");
	for (let buttons of addToCartButton) {
		buttons.addEventListener("click", addToCartClicked);
	}

	// check for existing cart
	const existingCart = JSON.parse(localStorage.getItem("cart"));

	if (existingCart) {
		// set cart quantity
		document.getElementById("cart-qty").innerHTML = `${existingCart.length}`;
	}
}

//this function will allow us add items into the our localStorageDB to pass over to our cart page.
function addToCartClicked(event) {
	let button = event.target;
	let shopItemPropertys = button.parentElement.parentElement.parentElement.parentElement;
	let h4 = shopItemPropertys.getElementsByClassName("title")[0].innerText;
	let img = shopItemPropertys.getElementsByClassName("product__img")[0].src;
	let price = shopItemPropertys.getElementsByClassName("price")[0].innerText;
	let cartItem = { cartItemImg: img, cartItemH4: h4, cartItemPrice: price };
	saveToLocalStorage(cartItem);
}

function saveToLocalStorage(cartItem) {
	// get existing cart item, if it exists, otherwise it will be null
	const existingCart = JSON.parse(localStorage.getItem("cart"));

	// update cart - used ternary operator to either update the existing array or create a new array with cartItem
	localStorage.setItem("cart", JSON.stringify(existingCart ? [...existingCart, cartItem] : [cartItem]));

	// commented out line from your original code
	// localStorage.setItem("cartItem", JSON.stringify(cartItem));

	// verify cart updated (just added to your original console.log)
	console.log(cartItem, JSON.parse(localStorage.getItem("cart")));
	// update cart quantity number
	document.getElementById("cart-qty").innerHTML = `${existingCart.length}`;
}
