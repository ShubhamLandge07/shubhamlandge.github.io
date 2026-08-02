(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -----------------------------------------------------------
     Footer year
     ----------------------------------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -----------------------------------------------------------
     Navbar: scrolled state, mobile toggle, active link
     ----------------------------------------------------------- */
  const navbar = document.getElementById("navbar");
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");

  const onScrollNav = () => {
    navbar.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const sections = document.querySelectorAll("main section[id]");
  const navAnchors = navLinks ? navLinks.querySelectorAll("a[href^='#']") : [];
  if (sections.length && navAnchors.length && "IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navAnchors.forEach((a) => a.classList.remove("is-active"));
          const active = navLinks.querySelector(`a[href="#${entry.target.id}"]`);
          if (active) active.classList.add("is-active");
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => navObserver.observe(s));
  }

  /* -----------------------------------------------------------
     Hero: typing role effect
     ----------------------------------------------------------- */
  const typingEl = document.getElementById("typing-role");
  const roles = [
    "Data Science Student",
    "Aspiring Data Analyst",
    "Machine Learning Enthusiast",
    "Python & SQL Practitioner",
  ];

  if (typingEl && !prefersReducedMotion) {
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const tick = () => {
      const current = roles[roleIndex];
      if (!deleting) {
        charIndex++;
        typingEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, 1600);
          return;
        }
      } else {
        charIndex--;
        typingEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }
      setTimeout(tick, deleting ? 35 : 65);
    };
    tick();
  } else if (typingEl) {
    typingEl.textContent = roles[0];
  }

  /* -----------------------------------------------------------
     Hero: constellation canvas background
     ----------------------------------------------------------- */
  const canvas = document.getElementById("constellation");
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext("2d");
    let width, height, nodes;
    const NODE_COUNT = 70;
    const LINK_DIST = 140;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = canvas.width = rect.width;
      height = canvas.height = rect.height;
    };

    const makeNodes = () => {
      nodes = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }));
    };

    const step = () => {
      ctx.clearRect(0, 0, width, height);
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      });
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DIST) {
            ctx.strokeStyle = `rgba(167, 139, 250, ${0.12 * (1 - dist / LINK_DIST)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
      nodes.forEach((n) => {
        ctx.fillStyle = "rgba(45, 212, 191, 0.55)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(step);
    };

    resize();
    makeNodes();
    step();
    window.addEventListener("resize", () => {
      resize();
      makeNodes();
    });
  }

  /* -----------------------------------------------------------
     Scroll reveal for .reveal elements
     ----------------------------------------------------------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* -----------------------------------------------------------
     Skill bars: fill to their data-width when scrolled into view
     ----------------------------------------------------------- */
  const skillBars = document.querySelectorAll(".skill-bar span[data-width]");
  if ("IntersectionObserver" in window && skillBars.length) {
    const barObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const span = entry.target;
          const bar = span.closest(".skill-bar");
          span.style.setProperty("--target-width", `${span.dataset.width}%`);
          bar.classList.add("is-filled");
          obs.unobserve(span);
        });
      },
      { threshold: 0.4 }
    );
    skillBars.forEach((bar) => barObserver.observe(bar));
  } else {
    skillBars.forEach((span) => {
      span.style.setProperty("--target-width", `${span.dataset.width}%`);
      span.closest(".skill-bar").classList.add("is-filled");
    });
  }

  /* -----------------------------------------------------------
     Contact form: validate, then hand off to mailto:
     ----------------------------------------------------------- */
  const form = document.getElementById("contact-form");
  if (form) {
    const fields = {
      name: { input: document.getElementById("cf-name"), error: document.getElementById("err-name") },
      email: { input: document.getElementById("cf-email"), error: document.getElementById("err-email") },
      message: { input: document.getElementById("cf-message"), error: document.getElementById("err-message") },
    };
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const setError = (field, message) => {
      field.input.closest(".form-row").classList.toggle("has-error", Boolean(message));
      field.error.textContent = message || "";
    };

    const validate = () => {
      let valid = true;
      if (!fields.name.input.value.trim()) {
        setError(fields.name, "Please enter your name.");
        valid = false;
      } else {
        setError(fields.name, "");
      }
      if (!emailPattern.test(fields.email.input.value.trim())) {
        setError(fields.email, "Please enter a valid email.");
        valid = false;
      } else {
        setError(fields.email, "");
      }
      if (!fields.message.input.value.trim()) {
        setError(fields.message, "Please add a short message.");
        valid = false;
      } else {
        setError(fields.message, "");
      }
      return valid;
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!validate()) return;

      const name = fields.name.input.value.trim();
      const email = fields.email.input.value.trim();
      const message = fields.message.input.value.trim();
      const subject = encodeURIComponent(`Portfolio contact from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);

      window.location.href = `mailto:landgeshubham438@gmail.com?subject=${subject}&body=${body}`;

      const note = document.getElementById("form-note");
      if (note) note.textContent = "Opening your email client…";
    });

    Object.values(fields).forEach(({ input }) => {
      input.addEventListener("blur", validate);
    });
  }
})();
