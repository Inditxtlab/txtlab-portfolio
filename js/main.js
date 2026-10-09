/* === FADE-IN AL CARGAR === */

document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll(
        '.hero'
    );
    
    setTimeout(() => {
        fadeElements.forEach((el) => {
            el.classList.add('is-visible');
        });
    }, 100);
});

/*TRANSITION PARCOURS*/

const timelineItems = document.querySelectorAll(".timeline__item"); 


const observer = new IntersectionObserver((entries)=>
    entries.forEach((entry) =>{
        if(entry.isIntersecting) {
            const index = [...timelineItems].indexOf(entry.target); 

           entry.target.style.transitionDelay = `${index * 150}ms`;
            entry.target.classList.add("is-visible");
            entry.target.addEventListener("transitionend", ()=>{
                entry.target.style.transitionDelay="";}, {once:true});
        }}
    )); 
    timelineItems.forEach((item)=>{
        observer.observe(item); 
    }); 
/*PROJECT CARDS*/
const projectRows = document.querySelectorAll(".project-row"); 
const projectObserver = new IntersectionObserver((entries)=>entries.forEach((entry)=>{
    if(entry.isIntersecting){
        const index=[...projectRows].indexOf(entry.target); 
        entry.target.style.transitionDelay = `${index * 150}ms`; 
        entry.target.classList.add("is-visible"); 
          entry.target.addEventListener("transitionend", ()=>{
                entry.target.style.transitionDelay="";}, {once:true});
        projectObserver.unobserve(entry.target); 
    }
})
); 
projectRows.forEach((row) => {
    projectObserver.observe(row); 
});

/*LEARN AND COMMINTMENT*/
const cards = document.querySelectorAll(".card-neutral, .card-accent");

const cardObserver = new IntersectionObserver((entries) =>
    entries.forEach((entry) => {
        if(entry.isIntersecting) {
            const index = [...cards].indexOf(entry.target); 
            entry.target.style.transitionDelay = `${index * 150}ms`;
            entry.target.classList.add("is-visible");
              entry.target.addEventListener("transitionend", ()=>{
                entry.target.style.transitionDelay="";}, {once:true});
            cardObserver.unobserve(entry.target);
        }
    })
);

cards.forEach((card) => {
    cardObserver.observe(card); 
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
    const atTop = window.scrollY < 100;
    const inUse =
    header.matches(":hover") ||
    header.querySelector(":focus-visible");
    if (atTop || inUse) return;
    header.classList.add("site-header--hidden");
}
window.addEventListener("scroll", hideHeader, { passive: true });
document.addEventListener("mousemove", (event) => {
    if (event.movementX !== 0 || event.movementY !== 0) showHeader();
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Tab") showHeader();
});
header.addEventListener("focusin", showHeader);

/* === MODAL MENTIONS LÉGALES === */

const mentionsModal = document.getElementById('mentions-modal');
const mentionsClose = document.getElementById('mentions-close');

// Abrir modal
document.querySelectorAll("[data-open-mentions]").forEach((link) => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        if (mentionsModal) {
            mentionsModal.hidden = false;
            mentionsClose.focus();
        }
    });
});

// Cerrar modal con el botón
if (mentionsClose) {
    mentionsClose.addEventListener('click', () => {
        if (mentionsModal) {
            mentionsModal.hidden = true;
        }
    });
}

// Cerrar modal al hacer clic fuera del contenido
if (mentionsModal) {
    mentionsModal.addEventListener('click', (e) => {
        if (e.target === mentionsModal) {
            mentionsModal.hidden = true;
        }
    });
}

// Cerrar modal con la tecla Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mentionsModal && !mentionsModal.hidden) {
        mentionsModal.hidden = true;
    }
});