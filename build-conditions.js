#!/usr/bin/env node
/**
 * Generates the condition pages from conditions.data.js.
 *
 * Why generated: the header, nav and footer are lifted from services.html at build time, so
 * these pages can never drift out of sync with the rest of the site. Edit the content in
 * conditions.data.js, not here, and never in the generated HTML.
 *
 * Run:  npm run build:conditions   (or npm run build, which also regenerates /hi/)
 */

const fs = require('fs');
const path = require('path');
const { CONDITIONS, REVIEWED_ON } = require('./conditions.data');

const ROOT = __dirname;
const ORIGIN = 'https://www.drvikasgupta.skin';
const BOOKING = 'https://www.eka.care/doctor/dr-vikas-gupta-dermatology-moradabad';
const DIRECTIONS = 'https://www.google.com/maps/dir/?api=1&destination=Dr%20Vikas%20Gupta%20Skin%20Care%20Clinic%2C%20A-73%2C%20Prince%20Road%2C%20Gandhi%20Nagar%2C%20Moradabad%2C%20Uttar%20Pradesh%20244001&travelmode=driving';

const TEMPLATE = 'services.html';

// --- shared chrome, lifted from a real page so nav/footer never drift -----------------------
function chrome() {
  const html = fs.readFileSync(path.join(ROOT, TEMPLATE), 'utf8');
  const header = html.slice(html.indexOf('<body class="lang-en">') + '<body class="lang-en">'.length,
                            html.indexOf('<main id="main-content">'));
  const footer = html.slice(html.indexOf('<footer class="footer">'), html.indexOf('</footer>') + '</footer>'.length);
  return { header, footer };
}

const bi = (en, hi) => `<span class="lang-en">${en}</span><span class="lang-hi">${hi}</span>`;
const list = (en, hi) => en.map((e, i) => `                        <li>${bi(e, hi[i])}</li>`).join('\n');

function schema(c) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: c.title.en,
    description: c.desc.en,
    url: `${ORIGIN}/${c.slug}`,
    inLanguage: 'en-IN',
    lastReviewed: REVIEWED_ON.iso,
    about: { '@type': 'MedicalCondition', name: c.schemaName },
    // E-E-A-T: health content is held to Google's strictest standard, so the clinician
    // responsible for the content is named as both author and reviewer.
    author: { '@type': 'Physician', '@id': `${ORIGIN}/#physician` },
    reviewedBy: {
      '@type': 'Physician',
      '@id': `${ORIGIN}/#physician`,
      name: 'Dr. Vikas Gupta',
      honorificSuffix: 'MD',
      medicalSpecialty: 'Dermatology',
      alumniOf: { '@type': 'CollegeOrUniversity', name: 'S.N. Medical College, Agra' },
      worksFor: { '@type': 'MedicalBusiness', name: 'Dr. Vikas Gupta Skin Care Clinic' }
    },
    publisher: { '@type': 'MedicalBusiness', '@id': `${ORIGIN}/#localbusiness` }
  }, null, 2);
}

function page(c, { header, footer }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${c.desc.en}">
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">

    <title>${c.title.en}</title>

    <meta property="og:title" content="${c.title.en}">
    <meta property="og:description" content="${c.desc.en}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="${ORIGIN}/${c.slug}">
    <meta property="og:image" content="${ORIGIN}/assets/images/dr-vikas-gupta-og.jpg">
    <meta property="og:site_name" content="Dr. Vikas Gupta Skin Care Clinic">
    <meta property="og:locale" content="en_IN">
    <meta property="og:locale:alternate" content="hi_IN">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${c.title.en}">
    <meta name="twitter:description" content="${c.desc.en}">
    <meta name="twitter:image" content="${ORIGIN}/assets/images/dr-vikas-gupta-og.jpg">

    <link rel="canonical" href="${ORIGIN}/${c.slug}">
    <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">
    <link rel="manifest" href="site.webmanifest?v=1">
    <meta name="theme-color" content="#2A7B9D">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/style.css?v=1">

    <script type="application/ld+json">
${schema(c)}
    </script>
</head>
<body class="lang-en">${header}    <main id="main-content">
        <section class="page-header">
            <div class="container">
                <h1>${bi(c.h1.en, c.h1.hi)}</h1>
                <p>${bi('Dr. Vikas Gupta Skin Care Clinic, Gandhi Nagar, Moradabad',
                        'डॉ विकास गुप्ता स्किन केयर क्लिनिक, गांधी नगर, मुरादाबाद')}</p>
            </div>
        </section>

        <section class="content-section">
            <div class="container">

                <!-- E-E-A-T: named clinician, credentials, and the date the page was reviewed -->
                <div class="medical-byline">
                    <p class="medical-byline-author">
                        ${bi('Reviewed by <strong>Dr. Vikas Gupta, MD (Dermatology, Venereology &amp; Leprology)</strong>, S.N. Medical College, Agra &middot; 31+ years in practice',
                             'समीक्षक: <strong>डॉ विकास गुप्ता, MD (त्वचा, यौन एवं कुष्ठ रोग)</strong>, एस.एन. मेडिकल कॉलेज, आगरा &middot; 31+ वर्षों का अनुभव')}
                    </p>
                    <p class="medical-byline-date">
                        ${bi(`Last reviewed ${REVIEWED_ON.en}`, `अंतिम समीक्षा ${REVIEWED_ON.hi}`)}
                    </p>
                </div>

                <p class="condition-intro">${bi(c.intro.en, c.intro.hi)}</p>

                <h2>${bi('What is treated here', 'यहाँ किन स्थितियों का इलाज होता है')}</h2>
                <ul class="condition-list">
${list(c.treats.en, c.treats.hi)}
                </ul>

                <h2>${bi('When to see a dermatologist', 'चर्म रोग विशेषज्ञ को कब दिखाएँ')}</h2>
                <ul class="condition-list">
${list(c.seeDoctor.en, c.seeDoctor.hi)}
                </ul>

                <h2>${bi('What the consultation involves', 'परामर्श में क्या होता है')}</h2>
                <p>${bi(c.visit.en, c.visit.hi)}</p>

                <h2>${bi('Fee and appointments', 'शुल्क और अपॉइंटमेंट')}</h2>
                <p>${bi('Consultation is <strong>₹800</strong>, the same for an in-clinic visit or a video consultation. In-clinic hours are Monday to Saturday, 10:00 AM to 5:00 PM. Video consultations run Monday to Saturday, 5:15 PM to 6:00 PM, and Sunday 11:00 AM to 11:30 AM.',
                        'परामर्श शुल्क <strong>₹800</strong> है — क्लिनिक विज़िट और वीडियो परामर्श दोनों के लिए समान। क्लिनिक समय सोमवार से शनिवार, सुबह 10:00 से शाम 5:00 बजे तक। वीडियो परामर्श सोमवार से शनिवार, शाम 5:15 से 6:00 बजे, और रविवार सुबह 11:00 से 11:30 बजे।')}</p>

                <div class="booking-actions">
                    <a href="${BOOKING}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-lg" data-booking-cta="condition-page">
                        ${bi('📅 Book on Eka Care', '📅 एका केयर पर बुक करें')}
                    </a>
                    <a href="${DIRECTIONS}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-lg" data-directions-cta="condition-page">
                        ${bi('🗺️ Get Directions', '🗺️ दिशा निर्देश पाएं')}
                    </a>
                    <p class="booking-actions-note">
                        ${bi('Booking opens on Eka Care in a new tab. Directions open in Google Maps.',
                             'बुकिंग एका केयर पर नए टैब में खुलेगी। दिशा निर्देश गूगल मैप्स में खुलेंगे।')}
                    </p>
                </div>

                <h2>${bi('Other conditions treated', 'अन्य स्थितियाँ जिनका इलाज होता है')}</h2>
                <ul class="condition-list condition-crosslinks">
${CONDITIONS.filter(o => o.slug !== c.slug).map(o =>
`                        <li><a href="${o.slug}">${bi(o.h1.en, o.h1.hi)}</a></li>`).join('\n')}
                        <li><a href="services.html">${bi('All skin, hair and nail services', 'त्वचा, बाल और नाखून की सभी सेवाएँ')}</a></li>
                </ul>

                <p class="medical-disclaimer">
                    ${bi('This page is general information about a condition, not a diagnosis. Skin conditions that look alike are often treated very differently, so please see a doctor before starting or stopping any treatment.',
                         'यह पृष्ठ किसी स्थिति के बारे में सामान्य जानकारी है, निदान नहीं। एक जैसी दिखने वाली त्वचा की स्थितियों का इलाज अक्सर बहुत अलग होता है, इसलिए कोई भी इलाज शुरू या बंद करने से पहले डॉक्टर को दिखाएँ।')}
                </p>

            </div>
        </section>
    </main>

${footer}

    <script src="assets/js/script.js?v=1"></script>
</body>
</html>
`;
}

const c = chrome();
if (!c.header.trim() || !c.footer.trim()) {
  console.error(`Could not lift header/footer from ${TEMPLATE}`);
  process.exit(1);
}

console.log('Generating condition pages');
for (const cond of CONDITIONS) {
  fs.writeFileSync(path.join(ROOT, cond.slug), page(cond, c));
  console.log(`  ${cond.slug.padEnd(46)} title ${cond.title.en.length} chars · desc ${cond.desc.en.length}`);
}
console.log(`\nReviewed-on date stamped: ${REVIEWED_ON.en} (set in conditions.data.js)`);
