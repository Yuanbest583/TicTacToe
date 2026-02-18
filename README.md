# Smart Tic-Tac-Toe with AI Analysis

A modern, responsive Tic-Tac-Toe web application featuring an intelligent AI opponent and real-time move analysis. Built with a "vanilla" stack for maximum performance and zero dependencies.

---

## 🌟 Key Features

* **Unbeatable AI:** Integrated **Minimax Algorithm** with Alpha-Beta pruning ensures the AI plays optimally on "Hard" mode.
* **Real-time Analysis:** Toggle "Analysis Mode" to see the AI's evaluation score and its predicted "best move" before you even play.
* **Adaptive Difficulty:**
    * **Easy:** Random moves for a casual experience.
    * **Medium:** AI blocks your winning rows but remains beatable.
    * **Hard:** The full engine is engaged—try your best to get a draw!
* **Smooth Animations:** Uses HTML5 Canvas for high-performance, procedural drawing of 'X' and 'O' marks.
* **iOS-Inspired UI:** A clean, minimal aesthetic that adapts perfectly to mobile, tablet, and desktop screens.
* **Session Stats:** Track wins, losses, and draws automatically.

---

## 🚀 Quick Start

Since this is a single-file application, there is no installation required:

1.  Download the `index.html` file.
2.  Open it in any modern web browser (Chrome, Safari, Firefox, or Edge).
3.  (Optional) Toggle **AI First (O)** if you want to practice defending.

---

## 🛠️ Technical Overview

### The AI Engine
The game uses a recursive **Minimax Algorithm**. It explores the game tree to assign values to every possible move:
* **Win for AI:** $+10$ (minus depth to prefer faster wins).
* **Win for Player:** $-10$ (plus depth to prefer longer games).
* **Draw:** $0$.

### Responsive Scaling
The CSS uses a combination of Flexbox, CSS Grid, and `transform: scale()` for mobile devices, ensuring the 378px game board remains functional even on small-screen smartphones.

---

**Developed with ❤️ for the Open Source community.**
