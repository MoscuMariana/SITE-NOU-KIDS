/* ============================================================
   Kiddy MSK — Banner de consimțământ cookie (Consent Mode v2)
   ------------------------------------------------------------
   INSTALARE: adaugă în <head>-ul FIECĂREI pagini, ÎNAINTE de
   orice script Google (gtag.js / Analytics), linia:

     <script src="/cookie-consent.js"></script>

   Re-deschidere setări (ex. link în footer):
     <a href="#" onclick="kiddyOpenCookieSettings();return false">Setări cookie-uri</a>

   NOTĂ: pentru reclamele AdSense în UE este necesar SUPLIMENTAR
   mesajul GDPR certificat din AdSense → Privacy & messaging.
   Acest banner acoperă Analytics + Consent Mode v2.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 1. Consent Mode v2: totul REFUZAT implicit ---------- */
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied', // site destinat copiilor: rămâne mereu refuzat
    analytics_storage: 'denied',
    wait_for_update: 500
  });

  var KEY = 'kiddyConsent';
  var MAX_AGE_DAYS = 180;

  function getConsent() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      var c = JSON.parse(raw);
      if (!c.ts || (Date.now() - c.ts) > MAX_AGE_DAYS * 864e5) return null;
      return c;
    } catch (e) { return null; }
  }

  function saveConsent(choice) {
    try { localStorage.setItem(KEY, JSON.stringify({ v: 1, choice: choice, ts: Date.now() })); } catch (e) {}
  }

  function applyConsent(choice) {
    if (choice === 'all') {
      gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'denied' // niciodată personalizate — conținut pentru copii
      });
    }
    /* 'necessary' -> rămâne totul refuzat (implicit) */
  }

  /* Aplică imediat alegerea salvată (dacă există) */
  var saved = getConsent();
  if (saved) applyConsent(saved.choice);

  /* ---------- 2. Interfața bannerului ---------- */
  function buildBanner() {
    if (document.getElementById('kiddy-cookie-banner')) return;

    var css = document.createElement('style');
    css.textContent =
      '#kiddy-cookie-banner{position:fixed;left:16px;right:16px;bottom:16px;z-index:99999;' +
      'max-width:520px;margin:0 auto;background:#fff8ef;color:#3a2e2a;border:2px solid #f3e3d0;' +
      'border-radius:22px;box-shadow:0 18px 40px -14px rgba(58,46,42,.45);padding:22px 24px;' +
      "font-family:'Nunito',sans-serif;font-size:15px;line-height:1.55;" +
      'animation:kiddyCookieUp .35s ease}' +
      '@keyframes kiddyCookieUp{from{transform:translateY(24px);opacity:0}to{transform:translateY(0);opacity:1}}' +
      '@media (prefers-reduced-motion:reduce){#kiddy-cookie-banner{animation:none}}' +
      '#kiddy-cookie-banner h2{font-family:"Fredoka","Nunito",sans-serif;font-weight:600;font-size:18px;' +
      'margin:0 0 8px;display:flex;align-items:center;gap:8px}' +
      '#kiddy-cookie-banner p{margin:0 0 14px}' +
      '#kiddy-cookie-banner a{color:#ff8a3d;font-weight:700;text-decoration:none}' +
      '#kiddy-cookie-banner a:hover{text-decoration:underline}' +
      '#kiddy-cookie-banner .kc-btns{display:flex;gap:10px;flex-wrap:wrap}' +
      '#kiddy-cookie-banner button{font-family:"Fredoka","Nunito",sans-serif;font-weight:600;font-size:15px;' +
      'border:none;border-radius:999px;padding:12px 22px;min-height:44px;cursor:pointer;transition:transform .15s,background .15s}' +
      '#kiddy-cookie-banner button:focus-visible{outline:3px solid #2f9bd6;outline-offset:2px}' +
      '#kiddy-cookie-banner .kc-accept{background:#3a2e2a;color:#fff}' +
      '#kiddy-cookie-banner .kc-accept:hover{background:#ff8a3d;transform:translateY(-2px)}' +
      '#kiddy-cookie-banner .kc-necessary{background:#fff;color:#3a2e2a;border:2px solid #f3e3d0}' +
      '#kiddy-cookie-banner .kc-necessary:hover{border-color:#3a2e2a}' +
      '@media (max-width:480px){#kiddy-cookie-banner{padding:18px}#kiddy-cookie-banner .kc-btns button{flex:1 1 100%}}';
    document.head.appendChild(css);

    var box = document.createElement('div');
    box.id = 'kiddy-cookie-banner';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'false');
    box.setAttribute('aria-labelledby', 'kc-title');
    box.setAttribute('aria-describedby', 'kc-desc');
    box.innerHTML =
      '<h2 id="kc-title">🍪 Prăjiturele digitale (cookie-uri)</h2>' +
      '<p id="kc-desc">Folosim cookie-uri esențiale pentru funcționarea site-ului și, doar cu acordul tău, ' +
      'cookie-uri statistice care ne ajută să înțelegem ce materiale vă plac. Reclamele afișate copiilor sunt ' +
      'întotdeauna <strong>nepersonalizate</strong>. Detalii în ' +
      '<a href="/confidentialitate.html">Politica de Confidențialitate</a>.</p>' +
      '<div class="kc-btns">' +
      '<button type="button" class="kc-accept">Accept toate</button>' +
      '<button type="button" class="kc-necessary">Doar cele necesare</button>' +
      '</div>';
    document.body.appendChild(box);

    function choose(choice) {
      saveConsent(choice);
      applyConsent(choice);
      box.remove();
    }
    box.querySelector('.kc-accept').addEventListener('click', function () { choose('all'); });
    box.querySelector('.kc-necessary').addEventListener('click', function () { choose('necessary'); });
    box.querySelector('.kc-accept').focus();
  }

  /* ---------- 3. Afișare la prima vizită + re-deschidere ---------- */
  function onReady(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }
  if (!saved) onReady(buildBanner);

  window.kiddyOpenCookieSettings = function () {
    try { localStorage.removeItem(KEY); } catch (e) {}
    onReady(buildBanner);
  };
})();
