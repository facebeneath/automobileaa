(function () {
  "use strict";

  var KEY = "cc_decision";

  function decided() {
    try {
      return localStorage.getItem(KEY) !== null;
    } catch (e) {
      return false;
    }
  }

  function getDecision() {
    try {
      return localStorage.getItem(KEY);
    } catch (e) {
      return null;
    }
  }

  function remember(v) {
    try {
      localStorage.setItem(KEY, v);
    } catch (e) {}
  }

  function waitForGtag(cb) {
    if (typeof window.gtag === "function") {
      cb();
    } else {
      setTimeout(function () {
        waitForGtag(cb);
      }, 200);
    }
  }

  function enableGA() {
    waitForGtag(function () {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
        ad_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
      });
    });
  }

  function disableGA() {
    waitForGtag(function () {
      window.gtag("consent", "update", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
    });
  }

  function injectStyles() {
    if (document.getElementById("_cc_s")) return;

    var s = document.createElement("style");
    s.id = "_cc_s";
    s.textContent = `
      #cc-wrap{
        position:fixed;inset:0;z-index:99999;
        display:flex;align-items:center;justify-content:center;
        background:rgba(0,0,0,0.6);
      }
      #cc-box{
        width:420px;max-width:92%;
        background:#0b1a2e;
        color:#fff;
        padding:24px;
        border-radius:16px;
        text-align:center;
        font-family:system-ui;
      }
      .cc-btn{
        width:100%;
        padding:12px;
        margin-top:10px;
        border-radius:10px;
        border:none;
        cursor:pointer;
      }
      .cc-accept{background:#38bdf8;color:#000;}
      .cc-decline{background:#333;color:#fff;}
    `;
    document.head.appendChild(s);
  }

  function buildUI() {
    var wrap = document.createElement("div");
    wrap.id = "cc-wrap";

    wrap.innerHTML = `
  <div id="cc-box">
    <h2>Cookies</h2>
    <p>Wir verwenden Cookies für Analysen und zur Verbesserung der Website.</p>

    <button class="cc-btn cc-accept" id="cc-accept">Alle akzeptieren</button>
    <button class="cc-btn cc-decline" id="cc-decline">Ablehnen</button>
  </div>
`;

    return wrap;
  }

  function applyStoredConsent() {
    var v = getDecision();

    if (v === "yes") {
      enableGA();
      return true;
    }

    if (v === "no") {
      disableGA();
      return true;
    }

    return false;
  }

  function init() {
    if (applyStoredConsent()) return;

    injectStyles();

    var wrap = buildUI();
    document.body.appendChild(wrap);

    document.getElementById("cc-accept").addEventListener("click", function () {
      remember("yes");
      enableGA();
      wrap.remove();
    });

    document
      .getElementById("cc-decline")
      .addEventListener("click", function () {
        remember("no");
        disableGA();
        wrap.remove();
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
