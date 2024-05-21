// Agrega un evento de clic a todas las imágenes
const images = document.querySelectorAll(".items img");

images.forEach((image) => {
  image.addEventListener("click", () => {
    const card = image.closest(".card");
    card.classList.toggle("is-flipped");
  });
});
