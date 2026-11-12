/* Ressources offertes — capture d'e-mail — Les Cavalières Intuitives
   ----------------------------------------------------------------
   Tout lien portant data-ressource="cle" ouvre un petit formulaire
   (prénom, e-mail, case d'accord). La fonction Netlify enregistre le
   contact dans Brevo et envoie le lien de la ressource par e-mail.

   INTERRUPTEUR : tant que CAPTURE_ACTIVE vaut false, les liens se
   comportent normalement (accès direct, comme avant). Passer à true
   seulement quand la fonction "ressource" est déployée et testée.
*/
(function () {
  var CAPTURE_ACTIVE = true;
  var ENDPOINT = 'https://decouverte-mission-connexion.netlify.app/.netlify/functions/ressource';

  var TITRES = {
    'livret-debourrer': 'le livret « Éduquer tôt, débourrer en douceur »'
  };

  function track(nom, params) {
    if (typeof window.gtag === 'function') window.gtag('event', nom, params || {});
  }

  /* ── Mode inactif : simple suivi des clics, accès direct ── */
  if (!CAPTURE_ACTIVE) {
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[data-ressource]');
      if (a) track('clic_ressource', { ressource: a.getAttribute('data-ressource'), page: location.pathname });
    });
    return;
  }

  /* ── Mode actif : formulaire ── */
  var css = ''
    + '#lci-res-overlay{position:fixed;inset:0;background:rgba(44,26,16,.55);display:none;align-items:center;justify-content:center;z-index:9999;padding:1rem}'
    + '#lci-res-overlay.open{display:flex}'
    + '#lci-res-box{background:#FDFAF7;color:#2C1A10;max-width:440px;width:100%;border-radius:6px;padding:2rem 1.6rem;position:relative;font-family:Lato,"Segoe UI",Helvetica,Arial,sans-serif;font-size:16px;line-height:1.6;box-shadow:0 10px 40px rgba(0,0,0,.25);max-height:92vh;overflow:auto}'
    + '#lci-res-box h3{font-family:"Playfair Display",Georgia,serif;color:#8B2500;font-size:1.35rem;margin:0 0 .4rem;line-height:1.3}'
    + '#lci-res-box p{margin:0 0 1rem}'
    + '#lci-res-box label{display:block;font-size:.9rem;font-weight:700;margin:.8rem 0 .25rem}'
    + '#lci-res-box input[type=text],#lci-res-box input[type=email]{width:100%;box-sizing:border-box;padding:.7rem .8rem;border:1px solid #E8D5CC;border-radius:4px;font:inherit;background:#fff}'
    + '#lci-res-box .case{display:flex;gap:.6rem;align-items:flex-start;font-weight:400;font-size:.88rem;margin-top:1rem}'
    + '#lci-res-box .case input{margin-top:.3rem;flex:none}'
    + '#lci-res-box button[type=submit]{margin-top:1.2rem;width:100%;background:#8B2500;color:#FDFAF7;border:0;border-radius:2px;padding:.85rem 1rem;font:inherit;font-weight:700;cursor:pointer}'
    + '#lci-res-box button[type=submit]:hover{background:#C0622A}'
    + '#lci-res-box button[disabled]{opacity:.6;cursor:wait}'
    + '#lci-res-close{position:absolute;top:.5rem;right:.7rem;background:none;border:0;font-size:1.6rem;color:#6E5D52;cursor:pointer;line-height:1}'
    + '#lci-res-msg{color:#8B2500;font-size:.9rem;margin-top:.8rem;min-height:1.2em}'
    + '#lci-res-box .piege{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var ov = document.createElement('div');
  ov.id = 'lci-res-overlay';
  ov.innerHTML = ''
    + '<div id="lci-res-box" role="dialog" aria-modal="true" aria-labelledby="lci-res-titre">'
    + '<button type="button" id="lci-res-close" aria-label="Fermer">×</button>'
    + '<div id="lci-res-contenu">'
    + '<h3 id="lci-res-titre">Je te l’envoie par e-mail</h3>'
    + '<p id="lci-res-sous">Laisse-moi ton prénom et ton e-mail, tu reçois le lien tout de suite.</p>'
    + '<form id="lci-res-form" novalidate>'
    + '<label for="lci-res-prenom">Ton prénom</label><input type="text" id="lci-res-prenom" autocomplete="given-name" required>'
    + '<label for="lci-res-email">Ton e-mail</label><input type="email" id="lci-res-email" autocomplete="email" required>'
    + '<div class="piege" aria-hidden="true"><input type="text" id="lci-res-piege" tabindex="-1" autocomplete="off"></div>'
    + '<label class="case"><input type="checkbox" id="lci-res-accord"> <span>J’accepte de recevoir cette ressource et les e-mails de Géraldine (Les Cavalières Intuitives) : lettres, nouveaux outils, actualités. Je peux me désinscrire à tout moment. <a href="/confidentialite.html" target="_blank">En savoir plus</a></span></label>'
    + '<button type="submit" id="lci-res-btn">Recevoir mon lien</button>'
    + '<p id="lci-res-msg" role="status"></p>'
    + '</form></div></div>';
  document.body.appendChild(ov);

  var cleCourante = null;
  function $(id) { return document.getElementById(id); }
  var contenuInitial = $('lci-res-contenu').innerHTML;

  function ouvrir(cle) {
    cleCourante = cle;
    $('lci-res-contenu').innerHTML = contenuInitial;
    $('lci-res-sous').textContent = 'Laisse-moi ton prénom et ton e-mail, et je t’envoie ' + (TITRES[cle] || 'ta ressource') + ' tout de suite.';
    $('lci-res-form').addEventListener('submit', envoyer);
    ov.classList.add('open');
    setTimeout(function () { $('lci-res-prenom').focus(); }, 50);
    track('ouverture_formulaire_ressource', { ressource: cle, page: location.pathname });
  }
  function fermer() { ov.classList.remove('open'); }

  function envoyer(e) {
    e.preventDefault();
    var prenom = $('lci-res-prenom').value.trim();
    var email = $('lci-res-email').value.trim();
    var msg = $('lci-res-msg');
    if (!prenom) { msg.textContent = 'Indique ton prénom.'; return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { msg.textContent = 'Vérifie ton adresse e-mail.'; return; }
    if (!$('lci-res-accord').checked) { msg.textContent = 'Coche la case pour recevoir ta ressource.'; return; }
    var btn = $('lci-res-btn'); btn.disabled = true; btn.textContent = 'Envoi…'; msg.textContent = '';

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prenom: prenom, email: email, ressource: cleCourante, consentement: true, piege: $('lci-res-piege').value, page: location.pathname })
    }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      track('ressource_demandee', { ressource: cleCourante, page: location.pathname });
      $('lci-res-contenu').innerHTML = '<h3>C’est envoyé ✓</h3>'
        + '<p>' + prenom.replace(/[<>&"]/g, '') + ', le lien t’attend dans ta boîte mail. S’il n’apparaît pas d’ici quelques minutes, regarde dans les onglets « Promotions » ou « Spam ».</p>';
    }).catch(function () {
      btn.disabled = false; btn.textContent = 'Recevoir mon lien';
      msg.innerHTML = 'Un souci a empêché l’envoi. Réessaie dans un instant, ou écris-moi à <a href="mailto:contactezgeraldine@gmail.com">contactezgeraldine@gmail.com</a>.';
    });
  }

  ov.addEventListener('click', function (e) { if (e.target === ov || e.target.id === 'lci-res-close') fermer(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fermer(); });
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[data-ressource]');
    if (!a) return;
    e.preventDefault();
    ouvrir(a.getAttribute('data-ressource'));
  });
})();
