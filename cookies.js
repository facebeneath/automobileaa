(function () {
  "use strict";

  var GA_ID = "G-33877VG7WG";
  var KEY = "cookie_consent_v1";

  /* ── helpers ── */
  function save(consent) {
    localStorage.setItem(KEY, JSON.stringify(consent));
  }

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY));
    } catch (e) {
      return null;
    }
  }

  function applyConsent(consent) {
    if (typeof window.gtag !== "function") return;
    window.gtag("consent", "update", {
      analytics_storage: consent.analytics ? "granted" : "denied",
      ad_storage: consent.marketing ? "granted" : "denied",
      ad_user_data: consent.marketing ? "granted" : "denied",
      ad_personalization: consent.marketing ? "granted" : "denied",
    });
    if (consent.analytics) {
      window.gtag("event", "page_view", { send_to: GA_ID });
    }
  }

  /* ── DOM injection ── */
  function injectUI() {
    if (document.getElementById("cc-banner")) return;

    var banner = document.createElement("div");
    banner.id = "cc-banner";
    banner.setAttribute("role", "region");
    banner.setAttribute("aria-label", "Cookie-Einwilligung");
    banner.innerHTML =
      '<div class="cc-banner-inner">' +
      '<div class="cc-banner-text">' +
      '<p class="cc-banner-title">Datenschutz-Einstellungen</p>' +
      '<p id="cc-banner-desc">' +
      "Wir verwenden Cookies und \u00e4hnliche Technologien, um unsere Website zu verbessern. " +
      'Weitere Informationen finden Sie in unserer <a href="cookies.html">Cookie-Richtlinie</a>.' +
      "</p>" +
      "</div>" +
      '<div class="cc-banner-actions">' +
      '<button id="cc-btn-settings" class="cc-btn cc-btn-ghost"    type="button">Einstellungen</button>' +
      '<button id="cc-btn-reject"   class="cc-btn cc-btn-outline"  type="button">Alle ablehnen</button>' +
      '<button id="cc-btn-accept"   class="cc-btn cc-btn-primary"  type="button">Alle akzeptieren</button>' +
      "</div>" +
      "</div>";
    document.body.appendChild(banner);

    var overlay = document.createElement("div");
    overlay.id = "cc-overlay";
    overlay.style.display = "none";
    document.body.appendChild(overlay);

    var modal = document.createElement("div");
    modal.id = "cc-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Cookie-Einstellungen");
    modal.setAttribute("hidden", "");
    modal.innerHTML =
      '<div class="cc-modal-box">' +
      '<div class="cc-modal-header">' +
      "<h2>Cookie-Einstellungen</h2>" +
      '<button class="cc-modal-close" id="cc-modal-close" type="button" aria-label="Schlie\u00dfen">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">' +
      '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>' +
      "</svg>" +
      "</button>" +
      "</div>" +
      '<div class="cc-modal-body">' +
      '<div class="cc-cat">' +
      '<div class="cc-cat-row">' +
      '<div class="cc-cat-info">' +
      "<strong>Technisch notwendig</strong>" +
      "<p>Erm\u00f6glicht grundlegende Funktionen wie die Speicherung Ihrer Cookie-Einwilligung. Ohne diese Cookies kann die Website nicht richtig funktionieren.</p>" +
      "</div>" +
      '<span class="cc-badge-always">Immer aktiv</span>' +
      "</div>" +
      "</div>" +
      '<div class="cc-cat">' +
      '<div class="cc-cat-row">' +
      '<div class="cc-cat-info">' +
      "<strong>Analyse</strong>" +
      "<p>Helfen uns zu verstehen, wie Besucher die Website nutzen (z.\u00a0B. Google Analytics). Alle Daten werden anonymisiert erhoben.</p>" +
      "</div>" +
      '<label class="cc-toggle-wrap" aria-label="Analyse-Cookies aktivieren">' +
      '<input type="checkbox" id="cc-toggle-analytics">' +
      '<span class="cc-toggle-track"><span class="cc-toggle-thumb"></span></span>' +
      "</label>" +
      "</div>" +
      "</div>" +
      '<div class="cc-cat">' +
      '<div class="cc-cat-row">' +
      '<div class="cc-cat-info">' +
      "<strong>Marketing</strong>" +
      "<p>Erm\u00f6glichen personalisierte Werbung durch Drittanbieter. Aktuell werden keine Marketing-Cookies gesetzt.</p>" +
      "</div>" +
      '<label class="cc-toggle-wrap" aria-label="Marketing-Cookies aktivieren">' +
      '<input type="checkbox" id="cc-toggle-marketing">' +
      '<span class="cc-toggle-track"><span class="cc-toggle-thumb"></span></span>' +
      "</label>" +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="cc-modal-footer">' +
      '<button id="cc-btn-save"       class="cc-btn cc-btn-outline" type="button">Auswahl speichern</button>' +
      '<button id="cc-btn-reject-all" class="cc-btn cc-btn-outline" type="button">Alle ablehnen</button>' +
      '<button id="cc-btn-accept-all" class="cc-btn cc-btn-primary" type="button">Alle akzeptieren</button>' +
      "</div>" +
      '<p class="cc-modal-legal">' +
      'Weitere Informationen: <a href="cookies.html">Cookie-Richtlinie</a> \u00b7 <a href="datenschutz.html">Datenschutz</a>' +
      "</p>" +
      "</div>";
    document.body.appendChild(modal);
  }

  /* ── banner show / hide ── */
  function showBanner() {
    var el = document.getElementById("cc-banner");
    if (!el) return;
    el.style.display = "";
    requestAnimationFrame(function () {
      el.classList.add("cc-visible");
    });
  }

  function hideBanner() {
    var el = document.getElementById("cc-banner");
    if (!el) return;
    el.classList.add("cc-hiding");
    el.addEventListener("transitionend", function handler() {
      el.classList.remove("cc-visible", "cc-hiding");
      el.style.display = "none";
      el.removeEventListener("transitionend", handler);
    });
  }

  /* ── modal show / hide ── */
  function showModal() {
    var modal = document.getElementById("cc-modal");
    var overlay = document.getElementById("cc-overlay");
    if (!modal) return;

    var saved = load();
    var chkAnalytics = document.getElementById("cc-toggle-analytics");
    var chkMarketing = document.getElementById("cc-toggle-marketing");
    if (chkAnalytics) chkAnalytics.checked = saved ? !!saved.analytics : false;
    if (chkMarketing) chkMarketing.checked = saved ? !!saved.marketing : false;

    if (overlay) overlay.style.display = "";
    modal.removeAttribute("hidden");
    modal.style.display = "flex";

    var closeBtn = document.getElementById("cc-modal-close");
    if (closeBtn) closeBtn.focus();
  }

  function hideModal() {
    var modal = document.getElementById("cc-modal");
    var overlay = document.getElementById("cc-overlay");
    if (modal) {
      modal.setAttribute("hidden", "");
      modal.style.display = "none";
    }
    if (overlay) overlay.style.display = "none";
  }

  /* ── consent actions ── */
  function acceptAll() {
    var consent = { analytics: true, marketing: true, preferences: true };
    save(consent);
    applyConsent(consent);
    hideBanner();
    hideModal();
  }

  function rejectAll() {
    var consent = { analytics: false, marketing: false, preferences: false };
    save(consent);
    applyConsent(consent);
    hideBanner();
    hideModal();
  }

  function saveSelection() {
    var chkAnalytics = document.getElementById("cc-toggle-analytics");
    var chkMarketing = document.getElementById("cc-toggle-marketing");
    var consent = {
      analytics: chkAnalytics ? chkAnalytics.checked : false,
      marketing: chkMarketing ? chkMarketing.checked : false,
      preferences: false,
    };
    save(consent);
    applyConsent(consent);
    hideBanner();
    hideModal();
  }

  /* ── wire up buttons ── */
  function bindEvents() {
    var btnAccept = document.getElementById("cc-btn-accept");
    var btnReject = document.getElementById("cc-btn-reject");
    var btnSettings = document.getElementById("cc-btn-settings");
    if (btnAccept) btnAccept.addEventListener("click", acceptAll);
    if (btnReject) btnReject.addEventListener("click", rejectAll);
    if (btnSettings) btnSettings.addEventListener("click", showModal);

    var btnClose = document.getElementById("cc-modal-close");
    var btnSave = document.getElementById("cc-btn-save");
    var btnRejectAll = document.getElementById("cc-btn-reject-all");
    var btnAcceptAll = document.getElementById("cc-btn-accept-all");
    var overlay = document.getElementById("cc-overlay");

    if (btnClose) btnClose.addEventListener("click", hideModal);
    if (btnSave) btnSave.addEventListener("click", saveSelection);
    if (btnRejectAll) btnRejectAll.addEventListener("click", rejectAll);
    if (btnAcceptAll) btnAcceptAll.addEventListener("click", acceptAll);
    if (overlay) overlay.addEventListener("click", hideModal);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") hideModal();
    });
  }

  /* ── init ── */
  function init() {
    injectUI();
    bindEvents();

    var existing = load();
    if (existing) {
      applyConsent(existing);
    } else {
      showBanner();
    }
  }

  /* ── public API ── */
  window.acceptCookies = acceptAll;
  window.rejectCookies = rejectAll;
  window.openCookieSettings = showModal;
  window.CookieConsent = { openSettings: showModal };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
