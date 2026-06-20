document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");
  const navLinks = nav ? [...nav.querySelectorAll("a[href^='#']")] : [];
  const faqButtons = [...document.querySelectorAll(".faq-trigger")];
  const revealItems = [...document.querySelectorAll(".reveal")];
  const yearNode = document.getElementById("year");
  const sections = [...document.querySelectorAll("main section[id]")];

  if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear());
  }

  const setHeaderState = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 12);
  };

  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  const closeMenu = () => {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
    document.body.style.overflow = "";
  };

  const openMenu = () => {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", "true");
    nav.classList.add("is-open");
    document.body.style.overflow = "hidden";
  };

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      if (expanded) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    document.addEventListener("click", (event) => {
      if (!nav.classList.contains("is-open")) return;
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (!nav.contains(target) && !toggle.contains(target)) {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 920) {
        closeMenu();
      }
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 920) {
        closeMenu();
      }
    });
  });

  faqButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const panelId = button.getAttribute("aria-controls");
      if (!panelId) return;
      const panel = document.getElementById(panelId);
      const item = button.closest(".faq-item");
      if (!panel || !item) return;

      const willOpen = button.getAttribute("aria-expanded") !== "true";

      faqButtons.forEach((otherButton) => {
        const otherPanelId = otherButton.getAttribute("aria-controls");
        const otherPanel = otherPanelId ? document.getElementById(otherPanelId) : null;
        const otherItem = otherButton.closest(".faq-item");

        otherButton.setAttribute("aria-expanded", "false");
        if (otherPanel) otherPanel.hidden = true;
        if (otherItem) otherItem.classList.remove("is-open");
      });

      if (willOpen) {
        button.setAttribute("aria-expanded", "true");
        panel.hidden = false;
        item.classList.add("is-open");
      }
    });
  });

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  if ("IntersectionObserver" in window && sections.length > 0 && navLinks.length > 0) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute("id");
          if (!id) return;

          navLinks.forEach((link) => {
            const isMatch = link.getAttribute("href") === `#${id}`;
            link.classList.toggle("is-active", isMatch);
          });
        });
      },
      {
        threshold: 0.4
      }
    );

    sections.forEach((section) => navObserver.observe(section));
  }
});
