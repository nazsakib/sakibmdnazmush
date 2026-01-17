document.addEventListener("DOMContentLoaded", () => {
    const matrixIntro = document.getElementById("matrix-intro");
    const terminal = document.getElementById("terminal");
    const commandInput = document.getElementById("command-input");
    const output = document.getElementById("output");
    const quoteContainer = document.getElementById("matrix-quote-container");
    const pillChoice = document.getElementById("pill-choice");
    const bluePill = document.querySelector(".blue-pill");
    const redPill = document.querySelector(".red-pill");
    const exitMessage = document.getElementById("exit-message");

    // Matrix intro text
    const matrixQuote =
        "This is your last chance. After this, there is no turning back. You take the blue pill—the story ends, you wake up in your bed and believe whatever you want to believe. You take the red pill—you stay in Wonderland, and I show you how deep the rabbit hole goes. Remember, all I'm offering is the truth—nothing more.";

    // Display Matrix quote with typewriter effect
    let i = 0;
    const typeWriter = () => {
        if (i < matrixQuote.length) {
            quoteContainer.textContent += matrixQuote.charAt(i);
            i++;
            setTimeout(typeWriter, 30); // Adjust typing speed here
        } else {
            // Show pill choices after quote is fully displayed
            setTimeout(() => {
                pillChoice.style.display = "flex";
            }, 500);
        }
    };

    // Start the typewriter effect
    typeWriter();

    // Blue pill: show exit message and then redirect
<<<<<<< HEAD
=======
    // Blue pill: show exit message and then redirect
>>>>>>> master
    bluePill.addEventListener("click", () => {
        // Hide the matrix intro
        matrixIntro.classList.add("matrix-fade");

<<<<<<< HEAD
        // Show the exit message after fade
=======
        // Wait for the fade animation (2 seconds), then show exit message
>>>>>>> master
        setTimeout(() => {
            matrixIntro.classList.add("hidden");
            exitMessage.classList.remove("hidden");

<<<<<<< HEAD
            // Set timeout to redirect after showing exit message
            setTimeout(() => {
                try {
                    window.close(); // Try to close the window (may not work in all browsers)
                } catch (e) {
                    // If window.close() fails, redirect to a blank page
                    window.location.href = "about:blank";
                }
            }, 5000);
=======
            // --- NEW COUNTDOWN LOGIC ---
            let timeLeft = 3; // Start countdown at 3
            const countdownElement = document.getElementById("countdown");

            // Update the timer every 1 second (1000ms)
            const timer = setInterval(() => {
                timeLeft--; // Decrease time

                // Update text on screen if element exists
                if (countdownElement) {
                    countdownElement.textContent = timeLeft;
                }

                // When time hits 0, stop timer and close
                if (timeLeft <= 0) {
                    clearInterval(timer);

                    // Attempt to close (This works if script opened window)
                    try {
                        window.close();
                    } catch (e) {
                        console.log("Browser prevented close");
                    }

                    // FALLBACK: Since browsers block window.close(),
                    // redirect to a blank page to simulate "exiting"
                    window.location.href = "about:blank";
                }
            }, 1000);
>>>>>>> master
        }, 2000);
    });

    // Red pill: proceed to terminal
    redPill.addEventListener("click", () => {
        matrixIntro.classList.add("matrix-fade");
        setTimeout(() => {
            matrixIntro.classList.add("hidden");
            terminal.classList.remove("hidden");
            commandInput.focus();
        }, 3000);
    });

    // Focus input when clicking anywhere on terminal
    terminal.addEventListener("click", () => {
        commandInput.focus();
    });

    // Process terminal commands
    commandInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            const command = this.value.trim().toLowerCase();
            const response = document.createElement("div");

            // Echo command with proper alignment
            const commandEcho = document.createElement("div");
            commandEcho.classList.add("command-echo");
            commandEcho.innerHTML = `<span class="prompt">guest@portfolio:~$</span><span class="command-text">${command}</span>`;
            output.appendChild(commandEcho);

            // Process command
            if (command === "help") {
                const helpContent = document
                    .getElementById("help")
                    .cloneNode(true);
                helpContent.classList.remove("hidden");
                response.appendChild(helpContent);
            } else if (command === "about") {
                const aboutContent = document
                    .getElementById("about")
                    .cloneNode(true);
                aboutContent.classList.remove("hidden");
                response.appendChild(aboutContent);
            } else if (command === "projects") {
                const projectsContent = document
                    .getElementById("projects")
                    .cloneNode(true);
                projectsContent.classList.remove("hidden");
                response.appendChild(projectsContent);
            } else if (command === "skills") {
                const skillsContent = document
                    .getElementById("skills")
                    .cloneNode(true);
                skillsContent.classList.remove("hidden");
                response.appendChild(skillsContent);
            } else if (command === "contact") {
                const contactContent = document
                    .getElementById("contact")
                    .cloneNode(true);
                contactContent.classList.remove("hidden");
                response.appendChild(contactContent);
            } else if (command === "clear") {
                while (output.firstChild) {
                    output.removeChild(output.firstChild);
                }
            } else if (command === "message") {
                response.innerHTML =
                    "<p>Message functionality would be implemented here with a form.</p>";
            } else if (command === "") {
                // Do nothing for empty command
            } else {
                response.innerHTML = `<p>Command not found: ${command}. Type 'help' for available commands.</p>`;
            }

            output.appendChild(response);

            // Clear input and scroll to bottom
            this.value = "";
            window.scrollTo(0, document.body.scrollHeight);
        }
    });
});
