# ⚓ Battleship Game — Vanilla JS Architecture & UI Showcase

A classic tactical naval combat game built from scratch using Modern JavaScript (ES6+), CSS3, and HTML5. This project was developed as a comprehensive educational capstone, transitioning from a single-file application into a highly decoupled, modular enterprise-grade architecture.

---

## 🕹️ Live Features

- **Game Modes:**
    - **Singleplayer:** Battle against an adaptive computer AI featuring distinct Hunting, Target Acquisition, and Destroy states.
    - **Local Multiplayer (Hotseat):** Play against a friend on the same screen with hidden operational boards preventing screen-peeking during setup and turns.
- **Dynamic Fleet Setup:** Full Drag & Drop interface to manually place battleships or use a recursive random assignment engine.
- **UI & UX Highlights:** Adaptive field labels shifting context per current player turn (`Your Fleet` vs `Target`) and interactive win/start modular announcements decorated with operational emojis.

---

## 🏗️ Architectural Redesign & SOLID Style

While the base project initially followed basic procedural logic, the current codebase has been completely refactored into a rigorous **Feature-Driven Architecture** adhering closely to **SOLID principles** and the **MVC (Model-View-Controller)** pattern.

---

## ⚡ Custom Implementations (Added Value)

Beyond the standard course curriculum requirements, the following custom systems were designed and integrated into the game:

### 🎸 Retrogaming Audio System (`soundManager.js`)

Inspired by the **16-bit arcade gaming machines of the 90s (NES/Dendy/Sega)**, a custom audio state coordinator was added:

- **Chiptune BGM Loop:** Immersive background arcade combat music that contextually starts on user canvas interaction due to modern browser constraints.
- **Smart Mute Engine:** An interactive hardware-like toggle button (`🔊 Mute Music` / `🔇 Unmute Music`) tracking an inner `isMuted` runtime flag. The app natively remembers user audio selection across game restarts without blasting loud tracks.
- **SFX End-State Interceptor:** Automatic safe background tracking termination upon game-over states to execute a dedicated chiptune victory theme (`win.mp3`) cleanly without acoustic overlay clashing.

### 🔄 Asymmetric Turning Interface

To ensure a smooth Hotseat multiplayer mode without exposing placement setups, an automated labels update system was programmed into `gameScreen.js`. The boards automatically rotate perspective labels based on active runtime pointer references, preventing visual orientation confusion for human players.

---

### 🎮 Battle Interfaces

![Battleship Gameboard Grid Layout]('./public/image1.PNG')
![VS Bot]('./public/image2.PNG')
![VS Human]('./public/image3.PNG')

---

## 🛠️ Installation & Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/IgorPanasik/battleship-odin.git
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the development server (Webpack Dev Server):
    ```bash
    npm run start
    ```

---

## 📖 Source Acknowledgement

This implementation was built as part of the JavaScript path from **The Odin Project** curriculum.

- **Original Lesson Specification:** [The Odin Project - Battleship](https://www.theodinproject.com/lessons/node-path-javascript-battleship)

---
