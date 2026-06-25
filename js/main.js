/*====================================================

TRASTES
MAIN.JS

Author
2026

====================================================*/


/*========================================
            VARIABLES
========================================*/

const body = document.body;

const header = document.querySelector(".header");

const sections = document.querySelectorAll("section");

const heroImage = document.querySelector(".hero-image img");



/*========================================
            LOADER
========================================*/

window.addEventListener("load", ()=>{

    body.classList.add("loaded");

});


/*========================================
            NAVBAR
========================================*/

function navbarScroll(){

    if(window.scrollY > 40){

        header.classList.add("scrolled");

    }

    else{

        header.classList.remove("scrolled");

    }

}

window.addEventListener("scroll",navbarScroll);



/*========================================
        SCROLL PROGRESS BAR
========================================*/

const progress = document.createElement("div");

progress.className="progress-bar";

document.body.appendChild(progress);

window.addEventListener("scroll",()=>{

    const scrollTop =
    document.documentElement.scrollTop;

    const height =
    document.documentElement.scrollHeight-
    document.documentElement.clientHeight;

    const value =
    scrollTop/height*100;

    progress.style.width=value+"%";

});



/*========================================
            REVEAL
========================================*/

const revealItems=document.querySelectorAll(

".method-item,.step,.course-card,.piece-item,.testimonial-card,.gallery figure,.cta"

);

const revealObserver=new IntersectionObserver(

(entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("active");

}

});

},

{

threshold:.15

}

);

revealItems.forEach(item=>{

item.classList.add("reveal");

revealObserver.observe(item);

});



/*========================================
            HERO PARALLAX
========================================*/

window.addEventListener("scroll",()=>{

const offset=window.pageYOffset;

if(heroImage){

heroImage.style.transform=

`translateY(${offset*.12}px) scale(1.04)`;

}

});



/*========================================
        HERO TITLE EFFECT
========================================*/

const heroTitle=document.querySelector("h1");

if(heroTitle){

heroTitle.style.opacity=0;

heroTitle.style.transform="translateY(80px)";

window.addEventListener("load",()=>{

setTimeout(()=>{

heroTitle.style.transition="1.2s";

heroTitle.style.opacity=1;

heroTitle.style.transform="translateY(0px)";

},300);

});

}



/*========================================
        HERO PARAGRAPH
========================================*/

const heroParagraph=document.querySelector(".hero-content p");

if(heroParagraph){

heroParagraph.style.opacity=0;

heroParagraph.style.transform="translateY(40px)";

window.addEventListener("load",()=>{

setTimeout(()=>{

heroParagraph.style.transition="1s";

heroParagraph.style.opacity=1;

heroParagraph.style.transform="translateY(0px)";

},900);

});

}



/*========================================
        HERO BUTTONS
========================================*/

const heroButtons=document.querySelector(".hero-buttons");

if(heroButtons){

heroButtons.style.opacity=0;

heroButtons.style.transform="translateY(40px)";

window.addEventListener("load",()=>{

setTimeout(()=>{

heroButtons.style.transition=".8s";

heroButtons.style.opacity=1;

heroButtons.style.transform="translateY(0px)";

},1300);

});

}



/*========================================
        REVEAL UTILITY
========================================*/

const utilityObserver=new IntersectionObserver(

(entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.style.opacity=1;

entry.target.style.transform="translateY(0px)";

}

});

},

{

threshold:.08

}

);

sections.forEach(section=>{

section.style.opacity=0;

section.style.transform="translateY(70px)";

section.style.transition="all 1.1s ease";

utilityObserver.observe(section);

});
/*====================================================
        CURSOR PERSONALIZADO
====================================================*/

const cursor = document.createElement("div");

cursor.classList.add("cursor");

document.body.appendChild(cursor);

document.addEventListener("mousemove",(e)=>{

    cursor.style.left=e.clientX+"px";

    cursor.style.top=e.clientY+"px";

});

const hoverElements=document.querySelectorAll(

"a, button, .course-card, .piece-item, .gallery figure"

);

hoverElements.forEach(item=>{

    item.addEventListener("mouseenter",()=>{

        cursor.classList.add("active");

    });

    item.addEventListener("mouseleave",()=>{

        cursor.classList.remove("active");

    });

});



/*====================================================
            BOTONES MAGNÉTICOS
====================================================*/

const magneticButtons=document.querySelectorAll(

".button-primary,.button-secondary,.button-nav"

);

magneticButtons.forEach(button=>{

button.addEventListener("mousemove",(e)=>{

const rect=button.getBoundingClientRect();

const x=e.clientX-rect.left-rect.width/2;

const y=e.clientY-rect.top-rect.height/2;

button.style.transform=

`translate(${x*.18}px,${y*.18}px)`;

});

button.addEventListener("mouseleave",()=>{

button.style.transform="translate(0,0)";

});

});



/*====================================================
        TARJETAS 3D
====================================================*/

const cards=document.querySelectorAll(

".course-card,.method-item,.testimonial-card"

);

cards.forEach(card=>{

card.addEventListener("mousemove",(e)=>{

const rect=card.getBoundingClientRect();

const x=e.clientX-rect.left;

const y=e.clientY-rect.top;

const rotateY=(x-rect.width/2)/18;

const rotateX=(rect.height/2-y)/18;

card.style.transform=

`perspective(1000px)
 rotateX(${rotateX}deg)
 rotateY(${rotateY}deg)
 translateY(-10px)`;

});

card.addEventListener("mouseleave",()=>{

card.style.transform=

"perspective(1000px) rotateX(0deg) rotateY(0deg)";

});

});



/*====================================================
        IMAGEN HERO ZOOM
====================================================*/

if(heroImage){

heroImage.addEventListener("mouseenter",()=>{

heroImage.style.transform="scale(1.08)";

});

heroImage.addEventListener("mouseleave",()=>{

heroImage.style.transform="scale(1)";

});

}



/*====================================================
        GALERÍA HOVER
====================================================*/

const galleryImages=document.querySelectorAll(

".gallery-grid figure"

);

galleryImages.forEach(image=>{

image.addEventListener("mousemove",(e)=>{

const rect=image.getBoundingClientRect();

const x=(e.clientX-rect.left)/rect.width;

const y=(e.clientY-rect.top)/rect.height;

image.style.transform=

`rotateX(${(0.5-y)*8}deg)
 rotateY(${(x-.5)*8}deg)
 scale(1.04)`;

});

image.addEventListener("mouseleave",()=>{

image.style.transform=

"rotateX(0deg) rotateY(0deg) scale(1)";

});

});



/*====================================================
        VIDEO SECTION
====================================================*/

const videoSection=document.querySelector(

".video-section"

);

function darkTransition(){

if(!videoSection) return;

const rect=videoSection.getBoundingClientRect();

const trigger=window.innerHeight*0.45;

if(rect.top<trigger){

body.classList.add("dark-mode");

videoSection.classList.add("dark");

}else{

body.classList.remove("dark-mode");

videoSection.classList.remove("dark");

}

}

window.addEventListener("scroll",darkTransition);



/*====================================================
        VIDEO PARALLAX
====================================================*/

const video=document.querySelector(

".video-player video"

);

window.addEventListener("scroll",()=>{

if(!video) return;

const rect=video.getBoundingClientRect();

const center=window.innerHeight/2;

const distance=(center-rect.top)*0.00045;

const scale=1+distance;

video.style.transform=

`scale(${Math.max(1,Math.min(scale,1.15))})`;

});



/*====================================================
        PIECES HOVER
====================================================*/

const pieces=document.querySelectorAll(

".piece-item"

);

pieces.forEach(item=>{

item.addEventListener("mouseenter",()=>{

item.style.background="#f7f2eb";

});

item.addEventListener("mouseleave",()=>{

item.style.background="transparent";

});

});



/*====================================================
        HEADER LINKS
====================================================*/

const navLinks=document.querySelectorAll(

'.navigation a[href^="#"]'

);

navLinks.forEach(link=>{

link.addEventListener("click",(e)=>{

e.preventDefault();

const target=document.querySelector(

link.getAttribute("href")

);

if(target){

target.scrollIntoView({

behavior:"smooth"

});

}

});

});
/*====================================================
            CONTADORES ANIMADOS
====================================================*/

const counters = document.querySelectorAll("[data-counter]");

function animateCounter(counter){

    const target = Number(counter.dataset.counter);

    let current = 0;

    const increment = target / 80;

    const timer = setInterval(()=>{

        current += increment;

        if(current >= target){

            current = target;

            clearInterval(timer);

        }

        counter.textContent = Math.floor(current);

    },16);

}

const counterObserver = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            animateCounter(entry.target);

            counterObserver.unobserve(entry.target);

        }

    });

},{threshold:.6});

counters.forEach(counter=>counterObserver.observe(counter));



/*====================================================
            APARICIÓN ESCALONADA
====================================================*/

const staggerGroups = document.querySelectorAll(".courses-grid,.testimonial-grid,.gallery-grid");

staggerGroups.forEach(group=>{

    const children = group.children;

    [...children].forEach((item,index)=>{

        item.style.transitionDelay = `${index * 120}ms`;

    });

});



/*====================================================
            BOTÓN VOLVER ARRIBA
====================================================*/

const topButton = document.createElement("button");

topButton.className = "scroll-top";

topButton.innerHTML = "↑";

document.body.appendChild(topButton);

window.addEventListener("scroll",()=>{

    if(window.scrollY > 900){

        topButton.classList.add("visible");

    }else{

        topButton.classList.remove("visible");

    }

});

topButton.addEventListener("click",()=>{

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

});



/*====================================================
            LAZY LOADING IMÁGENES
====================================================*/

const lazyImages = document.querySelectorAll("img");

const lazyObserver = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.classList.add("loaded");

            lazyObserver.unobserve(entry.target);

        }

    });

},{threshold:.1});

lazyImages.forEach(image=>lazyObserver.observe(image));



/*====================================================
            EFECTO PARALLAX GENERAL
====================================================*/

const parallaxItems = document.querySelectorAll("[data-parallax]");

window.addEventListener("scroll",()=>{

    const scroll = window.pageYOffset;

    parallaxItems.forEach(item=>{

        const speed = Number(item.dataset.parallax) || .15;

        item.style.transform = `translateY(${scroll * speed}px)`;

    });

});



/*====================================================
            EFECTO EN TÍTULOS
====================================================*/

const titles = document.querySelectorAll("h2");

const titleObserver = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.classList.add("active-title");

        }

    });

},{threshold:.4});

titles.forEach(title=>titleObserver.observe(title));



/*====================================================
            NAV LINK ACTIVO
====================================================*/

const menuLinks = document.querySelectorAll(".navigation a");

window.addEventListener("scroll",()=>{

    let currentSection = "";

    sections.forEach(section=>{

        const top = section.offsetTop - 180;

        if(window.scrollY >= top){

            currentSection = section.getAttribute("id");

        }

    });

    menuLinks.forEach(link=>{

        link.classList.remove("active");

        if(link.getAttribute("href") === "#" + currentSection){

            link.classList.add("active");

        }

    });

});



/*====================================================
            RANDOM FLOAT
====================================================*/

const floatingCards = document.querySelectorAll(".course-card");

floatingCards.forEach(card=>{

    let direction = 1;

    setInterval(()=>{

        card.style.transform = `translateY(${direction * 6}px)`;

        direction *= -1;

    },2500);

});



/*====================================================
            OPTIMIZACIÓN RAF
====================================================*/

let ticking = false;

function updateScroll(){

    navbarScroll();

    darkTransition();

    ticking = false;

}

window.addEventListener("scroll",()=>{

    if(!ticking){

        window.requestAnimationFrame(updateScroll);

        ticking = true;

    }

});



/*====================================================
            RESIZE
====================================================*/

window.addEventListener("resize",()=>{

    navbarScroll();

    darkTransition();

});



/*====================================================
            INIT
====================================================*/

function init(){

    navbarScroll();

    darkTransition();

    console.log("TRASTES — Ready");

}

init();
/*====================================================
            CONTADORES ANIMADOS
====================================================*/

const counters = document.querySelectorAll("[data-counter]");

function animateCounter(counter){

    const target = Number(counter.dataset.counter);

    let current = 0;

    const increment = target / 80;

    const timer = setInterval(()=>{

        current += increment;

        if(current >= target){

            current = target;

            clearInterval(timer);

        }

        counter.textContent = Math.floor(current);

    },16);

}

const counterObserver = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            animateCounter(entry.target);

            counterObserver.unobserve(entry.target);

        }

    });

},{threshold:.6});

counters.forEach(counter=>counterObserver.observe(counter));



/*====================================================
            APARICIÓN ESCALONADA
====================================================*/

const staggerGroups = document.querySelectorAll(".courses-grid,.testimonial-grid,.gallery-grid");

staggerGroups.forEach(group=>{

    const children = group.children;

    [...children].forEach((item,index)=>{

        item.style.transitionDelay = `${index * 120}ms`;

    });

});



/*====================================================
            BOTÓN VOLVER ARRIBA
====================================================*/

const topButton = document.createElement("button");

topButton.className = "scroll-top";

topButton.innerHTML = "↑";

document.body.appendChild(topButton);

window.addEventListener("scroll",()=>{

    if(window.scrollY > 900){

        topButton.classList.add("visible");

    }else{

        topButton.classList.remove("visible");

    }

});

topButton.addEventListener("click",()=>{

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

});



/*====================================================
            LAZY LOADING IMÁGENES
====================================================*/

const lazyImages = document.querySelectorAll("img");

const lazyObserver = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.classList.add("loaded");

            lazyObserver.unobserve(entry.target);

        }

    });

},{threshold:.1});

lazyImages.forEach(image=>lazyObserver.observe(image));



/*====================================================
            EFECTO PARALLAX GENERAL
====================================================*/

const parallaxItems = document.querySelectorAll("[data-parallax]");

window.addEventListener("scroll",()=>{

    const scroll = window.pageYOffset;

    parallaxItems.forEach(item=>{

        const speed = Number(item.dataset.parallax) || .15;

        item.style.transform = `translateY(${scroll * speed}px)`;

    });

});



/*====================================================
            EFECTO EN TÍTULOS
====================================================*/

const titles = document.querySelectorAll("h2");

const titleObserver = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.classList.add("active-title");

        }

    });

},{threshold:.4});

titles.forEach(title=>titleObserver.observe(title));



/*====================================================
            NAV LINK ACTIVO
====================================================*/

const menuLinks = document.querySelectorAll(".navigation a");

window.addEventListener("scroll",()=>{

    let currentSection = "";

    sections.forEach(section=>{

        const top = section.offsetTop - 180;

        if(window.scrollY >= top){

            currentSection = section.getAttribute("id");

        }

    });

    menuLinks.forEach(link=>{

        link.classList.remove("active");

        if(link.getAttribute("href") === "#" + currentSection){

            link.classList.add("active");

        }

    });

});



/*====================================================
            RANDOM FLOAT
====================================================*/

const floatingCards = document.querySelectorAll(".course-card");

floatingCards.forEach(card=>{

    let direction = 1;

    setInterval(()=>{

        card.style.transform = `translateY(${direction * 6}px)`;

        direction *= -1;

    },2500);

});



/*====================================================
            OPTIMIZACIÓN RAF
====================================================*/

let ticking = false;

function updateScroll(){

    navbarScroll();

    darkTransition();

    ticking = false;

}

window.addEventListener("scroll",()=>{

    if(!ticking){

        window.requestAnimationFrame(updateScroll);

        ticking = true;

    }

});



/*====================================================
            RESIZE
====================================================*/

window.addEventListener("resize",()=>{

    navbarScroll();

    darkTransition();

});



/*====================================================
            INIT
====================================================*/

function init(){

    navbarScroll();

    darkTransition();

    console.log("TRASTES — Ready");

}

init();