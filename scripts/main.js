const MODULE_ID = "pf2e-hud-custom-themes";
const THEME_CLASS_PREFIX = "pf2e-hud-theme-";

// 1. Google Font URLs
const FONT_IMPORTS = {
    orbitron: "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&display=swap",
    rajdhani: "https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&display=swap",
    cinzel: "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&display=swap",
    inter: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
};

// 2. Font Stack Resolver
function resolveFontStack(fontFamily) {
    switch (fontFamily) {
        case "system": return "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
        case "serif": return "Georgia, 'Times New Roman', serif";
        case "monospace": return "'Courier New', Courier, monospace";
        case "orbitron": return "'Orbitron', sans-serif";
        case "rajdhani": return "'Rajdhani', sans-serif";
        case "cinzel": return "'Cinzel', serif";
        case "inter": return "'Inter', sans-serif";
        default: return "inherit";
    }
}

Hooks.once("init", () => {
    // Theme Selector
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
        onChange: () => applyThemeSettings()
    });

    // Font Selector (Restored)
    game.settings.register(MODULE_ID, "hudFont", {
        name: "HUD Font",
        hint: "Choose a custom font for the HUD interface. 'Default' defers to the active theme.",
        scope: "client",
        config: true,
        type: String,
        default: "default",
        choices: {
            "default": "Default Theme Font",
            "system": "System UI (Clean)",
            "serif": "Standard Serif",
            "monospace": "Monospace",
            "orbitron": "Orbitron (Sci-Fi)",
            "rajdhani": "Rajdhani (Tactical)",
            "cinzel": "Cinzel (Fantasy)",
            "inter": "Inter (Modern)"
        },
        onChange: () => applyThemeSettings()
    });

    // Colorize Macro Icons Toggle
    game.settings.register(MODULE_ID, "colorizeMacros", {
        name: "Colorize Macro Icons",
        hint: "Apply theme colors to action and spell shortcut images.",
        scope: "client",
        config: true,
        type: Boolean,
        default: true,
        onChange: () => applyThemeSettings()
    });

    // Colorize HUD Icons Toggle
    game.settings.register(MODULE_ID, "colorizeIcons", {
        name: "Colorize PF2e HUD Icons",
        hint: "Apply theme colors to the built-in SVG and font navigation icons.",
        scope: "client",
        config: true,
        type: Boolean,
        default: true,
        onChange: () => applyThemeSettings()
    });
});

Hooks.once("ready", () => {
    applyThemeSettings();
});

function applyThemeSettings() {
    const bodyClassList = document.body.classList;

    // Wipe existing theme classes
    bodyClassList.forEach(className => {
        if (className.startsWith(THEME_CLASS_PREFIX)) {
            bodyClassList.remove(className);
        }
    });

    // Apply active theme class
    const currentTheme = game.settings.get(MODULE_ID, "activeTheme");
    if (currentTheme !== "default") {
        bodyClassList.add(`${THEME_CLASS_PREFIX}${currentTheme}`);
    }

    // Apply colorization toggles as helper classes
    const colorizeMacros = game.settings.get(MODULE_ID, "colorizeMacros");
    const colorizeIcons = game.settings.get(MODULE_ID, "colorizeIcons");
    bodyClassList.toggle("pf2e-hud-colorize-macros", colorizeMacros);
    bodyClassList.toggle("pf2e-hud-colorize-icons", colorizeIcons);

    // Dynamic Font Injection (Restored)
    const fontSelection = game.settings.get(MODULE_ID, "hudFont");

    // Remove old font link if the user changes it
    const oldLink = document.getElementById("pf2e-hud-theme-font");
    if (oldLink) oldLink.remove();

    // If a Google Font is selected, inject the stylesheet into the document <head>
    if (FONT_IMPORTS[fontSelection]) {
        const link = document.createElement("link");
        link.id = "pf2e-hud-theme-font";
        link.rel = "stylesheet";
        link.href = FONT_IMPORTS[fontSelection];
        document.head.appendChild(link);
    }

    // Pass the chosen font to your CSS via inline variable
    if (fontSelection !== "default") {
        document.body.style.setProperty("--custom-font-stack", resolveFontStack(fontSelection));
    } else {
        document.body.style.removeProperty("--custom-font-stack");
    }
}