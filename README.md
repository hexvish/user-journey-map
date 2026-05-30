# 🗺️ Interactive User Journey Map (UJM) Builder

An elegant, modern, and interactive React web application designed to map out user experiences, plot customer sentiment scores in real-time, and export vector diagrams. Built with React 19, Vite 8, and Tailwind CSS.

---

## 🚀 Key Features

- **🎯 Journey Lens**: Define the overarching scope of your user story:
  - **Persona (Actor)**: Identify the core user persona.
  - **Scenario**: Describe the trigger and contextual flow.
  - **User Goal**: Establish clear criteria for success.
- **📈 Real-Time Sentiment Curve**: 
  - Dynamic visual sentiment representation powered by an SVG overlay with cubic bezier interpolation.
  - Select emotional values (`🙂 Positive`, `😐 Neutral`, `🙁 Negative`) per phase, which updates the curve graph on the fly.
  - Interactive nodes with smooth CSS hover transformations and pulse indicators.
- **📂 Dynamic Phase Management**:
  - Add, rename, and delete phases seamlessly.
  - Automatic smooth-scrolling to focus on newly created phase columns.
- **📝 Qualitative Tracking Tiers**: Document detailed user metrics under distinct colored cards:
  - **User Actions**: What physical/digital activities occur in each phase.
  - **Touchpoints**: Interface elements, channels, and route points.
  - **Thoughts & Quotes**: Quotes and internal reactions.
  - **Pain Points**: Friction, UI blockages, and customer frustration points.
  - **Opportunities**: Key optimization ideas, design enhancements, and automations.
- **💾 Session Save & Load**:
  - **Save Map**: Export local state variables into a `.json` file.
  - **Load Map**: Import saved `.json` maps with comprehensive structure validation and error reporting.
- **🖼️ Vector SVG Export**:
  - Export a fully rendered, production-ready vector `.svg` file of the user journey map.
  - Custom SVG exporter compiles styling, gradients, imported Google Fonts (`Outfit` and `Lora`), qualitative content, and the interactive sentiment curve into a standalone image.

---

## 🛠️ Technology Stack

- **Core**: React 19, HTML5, ES6+ JavaScript
- **Build Tool**: Vite 8
- **Styles**: Tailwind CSS v3, PostCSS, Autoprefixer
- **Linter**: ESLint (Flat configuration)

---

## 📁 Project Structure

```text
user-journey-map/
├── public/                 # Static assets
├── src/
│   ├── components/         # React Components
│   │   ├── JourneyLens.jsx     # Scopes Persona, Scenario, and Goal
│   │   ├── Storyboard.jsx      # Layout grid container for phases
│   │   ├── SentimentCurve.jsx  # SVG cubic bezier curve overlay
│   │   ├── ResetModal.jsx      # Confirm action dialog
│   │   └── Toast.jsx           # Animated feedback alerts
│   ├── utils/              # Helper Scripts
│   │   └── svgExport.js        # Standalone vector SVG generator
│   ├── App.css             # Main styling rules
│   ├── App.jsx             # State orchestration and layout
│   ├── index.css           # Tailwind base layers and custom styles
│   └── main.jsx            # React root mount point
├── eslint.config.js        # Linter rules
├── package.json            # Project dependencies and script runner
├── tailwind.config.js      # Tailwind configurations
└── vite.config.js          # Vite compiler settings
```

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed (version 18 or above recommended).

### Installation

1. Install project dependencies:
   ```bash
   npm install
   ```

2. Run the development server locally:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) (or the port specified in terminal) in your browser.

3. Compile the production package:
   ```bash
   npm run build
   ```

4. Preview the production build locally:
   ```bash
   npm run preview
   ```

---

## 📊 Save & Load JSON Schema

The application exports and accepts a JSON structure matching the schema below:

```json
{
  "lens": {
    "persona": "Description of the user persona",
    "scenario": "Step-by-step situation mapping",
    "goal": "Definitive success criteria"
  },
  "phases": [
    {
      "id": "unique-phase-id",
      "name": "Phase Name (e.g. Discovery)",
      "emotion": 1, 
      "actions": "Description of physical/digital actions",
      "touchpoints": "Channels used",
      "thoughts": "Quotes or quotes",
      "painPoints": "Frictions identified",
      "opportunities": "Potential ideas"
    }
  ]
}
```

*Note: The `emotion` property must be one of `1` (positive), `0` (neutral), or `-1` (negative).*

