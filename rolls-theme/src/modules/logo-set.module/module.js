(function () {
  'use strict';

  // Optional: set window.LOGOS_DEBUG = 1 in the console to see debug logs.
  var DEBUG = !!window.LOGOS_DEBUG;

  // Country → region (amer|apac|emea|uk)
  var countryList = [
    {iso:"af",region:"emea"},{iso:"al",region:"emea"},{iso:"dz",region:"emea"},
    {iso:"as",region:"apac"},{iso:"ad",region:"emea"},{iso:"ao",region:"emea"},
    {iso:"ai",region:"amer"},{iso:"aq",region:"apac"},{iso:"ag",region:"amer"},
    {iso:"ar",region:"amer"},{iso:"am",region:"emea"},{iso:"aw",region:"amer"},
    {iso:"au",region:"apac"},{iso:"at",region:"emea"},{iso:"az",region:"emea"},
    {iso:"bs",region:"amer"},{iso:"bh",region:"emea"},{iso:"bd",region:"apac"},
    {iso:"bb",region:"amer"},{iso:"by",region:"emea"},{iso:"be",region:"emea"},
    {iso:"bz",region:"amer"},{iso:"bj",region:"emea"},{iso:"bm",region:"amer"},
    {iso:"bt",region:"apac"},{iso:"bo",region:"amer"},{iso:"ba",region:"emea"},
    {iso:"bw",region:"emea"},{iso:"br",region:"amer"},{iso:"bn",region:"apac"},
    {iso:"bg",region:"emea"},{iso:"bf",region:"emea"},{iso:"bi",region:"emea"},
    {iso:"kh",region:"apac"},{iso:"cm",region:"emea"},{iso:"ca",region:"amer"},
    {iso:"ky",region:"amer"},{iso:"cf",region:"emea"},{iso:"td",region:"emea"},
    {iso:"cl",region:"amer"},{iso:"cn",region:"apac"},{iso:"cx",region:"apac"},
    {iso:"cc",region:"apac"},{iso:"co",region:"amer"},{iso:"km",region:"emea"},
    {iso:"cg",region:"emea"},{iso:"cd",region:"emea"},{iso:"ck",region:"apac"},
    {iso:"cr",region:"amer"},{iso:"ci",region:"emea"},{iso:"hr",region:"emea"},
    {iso:"cu",region:"amer"},{iso:"cw",region:"amer"},{iso:"cy",region:"emea"},
    {iso:"cz",region:"emea"},{iso:"dk",region:"emea"},{iso:"dj",region:"emea"},
    {iso:"dm",region:"amer"},{iso:"do",region:"amer"},{iso:"ec",region:"amer"},
    {iso:"eg",region:"emea"},{iso:"sv",region:"amer"},{iso:"gq",region:"emea"},
    {iso:"er",region:"emea"},{iso:"ee",region:"emea"},{iso:"sz",region:"emea"},
    {iso:"et",region:"emea"},{iso:"fk",region:"emea"},{iso:"fo",region:"emea"},
    {iso:"fj",region:"apac"},{iso:"fi",region:"emea"},{iso:"fr",region:"emea"},
    {iso:"gf",region:"amer"},{iso:"pf",region:"apac"},{iso:"tf",region:"emea"},
    {iso:"ga",region:"emea"},{iso:"gm",region:"emea"},{iso:"ge",region:"emea"},
    {iso:"de",region:"emea"},{iso:"gh",region:"emea"},{iso:"gi",region:"emea"},
    {iso:"gr",region:"emea"},{iso:"gl",region:"emea"},{iso:"gd",region:"amer"},
    {iso:"gp",region:"amer"},{iso:"gu",region:"apac"},{iso:"gt",region:"amer"},
    {iso:"gg",region:"emea"},{iso:"gn",region:"emea"},{iso:"gw",region:"emea"},
    {iso:"gy",region:"amer"},{iso:"ht",region:"amer"},{iso:"hm",region:"apac"},
    {iso:"va",region:"emea"},{iso:"hn",region:"amer"},{iso:"hk",region:"apac"},
    {iso:"hu",region:"emea"},{iso:"is",region:"emea"},{iso:"in",region:"apac"},
    {iso:"id",region:"apac"},{iso:"ir",region:"emea"},{iso:"iq",region:"emea"},
    {iso:"ie",region:"emea"},{iso:"im",region:"emea"},{iso:"il",region:"emea"},
    {iso:"it",region:"emea"},{iso:"jm",region:"amer"},{iso:"jp",region:"apac"},
    {iso:"je",region:"emea"},{iso:"jo",region:"emea"},{iso:"kz",region:"emea"},
    {iso:"ke",region:"emea"},{iso:"ki",region:"apac"},{iso:"kp",region:"apac"},
    {iso:"kr",region:"apac"},{iso:"kw",region:"emea"},{iso:"kg",region:"emea"},
    {iso:"la",region:"apac"},{iso:"lv",region:"emea"},{iso:"lb",region:"emea"},
    {iso:"ls",region:"emea"},{iso:"lr",region:"emea"},{iso:"ly",region:"emea"},
    {iso:"li",region:"emea"},{iso:"lt",region:"emea"},{iso:"lu",region:"emea"},
    {iso:"mo",region:"apac"},{iso:"mk",region:"emea"},{iso:"mg",region:"emea"},
    {iso:"mw",region:"emea"},{iso:"my",region:"apac"},{iso:"mv",region:"apac"},
    {iso:"ml",region:"emea"},{iso:"mt",region:"emea"},{iso:"mh",region:"apac"},
    {iso:"mq",region:"amer"},{iso:"mr",region:"emea"},{iso:"mu",region:"emea"},
    {iso:"yt",region:"emea"},{iso:"mx",region:"amer"},{iso:"fm",region:"apac"},
    {iso:"md",region:"emea"},{iso:"mc",region:"emea"},{iso:"mn",region:"apac"},
    {iso:"me",region:"emea"},{iso:"ms",region:"amer"},{iso:"ma",region:"emea"},
    {iso:"mz",region:"emea"},{iso:"mm",region:"apac"},{iso:"na",region:"emea"},
    {iso:"nr",region:"apac"},{iso:"np",region:"apac"},{iso:"nl",region:"emea"},
    {iso:"nc",region:"apac"},{iso:"nz",region:"apac"},{iso:"ni",region:"amer"},
    {iso:"ne",region:"emea"},{iso:"ng",region:"emea"},{iso:"nu",region:"apac"},
    {iso:"nf",region:"apac"},{iso:"mp",region:"apac"},{iso:"no",region:"emea"},
    {iso:"om",region:"emea"},{iso:"pk",region:"apac"},{iso:"pw",region:"apac"},
    {iso:"ps",region:"emea"},{iso:"pa",region:"amer"},{iso:"pg",region:"apac"},
    {iso:"py",region:"amer"},{iso:"pe",region:"amer"},{iso:"ph",region:"apac"},
    {iso:"pn",region:"apac"},{iso:"pl",region:"emea"},{iso:"pt",region:"emea"},
    {iso:"pr",region:"amer"},{iso:"qa",region:"emea"},{iso:"re",region:"emea"},
    {iso:"ro",region:"emea"},{iso:"ru",region:"emea"},{iso:"rw",region:"emea"},
    {iso:"bl",region:"amer"},{iso:"sh",region:"emea"},{iso:"kn",region:"amer"},
    {iso:"lc",region:"amer"},{iso:"mf",region:"amer"},{iso:"pm",region:"amer"},
    {iso:"vc",region:"amer"},{iso:"ws",region:"apac"},{iso:"sm",region:"emea"},
    {iso:"st",region:"emea"},{iso:"sa",region:"emea"},{iso:"sn",region:"emea"},
    {iso:"rs",region:"emea"},{iso:"sc",region:"emea"},{iso:"sl",region:"emea"},
    {iso:"sg",region:"apac"},{iso:"sx",region:"amer"},{iso:"sk",region:"emea"},
    {iso:"si",region:"emea"},{iso:"sb",region:"apac"},{iso:"so",region:"emea"},
    {iso:"za",region:"emea"},{iso:"gs",region:"emea"},{iso:"ss",region:"emea"},
    {iso:"es",region:"emea"},{iso:"lk",region:"apac"},{iso:"sd",region:"emea"},
    {iso:"sr",region:"amer"},{iso:"sj",region:"emea"},{iso:"se",region:"emea"},
    {iso:"ch",region:"emea"},{iso:"sy",region:"emea"},{iso:"tw",region:"apac"},
    {iso:"tj",region:"emea"},{iso:"tz",region:"emea"},{iso:"th",region:"apac"},
    {iso:"tl",region:"apac"},{iso:"tg",region:"emea"},{iso:"tk",region:"apac"},
    {iso:"to",region:"apac"},{iso:"tt",region:"amer"},{iso:"tn",region:"emea"},
    {iso:"tr",region:"emea"},{iso:"tm",region:"emea"},{iso:"tc",region:"amer"},
    {iso:"tv",region:"apac"},{iso:"ug",region:"emea"},{iso:"ua",region:"emea"},
    {iso:"ae",region:"emea"},{iso:"gb",region:"uk"},{iso:"us",region:"amer"},
    {iso:"uy",region:"amer"},{iso:"uz",region:"emea"},{iso:"vu",region:"apac"},
    {iso:"ve",region:"amer"},{iso:"vn",region:"apac"},{iso:"vg",region:"amer"},
    {iso:"vi",region:"amer"},{iso:"wf",region:"apac"},{iso:"eh",region:"emea"},
    {iso:"ye",region:"emea"},{iso:"zm",region:"emea"},{iso:"zw",region:"emea"}
  ];

  function countryToRegion(iso2) {
    iso2 = (iso2 || '').toLowerCase();
    var found = countryList.find(function (c) { return c.iso === iso2; });
    return found ? found.region : null;
  }

  // html[data-location] → region hint
  var locationToRegion = { us:'amer', ca:'amer', gb:'uk', uk:'uk', au:'apac', nz:'apac', eu:'emea' };

  // region synonyms — we’ll match against whatever buckets actually exist in DOM
  var regionSynonyms = {
    amer: ['amer','america','americas','na','us','usa','latam','ca'],
    uk:   ['uk','gb','britain','united-kingdom'],
    apac: ['apac','asia-pacific','anz','au','nz','oceania','asia'],
    emea: ['emea','europe','eu','middle-east','me','africa'],
    default: ['default','global','all']
  };

  function fallbackCountry() {
    try {
      var lang = (navigator.language || '').toLowerCase();
      var maybe = lang.split('-')[1];
      if (maybe && maybe.length === 2) return maybe;
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      if (/sydney|melbourne|brisbane|auckland|hobart/i.test(tz)) return 'au';
      if (/london|guernsey|jersey|isle_of_man/i.test(tz)) return 'gb';
      if (/new_york|chicago|los_angeles|denver|phoenix|toronto|vancouver/i.test(tz)) return 'us';
    } catch (_) {}
    return '';
  }

  function pickBestBucket(available, desired) {
    var avail = new Set(available.map(function (s){return s.toLowerCase();}));
    if (avail.has(desired)) return desired; // exact

    var syns = regionSynonyms[desired] || [];
    for (var i=0;i<syns.length;i++) if (avail.has(syns[i])) return syns[i];

    var order = ['uk','amer','apac','emea','default'];
    for (var j=0;j<order.length;j++){
      var list = regionSynonyms[order[j]] || [];
      for (var k=0;k<list.length;k++) if (avail.has(list[k])) return list[k];
    }
    return available[0] || 'default';
  }

  function initScrollerAnimation(visibleInner) {
    if (!visibleInner) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var scroller = visibleInner.closest('.scroller');
    if (!scroller || scroller.hasAttribute('data-animated')) return;

    if (!visibleInner.querySelector('[aria-hidden="true"]')) {
      Array.prototype.slice.call(visibleInner.children).forEach(function (child) {
        var clone = child.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        visibleInner.appendChild(clone);
      });
    }
    requestAnimationFrame(function(){ scroller.setAttribute('data-animated','true'); });
  }

  function ready(fn){
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn, { once: true });
  }

  ready(function () {
    var htmlLoc = (document.documentElement.getAttribute('data-location') || '').toLowerCase();

    document.querySelectorAll('.logo-set-module').forEach(function (moduleEl) {
      try {
        // Sources of truth priority:
        // 1) data-country (server personalization)
        // 2) html[data-location] hint
        // 3) language/timezone fallback
        var serverCountry = (moduleEl.getAttribute('data-country') || '').toLowerCase();
        var hintRegion = (locationToRegion[htmlLoc] || '').toLowerCase();
        var fbCountry = fallbackCountry();

        var desiredRegion =
          countryToRegion(serverCountry) ||
          hintRegion ||
          countryToRegion(fbCountry) ||
          'default';

        // Find available buckets in this module
        var bucketEls = moduleEl.querySelectorAll('[data-logos]');
        var buckets = Array.prototype.map.call(bucketEls, function (el) {
          return (el.getAttribute('data-logos') || '').toLowerCase();
        }).filter(Boolean);

        // If there are no data-logos buckets, we’re on the simple/default variant
        if (!buckets.length) {
          moduleEl.style.visibility = 'visible';
          return;
        }

        var chosen = pickBestBucket(buckets, desiredRegion);
        var chosenEl = null;

        bucketEls.forEach(function (el) {
          var v = (el.getAttribute('data-logos') || '').toLowerCase();
          if (v === chosen) {
            el.style.display = 'flex';
            chosenEl = el;
          } else {
            el.style.display = 'none';
          }
        });

        moduleEl.style.visibility = 'visible';
        requestAnimationFrame(function(){ initScrollerAnimation(chosenEl); });

        if (DEBUG) {
          console.debug('[logos]', {
            htmlLoc: htmlLoc, serverCountry: serverCountry, fbCountry: fbCountry,
            desiredRegion: desiredRegion, buckets: buckets, chosen: chosen
          });
        }
      } catch (e) {
        moduleEl.style.visibility = 'visible';
        if (DEBUG) console.warn('[logos] error', e);
      }
    });
  });
})();
