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

    // Blue pill: 10s Total Countdown (7s Text + 3s Big Numbers)
    bluePill.addEventListener("click", () => {
        // 1. Start fade out
        matrixIntro.classList.add("matrix-fade");

        // 2. Wait 2 seconds for fade animation, then start sequence
        setTimeout(() => {
            matrixIntro.classList.add("hidden");
            exitMessage.classList.remove("hidden");

            // --- COUNTDOWN LOGIC ---
            let timeLeft = 10; // Start at 10 total seconds
            const countdownSpan = document.getElementById("countdown");

            // Update function
            const updateTimer = () => {
                timeLeft--; // Decrease time

                if (timeLeft > 3) {
                    // PHASE 1: Update the small text (Seconds 9 to 4)
                    if (countdownSpan) countdownSpan.innerText = timeLeft;
                } else if (timeLeft === 3) {
                    // PHASE 2: Switch to BIG Matrix Numbers (Seconds 3)
                    exitMessage.innerHTML = ""; // Clear the reading text

                    const bigNumber = document.createElement("div");
                    bigNumber.className = "big-countdown";
                    bigNumber.id = "big-count"; // Add ID to find it later
                    bigNumber.innerText = timeLeft;
                    exitMessage.appendChild(bigNumber);
                } else if (timeLeft > 0) {
                    // Continue BIG Countdown (Seconds 2 to 1)
                    const bigNumber = document.getElementById("big-count");
                    if (bigNumber) bigNumber.innerText = timeLeft;
                } else {
                    // Time is up (0) - Close
                    clearInterval(timer);
                    try {
                        window.close();
                    } catch (e) {
                        console.log("Browser prevented close");
                    }
                    window.location.href = "about:blank";
                }
            };

            // Run the timer every 1 second
            const timer = setInterval(updateTimer, 1000);
        }, 2000);
    });
    // // Blue pill: show exit message, wait, then show BIG countdown
    // bluePill.addEventListener("click", () => {
    //     // 1. Start the fade out animation
    //     matrixIntro.classList.add("matrix-fade");

    //     // 2. Wait 2 seconds for fade to finish, then show the text
    //     setTimeout(() => {
    //         matrixIntro.classList.add("hidden");
    //         exitMessage.classList.remove("hidden");

    //         // 3. Wait 2 MORE seconds (reading time), then switch to BIG countdown
    //         setTimeout(() => {
    //             // Clear the "You chose blue pill" text completely
    //             exitMessage.innerHTML = "";

    //             // Create the big number element
    //             const bigNumber = document.createElement("div");
    //             bigNumber.className = "big-countdown";
    //             bigNumber.innerText = "3";
    //             exitMessage.appendChild(bigNumber);

    //             // Start the countdown logic
    //             let timeLeft = 10;
    //             const timer = setInterval(() => {
    //                 timeLeft--;

    //                 if (timeLeft > 0) {
    //                     // Update the big number
    //                     bigNumber.innerText = timeLeft;
    //                 } else {
    //                     // Time is up (0) - Stop timer and close
    //                     clearInterval(timer);

    //                     try {
    //                         window.close();
    //                     } catch (e) {
    //                         console.log("Browser prevented close");
    //                     }
    //                     window.location.href = "about:blank";
    //                 }
    //             }, 1000); // Update every 1 second
    //         }, 7000); // 2-second delay before countdown starts
    //     }, 2000); // 2-second delay for fade out
    // });

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
