const allToggle = document.querySelectorAll(".first-details");
const previousButton = document.querySelector("#previous-slide");
const nextButton = document.querySelector("#next-slide");
const slides = document.querySelectorAll(".hero-slide");
const pauseButton = document.querySelector("#toggle-slideshow")

allToggle.forEach((details) => {
    let answerAnimation;
    const summaryDet = details.querySelector("summary");
    summaryDet.addEventListener("click", () => {
        if (answerAnimation !== undefined)
            {answerAnimation.cancel()};
        if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
            {return}
        if(details.open === true)
            {return}
        const pSimmary = details.querySelector(".p-simmary")
        answerAnimation = pSimmary.animate(
        [{ opacity: 0 }, { opacity: 1 }],
        { duration: 1000, easing: "ease"});
    })
})

const gallery = document.querySelector(".section-first-main");

gallery.addEventListener("focusin", (event) => {
    if (event.target !== pauseButton) {
        stopSlideshow();
    }
});

let currentSlide = 0;
let isSlideChanging = false;
let slideshowTimer = null;

function showMSlide(index) {
    if (isSlideChanging || index === currentSlide) return;

    const oldSlide = slides[currentSlide];
    const newSlide = slides[index];

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        oldSlide.hidden = true;
        newSlide.hidden = false;
        currentSlide = index;
        return;
    }

    const direction =
        index === (currentSlide + 1) % slides.length ? 1 : -1;

    isSlideChanging = true;
    previousButton.disabled = true;
    nextButton.disabled = true;

    oldSlide.inert = true;
    newSlide.inert = true;
    newSlide.hidden = false;

    const options = {
        duration: 600,
        easing: "ease-in-out",
        fill: "forwards"
    };

    const outgoing = oldSlide.animate(
        [
            { transform: "translateX(0%)" },
            { transform: `translateX(${-100 * direction}%)` }
        ],
        options
    );

    const incoming = newSlide.animate(
        [
            { transform: `translateX(${100 * direction}%)` },
            { transform: "translateX(0%)" }
        ],
        options
    );

    incoming.onfinish = () => {
        oldSlide.hidden = true;

        outgoing.cancel();
        incoming.cancel();

        oldSlide.inert = false;
        newSlide.inert = false;

        currentSlide = index;
        isSlideChanging = false;
        previousButton.disabled = false;
        nextButton.disabled = false;
    };
}

function nextSlide (){
    let nextIndex = currentSlide; 
    nextIndex++;
    if(nextIndex === slides.length){
        nextIndex = 0;
    }
    showMSlide(nextIndex);
}



nextButton.addEventListener("click", ()=>{
    stopSlideshow();
    nextSlide ();
})

previousButton.addEventListener("click", ()=>{
    stopSlideshow();
    let nextIndex = currentSlide; 
    nextIndex--;
    if(nextIndex < 0){
        nextIndex = slides.length - 1;
    }
    showMSlide(nextIndex);
})

function stopSlideshow(){
    clearInterval(slideshowTimer);
    slideshowTimer = null;
    pauseButton.textContent = "Play slideshow";
}

function startSlideshow(){
   if(slideshowTimer !== null){
    return
   }
   if (window.matchMedia("(prefers-reduced-motion: reduce)").matches){
    return
   }
   slideshowTimer = setInterval(nextSlide, 8000);
   pauseButton.textContent = "Pause slideshow";
}

pauseButton.addEventListener("click", () => {
    if(slideshowTimer === null){
        startSlideshow();
    }
    else{
        stopSlideshow();
    }
})

startSlideshow();