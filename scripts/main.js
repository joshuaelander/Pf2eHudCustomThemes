Hooks.once("init", () => {
    // Register the dropdown in Foundry's configuration menu
    game.settings.register("pf2e-hud-custom-themes", "activeTheme", {
        name: "HUD Theme",
        hint: "Select the visual theme for the PF2e HUD.",
        scope: "client", // Allows each player to pick their own theme
        config: true,
        type: String,
        default: "xcom",
        choices: {
            "xcom": "XCOM Tactical",
            "default": "Default (None)"
        },
        onChange: (value) => applyTheme(value)
    });
});

Hooks.once("ready", () => {
    // Apply the saved theme when the game loads
    const currentTheme = game.settings.get("pf2e-hud-custom-themes", "activeTheme");
    applyTheme(currentTheme);
});

function applyTheme(themeName) {
    const bodyClassList = document.body.classList;
    
    // Wipe any existing theme classes to prevent conflicts
    bodyClassList.forEach(className => {
        if (className.startsWith("pf2e-hud-theme-")) {
            bodyClassList.remove(className);
        }
    });

    // Inject the new theme class onto the body
    if (themeName !== "default") {
        document.body.classList.add(`pf2e-hud-theme-${themeName}`);
    }
}