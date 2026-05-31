# FutureMe — AI-Powered Personal Reflection System

Developed by **SaiRaju Labs**.

**FutureMe** is a premium, Apple-style AI-powered personal reflection web application. Users input key parameters regarding their current life state, goals, struggles, and ambitions. Using the Google Gemini API, the platform establishes a synchronized matrix, generating an emotionally resonant, highly strategic, and actionable transmission from their future self 5 years down the road. 

Beyond initial synchronization, users can interface in real-time with their generated consciousness in a dynamic convergent chat log.

---

## Technical Architecture

```
futureme/
  frontend/
    index.html          # Responsive Apple-style layout & Chat convergence UI
    style.css           # Premium glassmorphic styling & micro-animations
    script.js           # Interactive state manager & dynamic fetch interface
  backend/
    server.js           # Node.js + Express API server calling Gemini API
    package.json        # Dependencies & start scripts
    .env                # Local environmental secrets
    .env.example        # Environment secret templates
README.md               # Setup & operation manual
```

---

## Windows Direct Launcher

You can start the entire platform with a single double-click:
1. Double-click the [start_futureme.bat](file:///c:/Users/saira/OneDrive/Desktop/fun/start_futureme.bat) file in the root folder.
2. This automatically boots the Express backend in a dedicated console window and opens the premium browser interface.

---

## Getting Started

### 1. Configure the Backend Environment

1. Navigate to the backend folder:
   ```bash
   cd futureme/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your Google Gemini API key:
   - Duplicate the `.env.example` file and rename it to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Open `.env` and paste your Gemini API Key:
     ```env
     PORT=5000
     GEMINI_API_KEY=AIzaSy...your_gemini_api_key...
     ```
   - *(Note: You can obtain your API key for free from [Google AI Studio](https://aistudio.google.com/))*

### 2. Start the Backend Server

Start the development server with hot-reloading (using `nodemon`):
```bash
npm run dev
```

Alternatively, launch using standard Node execution:
```bash
npm start
```

Upon successful startup, the console will log:
```
FutureMe backend listening at http://localhost:5000
Gemini API Client initialized successfully.
```

### 3. Open the Frontend

Since the frontend is built using standard production-ready HTML5, CSS3, and JavaScript, you can open it directly in any modern browser without compiling:

1. Locate the file at `futureme/frontend/index.html`.
2. Double-click to open it in your browser (Chrome, Safari, Edge, Firefox), or run a simple local static server inside `futureme/frontend` (e.g. `npx serve`, Python `python -m http.server`, or Live Server extension).

---

## API Routes Documentation

### 1. `POST /api/generate-futureme`
Establishes the initial synchronization matrix and returns a highly detailed structured profile from the future self.

- **Request Body**:
  ```json
  {
    "name": "SAIRAJU",
    "age": "20",
    "goal": "Build a successful AI startup",
    "struggle": "Lack of consistency",
    "oneYearVision": "Running a profitable AI company",
    "tone": "Brutally Honest"
  }
  ```

- **Response Body**:
  ```json
  {
    "success": true,
    "data": {
      "message": "A powerful 120-180 word message from the future self.",
      "futureIdentity": "A concise description of who the user is becoming.",
      "nextMoves": ["Action 1", "Action 2", "Action 3"],
      "habit": "One small daily habit they should start today.",
      "warning": "One mistake their future self warns them about.",
      "mantra": "A short memorable line they can repeat daily."
    }
  }
  ```

### 2. `POST /api/chat-futureme`
Facilitates real-time conversation with the generated future identity, preserving chat logs for temporal context.

- **Request Body**:
  ```json
  {
    "userProfile": {
      "name": "SAIRAJU",
      "age": "20",
      "goal": "Build a successful AI startup",
      "struggle": "Lack of consistency",
      "oneYearVision": "Running a profitable AI company",
      "tone": "Brutally Honest"
    },
    "chatHistory": [
      {
        "role": "futureme",
        "message": "Only if your daily actions stop negotiating with your dreams."
      }
    ],
    "question": "What should I focus on this week?"
  }
  ```

- **Response Body**:
  ```json
  {
    "success": true,
    "reply": "Cut out the noise completely. Spend exactly two uninterrupted hours tomorrow shipping a core functional module..."
  }
  ```

---

## Distinctive Features Included

- **Enforced JSON Output Schema**: Leverages Google Gemini's advanced `responseMimeType: "application/json"` setting to guarantee structured API responses.
- **Adaptive Emotional Tone Weighting**: Prompts are dynamically customized for **Motivational**, **Brutally Honest**, **Calm Mentor**, or **CEO Mode** profiles.
- **Quantum Correlation Animations**: Features sleek cyclic text updates during loading sequences.
- **Sleek Toast Notifications**: Premium micro-interaction toasts alert users to copy completions and system updates.
- **Automatic Scrolling Logs**: Direct convergence chat messages automatically adjust viewport scroll alignments.
- **Secure Key Isolation**: Enforces API secret protection by routing all AI operations through the Node server.
