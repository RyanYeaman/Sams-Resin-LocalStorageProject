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