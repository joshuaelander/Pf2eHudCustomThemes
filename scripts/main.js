const MODULE_ID = "pf2e-hud-custom-themes";
const THEME_CLASS_PREFIX = "pf2e-hud-theme-";
const FONT_IMPORTS = {
    orbitron: "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&display=swap",
    rajdhani: "https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&display=swap",
    cinzel: "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&display=swap",
    inter: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
};

// The four icon filter channels
const ICON_FILTER_CHANNELS = ["action", "spell", "item", "menu"];

Hooks.once("init", () => {
    game.settings.register(MODULE_ID, "activeTheme", {
        name: "HUD Theme",
        hint: "Select the visual theme for the PF2e HUD.",
        scope: "client",
        config: true,
        type: String,
        default: "xcom",
        choices: {
            "xcom": "XCOM Tactical",
            "cyberpunk": "Cyberpunk Neon",
            "fantasy": "Classic Fantasy",
            "pf2e": "PF2e Official",
            "default": "Default (None)"
        },
        onChange: () => applyTheme()
    });

    game.settings.register(MODULE_ID, "colorizeIcons", {
        name: "Colorize Macro Icons",
        hint: "Tint macro and shortcut images to better match the selected theme. Uses multiple color channels for different icon types.",
        scope: "client",
        config: true,
        type: Boolean,
        default: false,
        onChange: () => applyTheme()
    });

    game.settings.register(MODULE_ID, "colorizeHudIcons", {
        name: "Colorize PF2e HUD Icons",
        hint: "Tint built-in PF2e HUD buttons such as saves, actions, perception, and menu buttons. Uses multiple color channels.",
        scope: "client",
        config: true,
        type: Boolean,
        default: false,
        onChange: () => applyTheme()
    });

    game.settings.register(MODULE_ID, "fontFamily", {
        name: "HUD Font Override",
        hint: "Choose a font stack for HUD panels, tooltips, and menus.",
        scope: "client",
        config: true,
        type: String,
        default: "default",
        choices: {
            default: "Default",
            system: "System UI",
            serif: "Serif",
            monospace: "Monospace",
            orbitron: "Orbitron",
            rajdhani: "Rajdhani",
            cinzel: "Cinzel",
            inter: "Inter"
        },
        onChange: () => applyTheme()
    });
});

Hooks.once("ready", () => {
    applyTheme();
});

function applyTheme() {
    const bodyClassList = document.body.classList;
    bodyClassList.forEach((className) => {
        if (className.startsWith(THEME_CLASS_PREFIX)) {
            bodyClassList.remove(className);
        }
    });

    const themeName = game.settings.get(MODULE_ID, "activeTheme");
    const colorizeIcons = game.settings.get(MODULE_ID, "colorizeIcons");
    const colorizeHudIcons = game.settings.get(MODULE_ID, "colorizeHudIcons");
    const fontFamily = game.settings.get(MODULE_ID, "fontFamily");

    if (themeName && themeName !== "default") {
        document.body.classList.add(`${THEME_CLASS_PREFIX}${themeName}`);
    }

    document.body.style.setProperty("--custom-font-stack", resolveFontStack(fontFamily));

    // Multi-channel icon filters
    const filters = getIconFilters(themeName);
    const isActive = themeName !== "default";

    for (const channel of ICON_FILTER_CHANNELS) {
        // Macro / shortcut image filters
        document.body.style.setProperty(
            `--custom-macro-icon-filter-${channel}`,
            colorizeIcons && isActive ? filters[channel] : "none"
        );
        // HUD built-in icon filters (SVGs, button icons)
        document.body.style.setProperty(
            `--custom-hud-icon-filter-${channel}`,
            colorizeHudIcons && isActive ? filters[channel] : "none"
        );
    }

    // Keep a single combined property as a fallback for any selectors
    // that don't fit neatly into categories
    document.body.style.setProperty(
        "--custom-macro-icon-filter",
        colorizeIcons && isActive ? filters.action : "none"
    );
    document.body.style.setProperty(
        "--custom-hud-icon-filter",
        colorizeHudIcons && isActive ? filters.action : "none"
    );

    loadFont(fontFamily);
}

function loadFont(fontFamily) {
    const fontUrl = FONT_IMPORTS[fontFamily];
    if (!fontUrl) return;

    const existingLink = document.head.querySelector(`link[data-pf2e-hud-theme-font="${fontFamily}"]`);
    if (existingLink) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = fontUrl;
    link.dataset.pf2eHudThemeFont = fontFamily;
    document.head.appendChild(link);
}

/**
 * Returns an object with four filter channels per theme.
 * Each channel is a CSS filter string designed to harmonize with
 * the theme palette but produce visually distinct icon tints.
 */
function getIconFilters(themeName) {
    switch (themeName) {
        case "cyberpunk":
            return {
                action: "brightness(1.15) saturate(1.5) hue-rotate(320deg)",
                spell:  "brightness(1.1) saturate(1.4) hue-rotate(60deg)",
                item:   "brightness(1.15) saturate(1.3) hue-rotate(175deg)",
                menu:   "brightness(1.08) saturate(1.2) hue-rotate(290deg)"
            };
        case "fantasy":
            return {
                action: "brightness(1.1) saturate(1.3) sepia(0.35) hue-rotate(-15deg)",
                spell:  "brightness(1.05) saturate(1.4) sepia(0.2) hue-rotate(220deg)",
                item:   "brightness(1.12) saturate(1.2) sepia(0.3) hue-rotate(60deg)",
                menu:   "brightness(1.08) saturate(1.1) sepia(0.4) hue-rotate(-30deg)"
            };
        case "pf2e":
            return {
                action: "brightness(1.1) saturate(1.3) hue-rotate(345deg)",
                spell:  "brightness(1.05) saturate(1.25) hue-rotate(220deg)",
                item:   "brightness(1.12) saturate(1.15) sepia(0.2) hue-rotate(35deg)",
                menu:   "brightness(1.05) saturate(1.05) hue-rotate(10deg)"
            };
        case "xcom":
        default:
            return {
                action: "brightness(1.15) saturate(1.4) hue-rotate(180deg)",
                spell:  "brightness(1.1) saturate(1.5) hue-rotate(260deg)",
                item:   "brightness(1.2) saturate(1.3) hue-rotate(140deg)",
                menu:   "brightness(1.05) saturate(1.1) hue-rotate(190deg)"
            };
    }
}

function resolveFontStack(fontFamily) {
    switch (fontFamily) {
        case "system":
            return "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
        case "serif":
            return "Georgia, 'Times New Roman', serif";
        case "monospace":
            return "'Courier New', Courier, monospace";
        case "orbitron":
            return "'Orbitron', 'Segoe UI', sans-serif";
        case "rajdhani":
            return "'Rajdhani', 'Segoe UI', sans-serif";
        case "cinzel":
            return "'Cinzel', Georgia, serif";
        case "inter":
            return "'Inter', 'Segoe UI', sans-serif";
        default:
            return "inherit";
    }
}