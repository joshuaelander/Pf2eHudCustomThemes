const MODULE_ID = "pf2e-hud-custom-themes";
const THEME_CLASS_PREFIX = "pf2e-hud-theme-";
const FONT_IMPORTS = {
    orbitron: "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&display=swap",
    rajdhani: "https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&display=swap",
    cinzel: "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&display=swap",
    inter: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
};

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
        name: "Colorize HUD Icons",
        hint: "Tint HUD and menu icons to better match the selected theme.",
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
    const fontFamily = game.settings.get(MODULE_ID, "fontFamily");

    if (themeName && themeName !== "default") {
        document.body.classList.add(`${THEME_CLASS_PREFIX}${themeName}`);
    }

    document.body.style.setProperty("--custom-font-stack", resolveFontStack(fontFamily));
    document.body.style.setProperty(
        "--custom-icon-filter",
        colorizeIcons && themeName !== "default"
            ? "brightness(1.08) saturate(1.25) drop-shadow(0 0 4px var(--custom-glow, rgba(255,255,255,0.2)))"
            : "none"
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