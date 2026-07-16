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
    
    // Initialize glowing electric circuit background
    initCircuitBackground();
});

// --- Animated Electric Circuit Background ---
function initCircuitBackground() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const paths = [];
    const numPaths = 12;

    function createPath() {
        const points = [];
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        points.push({ x, y });

        const segments = 3 + Math.floor(Math.random() * 3);
        const step = 80 + Math.random() * 120;

        for (let i = 0; i < segments; i++) {
            const dir = Math.floor(Math.random() * 3);
            const signX = Math.random() > 0.5 ? 1 : -1;
            const signY = Math.random() > 0.5 ? 1 : -1;

            if (dir === 0) {
                x += step * signX;
            } else if (dir === 1) {
                y += step * signY;
            } else {
                x += step * 0.707 * signX;
                y += step * 0.707 * signY;
            }
            points.push({ x, y });
        }

        return {
            points,
            color: 'rgba(0, 240, 255, 0)', // Set wire color to transparent to blend with wallpaper
            pulseColor: 'rgba(0, 240, 255, 0.85)',
            pulseGlow: '#00f0ff',
            pulses: []
        };
    }

    for (let i = 0; i < numPaths; i++) {
        paths.push(createPath());
    }

    function spawnPulse() {
        const pathIndex = Math.floor(Math.random() * paths.length);
        const path = paths[pathIndex];
        if (path && path.pulses.length < 2) {
            path.pulses.push({
                progress: 0,
                speed: 0.003 + Math.random() * 0.005
            });
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        paths.forEach((path, pathIndex) => {
            const firstPt = path.points[0];
            if (firstPt.x < -200 || firstPt.x > canvas.width + 200 || firstPt.y < -200 || firstPt.y > canvas.height + 200) {
                paths[pathIndex] = createPath();
                return;
            }
            // Base wire stroke and connection nodes are omitted to allow the electron pulses 
            // to blend seamlessly and travel strictly along the background wallpaper's printed lines.

            for (let p = path.pulses.length - 1; p >= 0; p--) {
                const pulse = path.pulses[p];
                pulse.progress += pulse.speed;

                if (pulse.progress >= 1) {
                    path.pulses.splice(p, 1);
                    continue;
                }

                const currentSegment = pulse.progress * (path.points.length - 1);
                const segmentIdx = Math.floor(currentSegment);
                const segmentProgress = currentSegment - segmentIdx;

                const p1 = path.points[segmentIdx];
                const p2 = path.points[segmentIdx + 1];

                if (p1 && p2) {
                    const px = p1.x + (p2.x - p1.x) * segmentProgress;
                    const py = p1.y + (p2.y - p1.y) * segmentProgress;

                    ctx.shadowBlur = 10;
                    ctx.shadowColor = path.pulseGlow;
                    ctx.beginPath();
                    ctx.arc(px, py, 3, 0, Math.PI * 2);
                    ctx.fillStyle = path.pulseColor;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            }
        });

        if (Math.random() < 0.0035) {
            spawnPulse();
        }

        requestAnimationFrame(animate);
    }

    animate();
}

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