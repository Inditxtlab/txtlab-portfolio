/* === FADE-IN AL CARGAR === */

document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll(
        '.site-header, .hero'
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
        }}
    )); 
    timelineItems.forEach((item)=>{
        observer.observe(item); 
    }); 

const projectRows = document.querySelectorAll(".project-row"); 
const projectObserver = new IntersectionObserver((entries)=>entries.forEach((entry)=>{
    if(entry.isIntersecting){
        const index=[...projectRows].indexOf(entry.target); 
        entry.target.style.transitionDelay = `${index * 150}ms`; 
        entry.target.classList.add("is-visible"); 
        projectObserver.unobserve(entry.target); 
    }
})
); 
projectRows.forEach((row) => {
    projectObserver.observe(row); 
});


const cards = document.querySelectorAll(".card-neutral, .card-accent");

const cardObserver = new IntersectionObserver((entries) =>
    entries.forEach((entry) => {
        if(entry.isIntersecting) {
            const index = [...cards].indexOf(entry.target); 
            entry.target.style.transitionDelay = `${index * 150}ms`;
            entry.target.classList.add("is-visible");
            cardObserver.unobserve(entry.target); // Solo una vez
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
        header.contains(document.activeElement);
    if (atTop || inUse) return;
    header.classList.add("site-header--hidden");
window.addEventListener("scroll", hideHeader, { passive: true });
document.addEventListener("mousemove", (event) => {
    if (event.movementX !== 0 || event.movementY !== 0) showHeader();
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Tab") showHeader();
});
header.addEventListener("focusin", showHeader);
}

// Abrir modal al hacer clic en "Mentions légales"
document.querySelector('.site-footer__legal').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('mentions').hidden = false;
});

/* === MODAL MENTIONS LÉGALES === */

const mentionsModal = document.getElementById('mentions-modal');
const mentionsLink = document.querySelector('.site-footer__legal');
const mentionsClose = document.getElementById('mentions-close');

// Abrir modal
if (mentionsLink) {
    mentionsLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (mentionsModal) {
            mentionsModal.hidden = false;
        }
    });
}

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
