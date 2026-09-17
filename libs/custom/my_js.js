document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".toggle-abstract").forEach((button) => {
    const panel = document.getElementById(button.getAttribute("aria-controls"));
    const verb = button.querySelector(".toggle-verb");

    button.addEventListener("click", () => {
      const isOpen = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!isOpen));
      if (verb) {
        verb.textContent = isOpen ? "Show" : "Hide";
      }
      if (panel) {
        panel.hidden = isOpen;
      }
    });
  });
});
