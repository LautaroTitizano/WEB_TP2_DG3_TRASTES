/* ==========================================
   TRASTES - MAIN.JS
   Inspiración:
   Apple
   Nike Run+
   Awwwards
========================================== */

/* ==========================
   NAVBAR SCROLL
========================== */

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {

    if (window.scrollY > 60) {

        navbar.classList.add("scrolled");

    } else {

        navbar.classList.remove("scrolled");
    }

});

/* ==========================
   REVEAL ELEMENTS
========================== */

const revealElements = document.querySelectorAll(
    ".method-card, .model-card, .course, .part, .about, .testimonial, .gallery img, .process-item"
);

const revealObserver = new IntersectionObserver(

    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.classList.add("active");

            }

        });

    },

    {
        threshold: 0.15
    }

);

revealElements.forEach((element) => {

    element.classList.add("reveal");

    revealObserver.observe(element);

});

/* ==========================
   PARALLAX HERO
========================== */

const heroImage = document.querySelector(".hero-image img");

window.addEventListener("scroll", () => {

    const offset = window.pageYOffset;

    if (heroImage) {

        heroImage.style.transform =
            `translateY(${offset * 0.08}px)`;
    }

});

/* ==========================
   COURSE HOVER EFFECT
========================== */

const cards = document.querySelectorAll(".course");

cards.forEach(card => {

    card.addEventListener("mousemove", (e) => {

        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateY = (x - centerX) / 35;
        const rotateX = -(y - centerY) / 35;

        card.style.transform =
            `perspective(1200px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            translateY(-10px)`;

    });

    card.addEventListener("mouseleave", () => {

        card.style.transform =
            "perspective(1200px) rotateX(0deg) rotateY(0deg)";

    });

});

/* ==========================
   MODEL CARDS 3D
========================== */

const modelCards = document.querySelectorAll(".model-card");

modelCards.forEach(card => {

    card.addEventListener("mousemove", (e) => {

        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateY = (x - centerX) / 45;
        const rotateX = -(y - centerY) / 45;

        card.style.transform =
            `perspective(1200px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            translateY(-8px)`;

    });

    card.addEventListener("mouseleave", () => {

        card.style.transform =
            "perspective(1200px) rotateX(0deg) rotateY(0deg)";

    });

});

/* ==========================
   SMOOTH SECTION FADE
========================== */

const sections = document.querySelectorAll("section");

const sectionObserver = new IntersectionObserver(

    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0px)";
            }

        });

    },

    {
        threshold: 0.05
    }

);

sections.forEach(section => {

    section.style.opacity = "0";
    section.style.transform = "translateY(50px)";
    section.style.transition = "all 1s ease";

    sectionObserver.observe(section);

});

/* ==========================
   GALLERY IMAGE EFFECT
========================== */

const galleryImages = document.querySelectorAll(".gallery img");

galleryImages.forEach(image => {

    image.addEventListener("mouseenter", () => {

        image.style.filter = "grayscale(0%)";
        image.style.transform = "scale(1.02)";

    });

    image.addEventListener("mouseleave", () => {

        image.style.filter = "grayscale(100%)";
        image.style.transform = "scale(1)";

    });

});

/* ==========================
   COUNTER ANIMATION
========================== */

const counters = document.querySelectorAll(".stats strong");

const runCounter = (counter) => {

    const target =
        parseInt(counter.innerText.replace(/\D/g, ""));

    let current = 0;

    const increment = target / 80;

    const updateCounter = () => {

        if (current < target) {

            current += increment;

            counter.innerText =
                Math.ceil(current) + "+";

            requestAnimationFrame(updateCounter);

        } else {

            counter.innerText =
                target + "+";
        }

    };

    updateCounter();
};

const counterObserver = new IntersectionObserver(

    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                runCounter(entry.target);

                counterObserver.unobserve(entry.target);
            }

        });

    },

    {
        threshold: 0.5
    }

);

counters.forEach(counter => {

    counterObserver.observe(counter);

});

/* ==========================
   MAGNETIC BUTTONS
========================== */

const buttons = document.querySelectorAll(
    ".btn-primary, .btn-secondary"
);

buttons.forEach(button => {

    button.addEventListener("mousemove", (e) => {

        const rect = button.getBoundingClientRect();

        const x =
            e.clientX - rect.left - rect.width / 2;

        const y =
            e.clientY - rect.top - rect.height / 2;

        button.style.transform =
            `translate(${x * 0.12}px, ${y * 0.12}px)`;

    });

    button.addEventListener("mouseleave", () => {

        button.style.transform =
            "translate(0px,0px)";
    });

});

/* ==========================
   SCROLL PROGRESS BAR
========================== */

const progressBar = document.createElement("div");

progressBar.style.position = "fixed";
progressBar.style.top = "0";
progressBar.style.left = "0";
progressBar.style.height = "3px";
progressBar.style.width = "0%";
progressBar.style.zIndex = "99999";
progressBar.style.background = "#b87333";

document.body.appendChild(progressBar);

window.addEventListener("scroll", () => {

    const winScroll =
        document.documentElement.scrollTop;

    const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

    const scrolled =
        (winScroll / height) * 100;

    progressBar.style.width =
        scrolled + "%";

});

/* ==========================
   CTA PULSE
========================== */

const ctaButton =
    document.querySelector(".cta .btn-primary");

if (ctaButton) {

    setInterval(() => {

        ctaButton.animate(

            [

                {
                    transform: "scale(1)"
                },

                {
                    transform: "scale(1.05)"
                },

                {
                    transform: "scale(1)"
                }

            ],

            {

                duration: 1600
            }

        );

    }, 5000);

}

/* ==========================
   PAGE LOADED
========================== */

window.addEventListener("load", () => {

    document.body.classList.add("loaded");

    console.log(
        "TRASTES - Experience Loaded"
    );

});
