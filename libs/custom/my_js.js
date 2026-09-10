document.addEventListener("DOMContentLoaded", () => {
  const setAbstractLabel = (button, isOpen) => {
    const noun = button.dataset.labelNoun || "abstract";
    button.textContent = `${isOpen ? "Hide" : "Show"} ${noun}`;
  };

  const closeAbstract = (button) => {
    const panel = document.getElementById(button.getAttribute("aria-controls"));
    button.setAttribute("aria-expanded", "false");
    setAbstractLabel(button, false);
    if (panel) {
      panel.hidden = true;
      panel.setAttribute("aria-hidden", "true");
    }
  };

  const openAbstract = (button) => {
    const panel = document.getElementById(button.getAttribute("aria-controls"));
    button.setAttribute("aria-expanded", "true");
    setAbstractLabel(button, true);
    if (panel) {
      panel.hidden = false;
      panel.setAttribute("aria-hidden", "false");
    }
  };

  document.querySelectorAll(".toggle-abstract").forEach((button) => {
    setAbstractLabel(button, false);
    const panel = document.getElementById(button.getAttribute("aria-controls"));
    if (panel) {
      panel.hidden = true;
      panel.setAttribute("aria-hidden", "true");
    }

    button.addEventListener("click", () => {
      const isOpen = button.getAttribute("aria-expanded") === "true";
      document.querySelectorAll(".toggle-abstract").forEach((otherButton) => {
        if (otherButton !== button) {
          closeAbstract(otherButton);
        }
      });

      if (isOpen) {
        closeAbstract(button);
      } else {
        openAbstract(button);
      }
    });
  });
});
