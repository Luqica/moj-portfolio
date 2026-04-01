const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*+";
let interval = null;

const startGlitch = () => {
    const target = document.getElementById("glitch-text");
    
    // We get the final string from the data attribute or the text itself
    const finalValue = target.dataset.value || target.innerText;
    let iteration = 0;

    clearInterval(interval);

    interval = setInterval(() => {
        target.innerHTML = target.innerText
            .split("")
            .map((letter, index) => {
                // If we've passed this index, show the correct letter
                if (index < iteration) {
                    return finalValue[index];
                }
                // Otherwise, show a random character
                return letters[Math.floor(Math.random() * letters.length)];
            })
            .join("");

        // Stop the interval once we've reached the end of the string
        if (iteration >= finalValue.length) {
            clearInterval(interval);
        }

        iteration += 1 / 3;
    }, 65);
};

window.onload = startGlitch;