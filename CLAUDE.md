# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Vite dev server with HMR
- `npm run build` — TypeScript check + Vite production build
- `npm run lint` — Run ESLint
- `npm run preview` — Preview production build locally

## Architecture

React 19 + TypeScript app built with Vite. Deployed to Netlify (config in `netlify.toml`). No test framework is configured.

### State Management

Game state is managed via `useReducer` in `src/context/GameContext.tsx`, exposed through a `GameProvider` context and consumed via the `useGame` hook (`src/hooks/useGame.ts`). All game mutations flow through `GameAction` dispatches (defined in `src/types/game.ts`). Stats are persisted to localStorage via `useLocalStorage` hook.

The reducer handles: cell selection, value setting, notes toggling, undo/redo (history/future stacks), new game creation, pause/resume, and timer ticks.

### Puzzle Generation

`src/utils/generator.ts` generates a complete board via backtracking, then removes cells while verifying unique solvability (`src/utils/solver.ts`). Clue counts per difficulty are in `src/utils/difficulty.ts`.

### Component Structure

- `App.tsx` — Top-level layout, keyboard handling, easter eggs (Konami code, zen mode, rainbow mode), stats tracking
- `components/Board/` — 9x9 grid and individual cells
- `components/Controls/` — NumberPad and ActionButtons (undo, notes toggle, etc.)
- `components/Header/` — Timer and DifficultySelect
- `components/WinModal/` — Completion overlay
- `components/Stats/` — Statistics modal

### Styling

CSS Modules (`*.module.css`) per component. Global styles in `src/index.css`.
