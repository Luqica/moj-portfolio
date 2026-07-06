// --- DJ LUQICA SITE LOGIC ---

document.addEventListener('DOMContentLoaded', () => {
    initEqualizerRing();
    initBookingModal();
});

// --- EQUALIZER RING ANIMATION ---
function initEqualizerRing() {
    const eqContainer = document.getElementById('eq-container');
    if (!eqContainer) return;

    const numBars = 45;
    const radius = 135; // slightly larger than vinyl radius (130px)
    const centerX = 160;
    const centerY = 160;

    const bars = [];

    for (let i = 0; i < numBars; i++) {
        const angle = (i / numBars) * 2 * Math.PI;
        const bar = document.createElement('div');
        bar.className = 'eq-bar';

        // Position bar radially around the vinyl record
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        bar.style.left = `${x}px`;
        bar.style.top = `${y}px`;

        // Rotate the bar so it points outwards
        // We add 90 degrees (PI/2) because default divs are upright and transform-origin is bottom center
        const rotateAngle = angle * (180 / Math.PI) + 90;
        bar.style.transform = `translate(-50%, -100%) rotate(${rotateAngle}deg)`;
        
        eqContainer.appendChild(bar);
        bars.push(bar);
    }

    // Dynamic height simulation
    setInterval(() => {
        bars.forEach(bar => {
            // Generate random heights to look like active audio frequencies
            const randomHeight = Math.floor(10 + Math.random() * 45);
            bar.style.height = `${randomHeight}px`;
            
            // Randomize opacity slightly for digital feel
            bar.style.opacity = (0.5 + Math.random() * 0.5).toFixed(2);
        });
    }, 120);
}

// --- BOOKING MODAL LOGIC ---
function initBookingModal() {
    const btnBookNow = document.getElementById('btn-book-now');
    const modalOverlay = document.getElementById('booking-modal');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const bookingForm = document.getElementById('booking-form');

    if (!btnBookNow || !modalOverlay || !btnCloseModal || !bookingForm) return;

    // Open Modal
    btnBookNow.addEventListener('click', () => {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // lock scrolling
    });

    // Close Modal via 'X' Button
    btnCloseModal.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto'; // restore scrolling
    });

    // Close Modal when clicking outside the modal-card
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Form Submit handling (Sends email in the background via FormSubmit API)
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const senderEmail = document.getElementById('booking-email').value.trim();
        const shortMessage = document.getElementById('booking-message').value.trim();
        const submitBtn = bookingForm.querySelector('.modal-btn-submit');

        if (!senderEmail || !shortMessage) {
            alert('Please fill out all fields.');
            return;
        }

        // Disable button and show progress spinner
        submitBtn.disabled = true;
        const originalBtnContent = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

        const recipient = 'kolareklukabusiness@gmail.com';

        fetch(`https://formsubmit.co/ajax/${recipient}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                _subject: 'New DJ Booking Request',
                _replyto: senderEmail,
                email: senderEmail,
                message: shortMessage
            })
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network error on form submission');
        })
        .then(data => {
            alert('Booking request sent successfully! Note: Since this is the first submission, FormSubmit will send a confirmation/activation email to ' + recipient + '. Make sure to click the link inside that email to activate background forwarding.');
            
            // Reset form and close modal
            bookingForm.reset();
            modalOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        })
        .catch(err => {
            console.error('Error submitting form:', err);
            alert('Could not send booking request. Please try again or contact directly via: ' + recipient);
        })
        .finally(() => {
            // Restore button state
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnContent;
        });
    });
}
