(function () {
  "use strict";

  const header = document.getElementById("siteHeader");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const yearEl = document.getElementById("year");
  const typedSkillEl = document.getElementById("typedSkill");
  const backTop = document.getElementById("backTop");
  const contactForm = document.getElementById("contactForm");
  const toast = document.getElementById("toast");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* Header scroll */
  function onScroll() {
    const y = window.scrollY;
    if (header) {
      header.classList.toggle("scrolled", y > 24);
    }
    if (backTop) {
      backTop.classList.toggle("visible", y > 500);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile nav */
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const open = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!open));
      navToggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
      navToggle.closest(".nav")?.classList.toggle("open", !open);
    });

    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open menu");
        navToggle.closest(".nav")?.classList.remove("open");
      });
    });
  }

  /* Smooth scroll */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  /* Active nav */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          const href = link.getAttribute("href");
          link.classList.toggle("active", href === `#${id}`);
        });
      });
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((s) => sectionObserver.observe(s));

  /* Reveal on scroll */
  const revealEls = document.querySelectorAll(".reveal");
  revealEls.forEach((el) => {
    const delay = el.getAttribute("data-delay");
    if (delay) {
      el.style.setProperty("--delay", `${delay}ms`);
    }
  });

  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  /* Skill bars */
  const skillGroups = document.querySelectorAll(".skill-group");
  const skillObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animated");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  skillGroups.forEach((g) => skillObserver.observe(g));

  /* Counter animation */
  const counters = document.querySelectorAll("[data-count]");
  const counterObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.getAttribute("data-count")) || 0;
        const suffix = el.textContent.includes("%") ? "%" : "";
        const duration = 1200;
        const start = performance.now();

        function tick(now) {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(target * eased) + (target === 30 ? "%" : "");
          if (t < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
        obs.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((c) => counterObserver.observe(c));

  /* Typed skills */
  if (typedSkillEl) {
    const skills = [
      "Java",
      "Spring Boot",
      "Microservices",
      "REST APIs",
      "Hibernate",
      "React.js",
      "MySQL",
      "Docker",
      "Spring Security",
      "JUnit"
    ];
    let skillIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeLoop() {
      const word = skills[skillIndex];
      typedSkillEl.textContent = word.slice(0, charIndex);
      const speed = deleting ? 40 : 85;

      if (!deleting && charIndex < word.length) {
        charIndex += 1;
        setTimeout(typeLoop, speed);
        return;
      }
      if (!deleting && charIndex === word.length) {
        deleting = true;
        setTimeout(typeLoop, 1400);
        return;
      }
      if (deleting && charIndex > 0) {
        charIndex -= 1;
        setTimeout(typeLoop, speed);
        return;
      }
      deleting = false;
      skillIndex = (skillIndex + 1) % skills.length;
      setTimeout(typeLoop, 320);
    }

    typeLoop();
  }

  /* Cert carousel */
  const certTrack = document.getElementById("certTrack");
  const certPrev = document.getElementById("certPrev");
  const certNext = document.getElementById("certNext");
  const certDots = document.getElementById("certDots");

  if (certTrack && certPrev && certNext && certDots) {
    const slides = Array.from(certTrack.children);
    let activeIndex = 0;
    let timer;

    function renderDots() {
      certDots.innerHTML = "";
      slides.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = `cert-dot${i === activeIndex ? " active" : ""}`;
        dot.setAttribute("aria-label", `Go to certification ${i + 1}`);
        dot.addEventListener("click", () => {
          activeIndex = i;
          update();
          restart();
        });
        certDots.appendChild(dot);
      });
    }

    function update() {
      certTrack.style.transform = `translateX(-${activeIndex * 100}%)`;
      renderDots();
    }

    function next() {
      activeIndex = (activeIndex + 1) % slides.length;
      update();
    }

    function prev() {
      activeIndex = (activeIndex - 1 + slides.length) % slides.length;
      update();
    }

    function start() {
      timer = setInterval(next, 5000);
    }

    function restart() {
      clearInterval(timer);
      start();
    }

    certNext.addEventListener("click", () => {
      next();
      restart();
    });
    certPrev.addEventListener("click", () => {
      prev();
      restart();
    });
    certTrack.addEventListener("mouseenter", () => clearInterval(timer));
    certTrack.addEventListener("mouseleave", start);

    update();
    start();
  }

  /* Contact form */
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3200);
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formNote = document.getElementById("formNote");
      if (formNote) {
        formNote.textContent = "Thanks! Your message was captured locally. Connect via email for fastest response.";
      }
      showToast("Message ready — replace with your backend or Formspree URL.");
      contactForm.reset();
    });
  }
})();
