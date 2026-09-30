/* Bandeau de consentement cookies — Les Cavalières Intuitives
   Google Analytics 4 n'est chargé qu'après un clic sur « J'accepte ».
   Le choix est mémorisé 6 mois dans le navigateur de la visiteuse, puis redemandé.
   Pour rouvrir le bandeau : lien « Gérer mes cookies » (appelle lciCookies.open()). */
(function () {
  var GA_ID = 'G-BX0NP7BXGY';
  var KEY = 'lci-cookies';
  var MAX_AGE = 1000 * 60 * 60 * 24 * 182; // ~6 mois

  function readChoice() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      var c = JSON.parse(raw);
      if (!c || !c.t || Date.now() - c.t > MAX_AGE) return null;
      return c.v;
    } catch (e) { return null; }
  }
  function saveChoice(v) {
    try { localStorage.setItem(KEY, JSON.stringify({ v: v, t: Date.now() })); } catch (e) {}
  }

  var gaLoaded = false;
  function loadGA() {
    if (gaLoaded) return;
    gaLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
  }
  function clearGACookies() {
    var host = location.hostname.replace(/^www\./, '');
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name.indexOf('_ga') === 0) {
        ['', '; domain=' + host, '; domain=.' + host].forEach(function (d) {
          document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d;
        });
      }
    });
  }

  var css =
    '#lci-cookie{position:fixed;left:1rem;right:1rem;bottom:1rem;z-index:9999;max-width:560px;margin:0 auto;' +
    'background:#FDFAF7;color:#2C1A10;border:1px solid #E8D5CC;border-left:4px solid #C0622A;border-radius:6px;' +
    'box-shadow:0 8px 30px rgba(44,26,16,.18);padding:1.1rem 1.25rem;font-family:Lato,sans-serif;font-size:.92rem;line-height:1.6}' +
    '#lci-cookie p{margin:0 0 .85rem}' +
    '#lci-cookie a{color:#C0622A}' +
    '#lci-cookie .lci-btns{display:flex;gap:.6rem;flex-wrap:wrap}' +
    '#lci-cookie button{flex:1 1 140px;font-family:inherit;font-size:.9rem;font-weight:700;padding:.6rem 1rem;' +
    'border-radius:4px;cursor:pointer;border:1px solid #8B2500}' +
    '#lci-cookie .lci-yes{background:#8B2500;color:#FDFAF7}' +
    '#lci-cookie .lci-no{background:#FDFAF7;color:#8B2500}';

  function showBanner() {
    if (document.getElementById('lci-cookie')) return;
    if (!document.getElementById('lci-cookie-css')) {
      var st = document.createElement('style');
      st.id = 'lci-cookie-css';
      st.textContent = css;
      document.head.appendChild(st);
    }
    var b = document.createElement('div');
    b.id = 'lci-cookie';
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-label', 'Choix des cookies');
    b.innerHTML =
      '<p>Petite question avant de continuer 🐎 J\u2019aimerais mesurer, de façon anonyme, comment les visiteuses ' +
      'utilisent ce site (Google Analytics), pour l\u2019améliorer. Tu es d\u2019accord ? Tu peux changer d\u2019avis ' +
      'à tout moment. <a href="confidentialite.html#cookies">En savoir plus</a></p>' +
      '<div class="lci-btns">' +
      '<button type="button" class="lci-no">Je refuse</button>' +
      '<button type="button" class="lci-yes">J\u2019accepte</button>' +
      '</div>';
    b.querySelector('.lci-yes').onclick = function () { saveChoice('yes'); b.remove(); loadGA(); };
    b.querySelector('.lci-no').onclick = function () { saveChoice('no'); b.remove(); clearGACookies(); };
    document.body.appendChild(b);
  }

  window.lciCookies = {
    open: function () {
      try { localStorage.removeItem(KEY); } catch (e) {}
      if (gaLoaded) { clearGACookies(); location.reload(); return; }
      showBanner();
    }
  };

  function init() {
    var c = readChoice();
    if (c === 'yes') loadGA();
    else if (c === null) showBanner();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
