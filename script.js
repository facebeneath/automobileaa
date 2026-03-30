function setupRevealAnimation() {
  const revealItems = document.querySelectorAll(".reveal");
  if (!revealItems.length) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  revealItems.forEach((item) => observer.observe(item));
}

function ensureNavigationLayout() {
  const nav = document.querySelector(".main-nav");
  if (!nav) {
    return;
  }

  const navContainer = nav.querySelector(".container");
  const logo = nav.querySelector(".logo-link");
  const linksWrap = nav.querySelector(".nav-left, .nav-right");

  if (!navContainer || !logo || !linksWrap) {
    return;
  }

  linksWrap.classList.remove("nav-left");
  linksWrap.classList.add("nav-right");

  logo.classList.remove("logo-text");
  let desktopLogoImage = logo.querySelector("img");
  if (!desktopLogoImage) {
    desktopLogoImage = document.createElement("img");
    logo.textContent = "";
    logo.append(desktopLogoImage);
  }
  desktopLogoImage.src = "images/logo.png";
  desktopLogoImage.alt = "AUTOMOBILE A & A Logo";

  navContainer.prepend(logo);

  let mobileLogo = nav.querySelector(".nav-mobile-logo");
  if (!mobileLogo) {
    mobileLogo = document.createElement("a");
    mobileLogo.className = "nav-mobile-logo";
    mobileLogo.href = "index.html";
    mobileLogo.setAttribute("data-transition", "page");
    mobileLogo.setAttribute("aria-label", "Startseite");
    mobileLogo.innerHTML =
      '<img src="images/logo.png" alt="AUTOMOBILE A & A Logo" />';
    navContainer.prepend(mobileLogo);
  }

  const mobileLogoImage = mobileLogo.querySelector("img");
  if (mobileLogoImage) {
    mobileLogoImage.src = "images/logo.png";
    mobileLogoImage.alt = "AUTOMOBILE A & A Logo";
  }

  navContainer.append(linksWrap);

  const hasStartseite = Array.from(linksWrap.querySelectorAll("a")).some(
    (link) => (link.getAttribute("href") || "").trim() === "index.html",
  );

  if (!hasStartseite) {
    const homeLink = document.createElement("a");
    homeLink.href = "index.html";
    homeLink.setAttribute("data-transition", "page");
    homeLink.textContent = "Startseite";
    linksWrap.prepend(homeLink);
  }

  const ebayHref =
    "https://www.kleinanzeigen.de/s-bestandsliste.html?userId=154737761&utm_source=sharesheet&utm_campaign=socialbuttons&utm_medium=social_profil&utm_content=app_android";
  const hasEbay = Array.from(linksWrap.querySelectorAll("a")).some(
    (link) => (link.getAttribute("href") || "").trim() === ebayHref,
  );

  if (!hasEbay) {
    const ebayLink = document.createElement("a");
    ebayLink.href = ebayHref;
    ebayLink.target = "_blank";
    ebayLink.rel = "noopener noreferrer";
    ebayLink.textContent = "eBay";
    linksWrap.append(ebayLink);
  }

  let toggle = nav.querySelector(".nav-toggle");
  if (!toggle) {
    toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "nav-toggle";
    toggle.setAttribute("aria-label", "Navigation öffnen");
    toggle.innerHTML =
      "<span class='nav-toggle-line'></span><span class='nav-toggle-line'></span><span class='nav-toggle-line'></span>";
    navContainer.append(toggle);
  }

  toggle.addEventListener("click", () => {
    document.body.classList.toggle("nav-open");
  });
}

function setupScrollNavBehavior() {
  const nav = document.querySelector(".main-nav");
  if (!nav) {
    return;
  }

  let lastScrollY = window.scrollY || 0;
  let mobileNavVisible = true;

  const applyMobileNavState = (state) => {
    document.body.classList.remove(
      "nav-visible",
      "nav-mobile-top",
      "nav-compact",
    );

    if (state === "top") {
      document.body.classList.add("nav-mobile-top");
      return;
    }

    if (state === "visible") {
      document.body.classList.add("nav-visible", "nav-compact");
    }
  };

  const updateByScroll = () => {
    const isMobile = window.matchMedia("(max-width: 860px)").matches;
    const currentScrollY = window.scrollY || 0;
    const scrolled = currentScrollY > 24;
    const scrollDelta = currentScrollY - lastScrollY;
    const isScrollingUp = scrollDelta < -4;
    const isScrollingDown = scrollDelta > 4;

    if (isMobile) {
      if (!scrolled) {
        mobileNavVisible = true;
        applyMobileNavState("visible");
        document.body.classList.remove("nav-open");
      } else if (
        document.body.classList.contains("nav-open") ||
        isScrollingUp
      ) {
        mobileNavVisible = true;
        applyMobileNavState("visible");
      } else if (isScrollingDown) {
        mobileNavVisible = false;
        applyMobileNavState("hidden");
        document.body.classList.remove("nav-open");
      } else {
        applyMobileNavState(mobileNavVisible ? "visible" : "hidden");
      }
    } else if (scrolled) {
      document.body.classList.add("nav-visible");
      document.body.classList.remove("nav-mobile-top", "nav-compact");
      document.body.classList.remove("nav-open");
    } else {
      document.body.classList.add("nav-visible");
      document.body.classList.remove("nav-mobile-top", "nav-compact");
      document.body.classList.remove("nav-open");
    }

    lastScrollY = currentScrollY;
  };

  updateByScroll();
  window.addEventListener("scroll", updateByScroll, { passive: true });
  window.addEventListener("resize", () => {
    lastScrollY = window.scrollY || 0;
    updateByScroll();
  });
}

function setupOutsideClickToCloseMenu() {
  document.addEventListener("click", (event) => {
    if (!document.body.classList.contains("nav-open")) {
      return;
    }

    const nav = document.querySelector(".main-nav");
    if (!nav) {
      return;
    }

    const clickedInsideNav = nav.contains(event.target);
    if (!clickedInsideNav) {
      document.body.classList.remove("nav-open");
    }
  });
}

function setupPageTransitions() {
  const links = document.querySelectorAll("a[data-transition='page']");
  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      const target = link.getAttribute("target");

      if (
        !href ||
        href.startsWith("http") ||
        href.startsWith("#") ||
        target === "_blank"
      ) {
        return;
      }

      event.preventDefault();
      document.body.classList.add("fade-out");
      window.setTimeout(() => {
        window.location.href = href;
      }, 280);
    });
  });
}

function markActiveNav() {
  const current = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-left a, .nav-right a");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === current) {
      link.classList.add("active");
    }
  });
}

function setupContactForm() {
  const form = document.querySelector("#kontakt-form");
  const notice = document.querySelector("#form-notice");

  if (!form || !notice) {
    return;
  }

  const requiredFields = {
    name: form.querySelector("[name='name']"),
    email: form.querySelector("[name='email']"),
    message: form.querySelector("[name='message']"),
  };
  const startedAtField = form.querySelector("[name='form_started_at']");
  const honeypotField = form.querySelector("[name='website']");
  const startedAtUnix = Math.floor(Date.now() / 1000);

  if (startedAtField) {
    startedAtField.value = String(startedAtUnix);
  }

  const setNotice = (message, type) => {
    notice.textContent = message;
    notice.classList.remove("is-success", "is-error");
    if (type === "success") {
      notice.classList.add("is-success");
    }
    if (type === "error") {
      notice.classList.add("is-error");
    }
  };

  const markFieldError = (field, hasError) => {
    if (!field) {
      return;
    }

    if (hasError) {
      field.setAttribute("aria-invalid", "true");
      field.classList.add("is-invalid");
      return;
    }

    field.removeAttribute("aria-invalid");
    field.classList.remove("is-invalid");
  };

  const validate = () => {
    const name = String(requiredFields.name?.value || "").trim();
    const email = String(requiredFields.email?.value || "").trim();
    const message = String(requiredFields.message?.value || "").trim();
    const honeypot = String(honeypotField?.value || "").trim();
    const secondsOnPage = Math.floor(Date.now() / 1000) - startedAtUnix;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const errors = [];

    if (honeypot) {
      errors.push("Anfrage konnte nicht verarbeitet werden.");
    }

    if (secondsOnPage < 3) {
      errors.push("Bitte bestaetigen Sie Ihre Anfrage erneut.");
    }

    if (!name) {
      errors.push("Bitte Name eingeben.");
      markFieldError(requiredFields.name, true);
    } else {
      markFieldError(requiredFields.name, false);
    }

    if (!email || !emailPattern.test(email)) {
      errors.push("Bitte eine gueltige E-Mail eingeben.");
      markFieldError(requiredFields.email, true);
    } else {
      markFieldError(requiredFields.email, false);
    }

    if (!message) {
      errors.push("Bitte Nachricht eingeben.");
      markFieldError(requiredFields.message, true);
    } else {
      markFieldError(requiredFields.message, false);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  Object.values(requiredFields).forEach((field) => {
    if (!field) {
      return;
    }

    field.addEventListener("input", () => {
      markFieldError(field, false);
      if (notice.classList.contains("is-error")) {
        setNotice("", "");
      }
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const validation = validate();
    if (!validation.isValid) {
      setNotice(validation.errors[0], "error");
      return;
    }

    const submitButton =
      form.querySelector("button[type='submit']") ||
      form.querySelector("input[type='submit']");
    const initialButtonText = submitButton?.textContent || "";
    const formData = new FormData(form);

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Wird gesendet...";
    }
    setNotice("Bitte warten...", "");

    try {
      const response = await fetch("send_mail.php", {
        method: "POST",
        body: formData,
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      const rawText = await response.text();
      let result;
      try {
        result = JSON.parse(rawText);
      } catch {
        throw new Error("Der Server hat keine gueltige Antwort geliefert.");
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Fehler beim Senden der Anfrage.");
      }

      setNotice(
        result.message || "Ihre Anfrage wurde erfolgreich gesendet.",
        "success",
      );
      form.reset();
      Object.values(requiredFields).forEach((field) =>
        markFieldError(field, false),
      );
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Es ist ein unerwarteter Fehler aufgetreten.",
        "error",
      );
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = initialButtonText || "Anfrage senden";
      }
    }
  });
}

function ensureFooterLegalLinks() {
  const footerInner = document.querySelector(".footer-inner");
  if (!footerInner) {
    return;
  }

  const creditsColumn = footerInner.querySelector(".footer-col.footer-credits");

  const footerParagraphs = footerInner.querySelectorAll("p");
  if (footerParagraphs[0]) {
    footerParagraphs[0].classList.add("footer-address");
  }
  if (footerParagraphs[1]) {
    footerParagraphs[1].classList.add("footer-credits");
  }

  if (!footerInner.querySelector(".footer-legal")) {
    const legal = document.createElement("div");
    legal.className = "footer-legal";
    legal.innerHTML = `
      <a data-transition="page" href="impressum.html">Impressum</a>
      <a data-transition="page" href="agb.html">AGB</a>
      <a data-transition="page" href="datenschutz.html">Datenschutz</a>
      <a data-transition="page" href="widerruf.html">Widerruf</a>
    `;
    footerInner.append(legal);
  }

  const legal = footerInner.querySelector(".footer-legal");
  if (legal) {
    let webdesignParagraph = footerInner.querySelector(".footer-webdesign");

    if (!webdesignParagraph && creditsColumn) {
      webdesignParagraph = creditsColumn.querySelector(
        "p:not(.footer-copyright)",
      );
    }

    if (webdesignParagraph) {
      webdesignParagraph.classList.add("footer-webdesign");
      if (legal.previousElementSibling !== webdesignParagraph) {
        footerInner.insertBefore(webdesignParagraph, legal);
      }
    }
  }

  const contactColumn = footerInner.querySelectorAll(".footer-col")[1];
  if (!contactColumn) {
    return;
  }

  let social = contactColumn.querySelector(".footer-social");

  if (!social) {
    social = document.createElement("div");
    social.className = "footer-social";
    social.innerHTML = `
      <a
        class="social-icon whatsapp"
        href="https://wa.me/4917661546663"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        title="WhatsApp"
      >
        <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
          <path d="M16.02 3C8.84 3 3 8.71 3 15.73c0 2.24.59 4.42 1.72 6.34L3 29l7.21-1.87a13.2 13.2 0 0 0 5.81 1.34h.01C23.2 28.47 29 22.76 29 15.73 29 8.7 23.2 3 16.02 3Zm0 23.33h-.01c-1.89 0-3.73-.5-5.35-1.43l-.38-.22-4.28 1.11 1.14-4.1-.25-.4a10.95 10.95 0 0 1-1.7-5.56c0-6.02 4.87-10.91 10.86-10.91 5.98 0 10.84 4.89 10.84 10.9 0 6.02-4.86 10.91-10.83 10.91Zm5.96-8.17c-.33-.16-1.95-.95-2.25-1.06-.3-.1-.52-.16-.73.16-.22.32-.84 1.06-1.03 1.28-.19.22-.38.24-.7.08-.33-.16-1.39-.5-2.65-1.58-.98-.85-1.64-1.89-1.84-2.21-.19-.32-.02-.49.15-.65.15-.14.33-.38.49-.57.16-.19.22-.32.33-.54.11-.22.06-.4-.03-.57-.08-.16-.73-1.76-1-2.41-.27-.64-.54-.55-.73-.56h-.62c-.22 0-.57.08-.87.4-.3.32-1.14 1.11-1.14 2.7 0 1.59 1.16 3.13 1.32 3.35.16.22 2.27 3.6 5.49 5.04.77.33 1.37.53 1.84.68.77.24 1.47.21 2.02.13.62-.09 1.95-.8 2.22-1.57.27-.78.27-1.44.19-1.58-.08-.13-.3-.21-.62-.37Z"></path>
        </svg>
      </a>
      <a
        class="social-icon facebook"
        href="https://www.facebook.com/automobile.aa"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook"
        title="Facebook"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.19 2.24.19v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12Z"></path>
        </svg>
      </a>
      <a
        class="social-icon instagram"
        href="https://www.instagram.com/automobile_aa?utm_source=qr&igsh=ZjBwdGM5bWUzZ3Zv"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        title="Instagram"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"></path>
          <path d="M5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"></path>
        </svg>
      </a>
    `;
    contactColumn.append(social);
  }

  if (!contactColumn.querySelector(".footer-opening-hours")) {
    const openingHours = document.createElement("div");
    openingHours.className = "footer-opening-hours";
    openingHours.innerHTML = `
      <p class="footer-hours-title">&#128339; &Ouml;ffnungszeiten</p>
      <ul class="footer-hours-list" aria-label="Oeffnungszeiten">
        <li><span class="day">Montag:</span><span class="time">09:00&ndash;18:00</span></li>
        <li><span class="day">Dienstag:</span><span class="time">09:00&ndash;18:00</span></li>
        <li><span class="day">Mittwoch:</span><span class="time">09:00&ndash;18:00</span></li>
        <li><span class="day">Donnerstag:</span><span class="time">09:00&ndash;18:00</span></li>
        <li><span class="day">Freitag:</span><span class="time">09:00&ndash;18:00</span></li>
        <li><span class="day">Samstag:</span><span class="time">09:00&ndash;13:00</span></li>
        <li class="is-closed"><span class="day">Sonntag:</span><span class="time">Geschlossen</span></li>
      </ul>
    `;
    social.insertAdjacentElement("afterend", openingHours);
  }
}

function setDynamicFooterYear() {
  const year = String(new Date().getFullYear());
  const yearTargets = document.querySelectorAll(".js-current-year");

  yearTargets.forEach((target) => {
    target.textContent = year;
  });
}

function setupCarFilter() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const cars = document.querySelectorAll(".car-card");

  if (!filterBtns.length || !cars.length) {
    return;
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");

      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      cars.forEach((car) => {
        const brand = car.getAttribute("data-brand");
        if (filter === "alle" || brand === filter) {
          car.classList.remove("hidden");
          car.classList.add("car-card-fade");
        } else {
          car.classList.add("hidden");
          car.classList.remove("car-card-fade");
        }
      });
    });
  });
}

function setupBrandAccordion() {
  const toggles = document.querySelectorAll(".brand-toggle");
  if (!toggles.length) {
    return;
  }

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const card = toggle.closest(".brand-card");
      if (!card) {
        return;
      }

      const isOpen = card.classList.contains("open");
      document.querySelectorAll(".brand-card.open").forEach((openCard) => {
        openCard.classList.remove("open");
      });

      if (!isOpen) {
        card.classList.add("open");
      }
    });

    toggle.addEventListener("dblclick", () => {
      const card = toggle.closest(".brand-card");
      if (!card) {
        return;
      }

      const firstLink = card.querySelector(".brand-models a[href]");
      const href = firstLink?.getAttribute("href");
      if (!href) {
        return;
      }

      document.body.classList.add("fade-out");
      window.setTimeout(() => {
        window.location.href = href;
      }, 280);
    });
  });
}

function setupMatrixTextReveal() {
  const targets = document.querySelectorAll("[data-matrix-text]");
  if (!targets.length) {
    return;
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+-";

  const randomGlyph = () => glyphs[Math.floor(Math.random() * glyphs.length)];

  const buildFrame = (finalText, resolvedCount) => {
    return finalText
      .split("")
      .map((char, index) => {
        if (char === " ") {
          return " ";
        }
        if (index < resolvedCount) {
          return char;
        }
        return randomGlyph();
      })
      .join("");
  };

  const animationState = new WeakMap();

  const clearAnimation = (element) => {
    const state = animationState.get(element);
    if (!state) {
      return;
    }

    if (state.delayTimer) {
      window.clearTimeout(state.delayTimer);
    }
    if (state.burstTimer) {
      window.clearInterval(state.burstTimer);
    }
    if (state.revealTimer) {
      window.clearInterval(state.revealTimer);
    }
    if (state.glowTimer) {
      window.clearTimeout(state.glowTimer);
    }

    animationState.delete(element);
    element.classList.remove("matrix-scramble-active");
    element.classList.remove("matrix-cta-glow");
  };

  const runReveal = (element) => {
    const finalText = String(element.getAttribute("data-matrix-text") || "");
    if (!finalText) {
      return;
    }

    clearAnimation(element);

    const delay = Number.parseInt(
      element.getAttribute("data-matrix-delay") || "0",
      10,
    );

    if (prefersReducedMotion) {
      element.textContent = finalText;
      return;
    }

    element.classList.remove("matrix-cta-glow");
    element.classList.add("matrix-scramble-active");

    const state = {
      delayTimer: 0,
      burstTimer: 0,
      revealTimer: 0,
      glowTimer: 0,
    };

    state.delayTimer = window.setTimeout(
      () => {
        let burstFrame = 0;
        const burstFrames = 14;

        state.burstTimer = window.setInterval(() => {
          element.textContent = buildFrame(finalText, 0);
          burstFrame += 1;

          if (burstFrame >= burstFrames) {
            window.clearInterval(state.burstTimer);
            state.burstTimer = 0;

            let revealIndex = 0;
            state.revealTimer = window.setInterval(() => {
              revealIndex += 1;
              element.textContent = buildFrame(finalText, revealIndex);

              if (revealIndex >= finalText.length) {
                window.clearInterval(state.revealTimer);
                state.revealTimer = 0;
                element.textContent = finalText;
                element.classList.remove("matrix-scramble-active");
                element.classList.add("matrix-cta-glow");
                state.glowTimer = window.setTimeout(() => {
                  element.classList.remove("matrix-cta-glow");
                }, 980);
                animationState.delete(element);
              }
            }, 42);
          }
        }, 24);
      },
      Number.isNaN(delay) ? 0 : Math.max(0, delay),
    );

    animationState.set(element, state);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const element = entry.target;

        if (!entry.isIntersecting) {
          element.dataset.matrixInView = "0";
          clearAnimation(element);
          return;
        }

        if (element.dataset.matrixInView === "1") {
          return;
        }

        element.dataset.matrixInView = "1";
        runReveal(element);
      });
    },
    {
      threshold: 0.45,
      rootMargin: "0px 0px -8% 0px",
    },
  );

  targets.forEach((target) => {
    const finalText = String(target.getAttribute("data-matrix-text") || "");
    target.textContent = finalText;
    target.dataset.matrixInView = "0";
    observer.observe(target);
  });
}

const serviceCardReturnStorageKey = "service-card-return-target";

function storeServiceCardReturnTarget(targetId) {
  if (!targetId) {
    return;
  }

  try {
    window.sessionStorage.setItem(serviceCardReturnStorageKey, targetId);
  } catch {}
}

function readServiceCardReturnTarget() {
  try {
    return window.sessionStorage.getItem(serviceCardReturnStorageKey) || "";
  } catch {
    return "";
  }
}

function clearServiceCardReturnTarget() {
  try {
    window.sessionStorage.removeItem(serviceCardReturnStorageKey);
  } catch {}
}

function restoreServiceCardReturnTarget() {
  const isIndexPage =
    (window.location.pathname.split("/").pop() || "index.html") ===
    "index.html";

  if (!isIndexPage) {
    return;
  }

  const hashTarget = window.location.hash.replace(/^#/, "");
  const storedTarget = readServiceCardReturnTarget();
  const targetId = hashTarget.startsWith("service-card-")
    ? hashTarget
    : storedTarget;

  if (!targetId) {
    return;
  }

  const scrollToTarget = () => {
    const target = document.getElementById(targetId);
    if (!target) {
      return;
    }

    target.scrollIntoView({ block: "center", behavior: "auto" });

    if (window.location.hash !== `#${targetId}`) {
      window.history.replaceState(null, "", `#${targetId}`);
    }
  };

  window.requestAnimationFrame(() => {
    scrollToTarget();
    window.setTimeout(scrollToTarget, 140);
  });

  clearServiceCardReturnTarget();
}

function setupGalleryLightbox() {
  const lightboxLinks = document.querySelectorAll(
    ".gallery a[href], .lightbox-trigger[href]",
  );
  if (!lightboxLinks.length || document.querySelector(".lightbox-overlay")) {
    return;
  }

  const images = Array.from(lightboxLinks).map((link) => ({
    src: link.getAttribute("href") || "",
    alt: link.querySelector("img")?.getAttribute("alt") || "Galerie slika",
  }));
  let currentIndex = 0;

  const overlay = document.createElement("div");
  overlay.className = "lightbox-overlay";
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML = `
    <button type="button" class="lightbox-close" aria-label="Lightbox schliessen">Schliessen</button>
    <div class="lightbox-frame">
      <button type="button" class="lightbox-nav lightbox-nav-prev" aria-label="Vorheriges Bild">&#8249;</button>
      <img class="lightbox-image" src="" alt="Vergroesserte Ansicht" />
      <button type="button" class="lightbox-nav lightbox-nav-next" aria-label="Naechstes Bild">&#8250;</button>
      <p class="lightbox-hint">Tippen zum Oeffnen, wischen zum Wechseln, mit zwei Fingern zoomen</p>
    </div>
  `;
  document.body.append(overlay);

  const lightboxImage = overlay.querySelector(".lightbox-image");
  const closeButton = overlay.querySelector(".lightbox-close");
  const prevButton = overlay.querySelector(".lightbox-nav-prev");
  const nextButton = overlay.querySelector(".lightbox-nav-next");
  let gestureStartX = 0;
  let gestureStartY = 0;
  let dragging = false;
  let skipNextTapAdvance = false;
  let zoomScale = 1;
  let zoomOffsetX = 0;
  let zoomOffsetY = 0;
  let isPinching = false;
  let pinchStartDistance = 0;
  let pinchStartScale = 1;

  const minZoom = 1;
  const maxZoom = 4;

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  const getMaxZoomOffset = () => {
    const frameRect = lightboxImage.parentElement?.getBoundingClientRect();
    const imageRect = lightboxImage.getBoundingClientRect();
    if (!frameRect) {
      return { maxX: 0, maxY: 0 };
    }

    const scaledWidth = imageRect.width * zoomScale;
    const scaledHeight = imageRect.height * zoomScale;
    return {
      maxX: Math.max(0, (scaledWidth - frameRect.width) / 2),
      maxY: Math.max(0, (scaledHeight - frameRect.height) / 2),
    };
  };

  const applyZoomTransform = () => {
    const { maxX, maxY } = getMaxZoomOffset();
    zoomOffsetX = clamp(zoomOffsetX, -maxX, maxX);
    zoomOffsetY = clamp(zoomOffsetY, -maxY, maxY);
    lightboxImage.style.transform = `translate(${zoomOffsetX}px, ${zoomOffsetY}px) scale(${zoomScale})`;
  };

  const resetZoom = () => {
    zoomScale = 1;
    zoomOffsetX = 0;
    zoomOffsetY = 0;
    isPinching = false;
    pinchStartDistance = 0;
    pinchStartScale = 1;
    applyZoomTransform();
  };

  const getTouchDistance = (touchA, touchB) => {
    const deltaX = touchB.clientX - touchA.clientX;
    const deltaY = touchB.clientY - touchA.clientY;
    return Math.hypot(deltaX, deltaY);
  };

  const showImageAt = (index) => {
    if (!images.length) {
      return;
    }

    currentIndex = (index + images.length) % images.length;
    lightboxImage.setAttribute("src", images[currentIndex].src);
    lightboxImage.setAttribute("alt", images[currentIndex].alt);
    resetZoom();
  };

  const closeLightbox = () => {
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
    resetZoom();
    window.setTimeout(() => {
      lightboxImage.setAttribute("src", "");
    }, 200);
  };

  lightboxLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const imageSrc = link.getAttribute("href") || "";
      const clickedIndex = images.findIndex((image) => image.src === imageSrc);
      if (clickedIndex < 0) {
        return;
      }

      showImageAt(clickedIndex);
      overlay.classList.add("open");
      overlay.setAttribute("aria-hidden", "false");
      document.body.classList.add("lightbox-open");
    });
  });

  lightboxImage.addEventListener("click", () => {
    if (!overlay.classList.contains("open")) {
      return;
    }

    if (zoomScale > 1) {
      return;
    }

    if (skipNextTapAdvance) {
      skipNextTapAdvance = false;
      return;
    }

    showImageAt(currentIndex + 1);
  });

  const applyGesture = (deltaX, deltaY) => {
    if (!overlay.classList.contains("open")) {
      return;
    }

    if (zoomScale > 1 || isPinching) {
      return;
    }

    if (Math.abs(deltaX) < 44 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) {
      return;
    }

    skipNextTapAdvance = true;
    showImageAt(currentIndex + (deltaX < 0 ? 1 : -1));
  };

  lightboxImage.addEventListener(
    "touchstart",
    (event) => {
      if (event.touches.length === 2) {
        const [touchA, touchB] = event.touches;
        if (!touchA || !touchB) {
          return;
        }

        isPinching = true;
        pinchStartDistance = getTouchDistance(touchA, touchB);
        pinchStartScale = zoomScale;
        skipNextTapAdvance = true;
        return;
      }

      if (event.touches.length !== 1) {
        return;
      }

      const touch = event.changedTouches[0];
      if (!touch) {
        return;
      }

      gestureStartX = touch.clientX;
      gestureStartY = touch.clientY;
    },
    { passive: true },
  );

  lightboxImage.addEventListener(
    "touchmove",
    (event) => {
      if (!overlay.classList.contains("open")) {
        return;
      }

      if (event.touches.length === 2) {
        const [touchA, touchB] = event.touches;
        if (!touchA || !touchB || !pinchStartDistance) {
          return;
        }

        event.preventDefault();
        const distance = getTouchDistance(touchA, touchB);
        zoomScale = clamp(
          (distance / pinchStartDistance) * pinchStartScale,
          minZoom,
          maxZoom,
        );
        if (zoomScale <= 1.02) {
          zoomScale = 1;
          zoomOffsetX = 0;
          zoomOffsetY = 0;
        }
        applyZoomTransform();
        return;
      }

      if (event.touches.length !== 1 || zoomScale <= 1) {
        return;
      }

      const touch = event.touches[0];
      if (!touch) {
        return;
      }

      event.preventDefault();
      const deltaX = touch.clientX - gestureStartX;
      const deltaY = touch.clientY - gestureStartY;
      gestureStartX = touch.clientX;
      gestureStartY = touch.clientY;
      zoomOffsetX += deltaX;
      zoomOffsetY += deltaY;
      applyZoomTransform();
      skipNextTapAdvance = true;
    },
    { passive: false },
  );

  lightboxImage.addEventListener(
    "touchend",
    (event) => {
      if (event.touches.length < 2) {
        isPinching = false;
        pinchStartDistance = 0;
      }

      if (zoomScale > 1) {
        return;
      }

      const touch = event.changedTouches[0];
      if (!touch) {
        return;
      }

      const deltaX = touch.clientX - gestureStartX;
      const deltaY = touch.clientY - gestureStartY;
      applyGesture(deltaX, deltaY);
    },
    { passive: true },
  );

  lightboxImage.addEventListener("pointerdown", (event) => {
    if (zoomScale > 1) {
      return;
    }

    if (event.pointerType !== "mouse") {
      return;
    }

    dragging = true;
    gestureStartX = event.clientX;
    gestureStartY = event.clientY;
    lightboxImage.classList.add("dragging");
  });

  lightboxImage.addEventListener("pointerup", (event) => {
    if (!dragging) {
      return;
    }

    dragging = false;
    lightboxImage.classList.remove("dragging");
    const deltaX = event.clientX - gestureStartX;
    const deltaY = event.clientY - gestureStartY;
    applyGesture(deltaX, deltaY);
  });

  lightboxImage.addEventListener("pointercancel", () => {
    dragging = false;
    lightboxImage.classList.remove("dragging");
  });

  closeButton.addEventListener("click", closeLightbox);
  prevButton?.addEventListener("click", (event) => {
    event.stopPropagation();
    showImageAt(currentIndex - 1);
  });
  nextButton?.addEventListener("click", (event) => {
    event.stopPropagation();
    showImageAt(currentIndex + 1);
  });
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!overlay.classList.contains("open")) {
      return;
    }

    if (event.key === "Escape") {
      closeLightbox();
    }

    if (event.key === "ArrowRight") {
      showImageAt(currentIndex + 1);
    }

    if (event.key === "ArrowLeft") {
      showImageAt(currentIndex - 1);
    }
  });
}

function setupBackButtons() {
  const backLinks = document.querySelectorAll("a[data-go-back='true']");
  if (!backLinks.length) {
    return;
  }

  const returnTo = new URLSearchParams(window.location.search).get("returnTo");
  const validReturnTo =
    typeof returnTo === "string" &&
    /^[a-z0-9-]+$/i.test(returnTo) &&
    returnTo.startsWith("service-card-");
  const directDestination = validReturnTo ? `index.html#${returnTo}` : null;

  backLinks.forEach((link) => {
    if (directDestination) {
      link.setAttribute("href", directDestination);
      link.setAttribute("data-fallback", directDestination);
    }

    link.addEventListener("click", (event) => {
      if (directDestination) {
        event.preventDefault();
        storeServiceCardReturnTarget(returnTo);
        window.location.assign(directDestination);
        return;
      }

      const fallback =
        link.getAttribute("data-fallback") ||
        link.getAttribute("href") ||
        "index.html";

      if (fallback.includes("#")) {
        event.preventDefault();
        window.location.assign(fallback);
        return;
      }

      const referrer = document.referrer;
      const sameOriginReferrer = referrer.startsWith(window.location.origin);

      if (sameOriginReferrer && window.history.length > 1) {
        event.preventDefault();
        window.history.back();
        return;
      }

      link.setAttribute("href", fallback);
    });
  });
}

function setupServiceCardReturnAnchors() {
  const cards = document.querySelectorAll(".service-grid .service-card[href]");
  if (!cards.length) {
    return;
  }

  cards.forEach((card) => {
    const id = card.getAttribute("id");
    const rawHref =
      card.getAttribute("data-base-href") || card.getAttribute("href") || "";
    if (
      !id ||
      !rawHref ||
      rawHref.startsWith("http") ||
      rawHref.startsWith("#")
    ) {
      return;
    }

    card.setAttribute("data-base-href", rawHref);

    const separator = rawHref.includes("?") ? "&" : "?";
    card.setAttribute("href", `${rawHref}${separator}returnTo=${id}`);

    card.addEventListener("click", () => {
      storeServiceCardReturnTarget(id);
    });
  });
}

function setupServiceCardParallax() {
  const layers = document.querySelectorAll(
    ".service-grid .card-media[data-parallax='true']",
  );
  if (!layers.length) {
    return;
  }

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const isMobile = window.matchMedia("(max-width: 860px)").matches;

  if (prefersReduced || isMobile) {
    layers.forEach((layer) => {
      layer.style.setProperty("--parallax-offset", "0px");
    });
    return;
  }

  let ticking = false;

  const update = () => {
    const viewportHeight = window.innerHeight || 1;

    layers.forEach((layer) => {
      const speed = Number.parseFloat(
        layer.getAttribute("data-speed") || "0.16",
      );
      const rect = layer.getBoundingClientRect();
      const distance = rect.top + rect.height / 2 - viewportHeight / 2;
      const rawOffset = -(distance * speed);
      const clampedOffset = Math.max(-26, Math.min(26, rawOffset));

      layer.style.setProperty(
        "--parallax-offset",
        `${clampedOffset.toFixed(2)}px`,
      );
    });

    ticking = false;
  };

  const onScroll = () => {
    if (ticking) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(update);
  };

  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
}

function setupBackToTopArrow() {
  let button = document.querySelector(".back-to-top");

  if (!button) {
    button = document.createElement("button");
    button.type = "button";
    button.className = "back-to-top";
    button.setAttribute("aria-label", "Na vrh stranice");
    button.innerHTML = "<span aria-hidden='true'>↑</span>";
    document.body.append(button);
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const revealAfter = 140;
  let lastY = window.scrollY || 0;

  const updateVisibility = () => {
    const currentY = window.scrollY || 0;
    const delta = currentY - lastY;
    const isScrollingUp = delta < -2;
    const isScrollingDown = delta > 2;
    const passedRevealPoint = currentY > revealAfter;

    if (isScrollingUp && passedRevealPoint) {
      button.classList.add("is-visible");
    }

    if (isScrollingDown || !passedRevealPoint) {
      button.classList.remove("is-visible");
    }

    lastY = currentY;
  };

  button.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  });

  updateVisibility();
  window.addEventListener("scroll", updateVisibility, { passive: true });
}

function setupMobileLeistungenStack() {
  const section = document.querySelector(".services-stack-section");
  const track = section?.querySelector(".services-stack-track");
  const sticky = section?.querySelector(".services-stack-sticky");
  const progressFill = section?.querySelector(".services-stack-progress span");
  const allCards = Array.from(
    section?.querySelectorAll(".service-grid .service-card") || [],
  );
  const maxCards = Number.parseInt(
    section?.getAttribute("data-stack-cards") || "5",
    10,
  );
  const cards = allCards.slice(
    0,
    Number.isFinite(maxCards) ? Math.max(2, maxCards) : 5,
  );
  const extraCards = allCards.slice(cards.length);

  if (!section || !track || !sticky || cards.length < 2) {
    return;
  }

  const mobileQuery = window.matchMedia("(max-width: 768px)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let startY = 0;
  let range = 1;
  let endY = 0;
  let stepSize = 1;
  let isAutoScrolling = false;
  let settledIndex = 0;
  let touchStartY = null;
  let gestureLocked = false;
  let gestureUnlockTimer = null;

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const getCurrentY = () => window.scrollY || window.pageYOffset || 0;

  const isWithinStackZone = () => {
    const y = getCurrentY();
    const vh = window.innerHeight || 700;
    return y >= startY - vh * 0.08 && y <= endY;
  };

  const progressFromY = (y) => Math.max(0, Math.min(1, (y - startY) / range));

  const indexToY = (index) => startY + stepSize * index;

  const setGestureLock = () => {
    gestureLocked = true;
    if (gestureUnlockTimer) {
      window.clearTimeout(gestureUnlockTimer);
    }

    gestureUnlockTimer = window.setTimeout(() => {
      gestureLocked = false;
      gestureUnlockTimer = null;
    }, 380);
  };

  const animateScrollTo = (targetY) => {
    const start = getCurrentY();
    const distance = targetY - start;
    const duration = 320;
    const t0 = performance.now();

    if (Math.abs(distance) < 2) {
      window.scrollTo(0, targetY);
      paint();
      return;
    }

    isAutoScrolling = true;

    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = easeOutCubic(p);
      window.scrollTo(0, start + distance * eased);

      if (p < 1) {
        window.requestAnimationFrame(tick);
      } else {
        window.scrollTo(0, targetY);
        paint();
        window.requestAnimationFrame(() => {
          isAutoScrolling = false;
        });
      }
    };

    window.requestAnimationFrame(tick);
  };

  const moveToIndex = (nextIndex) => {
    const clamped = Math.max(0, Math.min(cards.length - 1, nextIndex));
    if (clamped === settledIndex) {
      return false;
    }

    settledIndex = clamped;
    setGestureLock();
    paint();
    animateScrollTo(indexToY(clamped));
    return true;
  };

  const cleanup = () => {
    if (gestureUnlockTimer) {
      window.clearTimeout(gestureUnlockTimer);
      gestureUnlockTimer = null;
    }

    gestureLocked = false;
    touchStartY = null;
    section.classList.remove("is-mobile-stack");
    track.style.removeProperty("--stack-scroll-height");
    sticky.style.removeProperty("--stack-sticky-height");
    allCards.forEach((card) => {
      card.style.removeProperty("display");
      card.style.removeProperty("--stack-translate");
      card.style.removeProperty("--stack-scale");
      card.style.removeProperty("--stack-opacity");
      card.style.removeProperty("z-index");
      card.style.removeProperty("pointer-events");
      card.style.removeProperty("visibility");
    });
    if (progressFill) {
      progressFill.style.transform = "scaleX(0)";
    }
  };

  const updateMetrics = () => {
    const vh = window.innerHeight || 700;
    const stickyHeight = Math.max(430, vh - 116);
    const perCard = Math.max(240, vh * 0.72);
    const total = stickyHeight + perCard * (cards.length - 1) + vh * 0.3;

    sticky.style.setProperty(
      "--stack-sticky-height",
      `${Math.round(stickyHeight)}px`,
    );
    track.style.setProperty("--stack-scroll-height", `${Math.round(total)}px`);

    const rect = track.getBoundingClientRect();
    startY = window.scrollY + rect.top;
    range = Math.max(1, total - stickyHeight - vh * 0.2);
    endY = startY + range;
    stepSize = range / (cards.length - 1);
  };

  const paint = () => {
    if (!section.classList.contains("is-mobile-stack")) {
      return;
    }

    cards.forEach((card, index) => {
      const offset = index - settledIndex;
      const isActive = offset === 0;

      let slideOffset = offset > 0 ? 32 : -32;
      let scale = 0.985;
      let opacity = 0;
      let z = 1;

      if (isActive) {
        slideOffset = 0;
        scale = 1;
        opacity = 1;
        z = cards.length + 10;
      }

      card.style.setProperty(
        "--stack-translate",
        `${slideOffset.toFixed(2)}px`,
      );
      card.style.setProperty("--stack-scale", scale.toFixed(3));
      card.style.setProperty("--stack-opacity", opacity.toFixed(3));
      card.style.zIndex = String(z);
      card.style.pointerEvents = isActive ? "auto" : "none";
      card.style.visibility = isActive ? "visible" : "hidden";
    });

    if (progressFill) {
      const progress = settledIndex / Math.max(1, cards.length - 1);
      progressFill.style.transform = `scaleX(${progress.toFixed(3)})`;
    }
  };

  const onScroll = () => {
    if (!section.classList.contains("is-mobile-stack")) {
      return;
    }

    const y = getCurrentY();
    if (
      y < startY - (window.innerHeight || 700) * 0.35 ||
      y > endY + (window.innerHeight || 700) * 0.6
    ) {
      return;
    }

    if (isAutoScrolling || gestureLocked) {
      return;
    }

    window.requestAnimationFrame(paint);
  };

  const onWheel = (event) => {
    if (
      !section.classList.contains("is-mobile-stack") ||
      !isWithinStackZone()
    ) {
      return;
    }

    if (Math.abs(event.deltaY) < 6) {
      return;
    }

    if (gestureLocked || isAutoScrolling) {
      event.preventDefault();
      return;
    }

    const direction = event.deltaY > 0 ? 1 : -1;
    const maxIndex = cards.length - 1;
    const atStart = settledIndex <= 0;
    const atEnd = settledIndex >= maxIndex;

    if ((direction < 0 && atStart) || (direction > 0 && atEnd)) {
      return;
    }

    event.preventDefault();
    moveToIndex(settledIndex + direction);
  };

  const onTouchStart = (event) => {
    if (
      !section.classList.contains("is-mobile-stack") ||
      !isWithinStackZone()
    ) {
      touchStartY = null;
      return;
    }

    touchStartY = event.touches[0]?.clientY ?? null;
  };

  const onTouchMove = (event) => {
    if (
      touchStartY === null ||
      !section.classList.contains("is-mobile-stack") ||
      !isWithinStackZone()
    ) {
      return;
    }

    const currentTouchY = event.touches[0]?.clientY;
    if (typeof currentTouchY !== "number") {
      return;
    }

    const delta = touchStartY - currentTouchY;

    if (Math.abs(delta) < 22) {
      return;
    }

    if (gestureLocked || isAutoScrolling) {
      event.preventDefault();
      return;
    }

    const direction = delta > 0 ? 1 : -1;
    const maxIndex = cards.length - 1;
    const atStart = settledIndex <= 0;
    const atEnd = settledIndex >= maxIndex;

    if ((direction < 0 && atStart) || (direction > 0 && atEnd)) {
      touchStartY = null;
      return;
    }

    event.preventDefault();
    touchStartY = null;
    moveToIndex(settledIndex + direction);
  };

  const onTouchEnd = () => {
    touchStartY = null;
  };

  const restoreFromHash = () => {
    const hash = (window.location.hash || "").replace("#", "");
    if (!hash || !hash.startsWith("service-card-")) {
      return;
    }

    const index = cards.findIndex((card) => card.id === hash);
    if (index < 0) {
      return;
    }

    settledIndex = index;
    paint();
    window.requestAnimationFrame(() => {
      window.scrollTo(0, indexToY(index));
    });
  };

  const refresh = () => {
    const enable = mobileQuery.matches && !reducedMotion.matches;
    if (!enable) {
      cleanup();
      return;
    }

    cards.forEach((card) => {
      card.style.removeProperty("display");
    });
    extraCards.forEach((card) => {
      card.style.display = "none";
    });

    section.classList.add("is-mobile-stack");
    updateMetrics();

    const currentIndex = Math.round(
      progressFromY(getCurrentY()) * (cards.length - 1),
    );
    settledIndex = Math.max(0, Math.min(cards.length - 1, currentIndex));

    paint();

    if (window.location.hash) {
      window.requestAnimationFrame(() => {
        restoreFromHash();
        paint();
      });
    }
  };

  refresh();
  window.addEventListener("load", refresh);
  window.addEventListener("resize", refresh);
  window.addEventListener("orientationchange", refresh);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("touchstart", onTouchStart, { passive: true });
  window.addEventListener("touchmove", onTouchMove, { passive: false });
  window.addEventListener("touchend", onTouchEnd, { passive: true });
}

function setupMobileHeroScrollReveal() {
  const hero = document.querySelector(".hero");
  const panel = hero?.querySelector(".hero-panel");

  if (!hero || !panel) {
    return;
  }

  const mobileQuery = window.matchMedia("(max-width: 640px)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let ticking = false;

  const setProgress = (value) => {
    const clamped = Math.max(0, Math.min(1, value));
    hero.style.setProperty("--hero-content-progress", clamped.toFixed(3));
  };

  const update = () => {
    const isMobile = mobileQuery.matches;
    const prefersReduced = reducedMotion.matches;

    if (!isMobile || prefersReduced) {
      setProgress(1);
      ticking = false;
      return;
    }

    const y = window.scrollY || window.pageYOffset || 0;
    const start = 6;
    const end = Math.max(140, (window.innerHeight || 700) * 0.44);
    const progress = (y - start) / (end - start);

    setProgress(progress);
    ticking = false;
  };

  const onScroll = () => {
    if (ticking) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(update);
  };

  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
}

function setupMobileOdorTimeline() {
  const announcement = document.querySelector(".announcement");
  const grid = announcement?.querySelector(".odor-grid");
  const items = Array.from(grid?.querySelectorAll(".odor-item") || []);

  if (!announcement || !grid || !items.length) {
    return;
  }

  const mobileQuery = window.matchMedia("(max-width: 768px)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let ticking = false;

  const syncVisibility = () => {
    const rect = announcement.getBoundingClientRect();
    const viewportHeight = window.innerHeight || 0;
    const viewportCenter = viewportHeight * 0.5;
    const isVisible =
      rect.top <= viewportCenter && rect.bottom >= viewportCenter;

    announcement.classList.toggle("is-odor-timeline-visible", isVisible);
    return isVisible;
  };

  const clearState = () => {
    announcement.classList.remove("is-mobile-odor-timeline");
    announcement.classList.remove("is-odor-timeline-visible");
    grid.style.removeProperty("--odor-line-progress");
    items.forEach((item) => item.classList.remove("is-active"));
  };

  const update = () => {
    if (!announcement.classList.contains("is-mobile-odor-timeline")) {
      ticking = false;
      return;
    }

    const viewportCenter = (window.innerHeight || 0) * 0.5;
    const gridRect = grid.getBoundingClientRect();
    let activeItem = items[0];
    let minDistance = Number.POSITIVE_INFINITY;

    items.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const center = rect.top + rect.height * 0.5;
      const distance = Math.abs(center - viewportCenter);

      if (distance < minDistance) {
        minDistance = distance;
        activeItem = item;
      }
    });

    items.forEach((item) => {
      item.classList.toggle("is-active", item === activeItem);
    });

    const activeRect = activeItem.getBoundingClientRect();
    const progress = Math.max(
      24,
      Math.min(
        gridRect.height - 24,
        activeRect.top - gridRect.top + activeRect.height * 0.5,
      ),
    );

    grid.style.setProperty("--odor-line-progress", `${progress.toFixed(1)}px`);
    ticking = false;
  };

  const requestUpdate = () => {
    if (!announcement.classList.contains("is-mobile-odor-timeline")) {
      return;
    }

    if (!syncVisibility()) {
      return;
    }

    if (ticking) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(update);
  };

  const refresh = () => {
    const enable = mobileQuery.matches && !reducedMotion.matches;
    if (!enable) {
      clearState();
      return;
    }

    announcement.classList.add("is-mobile-odor-timeline");
    syncVisibility();
    requestUpdate();
  };

  refresh();
  window.addEventListener("load", refresh);
  window.addEventListener("resize", refresh);
  window.addEventListener("orientationchange", refresh);
  window.addEventListener("scroll", requestUpdate, { passive: true });
}

function setupReviewCarousel() {
  const lists = document.querySelectorAll(".review-list");
  if (!lists.length) {
    return;
  }

  lists.forEach((list) => {
    const items = Array.from(list.querySelectorAll(".review-item"));
    if (items.length < 2) {
      return;
    }

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let currentIndex = 0;
    let intervalId = null;

    const setHeight = () => {
      list.classList.remove("carousel");
      items.forEach((item) => item.classList.remove("is-active", "is-exit"));

      const maxHeight = items.reduce(
        (acc, item) => Math.max(acc, item.offsetHeight),
        0,
      );

      list.style.setProperty("--review-height", `${Math.ceil(maxHeight)}px`);
      list.classList.add("carousel");
      items[currentIndex].classList.add("is-active");
    };

    const nextSlide = () => {
      const nextIndex = (currentIndex + 1) % items.length;
      const currentItem = items[currentIndex];
      const nextItem = items[nextIndex];

      currentItem.classList.remove("is-active");
      currentItem.classList.add("is-exit");
      nextItem.classList.remove("is-exit");
      nextItem.classList.add("is-active");

      window.setTimeout(() => {
        currentItem.classList.remove("is-exit");
      }, 760);

      currentIndex = nextIndex;
    };

    setHeight();
    window.addEventListener("resize", setHeight);

    if (!prefersReduced) {
      intervalId = window.setInterval(nextSlide, 3000);
    }

    window.addEventListener("pagehide", () => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    });
  });
}

function setupStatsCounter() {
  const panel = document.querySelector("#kennzahlen");
  if (!panel) {
    return;
  }

  const counters = Array.from(
    panel.querySelectorAll(".stat-value[data-target]"),
  );
  if (!counters.length) {
    return;
  }

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const formatter = new Intl.NumberFormat("de-DE");
  let isInView = false;
  let runToken = 0;

  const resetCounters = () => {
    counters.forEach((counter) => {
      counter.textContent = "0";
    });
  };

  const animateCounter = (el, token) => {
    const target = Number.parseInt(el.getAttribute("data-target") || "0", 10);
    const suffix = el.getAttribute("data-suffix") || "";

    if (!Number.isFinite(target) || target <= 0 || prefersReduced) {
      el.textContent = `${formatter.format(Math.max(0, target))}${suffix}`;
      return;
    }

    const duration = 1800;
    const start = performance.now();

    const tick = (now) => {
      if (token !== runToken) {
        return;
      }

      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);

      el.textContent = `${formatter.format(current)}${suffix}`;

      if (progress < 1) {
        window.requestAnimationFrame(tick);
      }
    };

    window.requestAnimationFrame(tick);
  };

  const startCounters = () => {
    runToken += 1;
    resetCounters();
    counters.forEach((counter) => animateCounter(counter, runToken));
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isInView) {
          isInView = true;
          startCounters();
        } else if (!entry.isIntersecting && isInView) {
          isInView = false;
          runToken += 1;
          resetCounters();
        }
      });
    },
    { threshold: 0.28 },
  );

  observer.observe(panel);
}

function setupHeroPoster() {
  const poster = document.getElementById("hero-poster");
  const video = document.querySelector(".hero-video");
  if (!poster || !video) return;
  const hide = () => poster.classList.add("hidden");
  video.addEventListener("playing", hide);
  if (!video.paused) hide();
}

function setupGlobalTicker() {
  const createTicker = (extraClass = "") => {
    const ticker = document.createElement("div");
    ticker.className = `site-ticker ${extraClass}`.trim();
    ticker.setAttribute("aria-label", "Automobile A und A Lauftext");
    ticker.innerHTML = `
      <div class="site-ticker-inner" aria-hidden="true">
        <div class="site-ticker-track">
          <span>AUTOMOBILE A & A</span>
          <span>AUTOMOBILE A & A</span>
          <span>AUTOMOBILE A & A</span>
          <span>AUTOMOBILE A & A</span>
          <span>AUTOMOBILE A & A</span>
          <span>AUTOMOBILE A & A</span>
        </div>
        <div class="site-ticker-track">
          <span>AUTOMOBILE A & A</span>
          <span>AUTOMOBILE A & A</span>
          <span>AUTOMOBILE A & A</span>
          <span>AUTOMOBILE A & A</span>
          <span>AUTOMOBILE A & A</span>
          <span>AUTOMOBILE A & A</span>
        </div>
      </div>
    `;
    return ticker;
  };

  const hasHeroTicker = !!document.querySelector(".hero .hero-ticker");
  if (hasHeroTicker) {
    return;
  }

  const currentPage = (
    window.location.pathname.split("/").pop() || "index.html"
  ).toLowerCase();
  const isAutoDetailPage = currentPage.startsWith("auto-");

  if (isAutoDetailPage) {
    const heroContainer = document.querySelector(".page-hero .container");
    if (heroContainer && !heroContainer.querySelector(".site-ticker-detail")) {
      const detailTicker = createTicker("site-ticker-detail");
      heroContainer.append(detailTicker);
      return;
    }
  }

  if (document.querySelector(".site-ticker-global")) {
    return;
  }

  const anchor =
    document.querySelector(".page-hero") || document.querySelector(".main-nav");
  if (anchor?.parentNode) {
    const globalTicker = createTicker("site-ticker-global");
    anchor.insertAdjacentElement("afterend", globalTicker);
  }
}

function enhanceAutoDescriptionLists() {
  const descriptionHeadings = Array.from(
    document.querySelectorAll("h3"),
  ).filter(
    (heading) => heading.textContent?.trim().toLowerCase() === "beschreibung",
  );

  descriptionHeadings.forEach((heading) => {
    let nextElement = heading.nextElementSibling;

    while (nextElement) {
      if (nextElement.tagName === "H3") {
        break;
      }

      if (nextElement.tagName === "P" && nextElement.textContent?.trim()) {
        nextElement.classList.add("auto-description-item");
      }

      nextElement = nextElement.nextElementSibling;
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  restoreServiceCardReturnTarget();
  ensureNavigationLayout();
  setupScrollNavBehavior();
  setupMobileHeroScrollReveal();
  setupMobileOdorTimeline();
  setupReviewCarousel();
  setupStatsCounter();
  setupServiceCardReturnAnchors();

  setupOutsideClickToCloseMenu();
  ensureFooterLegalLinks();
  setDynamicFooterYear();
  setupCarFilter();
  setupBrandAccordion();
  setupGalleryLightbox();
  setupRevealAnimation();
  setupPageTransitions();
  markActiveNav();
  setupContactForm();
  setupBackButtons();
  setupServiceCardParallax();
  setupBackToTopArrow();
  setupHeroPoster();
  setupGlobalTicker();
  setupMatrixTextReveal();
  enhanceAutoDescriptionLists();
});
