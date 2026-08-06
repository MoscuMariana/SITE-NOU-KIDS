/* =====================================================================
   Kiddy MSK — reclame AdSense
   ---------------------------------------------------------------------
   SINGURUL fisier pe care trebuie sa-l editezi.

   Dupa ce contul AdSense e aprobat:
     1. Intra pe adsense.google.com -> Reclame -> Dupa unitate de anunt
     2. Creeaza doua unitati "Afisare" (Display), responsive
     3. Copiaza numarul data-ad-slot al fiecareia (10 cifre)
     4. Inlocuieste mai jos, intre ghilimele
     5. Urca doar acest fisier in repo

   Pana atunci lasa-le pe "0000000000" — nu se afiseaza nimic,
   nu apare niciun spatiu gol si nu se strica nicio pagina.
   ===================================================================== */

var KIDDY_ADS = {
  client: 'ca-pub-1336256146659551',

  // unitatea afisata dupa primul paragraf al articolului
  inArticle: '0000000000',

  // unitatea afisata la finalul articolului, inainte de navigare
  afterArticle: '0000000000'
};

/* ------------------ de aici in jos nu e nevoie sa modifici ----------- */
(function () {
  'use strict';

  var slots = document.querySelectorAll('[data-kiddy-ad]');
  if (!slots.length) { return; }

  slots.forEach(function (holder) {
    var key = holder.getAttribute('data-kiddy-ad');
    var slot = KIDDY_ADS[key];

    // slot neconfigurat inca -> nu randam nimic
    if (!slot || slot === '0000000000') { return; }

    var ins = document.createElement('ins');
    ins.className = 'adsbygoogle';
    ins.style.display = 'block';
    ins.style.margin = '22px 0';
    ins.setAttribute('data-ad-client', KIDDY_ADS.client);
    ins.setAttribute('data-ad-slot', slot);
    ins.setAttribute('data-ad-format', 'auto');
    ins.setAttribute('data-full-width-responsive', 'true');

    holder.appendChild(ins);

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  });
})();
