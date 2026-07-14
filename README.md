 # Custom Themes for PF2e HUD

A non-destructive, purely visual theme engine for the [PF2e HUD](https://foundryvtt.com/packages/pf2e-hud) module in Foundry VTT.

## 📖 Overview

PF2e HUD is an incredibly powerful utilitarian dashboard for Pathfinder 2e, but its default aesthetic is highly functional rather than thematic. This module acts as a **Presentation Layer Overlay**. 

Rather than relying on fragile JavaScript render hooks that break when the core module updates, this project uses a strict **CSS-only injection architecture**. It safely layers new geometries, colors, and animations over the existing DOM structure without ever touching the underlying event listeners or action economy logic.

## ⚙️ How It Works

The module utilizes a three-step pipeline to apply themes safely:

1. **The Settings Injector:** `main.js` registers a dropdown in the core Foundry settings menu. When a player selects a theme, it applies a master scoping class (e.g., `.pf2e-hud-theme-xcom`) directly to the `document.body`. This allows individual players to choose their own UI themes without affecting the GM or other players.
2. **Variable Hijacking:** The base module uses CSS variables for its layout (e.g., `--panel-background`, `--outer-border`, `--outer-border-radius`) applied to the `#pf2e-hud-persistent` container[cite: 3]. This theme engine hijacks those root variables, forcing the base HUD to natively inherit our custom colors and border styles without complex overriding.
3. **Targeted Clip-Paths:** To reshape the UI, we map custom CSS `clip-path` geometries directly to the base module's stable layout attributes, such as `[data-panel="shortcuts"]`[cite: 1] and `#hotbar #action-bar li`[cite: 4].

## 🚀 Current Implementations

### The XCOM Tactical Theme
A sleek, modern sci-fi interface inspired by tactical RPGs, perfect for modern, sci-fi, or cyberpunk campaigns.
* **Angled Geometries:** Replaces standard rounded corners with sharp, `clip-path` polygon cuts on all major panels and action shortcuts.
* **Holographic Glows:** Utilizes layered `box-shadow` and `text-shadow` properties to create a CRT-style emission effect.
* **Color Palette:** Deep navy backgrounds (`#11212C`) heavily contrasted by neon cyan borders (`#3FD6FF`).
* **Macro Integration:** Seamlessly applies the XCOM aesthetic to standard Foundry hotbar macros dragged into the HUD ecosystem.

## 🗺️ Development Milestones

### ✅ Phase 1: Core Architecture & Visual Theme Engine (Completed)
- [x] Establish safe `module.json` dependency loading (loads after core PF2e HUD).
- [x] Build the `main.js` theme-switcher and settings registration.
- [x] Map the core CSS Developer Targets (`#pf2e-hud-persistent`, `[data-panel]`, etc.).
- [x] Implement the **XCOM Tactical** theme using CSS variables and `clip-path` geometries.
- [x] Verify zero conflicts with `ApplicationV2` render lifecycles.

### ⏳ Phase 2: Theme Expansion (Completed)
The architecture is built to support infinite themes. The next step is expanding the visual roster.
- [x] **Fantasy / Parchment Theme:** Leather textures, brass borders, and stylized serif typography.
- [x] **Cyberpunk Theme:** High-contrast neon pink/yellow, glitch animations on hover, and darkened glass panels.
- [x] **Minimalist Dark Mode:** Stripping away all borders and using pure negative space and subtle drop-shadows for a distraction-free UI.

### ✅ Phase 3: User Customization & Polish (Completed)
Giving users more control over their chosen theme without needing to edit CSS files.
- [x] **Theme-Aware HUD Tooltips:** Tooltip styling now inherits the active HUD theme so hover info feels consistent with the rest of the interface.
- [x] **Icon Tinting Toggle:** A module setting lets users tint HUD and menu icons to better match the selected theme.
- [x] **Font Overrides:** Module settings now allow users to choose HUD and menu font stacks, including Google-hosted options such as Orbitron, Rajdhani, Cinzel, and Inter.