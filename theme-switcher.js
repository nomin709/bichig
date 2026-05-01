(() => {
  const THEMES = [
    { key: "theme-default", label: "Current Pixel", short: "PIX" },
    { key: "theme-arcade-dark", label: "Darker Arcade", short: "ARC" },
    { key: "theme-gameboy-light", label: "Brighter GameBoy", short: "GBY" },
  ];

  const STORAGE_KEY = "script-bridge-theme";
  const validThemeKeys = new Set(THEMES.map((theme) => theme.key));

  const getInitialTheme = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return validThemeKeys.has(stored) ? stored : "theme-default";
  };

  const applyTheme = (themeKey) => {
    document.body.classList.remove("theme-arcade-dark", "theme-gameboy-light");
    if (themeKey === "theme-arcade-dark" || themeKey === "theme-gameboy-light") {
      document.body.classList.add(themeKey);
    }

    const buttons = document.querySelectorAll(".theme-option");
    buttons.forEach((btn) => {
      const isActive = btn.dataset.theme === themeKey;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });

    const theme = THEMES.find((item) => item.key === themeKey) || THEMES[0];
    const currentTag = document.querySelector(".theme-current");
    const trigger = document.querySelector(".theme-trigger");
    if (currentTag) {
      currentTag.textContent = theme.short;
    }
    if (trigger) {
      trigger.setAttribute("title", `Theme: ${theme.label}`);
      trigger.setAttribute("aria-label", `Theme menu. Current: ${theme.label}`);
    }
  };

  const initialTheme = getInitialTheme();

  const mount = () => {
    if (document.querySelector(".theme-switcher")) {
      applyTheme(initialTheme);
      return;
    }

    const switcher = document.createElement("aside");
    switcher.className = "theme-switcher";
    switcher.setAttribute("aria-label", "Theme switcher");

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "theme-trigger";
    trigger.setAttribute("aria-haspopup", "true");
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-controls", "theme-dropdown-menu");

    const triggerLabel = document.createElement("span");
    triggerLabel.className = "theme-trigger-label";
    triggerLabel.textContent = "Theme";

    const triggerCurrent = document.createElement("span");
    triggerCurrent.className = "theme-current";
    triggerCurrent.setAttribute("aria-hidden", "true");

    trigger.appendChild(triggerLabel);
    trigger.appendChild(triggerCurrent);
    switcher.appendChild(trigger);

    const dropdown = document.createElement("div");
    dropdown.className = "theme-dropdown";
    dropdown.id = "theme-dropdown-menu";
    dropdown.hidden = true;

    const dropdownTitle = document.createElement("p");
    dropdownTitle.className = "theme-dropdown-header";
    dropdownTitle.textContent = "Choose Theme";
    dropdown.appendChild(dropdownTitle);

    const grid = document.createElement("div");
    grid.className = "theme-switcher-grid";
    grid.setAttribute("role", "group");
    grid.setAttribute("aria-label", "Theme options");

    THEMES.forEach((theme) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "theme-option";
      btn.dataset.theme = theme.key;
      btn.setAttribute("aria-label", theme.label);
      btn.setAttribute("title", theme.label);

      const swatch = document.createElement("span");
      swatch.className = "theme-swatch";
      swatch.setAttribute("aria-hidden", "true");

      const code = document.createElement("span");
      code.className = "theme-code";
      code.textContent = theme.short;

      const name = document.createElement("span");
      name.className = "theme-name";
      name.textContent = theme.label;

      btn.appendChild(swatch);
      btn.appendChild(code);
      btn.appendChild(name);

      btn.addEventListener("click", () => {
        localStorage.setItem(STORAGE_KEY, theme.key);
        applyTheme(theme.key);
        switcher.classList.remove("open");
        trigger.setAttribute("aria-expanded", "false");
        dropdown.hidden = true;
      });
      grid.appendChild(btn);
    });

    dropdown.appendChild(grid);
    switcher.appendChild(dropdown);

    const navInner = document.querySelector(".top-nav-inner");
    const navLinks = navInner?.querySelector(".nav-links");
    if (navLinks) {
      navLinks.insertAdjacentElement("afterend", switcher);
    } else if (navInner) {
      navInner.appendChild(switcher);
    } else {
      document.body.appendChild(switcher);
    }

    const setOpen = (isOpen) => {
      switcher.classList.toggle("open", isOpen);
      trigger.setAttribute("aria-expanded", String(isOpen));
      dropdown.hidden = !isOpen;
    };

    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      setOpen(!switcher.classList.contains("open"));
    });

    document.addEventListener("click", (event) => {
      if (!switcher.contains(event.target)) {
        setOpen(false);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        const wasOpen = switcher.classList.contains("open");
        setOpen(false);
        if (wasOpen) {
          trigger.focus();
        }
      }
    });

    applyTheme(initialTheme);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
