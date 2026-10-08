/*TRANSITION PARCOURS*/

const timelineItems = document.querySelectorAll(".timeline__item"); 


const observer = new IntersectionObserver((entries)=>
    entries.forEach((entry) =>{
        if(entry.isIntersecting) {
            const index = [...timelineItems].indexOf(entry.target); 

           entry.target.style.transitionDelay = `${index * 150}ms`;
            entry.target.classList.add("is-visible");
        }}
    )); 
    timelineItems.forEach((item)=>{
        observer.observe(item); 
    }); 
/*CHANGEMENT DE DATE */
const yearElement = document.querySelector("#year"); 
yearElement.textContent = new Date().getFullYear();

/*  MENU*/ 
    const header = document.querySelector(".site-header");

function showHeader() {
    header.classList.remove("site-header--hidden");
}

function hideHeader() {
    const atTop = window.scrollY < 100;                  // arriba del todo: nunca se esconde
    const inUse =
        header.matches(":hover") ||                      // el ratón está sobre el menú
        header.contains(document.activeElement);         // el foco del teclado está dentro
    if (atTop || inUse) return;
    header.classList.add("site-header--hidden");
}

// Se esconde al hacer scroll
window.addEventListener("scroll", hideHeader, { passive: true });

// Reaparece cuando el ratón se MUEVE de verdad
document.addEventListener("mousemove", (event) => {
    if (event.movementX !== 0 || event.movementY !== 0) showHeader();
});

// Reaparece con el teclado: Tab o foco dentro del menú
document.addEventListener("keydown", (event) => {
    if (event.key === "Tab") showHeader();
});
header.addEventListener("focusin", showHeader);