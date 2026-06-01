document.addEventListener("DOMContentLoaded", () => {
  const overlay       = document.getElementById("reveal-overlay");
  const revealBtn     = document.getElementById("reveal-btn");
  const intro         = document.getElementById("intro");
  const flower        = document.getElementById("animation-flower");
  const rainContainer = document.getElementById("rain-container");

  // ---------- Rain ----------
  const MAX_DROPS = 120; // cap to prevent DOM bloat
  let rainInterval = null;

  function createRaindrop() {
    // Respect the cap
    if (rainContainer.children.length >= MAX_DROPS) {
      const oldest = rainContainer.firstElementChild;
      if (oldest) oldest.remove();
    }

    const drop = document.createElement("div");
    drop.className = "rain-drop";

    const x        = Math.random() * window.innerWidth;
    const delay    = Math.random() * 0.5;   // seconds
    const duration = Math.random() * 1.5 + 1.5; // 1.5–3 s

    drop.style.left              = `${x}px`;
    drop.style.animationDelay    = `${delay}s`;
    drop.style.animationDuration = `${duration}s`;

    rainContainer.appendChild(drop);

    // Remove drop from DOM once its animation ends (proper cleanup)
    drop.addEventListener("animationend", () => drop.remove(), { once: true });
  }

  function startRain() {
    if (rainInterval) return;
    rainInterval = setInterval(createRaindrop, 120);
  }

  // ---------- Reveal sequence ----------
  function startSequence() {
    // 1. Hide overlay
    overlay.classList.add("hidden");

    // Remove overlay from DOM after its fade-out finishes
    overlay.addEventListener("animationend", () => overlay.remove(), { once: true });

    // 2. Show intro text
    intro.classList.add("visible");
    intro.removeAttribute("aria-hidden");
    startRain();

    // 3. After ~3 s, fade out intro and show flowers
    setTimeout(() => {
      intro.classList.remove("visible");
      intro.classList.add("fade-out");

      // 4. Once intro is gone, show flowers
      setTimeout(() => {
        intro.setAttribute("aria-hidden", "true");
        flower.classList.add("visible");
        flower.removeAttribute("aria-hidden");
      }, 1000); // matches fade-out duration
    }, 3000);
  }

  // Button click — start the whole show
  revealBtn.addEventListener("click", startSequence);

  // Also allow pressing Enter/Space on the button (accessibility)
  revealBtn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      startSequence();
    }
  });
});
