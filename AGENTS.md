# Repository Guidelines

# What this app is

I am a Human Computer Interaction student. 

My task for my course project is to create three prototypes for a redesign of YouTube's video player page.

The three redesigns will be deployed on three separate Vercel or GitHub Pages pages for people to click around on.

And so the question then is, what are the three redesigns?

# Three prototypes for UXUI improvements to YouTube

## What is the problem being solved?

Problem statement: People have difficulty finding the hotkeys to use with the keyboard.

Solution statement: Provide enhancements to discoverability via the Settings menu.

Three possibilities:

### 4.1 Design one: “Always show hotkeys” toggle

I will modify the YouTube settings menu to have a toggle for showing hotkeys over the player at all times. I selected this one because it was relevant and simple to implement.

### 4.2 Design two: Click to Show Hotkeys (Briefly)

I will add a menu option that allows the user to  briefly show all hotkeys, until one is pressed, allowing learning to occur. I selected this one again because it addresses a real reported problem and cannot be construed as a bug.

### 4.3 Design three: A manual page showing all hotkeys

I will add a toggleable popup that displays all video player page hotkeys without becoming a chore to read through overwhelm. I again select this option over my initial plan (“focus the keyboard back on the player”) because this problem was reported most often and cannot be construed as a bug.


# A short break to discuss ethics

ChatGPT told me, "don't copy their font, their logo, or imply that the visitor is actually on YouTube."

As you can see from the code, nothing like that has occurred.

In fact, due to the nature of the UXUI change being tested, it's actually *completely fine* if the YouTube mockup only kinda-sorta looks like YouTube.

Think, "somewhat low-fidelity is good here." I am not testing anything concerning aesthetics: I am testing a feature. Hence to have simple (but not distractingly bad) aesthetics is actually a good thing.

## Project Structure & Module Organization
The React + TypeScript app lives in `src/`, where `main.tsx` boots `App.tsx` and related hooks. Styles sit alongside components (`App.css`, `index.css`), and component-specific imagery belongs in `src/assets/`. Use the top-level `assets/` folder for design references or research artifacts that inform implementation. Static files served as-is go in `public/`; Vite emits production bundles to `dist/`, which should stay untracked. When introducing new modules, group shared utilities under `src/lib/` and keep feature-specific code in dedicated subfolders to preserve navigability.

## Build, Test, and Development Commands
- `npm install` — synchronize dependencies before making changes.
- `npm run dev` — start the Vite dev server with hot module reloading on http://localhost:5173.
- `npm run build` — run TypeScript project references (`tsc -b`) and produce an optimized production build.
- `npm run preview` — serve the last build locally for production-accurate smoke testing.
- `npm run lint` — execute ESLint with the repo’s `eslint.config.js`; fix warnings before pushing.

## Coding Style & Naming Conventions
Author functional React components with TypeScript annotations and the existing two-space indentation. Prefer single quotes, trailing commas, and descriptive hook names, matching the patterns in `src/App.tsx`. Name component files and exported components in PascalCase (`VideoControls.tsx`), hooks in camelCase (`useHotkeys.ts`), and CSS modules as `Component.module.css` when needed. Rely on the configured ESLint rules for consistency; if your editor formats code, align it with lint output to prevent churn.

## Testing Guidelines
Automated testing is not wired up yet, so document manual validation steps in pull requests and use `npm run preview` to verify interactive flows. When tests are introduced, colocate them with their subjects (`Component.test.tsx`) and adopt Vitest with React Testing Library for user-centric assertions. Keep test descriptions action-oriented and include accessibility expectations (focus states, keyboard shortcuts) to reflect the project’s HCI emphasis.

## Commit & Pull Request Guidelines
Existing commit history favors concise, action-led messages (e.g., “arrow keys control volume, time position”). Follow that tone, stay under ~72 characters, and scope each commit to a single concern. Pull requests should explain the problem, the solution, and how you validated it, linking issues or design docs when available. Include screenshots or screen recordings for UI changes and list follow-up tasks so reviewers understand remaining risks.
