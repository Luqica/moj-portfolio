// Force scroll to top on refresh
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// Function to reset intro video and reload page
window.resetIntro = function() {
    sessionStorage.removeItem('introPlayed');
    window.location.reload();
};

// --- Intro Screen Logic ---
const introScreen = document.getElementById('intro-screen');
const videoDesktop = document.getElementById('video-desktop');
const videoMobile = document.getElementById('video-mobile');

function hideIntro() {
    introScreen.classList.add('hidden');
    document.body.style.overflow = 'auto';
    document.body.style.overflowX = 'hidden';
    sessionStorage.setItem('introPlayed', 'true');
    setTimeout(() => {
        introScreen.style.display = 'none';
    }, 1000);
}

// Check if intro has already been played in this session
if (sessionStorage.getItem('introPlayed') === 'true') {
    introScreen.style.display = 'none';
    document.body.style.overflow = 'auto';
    document.body.style.overflowX = 'hidden';
} else {
    // Lock scroll initially
    document.body.style.overflow = 'hidden';

    if (window.innerWidth >= 768) {
        if (videoDesktop) videoDesktop.onended = hideIntro;
    } else {
        if (videoMobile) videoMobile.onended = hideIntro;
    }

    // Fallback timeout
    setTimeout(hideIntro, 6000);
}

// --- Glitch Effect ---
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*+";

const startGlitch = (element) => {
    const finalValue = element.dataset.value;
    if (!finalValue) return;

    let iteration = 0;
    clearInterval(element.glitchInterval);

    element.glitchInterval = setInterval(() => {
        element.innerText = finalValue
            .split("")
            .map((letter, index) => {
                if (index < iteration) {
                    return finalValue[index];
                }
                return letters[Math.floor(Math.random() * letters.length)];
            })
            .join("");

        if (iteration >= finalValue.length) {
            clearInterval(element.glitchInterval);
        }

        iteration += 1 / 3;
    }, 40); // Slightly faster for a snappier feel
};

// --- Scroll Reveal with Intersection Observer ---
const revealElements = document.querySelectorAll('.reveal');

const revealOptions = {
    threshold: 0.15, // Trigger when 15% of element is visible
    rootMargin: "0px 0px -50px 0px"
};

const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            entry.target.classList.add('active');
            
            // If it has a glitch effect, trigger it when revealed
            const glitchText = entry.target.querySelector('.glitch-effect');
            if (glitchText) {
                startGlitch(glitchText);
            }

            observer.unobserve(entry.target);
        }
    });
}, revealOptions);

revealElements.forEach(el => {
    revealOnScroll.observe(el);
});

// --- Initialize on Load ---
window.addEventListener('load', () => {
    // Initial glitch for the main header (if it's not already handled by intersection observer)
    const mainHeader = document.querySelector('#home .glitch-effect');
    if (mainHeader) {
        setTimeout(() => {
            startGlitch(mainHeader);
        }, 500); // Slight delay for dramatic effect
    }
});

// --- Smooth Scrolling for Navigation ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});