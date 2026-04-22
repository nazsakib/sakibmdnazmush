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

    // --- SETUP: SOUND EFFECTS (Web Audio API) ---
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;
    let isMuted = false;

    const initAudio = () => {
        if (!audioCtx) {
            audioCtx = new AudioContext();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    };

    const playKeystroke = (isEnter = false) => {
        if (isMuted) return;
        initAudio();
        
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = isEnter ? 'triangle' : 'square';
        // Randomize pitch slightly for realism
        const baseFreq = isEnter ? 150 : 300;
        oscillator.frequency.setValueAtTime(baseFreq + (Math.random() * 50 - 25), audioCtx.currentTime);
        
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + (isEnter ? 0.15 : 0.05));
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + (isEnter ? 0.15 : 0.05));
    };
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
    let alphabet = katakana + latin + nums;

    // --- NEW: KONAMI CODE LOGIC ---
    let konamiIndex = 0;
    let isEmojiMode = false;
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    document.addEventListener('keydown', (e) => {
        if (e.key === konamiSequence[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiSequence.length) {
                konamiIndex = 0;
                isEmojiMode = !isEmojiMode;
                if (isEmojiMode) {
                    alphabet = "🚀💻🔥😎👾🍕🎮🦄";
                    matrixColor = "#fff"; // Emoji friendly
                } else {
                    alphabet = katakana + latin + nums;
                    matrixColor = "#0F0"; // Default Green
                }
            }
        } else {
            konamiIndex = 0;
        }
    });

    const fontSize = 16;
    const columns = canvas.width / fontSize; // Number of columns

    const rainDrops = [];
    // Initialize drops
    for (let x = 0; x < columns; x++) {
        rainDrops[x] = 1;
    }

    // 1. ADD THIS VARIABLE (It holds the current color)
    let matrixColor = "#0F0"; // Default is Green

    const drawRain = () => {
        // Black background with slight opacity to create "trail" effect
        ctx.fillStyle = "rgba(13, 13, 13, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 2. CHANGE THIS LINE (Use the variable instead of hardcoded "#0F0")
        ctx.fillStyle = matrixColor;

        ctx.font = fontSize + "px monospace";

        const chars = Array.from(alphabet);
        for (let i = 0; i < rainDrops.length; i++) {
            const text = chars[
                Math.floor(Math.random() * chars.length)
            ];
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

    // --- NEW: BOOT SEQUENCE LOGIC ---
    const runBootSequence = (isReturningUser = false) => {
        matrixIntro.classList.add("hidden");
        terminal.classList.remove("hidden");

        const outputDiv = document.getElementById("output");
        const commandLine = document.querySelector(".command-line");
        outputDiv.innerHTML = "";
        commandLine.classList.add("transparent");

        if (isReturningUser) {
            const welcomeMsg = document.createElement("p");
            welcomeMsg.className = "stream-text";
            welcomeMsg.innerHTML = "Wake up, Neo... Welcome back. Skipping boot sequence.<br><br>Type <strong>help</strong> to see available commands.";
            outputDiv.appendChild(welcomeMsg);
            
            setTimeout(() => {
                commandLine.classList.remove("transparent");
                commandLine.classList.add("fade-in-text");
                commandInput.focus();
            }, 1000);
        } else {
            localStorage.setItem('matrixVisited', 'true');
            const bootLines = [
                "INIT: version 2.88 booting",
                "Loading kernel... OK",
                "Mounting file systems... OK",
                "Starting system logger: OK",
                "Bypassing mainframe... DONE",
                "Establishing secure connection... ESTABLISHED",
                "WELCOME TO MY PORTFOLIO"
            ];
            
            let delay = 0;
            bootLines.forEach((line, index) => {
                setTimeout(() => {
                    const p = document.createElement("p");
                    p.className = "stream-text";
                    if (index === bootLines.length - 1) {
                        p.style.color = "#33ff33";
                        p.style.fontWeight = "bold";
                        p.innerHTML = `${line}<br><br>Type <strong>help</strong> to see available commands. Or you can type <strong>hack</strong>.`;
                    } else {
                        p.innerText = line;
                    }
                    outputDiv.appendChild(p);
                    window.scrollTo(0, document.body.scrollHeight);
                }, delay);
                delay += (index === bootLines.length - 1) ? 800 : 250;
            });

            setTimeout(() => {
                commandLine.classList.remove("transparent");
                commandLine.classList.add("fade-in-text");
                commandInput.focus();
            }, delay + 500);
        }
    };

    // Check persistence
    if (localStorage.getItem('matrixVisited') === 'true') {
        runBootSequence(true);
    } else {
        typeWriter();
    }

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
            runBootSequence(false);
        }, 3000);
    });

    // --- PART 4: TERMINAL FUNCTIONS ---
    let commandHistory = [];
    let historyIndex = -1;
    let isPrinting = false;
    let hackUsed = false;

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
        playKeystroke(event.key === "Enter");

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
                "github",
                "status",
                "ask",
                "mute",
                "unmute",
                "hack",
                "theme",
                "play"
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
                // --- ADD THESE NEW COMMANDS ---
            } else if (command === "hack") {
                // CHECK: Has this already been used?
                if (hackUsed) {
                    // IF YES: Show error message
                    response.innerHTML = `<p class="stream-text" style="color: red;">[ERROR] Security patch active. Exploit no longer valid.</p>`;
                } else {
                    // IF NO: Run the hack sequence
                    hackUsed = true; // Mark as used immediately
                    isPrinting = true;

                    // --- EXISTING HACK LOGIC ---
                    const panicLines = [
                        "WARNING: UNAUTHORIZED ACCESS DETECTED!",
                        "SYSTEM INTEGRITY COMPROMISED...",
                        "FIREWALL BREACHED.",
                        "DOWNLOADING USER DATA...",
                        "CRITICAL ERROR: KERNEL PANIC",
                        "SYSTEM SHUTDOWN IMMINENT...",
                    ];

                    let lineDelay = 0;
                    const lineSpeed = 600;

                    panicLines.forEach((line) => {
                        setTimeout(() => {
                            const p = document.createElement("p");
                            p.className = "stream-text";
                            p.style.color = "red";
                            p.style.fontWeight = "bold";
                            p.innerText = line;
                            response.appendChild(p);
                            window.scrollTo(0, document.body.scrollHeight);
                        }, lineDelay);
                        lineDelay += lineSpeed;
                    });

                    // Start Chaos
                    setTimeout(() => {
                        document.body.classList.add("system-failure");
                        matrixColor = "#F00"; // Red Rain

                        // Chaos Duration (6 seconds)
                        setTimeout(() => {
                            document.body.classList.remove("system-failure");
                            output.classList.add("fade-out-content");

                            // Reboot Sequence
                            setTimeout(() => {
                                matrixColor = "#0F0"; // Green Rain
                                output.innerHTML = ""; // Wipe screen
                                output.classList.remove("fade-out-content");

                                // Hide prompt
                                const commandLine =
                                    document.querySelector(".command-line");
                                commandLine.classList.add("transparent");
                                commandLine.classList.remove("fade-in-text");

                                // Print "System restored."
                                const msg1 = document.createElement("p");
                                msg1.className = "stream-text";
                                msg1.style.color = "#33ff33";
                                msg1.style.marginTop = "20px";
                                msg1.innerText = "System restored.";
                                output.appendChild(msg1);

                                // Wait, then print "Type help"
                                setTimeout(() => {
                                    const msg2 = document.createElement("p");
                                    msg2.className = "stream-text";
                                    msg2.innerHTML =
                                        "You need help? Type <strong>help</strong>.";
                                    output.appendChild(msg2);

                                    // Reveal Input Line
                                    setTimeout(() => {
                                        commandLine.classList.remove(
                                            "transparent",
                                        );
                                        commandLine.classList.add(
                                            "fade-in-text",
                                        );

                                        commandInput.focus();
                                        isPrinting = false;
                                        window.scrollTo(
                                            0,
                                            document.body.scrollHeight,
                                        );
                                    }, 1000);
                                }, 1000);
                            }, 2000); // End of fade out
                        }, 6000); // End of chaos
                    }, lineDelay);
                }
            } else if (command === "mute") {
                isMuted = true;
                response.innerHTML =
                    "<p class='stream-text'>Audio output: <span style='color:red'>MUTED</span></p>";
            } else if (command === "unmute") {
                isMuted = false;
                response.innerHTML =
                    "<p class='stream-text'>Audio output: <span style='color:#33ff33'>ENABLED</span></p>";
            } else if (command.startsWith("ask ")) {
                const query = command.replace("ask ", "").trim();
                let answer = "I'm sorry, my knowledge base doesn't cover that.";
                if (query.includes("location") || query.includes("where")) answer = "I am based in Dhaka, Bangladesh.";
                else if (query.includes("hire") || query.includes("job") || query.includes("work")) answer = "I am currently open to new opportunities!";
                else if (query.includes("stack") || query.includes("tech")) answer = "My core stack is JavaScript, React, WordPress, and Shopify.";
                else if (query.includes("salary") || query.includes("pay")) answer = "My salary expectations are negotiable depending on the role.";
                
                response.innerHTML = `<p class='stream-text'>> Processing query...</p><p class='stream-text' style='animation-delay: 0.5s'>${answer}</p>`;
            } else if (command === "github") {
                response.innerHTML = "<p class='stream-text'>Fetching live data from GitHub API...</p>";
                fetch('https://api.github.com/users/nazsakib')
                    .then(res => res.json())
                    .then(data => {
                        setTimeout(() => {
                            const githubData = document.createElement('div');
                            githubData.innerHTML = `
                                <p class="stream-text" style="color: #00ffff">User: ${data.login}</p>
                                <p class="stream-text">Public Repos: ${data.public_repos}</p>
                                <p class="stream-text">Followers: ${data.followers}</p>
                                <p class="stream-text">URL: <a href="${data.html_url}" target="_blank" style="color: #33ff33;">${data.html_url}</a></p>
                            `;
                            response.appendChild(githubData);
                            window.scrollTo(0, document.body.scrollHeight);
                        }, 500);
                    })
                    .catch(err => {
                        response.innerHTML += `<p class="error stream-text">Failed to fetch GitHub data.</p>`;
                    });
            } else if (command === "status") {
                const date = new Date();
                response.innerHTML = `
                    <p class='stream-text'>Local connection established.</p>
                    <p class='stream-text'>User Time: ${date.toLocaleTimeString()}</p>
                    <p class='stream-text'>System Status: ONLINE</p>
                    <p class='stream-text'>Browser Agent: ${navigator.userAgent.substring(0, 50)}...</p>
                `;
            } else if (command.startsWith("theme ")) {
                const themeName = command.replace("theme ", "").trim();
                const root = document.documentElement;
                document.body.style.backgroundColor = ""; // Reset in case light mode was active
                if (themeName === "cyberpunk") {
                    root.style.setProperty('--primary-color', '#ff00ff');
                    matrixColor = "#ffff00";
                    response.innerHTML = "<p class='stream-text' style='color:#ff00ff'>Theme changed to Cyberpunk.</p>";
                } else if (themeName === "dracula") {
                    root.style.setProperty('--primary-color', '#bd93f9');
                    matrixColor = "#8be9fd";
                    response.innerHTML = "<p class='stream-text' style='color:#bd93f9'>Theme changed to Dracula.</p>";
                } else if (themeName === "hacker") {
                    root.style.setProperty('--primary-color', '#33ff33');
                    matrixColor = "#0F0";
                    response.innerHTML = "<p class='stream-text' style='color:#33ff33'>Theme changed to Hacker.</p>";
                } else {
                    response.innerHTML = "<p class='stream-text'>Available themes: hacker, cyberpunk, dracula.</p>";
                }
            } else if (command === "theme") {
                response.innerHTML = "<p class='stream-text'>Usage: theme &lt;name&gt;. Available themes: hacker, cyberpunk, dracula.</p>";
            } else if (command === "play snake") {
                output.innerHTML = "";
                startSnakeGame(output);
            } else if (command === "play") {
                response.innerHTML = "<p class='stream-text'>Usage: play &lt;game&gt;. Available games: snake.</p>";
            } else if (['ls', 'cd', 'pwd', 'mkdir', 'rm', 'cat', 'echo', 'grep'].includes(command.split(" ")[0])) {
                response.innerHTML = `<p class='error stream-text'>Access denied. Core Linux commands are restricted for guest users.</p>`;
            } else {
                // Typo check (Levenshtein Distance)
                const availableCommands = ["help", "about", "projects", "skills", "contact", "clear", "resume", "message", "exit", "hack", "github", "status", "ask", "mute", "unmute", "theme", "play"];
                let closestMatch = null;
                let smallestDist = 3; // Max threshold
                
                const getEditDistance = (a, b) => {
                    if (a.length === 0) return b.length;
                    if (b.length === 0) return a.length;
                    const matrix = [];
                    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
                    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
                    for (let i = 1; i <= b.length; i++) {
                        for (let j = 1; j <= a.length; j++) {
                            if (b.charAt(i-1) === a.charAt(j-1)) matrix[i][j] = matrix[i-1][j-1];
                            else matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, Math.min(matrix[i][j-1] + 1, matrix[i-1][j] + 1));
                        }
                    }
                    return matrix[b.length][a.length];
                };

                for (let cmd of availableCommands) {
                    const dist = getEditDistance(command, cmd);
                    if (dist < smallestDist) {
                        smallestDist = dist;
                        closestMatch = cmd;
                    }
                }

                if (closestMatch) {
                    response.innerHTML = `<p class='error stream-text'>Command not found: ${command}. Did you mean '<span style="color:#00ffff; cursor:pointer;" onclick="document.getElementById('command-input').value='${closestMatch}'; document.getElementById('command-input').focus();">${closestMatch}</span>'?</p>`;
                } else {
                    response.innerHTML = `<p class='error stream-text'>Command not found: ${command}. Type 'help'.</p>`;
                }
            }

            window.scrollTo(0, document.body.scrollHeight);
        }
    });

    // --- RANDOM TEXT GLITCH EFFECT ---
    setInterval(() => {
        if (Math.random() > 0.8 && !document.body.classList.contains("system-failure")) {
            terminal.classList.add("glitch-active");
            setTimeout(() => {
                terminal.classList.remove("glitch-active");
            }, 200 + Math.random() * 300);
        }
    }, 5000);

    // --- VIRTUAL KEYBOARD LOGIC ---
    const virtualKeyboard = document.getElementById("virtual-keyboard");
    const vkKeys = document.querySelectorAll(".vk-key");
    if (virtualKeyboard && vkKeys) {
        // Show VK when terminal input is focused on mobile
        commandInput.addEventListener("focus", () => {
            if (window.innerWidth < 768) {
                virtualKeyboard.classList.remove("hidden");
            }
        });
        
        vkKeys.forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.preventDefault(); // Prevent input blur
                const key = btn.innerText;
                
                if (btn.id === "vk-backspace") {
                    commandInput.value = commandInput.value.slice(0, -1);
                } else if (btn.id === "vk-enter") {
                    commandInput.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
                } else if (btn.id === "vk-space") {
                    commandInput.value += " ";
                } else {
                    commandInput.value += key;
                }
                playKeystroke(btn.id === "vk-enter");
                commandInput.focus();
            });
        });
    }

    // --- ASCII SNAKE GAME LOGIC ---
    function startSnakeGame(container) {
        isPrinting = true;
        commandInput.disabled = true;
        
        const width = 20;
        const height = 10;
        let snake = [{x: 5, y: 5}];
        let dir = {x: 1, y: 0};
        let food = {x: 15, y: 5};
        let score = 0;
        let gameLoop;
        
        const board = document.createElement("pre");
        board.className = "ascii-art";
        board.id = "snake-board";
        
        const instructions = document.createElement("p");
        instructions.className = "stream-text";
        instructions.innerHTML = "Use <strong>W, A, S, D</strong> or Arrow Keys to move. Press <strong>Q</strong> to quit.";
        
        container.appendChild(instructions);
        container.appendChild(board);
        
        const draw = () => {
            let grid = "";
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    if (x === food.x && y === food.y) grid += "★";
                    else if (snake.some(segment => segment.x === x && segment.y === y)) {
                        grid += (snake[0].x === x && snake[0].y === y) ? "█" : "▒";
                    }
                    else grid += "·";
                }
                grid += "\n";
            }
            board.innerText = `Score: ${score}\n\n${grid}`;
        };
        
        const gameOver = () => {
            clearInterval(gameLoop);
            board.innerText += "\nGAME OVER. Final Score: " + score;
            setTimeout(() => {
                isPrinting = false;
                commandInput.disabled = false;
                commandInput.focus();
                document.removeEventListener("keydown", snakeKeyHandler);
            }, 1500);
        };
        
        const update = () => {
            const head = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};
            
            // Wall Collision
            if (head.x < 0 || head.x >= width || head.y < 0 || head.y >= height) return gameOver();
            // Self Collision
            if (snake.some(segment => segment.x === head.x && segment.y === head.y)) return gameOver();
            
            snake.unshift(head);
            
            if (head.x === food.x && head.y === food.y) {
                score += 10;
                playKeystroke();
                food = {
                    x: Math.floor(Math.random() * width),
                    y: Math.floor(Math.random() * height)
                };
            } else {
                snake.pop();
            }
            draw();
        };
        
        const snakeKeyHandler = (e) => {
            if (['ArrowUp', 'w'].includes(e.key) && dir.y === 0) dir = {x: 0, y: -1};
            else if (['ArrowDown', 's'].includes(e.key) && dir.y === 0) dir = {x: 0, y: 1};
            else if (['ArrowLeft', 'a'].includes(e.key) && dir.x === 0) dir = {x: -1, y: 0};
            else if (['ArrowRight', 'd'].includes(e.key) && dir.x === 0) dir = {x: 1, y: 0};
            else if (e.key === 'q') {
                gameOver();
            }
        };
        
        document.addEventListener("keydown", snakeKeyHandler);
        gameLoop = setInterval(update, 200);
    }
});
