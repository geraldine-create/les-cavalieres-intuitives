/* assets/origine.js
   Retient d'où arrive une visiteuse (post, newsletter, Google, Facebook…) et par quelle page
   elle est entrée sur le site, pour que le test des 4 clés puisse transmettre son origine.
   - Un lien peut porter une étiquette : ?src=post-respiration, ?src=newsletter, ?src=page-peur…
   - Sinon, on regarde le site d'où elle vient (Google, Facebook, Instagram…).
   Rien n'est envoyé ailleurs : l'information reste dans son navigateur jusqu'au test.
   Respect du bandeau cookies : la mémoire sur 30 jours n'est utilisée que si la visiteuse
   a cliqué « J'accepte ». Sinon rien n'est stocké : on lit seulement l'étiquette ?src=
   et la page d'où elle arrive, au moment du test. */
(function () {
  'use strict';
  var CLE = 'lci_origine';
  var DUREE = 30 * 24 * 3600 * 1000; // 30 jours
  var ICI = location.hostname.replace(/^www\./, '');

  function accepte() {
    try { var c = JSON.parse(localStorage.getItem('lci-cookies')); return !!(c && c.v === 'yes'); } catch (e) { return false; }
  }
  function lire() { if (!accepte()) return null; try { return JSON.parse(localStorage.getItem(CLE)); } catch (e) { return null; } }
  function ecrire(v) {
    try { if (accepte()) localStorage.setItem(CLE, JSON.stringify(v)); else localStorage.removeItem(CLE); } catch (e) {}
  }

  function canalDe(ref) {
    if (!ref) return '';
    var h;
    try { h = new URL(ref).hostname.replace(/^www\./, ''); } catch (e) { return ''; }
    if (h === ICI) return 'interne';
    if (/google\./.test(h)) return 'Google';
    if (/bing\.|duckduckgo|qwant|ecosia|yahoo\./.test(h)) return 'Moteur de recherche';
    if (/facebook\.|fb\.|messenger\./.test(h)) return 'Facebook';
    if (/instagram\./.test(h)) return 'Instagram';
    if (/linkedin\./.test(h)) return 'LinkedIn';
    if (/youtube\.|youtu\.be/.test(h)) return 'YouTube';
    if (/brevo|sendibt|mail\./.test(h)) return 'E-mail';
    return h;
  }

  var src = new URLSearchParams(location.search).get('src');
  var canal = canalDe(document.referrer);
  var memo = lire();
  var perime = !memo || (Date.now() - (memo.quand || 0)) > DUREE;

  // Nouvelle arrivée de l'extérieur (ou lien étiqueté) : on note le canal et la page d'entrée
  if (src || (canal && canal !== 'interne') || perime) {
    memo = {
      canal: src ? src : (canal === 'interne' ? 'site' : (canal || 'accès direct')),
      entree: location.pathname,
      quand: Date.now()
    };
  }
  // Dernière page vue avant celle-ci (utile pour savoir d'où elle a cliqué vers le test)
  if (canal === 'interne') {
    try { memo.avant = new URL(document.referrer).pathname; } catch (e) {}
  } else {
    memo.avant = '';
  }
  ecrire(memo);

  // Texte court de l'origine, lu par la page du test
  window.lciOrigine = function () {
    var m = lire() || memo;
    var morceaux = [m.canal || 'accès direct'];
    if (m.entree && m.entree !== location.pathname) morceaux.push('entrée ' + m.entree);
    if (m.avant && m.avant !== m.entree && m.avant !== location.pathname) morceaux.push('clic depuis ' + m.avant);
    return morceaux.join(' · ').slice(0, 100);
  };
})();
