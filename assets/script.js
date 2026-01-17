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

    // --- SETUP: SOUND EFFECTS ---
    // Ensure you have 'keypress.mp3' in your assets folder
    const keySound = new Audio("assets/keypress.mp3");
    keySound.volume = 0.3; // Adjust volume (0.0 to 1.0)
    // --- SETUP: MATRIX RAIN EFFECT ---
    const canvas = document.getElementById("matrix-rain");
    const ctx = canvas.getContext("2d");

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Characters to use (Katakana + Latin + Numbers)
    const katakana =
        "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン";
    const latin = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const nums = "0123456789";
    const alphabet = katakana + latin + nums;

    const fontSize = 16;
    const columns = canvas.width / fontSize; // Number of columns

    const rainDrops = [];
    // Initialize drops
    for (let x = 0; x < columns; x++) {
        rainDrops[x] = 1;
    }

    const drawRain = () => {
        // Black background with slight opacity to create "trail" effect
        ctx.fillStyle = "rgba(13, 13, 13, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#0F0"; // Green text
        ctx.font = fontSize + "px monospace";

        for (let i = 0; i < rainDrops.length; i++) {
            const text = alphabet.charAt(
                Math.floor(Math.random() * alphabet.length),
            );
            ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

            // Reset drop to top randomly
            if (
                rainDrops[i] * fontSize > canvas.height &&
                Math.random() > 0.975
            ) {
                rainDrops[i] = 0;
            }
            rainDrops[i]++;
        }
    };

    // Run animation
    setInterval(drawRain, 30);

    // Handle resize
    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    // --- PART 1: MATRIX INTRO QUOTE ---
    const matrixQuote =
        "This is your last chance. After this, there is no turning back. You take the blue pill—the story ends, you wake up in your bed and believe whatever you want to believe. You take the red pill—you stay in Wonderland, and I show you how deep the rabbit hole goes. Remember, all I'm offering is the truth—nothing more.";

    let i = 0;
    const typeWriter = () => {
        if (i < matrixQuote.length) {
            quoteContainer.textContent += matrixQuote.charAt(i);
            i++;
            setTimeout(typeWriter, 30); // Typing speed
        } else {
            setTimeout(() => {
                pillChoice.style.display = "flex";
            }, 500);
        }
    };
    typeWriter();

    // --- PART 2: BLUE PILL LOGIC (10s Countdown) ---
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
                    if (countdownSpan) countdownSpan.innerText = timeLeft;
                } else if (timeLeft === 3) {
                    exitMessage.innerHTML = "";
                    const bigNumber = document.createElement("div");
                    bigNumber.className = "big-countdown";
                    bigNumber.id = "big-count";
                    bigNumber.innerText = timeLeft;
                    exitMessage.appendChild(bigNumber);
                } else if (timeLeft > 0) {
                    const bigNumber = document.getElementById("big-count");
                    if (bigNumber) bigNumber.innerText = timeLeft;
                } else {
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

    // --- PART 3: RED PILL LOGIC (Smooth Boot) ---
    redPill.addEventListener("click", () => {
        matrixIntro.classList.add("matrix-fade");
        setTimeout(() => {
            matrixIntro.classList.add("hidden");
            terminal.classList.remove("hidden");

            const outputDiv = document.getElementById("output");
            const commandLine = document.querySelector(".command-line");
            outputDiv.innerHTML = "";
            commandLine.classList.add("transparent");

            const welcomeText = "WELCOME TO MY PORTFOLIO";
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
                    setTimeout(() => {
                        const line2 = document.createElement("p");
                        line2.innerHTML =
                            "Type <strong>help</strong> to see available commands.";
                        line2.className = "fade-in-text";
                        outputDiv.appendChild(line2);
                        setTimeout(() => {
                            commandLine.classList.remove("transparent");
                            commandLine.classList.add("fade-in-text");
                            commandInput.focus();
                        }, 800);
                    }, 300);
                }
            }, 80);
        }, 3000);
    });

    // --- PART 4: TERMINAL FUNCTIONS ---
    let commandHistory = [];
    let historyIndex = -1;
    let isPrinting = false;

    // Helper: Mobile Focus Fix
    commandInput.addEventListener("focus", () => {
        setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight);
        }, 300);
    });

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

    // Focus input on terminal click
    terminal.addEventListener("click", () => {
        if (!isPrinting) commandInput.focus();
    });

    // --- PART 5: INPUT HANDLING (Sound, History, Tab, Exec) ---
    commandInput.addEventListener("keydown", function (event) {
        if (isPrinting) {
            event.preventDefault();
            return;
        }

        // 1. Play Typing Sound
        // Clone node allows overlapping sounds for fast typing
        const soundClone = keySound.cloneNode();
        soundClone.play().catch(() => {}); // Catch errors if browser blocks autoplay

        // 2. Tab Autocomplete
        if (event.key === "Tab") {
            event.preventDefault();
            const currentInput = this.value.trim().toLowerCase();
            const availableCommands = [
                "help",
                "about",
                "projects",
                "skills",
                "contact",
                "clear",
                "resume",
                "message",
                "exit",
            ];
            const match = availableCommands.find((cmd) =>
                cmd.startsWith(currentInput),
            );
            if (match) {
                this.value = match;
            }
        }

        // 3. Command History (Up/Down)
        else if (event.key === "ArrowUp") {
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
        }

        // 4. Execute Command (Enter)
        else if (event.key === "Enter") {
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

            // --- COMMANDS LIST ---
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
            } else if (command === "message" || command === "email") {
                response.innerHTML =
                    "<p class='stream-text'>Opening your email client...</p>";
                setTimeout(() => {
                    window.location.href =
                        "mailto:sakibsnaz@gmail.com?subject=Hello from Portfolio";
                }, 1000);
            } else if (command === "resume" || command === "download") {
                response.innerHTML =
                    "<p class='stream-text'>Initiating download...</p>";
                setTimeout(() => {
                    const link = document.createElement("a");
                    link.href = "assets/sakib_resume.pdf";
                    link.download = "Sakib_Nazmush_Resume.pdf";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }, 1000);
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
            } else if (command.startsWith("sudo")) {
                response.innerHTML = `<p class='error stream-text'>Permission denied: You are not the One.</p>
                                      <p class='stream-text' style='color:#fff'>This incident will be reported.</p>`;
            } else {
                response.innerHTML = `<p class='error stream-text'>Command not found: ${command}. Type 'help'.</p>`;
            }

            window.scrollTo(0, document.body.scrollHeight);
        }
    });
});
