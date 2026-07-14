Hooks.once("init", () => {
    game.settings.register("pf2e-hud-custom-themes", "activeTheme", {
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
        onChange: (value) => applyTheme(value)
    });
});

Hooks.once("ready", () => {
    const currentTheme = game.settings.get("pf2e-hud-custom-themes", "activeTheme");
    applyTheme(currentTheme);
});

function applyTheme(themeName) {
    const bodyClassList = document.body.classList;
    bodyClassList.forEach(className => {
        if (className.startsWith("pf2e-hud-theme-")) {
            bodyClassList.remove(className);
        }
    });

    if (themeName !== "default") {
        document.body.classList.add(`pf2e-hud-theme-${themeName}`);
    }
}