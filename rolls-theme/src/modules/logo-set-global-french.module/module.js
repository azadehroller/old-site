(function () {
  'use strict';

  // --- Country -> Region map (ISO 3166-1 alpha-2) ---
  const countryList = [
    {country:"Afghanistan",iso_3166:"af",region:"emea"},
    {country:"Albania",iso_3166:"al",region:"emea"},
    {country:"Algeria",iso_3166:"dz",region:"emea"},
    {country:"American Samoa",iso_3166:"as",region:"apac"},
    {country:"Andorra",iso_3166:"ad",region:"emea"},
    {country:"Angola",iso_3166:"ao",region:"emea"},
    {country:"Anguilla",iso_3166:"ai",region:"amer"},
    {country:"Antarctica",iso_3166:"aq",region:"apac"},
    {country:"Antigua and Barbuda",iso_3166:"ag",region:"amer"},
    {country:"Argentina",iso_3166:"ar",region:"amer"},
    {country:"Armenia",iso_3166:"am",region:"emea"},
    {country:"Aruba",iso_3166:"aw",region:"amer"},
    {country:"Australia",iso_3166:"au",region:"apac"},
    {country:"Austria",iso_3166:"at",region:"emea"},
    {country:"Azerbaijan",iso_3166:"az",region:"emea"},
    {country:"Bahamas",iso_3166:"bs",region:"amer"},
    {country:"Bahrain",iso_3166:"bh",region:"emea"},
    {country:"Bangladesh",iso_3166:"bd",region:"apac"},
    {country:"Barbados",iso_3166:"bb",region:"amer"},
    {country:"Belarus",iso_3166:"by",region:"emea"},
    {country:"Belgium",iso_3166:"be",region:"emea"},
    {country:"Belize",iso_3166:"bz",region:"amer"},
    {country:"Benin",iso_3166:"bj",region:"emea"},
    {country:"Bermuda",iso_3166:"bm",region:"amer"},
    {country:"Bhutan",iso_3166:"bt",region:"apac"},
    {country:"Bolivia",iso_3166:"bo",region:"amer"},
    {country:"Bosnia and Herzegovina",iso_3166:"ba",region:"emea"},
    {country:"Botswana",iso_3166:"bw",region:"emea"},
    {country:"Brazil",iso_3166:"br",region:"amer"},
    {country:"Brunei",iso_3166:"bn",region:"apac"},
    {country:"Bulgaria",iso_3166:"bg",region:"emea"},
    {country:"Burkina Faso",iso_3166:"bf",region:"emea"},
    {country:"Burundi",iso_3166:"bi",region:"emea"},
    {country:"Cambodia",iso_3166:"kh",region:"apac"},
    {country:"Cameroon",iso_3166:"cm",region:"emea"},
    {country:"Canada",iso_3166:"ca",region:"amer"},
    {country:"Cayman Islands",iso_3166:"ky",region:"amer"},
    {country:"Central African Republic",iso_3166:"cf",region:"emea"},
    {country:"Chad",iso_3166:"td",region:"emea"},
    {country:"Chile",iso_3166:"cl",region:"amer"},
    {country:"China",iso_3166:"cn",region:"apac"},
    {country:"Christmas Island",iso_3166:"cx",region:"apac"},
    {country:"Cocos Islands",iso_3166:"cc",region:"apac"},
    {country:"Colombia",iso_3166:"co",region:"amer"},
    {country:"Comoros",iso_3166:"km",region:"emea"},
    {country:"Congo",iso_3166:"cg",region:"emea"},
    {country:"Democratic Republic of Congo",iso_3166:"cd",region:"emea"},
    {country:"Cook Islands",iso_3166:"ck",region:"apac"},
    {country:"Costa Rica",iso_3166:"cr",region:"amer"},
    {country:"Côte d'Ivoire",iso_3166:"ci",region:"emea"},
    {country:"Croatia",iso_3166:"hr",region:"emea"},
    {country:"Cuba",iso_3166:"cu",region:"amer"},
    {country:"Curaçao",iso_3166:"cw",region:"amer"},
    {country:"Cyprus",iso_3166:"cy",region:"emea"},
    {country:"Czechia",iso_3166:"cz",region:"emea"},
    {country:"Denmark",iso_3166:"dk",region:"emea"},
    {country:"Djibouti",iso_3166:"dj",region:"emea"},
    {country:"Dominica",iso_3166:"dm",region:"amer"},
    {country:"Dominican Republic",iso_3166:"do",region:"amer"},
    {country:"Ecuador",iso_3166:"ec",region:"amer"},
    {country:"Egypt",iso_3166:"eg",region:"emea"},
    {country:"El Salvador",iso_3166:"sv",region:"amer"},
    {country:"Equatorial Guinea",iso_3166:"gq",region:"emea"},
    {country:"Eritrea",iso_3166:"er",region:"emea"},
    {country:"Estonia",iso_3166:"ee",region:"emea"},
    {country:"Eswatini",iso_3166:"sz",region:"emea"},
    {country:"Ethiopia",iso_3166:"et",region:"emea"},
    {country:"Falkland Islands",iso_3166:"fk",region:"emea"},
    {country:"Faroe Islands",iso_3166:"fo",region:"emea"},
    {country:"Fiji",iso_3166:"fj",region:"apac"},
    {country:"Finland",iso_3166:"fi",region:"emea"},
    {country:"France",iso_3166:"fr",region:"emea"},
    {country:"French Guiana",iso_3166:"gf",region:"amer"},
    {country:"French Polynesia",iso_3166:"pf",region:"apac"},
    {country:"French Southern Territories",iso_3166:"tf",region:"emea"},
    {country:"Gabon",iso_3166:"ga",region:"emea"},
    {country:"Gambia",iso_3166:"gm",region:"emea"},
    {country:"Georgia",iso_3166:"ge",region:"emea"},
    {country:"Germany",iso_3166:"de",region:"emea"},
    {country:"Ghana",iso_3166:"gh",region:"emea"},
    {country:"Gibraltar",iso_3166:"gi",region:"emea"},
    {country:"Greece",iso_3166:"gr",region:"emea"},
    {country:"Greenland",iso_3166:"gl",region:"emea"},
    {country:"Grenada",iso_3166:"gd",region:"amer"},
    {country:"Guadeloupe",iso_3166:"gp",region:"amer"},
    {country:"Guam",iso_3166:"gu",region:"apac"},
    {country:"Guatemala",iso_3166:"gt",region:"amer"},
    {country:"Guernsey",iso_3166:"gg",region:"emea"},
    {country:"Guinea",iso_3166:"gn",region:"emea"},
    {country:"Guinea-Bissau",iso_3166:"gw",region:"emea"},
    {country:"Guyana",iso_3166:"gy",region:"amer"},
    {country:"Haiti",iso_3166:"ht",region:"amer"},
    {country:"Heard Island",iso_3166:"hm",region:"apac"},
    {country:"Holy See",iso_3166:"va",region:"emea"},
    {country:"Honduras",iso_3166:"hn",region:"amer"},
    {country:"Hong Kong",iso_3166:"hk",region:"apac"},
    {country:"Hungary",iso_3166:"hu",region:"emea"},
    {country:"Iceland",iso_3166:"is",region:"emea"},
    {country:"India",iso_3166:"in",region:"apac"},
    {country:"Indonesia",iso_3166:"id",region:"apac"},
    {country:"Iran",iso_3166:"ir",region:"emea"},
    {country:"Iraq",iso_3166:"iq",region:"emea"},
    {country:"Ireland",iso_3166:"ie",region:"emea"},
    {country:"Isle of Man",iso_3166:"im",region:"emea"},
    {country:"Israel",iso_3166:"il",region:"emea"},
    {country:"Italy",iso_3166:"it",region:"emea"},
    {country:"Jamaica",iso_3166:"jm",region:"amer"},
    {country:"Japan",iso_3166:"jp",region:"apac"},
    {country:"Jersey",iso_3166:"je",region:"emea"},
    {country:"Jordan",iso_3166:"jo",region:"emea"},
    {country:"Kazakhstan",iso_3166:"kz",region:"emea"},
    {country:"Kenya",iso_3166:"ke",region:"emea"},
    {country:"Kiribati",iso_3166:"ki",region:"apac"},
    {country:"North Korea",iso_3166:"kp",region:"apac"},
    {country:"South Korea",iso_3166:"kr",region:"apac"},
    {country:"Kuwait",iso_3166:"kw",region:"emea"},
    {country:"Kyrgyzstan",iso_3166:"kg",region:"emea"},
    {country:"Laos",iso_3166:"la",region:"apac"},
    {country:"Latvia",iso_3166:"lv",region:"emea"},
    {country:"Lebanon",iso_3166:"lb",region:"emea"},
    {country:"Lesotho",iso_3166:"ls",region:"emea"},
    {country:"Liberia",iso_3166:"lr",region:"emea"},
    {country:"Libya",iso_3166:"ly",region:"emea"},
    {country:"Liechtenstein",iso_3166:"li",region:"emea"},
    {country:"Lithuania",iso_3166:"lt",region:"emea"},
    {country:"Luxembourg",iso_3166:"lu",region:"emea"},
    {country:"Macao",iso_3166:"mo",region:"apac"},
    {country:"North Macedonia",iso_3166:"mk",region:"emea"},
    {country:"Madagascar",iso_3166:"mg",region:"emea"},
    {country:"Malawi",iso_3166:"mw",region:"emea"},
    {country:"Malaysia",iso_3166:"my",region:"apac"},
    {country:"Maldives",iso_3166:"mv",region:"apac"},
    {country:"Mali",iso_3166:"ml",region:"emea"},
    {country:"Malta",iso_3166:"mt",region:"emea"},
    {country:"Marshall Islands",iso_3166:"mh",region:"apac"},
    {country:"Martinique",iso_3166:"mq",region:"amer"},
    {country:"Mauritania",iso_3166:"mr",region:"emea"},
    {country:"Mauritius",iso_3166:"mu",region:"emea"},
    {country:"Mayotte",iso_3166:"yt",region:"emea"},
    {country:"Mexico",iso_3166:"mx",region:"amer"},
    {country:"Micronesia",iso_3166:"fm",region:"apac"},
    {country:"Moldova",iso_3166:"md",region:"emea"},
    {country:"Monaco",iso_3166:"mc",region:"emea"},
    {country:"Mongolia",iso_3166:"mn",region:"apac"},
    {country:"Montenegro",iso_3166:"me",region:"emea"},
    {country:"Montserrat",iso_3166:"ms",region:"amer"},
    {country:"Morocco",iso_3166:"ma",region:"emea"},
    {country:"Mozambique",iso_3166:"mz",region:"emea"},
    {country:"Myanmar",iso_3166:"mm",region:"apac"},
    {country:"Namibia",iso_3166:"na",region:"emea"},
    {country:"Nauru",iso_3166:"nr",region:"apac"},
    {country:"Nepal",iso_3166:"np",region:"apac"},
    {country:"Netherlands",iso_3166:"nl",region:"emea"},
    {country:"New Caledonia",iso_3166:"nc",region:"apac"},
    {country:"New Zealand",iso_3166:"nz",region:"apac"},
    {country:"Nicaragua",iso_3166:"ni",region:"amer"},
    {country:"Niger",iso_3166:"ne",region:"emea"},
    {country:"Nigeria",iso_3166:"ng",region:"emea"},
    {country:"Niue",iso_3166:"nu",region:"apac"},
    {country:"Norfolk Island",iso_3166:"nf",region:"apac"},
    {country:"Northern Mariana Islands",iso_3166:"mp",region:"apac"},
    {country:"Norway",iso_3166:"no",region:"emea"},
    {country:"Oman",iso_3166:"om",region:"emea"},
    {country:"Pakistan",iso_3166:"pk",region:"apac"},
    {country:"Palau",iso_3166:"pw",region:"apac"},
    {country:"Palestine",iso_3166:"ps",region:"emea"},
    {country:"Panama",iso_3166:"pa",region:"amer"},
    {country:"Papua New Guinea",iso_3166:"pg",region:"apac"},
    {country:"Paraguay",iso_3166:"py",region:"amer"},
    {country:"Peru",iso_3166:"pe",region:"amer"},
    {country:"Philippines",iso_3166:"ph",region:"apac"},
    {country:"Pitcairn",iso_3166:"pn",region:"apac"},
    {country:"Poland",iso_3166:"pl",region:"emea"},
    {country:"Portugal",iso_3166:"pt",region:"emea"},
    {country:"Puerto Rico",iso_3166:"pr",region:"amer"},
    {country:"Qatar",iso_3166:"qa",region:"emea"},
    {country:"Réunion",iso_3166:"re",region:"emea"},
    {country:"Romania",iso_3166:"ro",region:"emea"},
    {country:"Russia",iso_3166:"ru",region:"emea"},
    {country:"Rwanda",iso_3166:"rw",region:"emea"},
    {country:"Saint Barthélemy",iso_3166:"bl",region:"amer"},
    {country:"Saint Helena",iso_3166:"sh",region:"emea"},
    {country:"Saint Kitts and Nevis",iso_3166:"kn",region:"amer"},
    {country:"Saint Lucia",iso_3166:"lc",region:"amer"},
    {country:"Saint Martin",iso_3166:"mf",region:"amer"},
    {country:"Saint Pierre and Miquelon",iso_3166:"pm",region:"amer"},
    {country:"Saint Vincent and the Grenadines",iso_3166:"vc",region:"amer"},
    {country:"Samoa",iso_3166:"ws",region:"apac"},
    {country:"San Marino",iso_3166:"sm",region:"emea"},
    {country:"Sao Tome and Principe",iso_3166:"st",region:"emea"},
    {country:"Saudi Arabia",iso_3166:"sa",region:"emea"},
    {country:"Senegal",iso_3166:"sn",region:"emea"},
    {country:"Serbia",iso_3166:"rs",region:"emea"},
    {country:"Seychelles",iso_3166:"sc",region:"emea"},
    {country:"Sierra Leone",iso_3166:"sl",region:"emea"},
    {country:"Singapore",iso_3166:"sg",region:"apac"},
    {country:"Sint Maarten",iso_3166:"sx",region:"amer"},
    {country:"Slovakia",iso_3166:"sk",region:"emea"},
    {country:"Slovenia",iso_3166:"si",region:"emea"},
    {country:"Solomon Islands",iso_3166:"sb",region:"apac"},
    {country:"Somalia",iso_3166:"so",region:"emea"},
    {country:"South Africa",iso_3166:"za",region:"emea"},
    {country:"South Georgia",iso_3166:"gs",region:"emea"},
    {country:"South Sudan",iso_3166:"ss",region:"emea"},
    {country:"Spain",iso_3166:"es",region:"emea"},
    {country:"Sri Lanka",iso_3166:"lk",region:"apac"},
    {country:"Sudan",iso_3166:"sd",region:"emea"},
    {country:"Suriname",iso_3166:"sr",region:"amer"},
    {country:"Svalbard",iso_3166:"sj",region:"emea"},
    {country:"Sweden",iso_3166:"se",region:"emea"},
    {country:"Switzerland",iso_3166:"ch",region:"emea"},
    {country:"Syria",iso_3166:"sy",region:"emea"},
    {country:"Taiwan",iso_3166:"tw",region:"apac"},
    {country:"Tajikistan",iso_3166:"tj",region:"emea"},
    {country:"Tanzania",iso_3166:"tz",region:"emea"},
    {country:"Thailand",iso_3166:"th",region:"apac"},
    {country:"Timor-Leste",iso_3166:"tl",region:"apac"},
    {country:"Togo",iso_3166:"tg",region:"emea"},
    {country:"Tokelau",iso_3166:"tk",region:"apac"},
    {country:"Tonga",iso_3166:"to",region:"apac"},
    {country:"Trinidad and Tobago",iso_3166:"tt",region:"amer"},
    {country:"Tunisia",iso_3166:"tn",region:"emea"},
    {country:"Turkey",iso_3166:"tr",region:"emea"},
    {country:"Turkmenistan",iso_3166:"tm",region:"emea"},
    {country:"Turks and Caicos Islands",iso_3166:"tc",region:"amer"},
    {country:"Tuvalu",iso_3166:"tv",region:"apac"},
    {country:"Uganda",iso_3166:"ug",region:"emea"},
    {country:"Ukraine",iso_3166:"ua",region:"emea"},
    {country:"United Arab Emirates",iso_3166:"ae",region:"emea"},
    {country:"United Kingdom",iso_3166:"gb",region:"uk"},
    {country:"United States",iso_3166:"us",region:"amer"},
    {country:"Uruguay",iso_3166:"uy",region:"amer"},
    {country:"Uzbekistan",iso_3166:"uz",region:"emea"},
    {country:"Vanuatu",iso_3166:"vu",region:"apac"},
    {country:"Venezuela",iso_3166:"ve",region:"amer"},
    {country:"Vietnam",iso_3166:"vn",region:"apac"},
    {country:"Virgin Islands British",iso_3166:"vg",region:"amer"},
    {country:"Virgin Islands U.S.",iso_3166:"vi",region:"amer"},
    {country:"Wallis and Futuna",iso_3166:"wf",region:"apac"},
    {country:"Western Sahara",iso_3166:"eh",region:"emea"},
    {country:"Yemen",iso_3166:"ye",region:"emea"},
    {country:"Zambia",iso_3166:"zm",region:"emea"},
    {country:"Zimbabwe",iso_3166:"zw",region:"emea"}
  ];

  // --- Helpers ---
  function countryToRegion(code) {
    code = (code || '').toLowerCase();
    const hit = countryList.find(c => c.iso_3166 === code);
    return hit ? hit.region.toLowerCase() : null;
  }

  // If you set <html data-location="us|gb|au|..."> this maps directly to a region
  const locationToRegion = { us:'amer', ca:'amer', gb:'uk', uk:'uk', au:'apac', nz:'apac', eu:'emea' };

  function fallbackCountry() {
    try {
      const lang = (navigator.language || '').toLowerCase();
      const maybe = lang.split('-')[1];
      if (maybe && maybe.length === 2) return maybe;

      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      if (/sydney|melbourne|brisbane|auckland|hobart/i.test(tz)) return 'au';
      if (/london|guernsey|jersey|isle_of_man/i.test(tz)) return 'gb';
      if (/new_york|chicago|los_angeles|denver|phoenix|toronto|vancouver/i.test(tz)) return 'us';
    } catch (e) {}
    return '';
  }

  function detectRegion(sectionEl) {
    const dataCountry = (sectionEl.getAttribute('data-country') || '').toLowerCase();
    const htmlLoc     = (document.documentElement.getAttribute('data-location') || '').toLowerCase();
    const country     = dataCountry || htmlLoc || fallbackCountry();
    const locRegion   = locationToRegion[htmlLoc] || null;
    return locRegion || countryToRegion(country) || 'default';
  }

  function hide(el){ if (el) el.style.display = 'none'; }
  function show(el){
    if (!el) return;
    // Clear inline "display:none" so CSS classes decide the layout (grid/flex)
    el.style.display = '';
    // If nothing sets it, fall back to flex (works with your scroller CSS)
    if (getComputedStyle(el).display === 'none') el.style.display = 'flex';
  }

  function visibleInner(scroller) {
    const inners = scroller ? scroller.querySelectorAll('.scroller__inner') : [];
    for (const el of inners) {
      if (getComputedStyle(el).display !== 'none') return el;
    }
    return null;
  }

  function initAnimation(scroller) {
    if (!scroller) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (scroller.getAttribute('data-animated') === 'true') return;

    const inner = visibleInner(scroller) || scroller.querySelector('.scroller__inner');
    if (!inner) return;

    if (!inner.querySelector('[aria-hidden="true"]')) {
      Array.from(inner.children).forEach(child => {
        const clone = child.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        inner.appendChild(clone);
      });
    }
    requestAnimationFrame(() => scroller.setAttribute('data-animated', 'true'));
  }

  function ready(fn){
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn, { once: true });
  }

  // --- Boot ---
  ready(function () {
    // Support both module shapes:
    // 1) <div class="logo-set-module" data-country="US"> ... </div>
    // 2) <section id="logo-set-..." data-country="US"> ... </section>
    const modules = document.querySelectorAll('.logo-set-module, section[id^="logo-set-"]');
    modules.forEach(section => {
      try {
        const region = detectRegion(section);

        const amer = section.querySelector('.amer-logos');
        const apac = section.querySelector('.apac-logos');
        const emea = section.querySelector('.emea-logos');
        const uk   = section.querySelector('.uk-logos');

        // Hide all regional blocks first (if present)
        hide(amer); hide(apac); hide(emea); hide(uk);

        // Choose the correct block (or default to first .scroller__inner)
        const chosen =
          (region === 'amer' && amer) ||
          (region === 'apac' && apac) ||
          (region === 'emea' && emea) ||
          (region === 'uk'   && uk)   ||
          section.querySelector('.scroller__inner');

        show(chosen);

        // Start marquee animation on the visible scroller (mobile per CSS)
        initAnimation(section.querySelector('.scroller'));
      } finally {
        // If parent was hidden to avoid FOUC, reveal it
        section.style.visibility = 'visible';
      }
    });
  });
})();
