/* Interactive Scroll Observer System */
const observerOptions = { root: null, threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* Magnetic Mouse Tracker for Glow Gradients */
function initGlowTracking() {
    document.querySelectorAll('.dynamic-glow').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });
}
initGlowTracking();

/* Button Ripple Engine */
function initButtonRipples() {
    document.querySelectorAll('.interactive-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
}
initButtonRipples();

/* Application State */
const API_BASE = "http://localhost:5000/api";
let userProfile = null;
let chatHistory = [];
let loadingInterval = null;

// Premium loading text sequences
const loadingPhrases = [
    "Establishing quantum correlation link...",
    "Decrypting future timelines...",
    "Calibrating character tone vector weights...",
    "Creating your future identity..."
];

/* Trigger Toast Notification */
function triggerToast(text = null, isError = false) {
    const toast = document.getElementById('share-toast');
    const toastText = document.getElementById('toast-message');
    
    if (text) {
        toastText.innerText = text;
    } else {
        toastText.innerText = "Your FutureMe moment is ready to share.";
    }

    if (isError) {
        toast.classList.add('toast-error');
    } else {
        toast.classList.remove('toast-error');
    }

    toast.classList.add('active');
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3500);
}

/* Form Generation Submission Handler */
async function handleGeneration(e) {
    e.preventDefault();
    
    // Extract UI Elements
    const nameInput = document.getElementById('user-name');
    const ageInput = document.getElementById('user-age');
    const goalInput = document.getElementById('user-goal');
    const struggleInput = document.getElementById('user-struggle');
    const visionInput = document.getElementById('user-vision');
    const toneInput = document.getElementById('user-tone');
    const generateBtn = document.getElementById('generate-btn');

    const name = nameInput.value.trim();
    const age = ageInput.value.trim();
    const goal = goalInput.value.trim();
    const struggle = struggleInput.value.trim();
    const vision = visionInput.value.trim();
    const tone = toneInput.value;

    // Simple Inline Field Validation Engine
    let isValid = true;
    if(!name) { document.getElementById('err-name').style.display = 'block'; isValid = false; } else { document.getElementById('err-name').style.display = 'none'; }
    if(!age) { document.getElementById('err-age').style.display = 'block'; isValid = false; } else { document.getElementById('err-age').style.display = 'none'; }
    if(!goal) { document.getElementById('err-goal').style.display = 'block'; isValid = false; } else { document.getElementById('err-goal').style.display = 'none'; }
    if(!struggle) { document.getElementById('err-struggle').style.display = 'block'; isValid = false; } else { document.getElementById('err-struggle').style.display = 'none'; }
    if(!vision) { document.getElementById('err-vision').style.display = 'block'; isValid = false; } else { document.getElementById('err-vision').style.display = 'none'; }

    if(!isValid) {
        triggerToast("Please fill all configuration vectors.", true);
        return;
    }

    // Capture User Profile State
    userProfile = { name, age, goal, struggle, oneYearVision: vision, tone };
    chatHistory = [];

    // Trigger UI States
    document.getElementById('future-form').style.display = 'none';
    const loader = document.getElementById('loading-state');
    const loadingText = document.getElementById('loading-text');
    loader.style.display = 'flex';
    generateBtn.disabled = true;

    // Cycle through exciting premium loading phases
    let phraseIndex = 0;
    loadingText.innerText = loadingPhrases[phraseIndex];
    loadingInterval = setInterval(() => {
        phraseIndex = (phraseIndex + 1) % loadingPhrases.length;
        loadingText.innerText = loadingPhrases[phraseIndex];
    }, 1800);

    try {
        const response = await fetch(`${API_BASE}/generate-futureme`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userProfile)
        });

        const json = await response.json();
        
        clearInterval(loadingInterval);
        loader.style.display = 'none';
        generateBtn.disabled = false;

        if (json.success && json.data) {
            const data = json.data;

            // Content Mapping Pipeline
            document.getElementById('out-message').innerText = `"${data.message}"`;
            document.getElementById('out-identity').innerText = `${data.futureIdentity} (Age Vector: ${parseInt(age) + 5})`;
            
            const listContainer = document.getElementById('out-moves');
            listContainer.innerHTML = '';
            (data.nextMoves || []).forEach(move => {
                const li = document.createElement('li');
                li.innerText = move;
                listContainer.appendChild(li);
            });

            document.getElementById('out-habit').innerText = data.habit;
            document.getElementById('out-warning').innerText = data.warning;
            document.getElementById('out-mantra').innerText = `"${data.mantra}"`;

            // Animate Display Response Card
            const outputCard = document.getElementById('output-state');
            outputCard.style.display = 'block';

            // Establish Dynamic Chat Welcome Message
            initChatSession(data.message);

            // Enable convergent Chat UI
            const chatSection = document.getElementById('chat');
            chatSection.classList.add('active');
            
            // Re-trigger reveal animations in case chat was hidden
            setTimeout(() => {
                document.querySelectorAll('#chat .reveal').forEach(el => observer.observe(el));
            }, 100);

            triggerToast("Temporal synchronization complete.");
        } else {
            throw new Error(json.error || "Server failed to process synchronization.");
        }

    } catch (err) {
        console.error("Synchronization Failure:", err);
        clearInterval(loadingInterval);
        loader.style.display = 'none';
        generateBtn.disabled = false;
        document.getElementById('future-form').style.display = 'block';
        triggerToast(err.message || "FutureMe could not respond right now. Try again.", true);
    }
}

/* Copy Result to Clipboard */
function copyResult() {
    if (!userProfile) return;

    const listItems = Array.from(document.querySelectorAll('#out-moves li')).map((li, i) => `${i + 1}. ${li.innerText}`).join('\n');

    const resultText = `FUTUREME SYNCHRONIZATION MATRIX
-----------------------------------------
Identity Matrix: ${userProfile.name} (Current Age: ${userProfile.age})
Transmission Easing Tone: ${userProfile.tone}
Future Identity Vector: ${document.getElementById('out-identity').innerText}

[1] MESSAGE FROM YOUR FUTUREME
${document.getElementById('out-message').innerText}

[2] NEXT 3 SYSTEM ADJUSTMENTS
${listItems}

[3] DAILY HABIT
${document.getElementById('out-habit').innerText}

[4] FUTURE WARNING
${document.getElementById('out-warning').innerText}

[5] DAILY INTENT MANTRA
${document.getElementById('out-mantra').innerText}

-----------------------------------------
Synthesized by SaiRaju Labs
`;

    navigator.clipboard.writeText(resultText).then(() => {
        triggerToast("Identity parameters copied to clipboard.");
    }).catch(err => {
        console.error("Clipboard copy failure:", err);
        triggerToast("Failed to write coordinates to clipboard.", true);
    });
}

/* Reset / Regenerate Form State */
function resetForm() {
    // Hide Outputs
    document.getElementById('output-state').style.display = 'none';
    document.getElementById('chat').classList.remove('active');
    
    // Reset Form Fields
    document.getElementById('future-form').style.display = 'block';
    
    // Clear Local State
    userProfile = null;
    chatHistory = [];
    document.getElementById('chat-messages').innerHTML = '';

    triggerToast("Matrix reset. Ready for new synchronization inputs.");
}

/* Chat Section Initialization */
function initChatSession(initialMessage) {
    const chatContainer = document.getElementById('chat-messages');
    chatContainer.innerHTML = ''; // Clear previous logs

    // Insert welcome message bubble from future self
    appendChatBubble("futureme", initialMessage);

    // Seed chat history list
    chatHistory.push({
        role: "futureme",
        message: initialMessage
    });
}

/* Smooth Navigation Scroll to Chat Section */
function scrollToChat(e) {
    e.preventDefault();
    const chatSection = document.getElementById('chat');
    chatSection.scrollIntoView({ behavior: 'smooth' });
    
    // Focus chat inputs
    setTimeout(() => {
        const chatInput = document.getElementById('chat-input');
        if (chatInput) chatInput.focus();
    }, 800);
}

/* Append Bubble to Chat Interface */
function appendChatBubble(role, message) {
    const chatContainer = document.getElementById('chat-messages');
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${role === 'user' ? 'bubble-user' : 'bubble-future'}`;
    bubble.innerText = message;
    
    chatContainer.appendChild(bubble);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

/* Append Typing Indicator to Chat logs */
function appendTypingIndicator() {
    const chatContainer = document.getElementById('chat-messages');
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.id = 'chat-typing';
    
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = 'typing-dot';
        indicator.appendChild(dot);
    }
    
    chatContainer.appendChild(indicator);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

/* Remove Typing Indicator from Chat logs */
function removeTypingIndicator() {
    const indicator = document.getElementById('chat-typing');
    if (indicator) {
        indicator.remove();
    }
}

/* Convergent Conversation Message Submission Handler */
async function handleChatSubmit(e) {
    e.preventDefault();
    
    if (!userProfile) return;

    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send');
    const question = chatInput.value.trim();

    if (!question) return;

    // 1. Add message bubble from user immediately
    appendChatBubble("user", question);
    chatInput.value = "";
    
    // Disable inputs during round-trip
    chatInput.disabled = true;
    chatSendBtn.disabled = true;

    // 2. Append to chat state history
    chatHistory.push({
        role: "user",
        message: question
    });

    // 3. Show dynamic typing loading states
    appendTypingIndicator();

    try {
        const response = await fetch(`${API_BASE}/chat-futureme`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userProfile: userProfile,
                chatHistory: chatHistory.slice(0, -1), // History up to before this question
                question: question
            })
        });

        const json = await response.json();
        
        removeTypingIndicator();
        chatInput.disabled = false;
        chatSendBtn.disabled = false;
        chatInput.focus();

        if (json.success && json.reply) {
            // 4. Append message response bubble from future self
            appendChatBubble("futureme", json.reply);

            // 5. Append to history state
            chatHistory.push({
                role: "futureme",
                message: json.reply
            });
        } else {
            throw new Error(json.error || "Failed to retrieve convergent consciousness response.");
        }
    } catch (err) {
        console.error("Chat failure:", err);
        removeTypingIndicator();
        chatInput.disabled = false;
        chatSendBtn.disabled = false;
        
        // Append system error warning to chat logs
        appendChatBubble("system", "FutureMe transmission interrupted. Re-establishing link. Please retry.");
        triggerToast("Transmission failure. Check backend connection.", true);
    }
}
