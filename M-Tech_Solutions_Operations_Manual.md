# M-Tech Solutions - Operations & Deployment Manual
**Author:** Elite Full-Stack & UI/UX Engineering Team  
**Date:** June 2026  
**Document Version:** 1.0.0  

---

## 1. Project Overview & Core Brand

**M-Tech Solutions** is a high-performance tech agency specializing in custom enterprise systems, Point-of-Sale (POS) architectures, inventory databases, and conversion-focused web applications.

This project delivers a premium, single-page corporate portal featuring Cuberto-level interactive animations, custom-engineered physics-based cursor tracking, fluid bento grids, and scroll-driven scrollytelling.

---

## 2. Project Architecture

The application is structured as a Vite-compiled React Single Page Application (SPA), styled with Tailwind CSS utility layers and animated using GSAP and Framer Motion.

```
M-Tech Solutions/
├── .firebaserc                       # Firebase project registry
├── firebase.json                     # Firebase Hosting rewrite rules and static folders
├── index.html                        # Main HTML entrypoint (Google Font payloads)
├── package.json                      # Dependencies and compiler scripts
├── postcss.config.js                 # PostCSS processor hook
├── tailwind.config.js                # Tailwind custom color palettes and typography
├── vite.config.js                    # Vite packaging config
└── src/
    ├── main.jsx                      # React application render root
    ├── App.css                       # Unused default styles (cleared)
    ├── App.jsx                       # Main shell coordinator
    ├── index.css                     # Global styles, scrollbar styling, cursor hides
    └── components/
        ├── CustomCursor.jsx          # Physics-based custom mouse cursor
        ├── Navbar.jsx                # Glassmorphic floating nav with magnetic components
        ├── Hero.jsx                  # Main viewport with math flow-wave canvas backdrop
        ├── About.jsx                 # Split-text ScrollTrigger animation module
        ├── Services.jsx              # Bento grid layout with cursor view morph states
        └── Footer.jsx                # High-impact contact bento card & SVG social links
```

### Key Animation Configurations
1. **Custom Cursor (`CustomCursor.jsx`)**:
   - Handles mouse move events using Framer Motion's `useSpring` and `useMotionValue` to establish physics-based inertia.
   - Utilizes event delegation on `document.mouseover` to check if a hovered element has `data-cursor="magnetic"` (triggering contrast blend expansion), `data-cursor="view"` (creating a blue badge with text), or `data-cursor="footer"` (expanding to a massive white overlay ring).
   - Gracefully ignores loading on touch devices or screens matching `(hover: none)`.

2. **Flow Wave Canvas (`Hero.jsx`)**:
   - Renders 4 overlapping trigonometric mathematical waves inside an HTML5 `<canvas>` using `requestAnimationFrame`.
   - Modulates the frequency, phase, and vertical shift of the waves dynamically based on the mouse coordinate distance from the center.

3. **Text Scroll Reveal (`About.jsx`)**:
   - Uses GSAP `ScrollTrigger` to track scrolling coordinates of the container.
   - Splits paragraphs into dynamic inline text spans, animating their opacity from `0.15` to `1` as the container scrolls through the screen's center.

---

## 3. Local Environment Setup

To run the application locally on your machine, follow these steps:

### Prerequisites
Make sure you have **Node.js** (v18.0.0 or later) and **npm** installed. Verify by running:
```bash
node --version
npm --version
```

### Step 1: Install Dependencies
Navigate to the root directory of the project and execute:
```bash
npm install
```
This installs Vite, React, GSAP, Framer Motion, Tailwind CSS, and Lucide Icons as defined in `package.json`.

### Step 2: Launch local development server
Run the development command:
```bash
npm run dev
```
The terminal will display the local development URL, usually `http://localhost:5173`. Open this URL in your web browser.

---

## 4. Firebase Deployment Roadmap

This codebase comes pre-configured for static single-page application hosting via Firebase.

### Step 1: Install Firebase CLI globally
If you do not have Firebase tools installed on your local computer, run:
```bash
npm install -g firebase-tools
```
*(Alternatively, you can run Firebase commands using `npx firebase-tools ...` without installing them globally).*

### Step 2: Log into your Google Account
Authenticate the CLI against your Firebase dashboard:
```bash
firebase login
```

### Step 3: Link/Initialize Firebase Project
If you already have a Firebase project created on your console:
1. Initialize the project connection:
   ```bash
   firebase init hosting
   ```
2. Select **Use an existing project** and pick your project ID.
3. When prompted:
   - *What do you want to use as your public directory?* Enter **`dist`** (Vite builds to `dist`).
   - *Configure as a single-page app (rewrite all urls to /index.html)?* Choose **`Yes`**.
   - *Set up automatic builds and deploys with GitHub?* Choose **`No`** (unless you want CI/CD).
   - *File dist/index.html already exists. Overwrite?* Choose **`No`**.

### Step 4: Build Production Assets
Run the Vite compilation script to generate optimized, static HTML, CSS, and JS bundles:
```bash
npm run build
```
This creates a compiled static site in the `/dist` directory.

### Step 5: Deploy to Firebase Hosting
Push the compiled build to Firebase Hosting:
```bash
firebase deploy --only hosting
```
Once complete, the CLI will output your live Hosting URL (e.g., `https://m-tech-solutions-app.web.app`).

---

## 5. Scaling & Maintenance Guide

Once your startup's social media handles are ready, follow these instructions to swap out the placeholders in the source code:

### How to insert actual Facebook and Instagram links:
1. Open the file [Footer.jsx](file:///Users/miantuahaafzal/Documents/M-Tech%20Solutions/src/components/Footer.jsx).
2. Locate the social media link containers at the bottom of the file (lines ~98 to ~128):
   - **Instagram Container**:
     ```jsx
     {/* Instagram Link */}
     <a
       href="#"
       data-cursor="magnetic"
       aria-label="Instagram"
       className="..."
     >
     ```
   - **Facebook Container**:
     ```jsx
     {/* Facebook Link */}
     <a
       href="#"
       data-cursor="magnetic"
       aria-label="Facebook"
       className="..."
     >
     ```
3. Replace the placeholder hash symbols (`href="#"`) with your live URLs:
   - For example: `href="https://instagram.com/mtechsolutions"` and `href="https://facebook.com/mtechsolutions"`.
4. Re-compile the application and re-deploy:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```
