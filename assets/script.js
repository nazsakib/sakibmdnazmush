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

    // --- PART 1: MATRIX INTRO QUOTE (Restored) ---
    const matrixQuote =
        "This is your last chance. After this, there is no turning back. You take the blue pill—the story ends, you wake up in your bed and believe whatever you want to believe. You take the red pill—you stay in Wonderland, and I show you how deep the rabbit hole goes. Remember, all I'm offering is the truth—nothing more.";

    let i = 0;
    const typeWriter = () => {
        if (i < matrixQuote.length) {
            quoteContainer.textContent += matrixQuote.charAt(i);
            i++;
            setTimeout(typeWriter, 30); // Typing speed
        } else {
            // Show pill choices after quote is done
            setTimeout(() => {
                pillChoice.style.display = "flex";
            }, 500);
        }
    };

    // Start the intro immediately
    typeWriter();

    // --- PART 2: BLUE PILL (10s Countdown: 7s Text + 3s Big Numbers) ---
    bluePill.addEventListener("click", () => {
        matrixIntro.classList.add("matrix-fade");

        setTimeout(() => {
            matrixIntro.classList.add("hidden");
            exitMessage.classList.remove("hidden");

            let timeLeft = 10;
            const countdownSpan = document.getElementById("countdown");

            const updateTimer = () => {
                timeLeft--;

                if (timeLeft > 3) {
                    // Phase 1: Small text countdown (10-4)
                    if (countdownSpan) countdownSpan.innerText = timeLeft;
                } else if (timeLeft === 3) {
                    // Phase 2: Switch to BIG numbers (3)
                    exitMessage.innerHTML = ""; // Clear text
                    const bigNumber = document.createElement("div");
                    bigNumber.className = "big-countdown";
                    bigNumber.id = "big-count";
                    bigNumber.innerText = timeLeft;
                    exitMessage.appendChild(bigNumber);
                } else if (timeLeft > 0) {
                    // Big numbers (2-1)
                    const bigNumber = document.getElementById("big-count");
                    if (bigNumber) bigNumber.innerText = timeLeft;
                } else {
                    // Time up (0)
                    clearInterval(timer);
                    try {
                        window.close();
                    } catch (e) {}
                    window.location.href = "about:blank";
                }
            };

            const timer = setInterval(updateTimer, 1000);
        }, 2000);
    });

    // --- PART 3: RED PILL (Smooth Terminal Boot) ---
    redPill.addEventListener("click", () => {
        matrixIntro.classList.add("matrix-fade");

        setTimeout(() => {
            matrixIntro.classList.add("hidden");
            terminal.classList.remove("hidden");

            // Setup: Clear output and hide prompt
            const outputDiv = document.getElementById("output");
            const commandLine = document.querySelector(".command-line");
            outputDiv.innerHTML = "";
            commandLine.classList.add("transparent");

            // Type Header
            const welcomeText = "WELCOME TO MY PORTFOLIO";
            const typeDelay = 80;

            const line1 = document.createElement("div");
            line1.className = "typing";
            outputDiv.appendChild(line1);

            let charIndex = 0;
            const typeInterval = setInterval(() => {
                line1.textContent += welcomeText.charAt(charIndex);
                charIndex++;

                if (charIndex >= welcomeText.length) {
                    clearInterval(typeInterval);
                    line1.classList.remove("typing");
                    line1.style.borderRight = "none";

                    // Fade in subtitle
                    setTimeout(() => {
                        const line2 = document.createElement("p");
                        line2.innerHTML =
                            "Type <strong>help</strong> to see available commands.";
                        line2.className = "fade-in-text";
                        outputDiv.appendChild(line2);

                        // Fade in Prompt
                        setTimeout(() => {
                            commandLine.classList.remove("transparent");
                            commandLine.classList.add("fade-in-text");
                            commandInput.focus();
                        }, 800);
                    }, 300);
                }
            }, typeDelay);
        }, 3000);
    });

    // --- PART 4: TERMINAL LOGIC (Streaming Text + History) ---
    let commandHistory = [];
    let historyIndex = -1;
    let isPrinting = false;

    // Helper: Stream text line-by-line
    const renderLineByLine = (sourceId, targetContainer) => {
        const sourceElement = document.getElementById(sourceId);
        if (!sourceElement) return 0;

        const lines = Array.from(sourceElement.children);
        let delay = 0;
        const lineDelay = 150;

        lines.forEach((line) => {
            setTimeout(() => {
                const clone = line.cloneNode(true);
                clone.classList.add("stream-text");
                targetContainer.appendChild(clone);
                window.scrollTo(0, document.body.scrollHeight);
            }, delay);
            delay += lineDelay;
        });

        return delay;
    };

    // Focus input on click
    terminal.addEventListener("click", () => {
        if (!isPrinting) commandInput.focus();
    });

    // Command Processing
    commandInput.addEventListener("keydown", function (event) {
        if (isPrinting) {
            event.preventDefault();
            return;
        }

        if (event.key === "ArrowUp") {
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                this.value =
                    commandHistory[commandHistory.length - 1 - historyIndex];
            }
            event.preventDefault();
        } else if (event.key === "ArrowDown") {
            if (historyIndex > 0) {
                historyIndex--;
                this.value =
                    commandHistory[commandHistory.length - 1 - historyIndex];
            } else {
                historyIndex = -1;
                this.value = "";
            }
        } else if (event.key === "Enter") {
            const command = this.value.trim().toLowerCase();

            if (command) {
                commandHistory.push(command);
                historyIndex = -1;
            }

            const response = document.createElement("div");
            response.className = "command-response";

            const commandEcho = document.createElement("div");
            commandEcho.classList.add("command-echo");
            commandEcho.innerHTML = `<span class="prompt">guest@portfolio:~$</span><span class="command-text">${command}</span>`;
            output.appendChild(commandEcho);
            output.appendChild(response);

            this.value = "";

            // Commands
            if (
                ["help", "about", "projects", "skills", "contact"].includes(
                    command,
                )
            ) {
                isPrinting = true;
                const totalTime = renderLineByLine(command, response);
                setTimeout(() => {
                    isPrinting = false;
                    commandInput.focus();
                }, totalTime);
            } else if (command === "clear") {
                output.innerHTML = "";
            } else if (command === "resume" || command === "download") {
                response.innerHTML =
                    "<p class='stream-text'>Initiating download sequence...</p><p class='stream-text' style='animation-delay: 0.5s'>Downloading <strong>sakib_resume.pdf</strong>...</p>";
                setTimeout(() => {
                    const link = document.createElement("a");
                    link.href = "assets/sakib_resume.pdf";
                    link.download = "Sakib_Nazmush_Resume.pdf";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }, 1000);
                // --- ADD THIS BLOCK ---
            } else if (
                command === "message" ||
                command === "email" ||
                command === "mail"
            ) {
                response.innerHTML =
                    "<p class='stream-text'>Opening your email client...</p>";

                // Wait 1 second, then open the mailto link
                setTimeout(() => {
                    window.location.href =
                        "mailto:sakibsnaz@gmail.com?subject=Hello from your Portfolio&body=Hi Sakib, I saw your portfolio and wanted to reach out.";
                }, 1000);

                // --- END OF NEW BLOCK ---
            } else if (command === "exit") {
                isPrinting = true;
                response.innerHTML =
                    "<p class='stream-text'>Terminating session...</p><p class='stream-text' style='animation-delay: 0.8s'>Logging out guest user...</p>";
                setTimeout(() => {
                    try {
                        window.close();
                    } catch (e) {}
                    window.location.href = "about:blank";
                }, 2000);
            } else if (command === "") {
                // Do nothing
            } else {
                response.innerHTML = `<p class='error stream-text'>Command not found: ${command}. Type 'help' for available commands.</p>`;
            }

            window.scrollTo(0, document.body.scrollHeight);
        }
    });
});
