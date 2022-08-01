const totalPrice = document.getElementById("total-price");
const existingCart = JSON.parse(localStorage.getItem("cart"));

let total = 0;

if (existingCart) {
    for (let item of existingCart) {
        console.log(total += item.cartItemPrice.slice(1) * item.qty)
    }
}
totalPrice.innerHTML = `Total: ${total}`;
