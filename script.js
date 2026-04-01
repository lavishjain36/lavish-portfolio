const menuToggle = document.getElementById("menuToggle");
const mobileNav = document.getElementById("mobileNav");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const yearEl = document.getElementById("year");
const mobileLinks = document.querySelectorAll(".mobile-link");
const typedSkillEl = document.getElementById("typedSkill");

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.documentElement.classList.toggle("dark", isDark);
  if (themeIcon) {
    themeIcon.textContent = isDark ? "☀️" : "🌙";
  }
}

function getPreferredTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

applyTheme(getPreferredTheme());

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.classList.contains("dark") ? "dark" : "light";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", nextTheme);
    applyTheme(nextTheme);
  });
}

if (menuToggle && mobileNav) {
  menuToggle.addEventListener("click", () => {
    mobileNav.classList.toggle("hidden");
  });
}

mobileLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileNav.classList.add("hidden");
  });
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const targetId = anchor.getAttribute("href");
    const target = targetId ? document.querySelector(targetId) : null;

    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

if (typedSkillEl) {
  const skills = [
    "Java",
    "Spring Boot",
    "React.js",
    "MySQL",
    "MongoDB",
    "JavaScript",
    "Docker",
    "Microservices",
    "Spring AI",
    "Spring MVC",
    "HTML",
    "CSS"
  ];

  let skillIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function runTypeAnimation() {
    const currentSkill = skills[skillIndex];
    typedSkillEl.textContent = currentSkill.slice(0, charIndex);

    const typeSpeed = isDeleting ? 45 : 85;

    if (!isDeleting && charIndex < currentSkill.length) {
      charIndex += 1;
      setTimeout(runTypeAnimation, typeSpeed);
      return;
    }

    if (!isDeleting && charIndex === currentSkill.length) {
      isDeleting = true;
      setTimeout(runTypeAnimation, 1100);
      return;
    }

    if (isDeleting && charIndex > 0) {
      charIndex -= 1;
      setTimeout(runTypeAnimation, typeSpeed);
      return;
    }

    isDeleting = false;
    skillIndex = (skillIndex + 1) % skills.length;
    setTimeout(runTypeAnimation, 280);
  }

  runTypeAnimation();
}

const certTrack = document.getElementById("certTrack");
const certPrev = document.getElementById("certPrev");
const certNext = document.getElementById("certNext");
const certDots = document.getElementById("certDots");

if (certTrack && certPrev && certNext && certDots) {
  const slides = Array.from(certTrack.children);
  let activeIndex = 0;
  let autoSlideTimer;

  function renderDots() {
    certDots.innerHTML = "";
    slides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.className = `cert-dot ${index === activeIndex ? "active" : ""}`;
      dot.setAttribute("aria-label", `Go to certification ${index + 1}`);
      dot.addEventListener("click", () => {
        activeIndex = index;
        updateCarousel();
        restartAutoSlide();
      });
      certDots.appendChild(dot);
    });
  }

  function updateCarousel() {
    certTrack.style.transform = `translateX(-${activeIndex * 100}%)`;
    renderDots();
  }

  function goNext() {
    activeIndex = (activeIndex + 1) % slides.length;
    updateCarousel();
  }

  function goPrev() {
    activeIndex = (activeIndex - 1 + slides.length) % slides.length;
    updateCarousel();
  }

  function startAutoSlide() {
    autoSlideTimer = setInterval(goNext, 4500);
  }

  function restartAutoSlide() {
    clearInterval(autoSlideTimer);
    startAutoSlide();
  }

  certNext.addEventListener("click", () => {
    goNext();
    restartAutoSlide();
  });

  certPrev.addEventListener("click", () => {
    goPrev();
    restartAutoSlide();
  });

  certTrack.addEventListener("mouseenter", () => clearInterval(autoSlideTimer));
  certTrack.addEventListener("mouseleave", startAutoSlide);

  updateCarousel();
  startAutoSlide();
}

const mousePointer = document.getElementById("mousePointer");
const bubbleLayer = document.getElementById("bubbleLayer");

if (mousePointer && bubbleLayer && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  let lastBubbleTime = 0;
  const magneticTargets = document.querySelectorAll(
    "a, button, .project-card, .skills-card, .cert-slide"
  );

  magneticTargets.forEach((target) => {
    target.classList.add("magnetic-target");

    target.addEventListener("mousemove", (event) => {
      const rect = target.getBoundingClientRect();
      const offsetX = (event.clientX - (rect.left + rect.width / 2)) * 0.08;
      const offsetY = (event.clientY - (rect.top + rect.height / 2)) * 0.08;
      target.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
    });

    target.addEventListener("mouseleave", () => {
      target.style.transform = "";
    });
  });

  function movePointer(event) {
    const { clientX, clientY } = event;
    mousePointer.style.transform = `translate(${clientX}px, ${clientY}px) translate(-50%, -50%)`;

    const now = Date.now();
    if (now - lastBubbleTime < 75) {
      return;
    }
    lastBubbleTime = now;

    const bubble = document.createElement("span");
    bubble.className = "trail-bubble";
    const size = 4 + Math.random() * 6;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${clientX}px`;
    bubble.style.top = `${clientY}px`;
    bubbleLayer.appendChild(bubble);

    setTimeout(() => bubble.remove(), 720);
  }

  document.addEventListener("mousemove", movePointer);
  document.addEventListener("mousedown", () => mousePointer.classList.add("pointer-active"));
  document.addEventListener("mouseup", () => mousePointer.classList.remove("pointer-active"));
}
