(function () {
  "use strict";

  var GA_ID = "G-33877VG7WG";
  var KEY = "cc_decision";

  function decided() {
    try {
      return sessionStorage.getItem(KEY) !== null;
    } catch (e) {
      return false;
    }
  }

  function remember(v) {
    try {
      sessionStorage.setItem(KEY, v);
    } catch (e) {}
  }

  function isHome() {
    var p = window.location.pathname.split("/").pop();
    return p === "" || p === "index.html";
  }

  function enableGA() {
    if (typeof window.gtag !== "function") return;
    window.gtag("consent", "update", { analytics_storage: "granted" });
    window.gtag("event", "page_view", { send_to: GA_ID });
  }

  function injectStyles() {
    if (document.getElementById("_cc_s")) return;
    var s = document.createElement("style");
    s.id = "_cc_s";
    s.textContent = [
      "#cc-wrap{",
      "position:fixed;inset:0;z-index:99999;",
      "display:flex;align-items:center;justify-content:center;",
      "padding:1rem;box-sizing:border-box;",
      "background:rgba(2,7,17,0);",
      "backdrop-filter:blur(0px);-webkit-backdrop-filter:blur(0px);",
      "transition:background .35s ease,backdrop-filter .35s ease,-webkit-backdrop-filter .35s ease;",
      "}",
      "#cc-wrap.cc-in{",
      "background:rgba(2,7,17,0.72);",
      "backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);",
      "}",
      "#cc-box{",
      "width:min(460px,100%);",
      "background:linear-gradient(145deg,rgba(6,16,36,0.99),rgba(10,26,54,0.99));",
      "border:1px solid rgba(56,189,248,0.18);",
      "border-radius:22px;",
      "box-shadow:0 24px 64px rgba(0,0,0,0.6),0 0 0 1px rgba(56,189,248,0.06);",
      "padding:2.2rem 2rem 1.75rem;",
      "display:flex;flex-direction:column;align-items:center;text-align:center;",
      "font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;",
      "color:#f4f8ff;",
      "opacity:0;transform:scale(0.86) translateY(24px);",
      "transition:opacity .42s cubic-bezier(0.34,1.45,0.64,1),transform .42s cubic-bezier(0.34,1.45,0.64,1);",
      "}",
      "#cc-wrap.cc-in #cc-box{opacity:1;transform:scale(1) translateY(0);}",
      "#cc-box.cc-out{animation:_ccOut .4s cubic-bezier(0.55,0,0.75,0.05) forwards;}",
      "@keyframes _ccOut{",
      "0%{opacity:1;transform:scale(1) translateY(0) rotate(0deg);}",
      "35%{opacity:1;transform:scale(1.04) translateY(-6px) rotate(0deg);}",
      "100%{opacity:0;transform:scale(0.72) translateY(40px) rotate(-2.5deg);}",
      "}",
      "#cc-icon{",
      "width:62px;height:62px;border-radius:50%;",
      "background:rgba(56,189,248,0.1);border:1.5px solid rgba(56,189,248,0.25);",
      "display:flex;align-items:center;justify-content:center;",
      "font-size:1.9rem;margin-bottom:1.1rem;flex-shrink:0;",
      "}",
      "#cc-box h2{margin:0 0 .55rem;font-size:1.15rem;font-weight:700;color:#f4f8ff;}",
      "#cc-box p{margin:0 0 1.5rem;font-size:.875rem;line-height:1.6;color:#8fb0d0;}",
      "#cc-box p a{color:#38bdf8;text-decoration:underline;text-underline-offset:2px;}",
      "#cc-box p a:hover{color:#8ad7ff;}",
      ".cc-btns{display:flex;flex-direction:column;gap:.6rem;width:100%;margin-bottom:1rem;}",
      ".cc-btn{",
      "display:inline-flex;align-items:center;justify-content:center;",
      "padding:.65rem 1.4rem;border-radius:10px;font-size:.9rem;font-weight:600;",
      "cursor:pointer;border:2px solid transparent;font-family:inherit;",
      "transition:background .15s,border-color .15s,box-shadow .15s;",
      "width:100%;box-sizing:border-box;",
      "}",
      ".cc-btn:focus-visible{outline:3px solid #38bdf8;outline-offset:2px;}",
      ".cc-btn-accept{",
      "background:linear-gradient(135deg,#38bdf8,#0284c7);color:#fff;",
      "box-shadow:0 4px 18px rgba(56,189,248,0.35);",
      "}",
      ".cc-btn-accept:hover{background:linear-gradient(135deg,#5ccfff,#0ea5e9);box-shadow:0 6px 24px rgba(56,189,248,0.5);}",
      ".cc-btn-decline{",
      "background:transparent;color:#8fb0d0;",
      "border-color:rgba(56,189,248,0.22);",
      "}",
      ".cc-btn-decline:hover{border-color:rgba(56,189,248,0.5);color:#c6d7ee;}",
      ".cc-legal{font-size:.72rem;color:#4a6b8a;line-height:1.5;}",
      ".cc-legal a{color:#38bdf8;text-decoration:underline;text-underline-offset:2px;}",
      ".cc-legal a:hover{color:#8ad7ff;}",
      "@media(max-width:480px){",
      "#cc-box{padding:1.75rem 1.35rem 1.4rem;}",
      "}",
    ].join("");
    document.head.appendChild(s);
  }

  function buildUI() {
    var wrap = document.createElement("div");
    wrap.id = "cc-wrap";
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-modal", "true");
    wrap.setAttribute("aria-label", "Cookie-Einwilligung");

    wrap.innerHTML =
      '<div id="cc-box">' +
      '<div id="cc-icon">&#x1F36A;</div>' +
      "<h2>Datenschutz&#x200B;-Einstellungen</h2>" +
      "<p>Wir verwenden Cookies, um unsere Website zu verbessern und Besuche statistisch auszuwerten. " +
      "Weitere Informationen finden Sie in unserer " +
      '<a href="datenschutz.html">Datenschutzerkl\u00e4rung</a>.</p>' +
      '<div class="cc-btns">' +
      '<button class="cc-btn cc-btn-accept" id="cc-accept">Alle akzeptieren</button>' +
      '<button class="cc-btn cc-btn-decline" id="cc-decline">Nur notwendige</button>' +
      "</div>" +
      '<p class="cc-legal">' +
      '<a href="impressum.html">Impressum</a> &nbsp;&middot;&nbsp; ' +
      '<a href="datenschutz.html">Datenschutz</a>' +
      "</p>" +
      "</div>";

    return wrap;
  }

  function show(wrap) {
    document.body.appendChild(wrap);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        wrap.classList.add("cc-in");
      });
    });
  }

  function hide(wrap, cb) {
    var box = wrap.querySelector("#cc-box");
    var done = false;
    function finish() {
      if (done) return;
      done = true;
      wrap.style.transition =
        "background .3s ease,backdrop-filter .3s ease,-webkit-backdrop-filter .3s ease";
      wrap.classList.remove("cc-in");
      setTimeout(function () {
        if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
        if (cb) cb();
      }, 320);
    }
    box.addEventListener("animationend", finish, { once: true });
    setTimeout(finish, 600); // fallback
    box.classList.add("cc-out");
  }

  function init() {
    if (!isHome() || decided()) return;

    injectStyles();
    var wrap = buildUI();
    show(wrap);

    document.getElementById("cc-accept").addEventListener("click", function () {
      remember("yes");
      enableGA();
      hide(wrap);
    });

    document
      .getElementById("cc-decline")
      .addEventListener("click", function () {
        remember("no");
        hide(wrap);
      });

    document.addEventListener("keydown", function onKey(e) {
      if (e.key === "Escape") {
        document.removeEventListener("keydown", onKey);
        remember("no");
        hide(wrap);
      }
    });
  }

  window.CookieConsent = { openSettings: function () {} };
  window.acceptCookies = function () {
    remember("yes");
    enableGA();
  };
  window.rejectCookies = function () {
    remember("no");
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
