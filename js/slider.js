const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
let currentIndex = 0;

function updateSlider() {
    const slideWidth = slides[0].clientWidth;
    slider.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlider();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlider();
}

const prevButton = document.getElementById('prevBtn');
const nextButton = document.getElementById('nextBtn');

prevButton.addEventListener('click', prevSlide);
nextButton.addEventListener('click', nextSlide);

setInterval(nextSlide, 3000); 

updateSlider();