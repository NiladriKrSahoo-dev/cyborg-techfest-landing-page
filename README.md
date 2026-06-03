# 🌐 Techfest Official Event Portal task
**🎥 Live Demo Recording:** [https://drive.google.com/file/d/1p9OF2ZBVuAVwLt05FXXrEcKtos6HmH51/view?usp=sharing]

*(Note: Viewer access is enabled)*
---
A high-performance, immersive single-page landing site built for **Techfest** (Asia's Largest Science and Technology Festival). This project features a custom WebGL shader background, a global cursor-tracking 3D robot, and a premium Cyber-Glassmorphism user interface.

## ✨ Key Features

* **True Global 3D Tracking:** Utilizes a borderless, fixed-viewport Spline scene. The UI layer implements "Swiss Cheese" pointer events (`pointer-events-none` on wrappers, `auto` on specific elements) allowing the user's cursor to interact with the 3D model through the empty spaces of the website.
* **Custom WebGL Shader:** A highly optimized, full-screen Three.js fragment shader that renders an animated, interference-pattern grid in the background.
* **Cyber-Glassmorphism UI:** Built with Tailwind CSS v4, featuring backdrop blurs, neon cyan accents, hover-responsive elevation, and terminal-style aesthetics.
* **Single-File Architecture:** The core logic, 3D hooks, and UI layouts are elegantly streamlined into a single, monolithic `app/page.tsx` file for ultimate simplicity and ease of maintenance.

## 🛠️ Tech Stack

* **Framework:** [Next.js](https://nextjs.org/) (App Router)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
* **3D Engine:** [Spline](https://spline.design/) via `@splinetool/react-spline`
* **Shader Graphics:** [Three.js](https://threejs.org/)
* **Icons:** [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

To run this project locally on your machine or in a Codespace:

### 1. Install Dependencies
Ensure you have Node.js installed, then run:
```bash
npm install
