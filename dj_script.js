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
    const bars = [];

    for (let i = 0; i < numBars; i++) {
        const angle = (i / numBars) * 360; // Set angle in degrees directly
        const bar = document.createElement('div');
        bar.className = 'eq-bar';

        // Delegate radial positioning and rotation to CSS using variables
        bar.style.setProperty('--angle', `${angle}deg`);
        
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

    // Container references
    const formContainer = document.getElementById('booking-form-container');
    const successContainer = document.getElementById('booking-success-container');
    const errorMsg = document.getElementById('booking-error-msg');
    const btnSuccessClose = document.getElementById('btn-success-close');
    const modalTitle = document.getElementById('booking-modal-title');

    if (!btnBookNow || !modalOverlay || !btnCloseModal || !bookingForm) return;

    // Reset Modal Content to original Form view
    function resetModal() {
        bookingForm.reset();
        if (formContainer) formContainer.style.display = 'block';
        if (successContainer) successContainer.style.display = 'none';
        if (errorMsg) errorMsg.style.display = 'none';
        if (modalTitle) modalTitle.style.display = 'block';
    }

    // Open Modal
    btnBookNow.addEventListener('click', () => {
        resetModal();
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // lock scrolling
    });

    // Close Modal via 'X' Button
    btnCloseModal.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto'; // restore scrolling
    });

    // Close Modal via Success screen close button
    if (btnSuccessClose) {
        btnSuccessClose.addEventListener('click', () => {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }

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
            return;
        }

        // Disable button and show progress spinner
        submitBtn.disabled = true;
        const originalBtnContent = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
        if (errorMsg) errorMsg.style.display = 'none';

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
            // Smoothly switch views inside the modal
            if (formContainer) formContainer.style.display = 'none';
            if (modalTitle) modalTitle.style.display = 'none';
            if (successContainer) successContainer.style.display = 'block';
        })
        .catch(err => {
            console.error('Error submitting form:', err);
            if (errorMsg) errorMsg.style.display = 'block';
        })
        .finally(() => {
            // Restore button state
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnContent;
        });
    });
}

