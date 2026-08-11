/**
 * Content for the condition pages, in both languages.
 *
 * Chosen from Google Search Console demand, restricted to conditions the clinic already
 * states it treats on services.html. Impressions are for the 3 months to 10 Aug 2026:
 *
 *   hair loss / alopecia        622 impressions across 109 queries
 *   skin allergy & fungal       296 impressions across  47 queries
 *   vitiligo                     43 impressions (incl. सफेद दाग का सबसे अच्छा डॉक्टर)
 *   acne                         25 impressions
 *
 * Laser and cosmetic procedures show real demand (155 impressions) but the clinic does not
 * list them among its services, so there is deliberately no page for them. Do not add one
 * without confirming the clinic actually offers the procedure.
 *
 * MEDICAL CONTENT: descriptive only. It says what a condition is, what a consultation
 * involves, and when to see a doctor. It must not promise outcomes, name specific drugs or
 * dosages, or substitute for diagnosis.
 */

// Set this to the date Dr. Gupta actually reviews these pages. The byline claims medical
// review; leaving a date here that never happened would be a false credential.
const REVIEWED_ON = { iso: '2026-08-11', en: '11 August 2026', hi: '11 अगस्त 2026' };

const CONDITIONS = [
  {
    slug: 'hair-loss-treatment-moradabad.html',
    schemaName: 'Hair loss',
    title: { en: 'Hair Loss Treatment in Moradabad — Dr. Vikas Gupta',
             hi: 'मुरादाबाद में बाल झड़ने का इलाज — बालों का डॉक्टर' },
    desc: { en: 'Hair fall, alopecia areata, dandruff and scalp infections assessed and treated by an MD dermatologist in Gandhi Nagar, Moradabad. Consultation ₹800.',
            hi: 'बाल झड़ना, एलोपेसिया एरीटा, रूसी और खोपड़ी के संक्रमण का इलाज — गांधी नगर, मुरादाबाद में MD चर्म रोग विशेषज्ञ द्वारा। परामर्श ₹800।' },
    h1: { en: 'Hair Loss Treatment in Moradabad', hi: 'मुरादाबाद में बाल झड़ने का इलाज' },
    intro: {
      en: 'Hair fall has many different causes, and they are treated in different ways. Telling them apart is what a dermatology consultation is for — the same amount of shedding can mean a temporary reaction to illness or stress, a thyroid or iron problem, an inherited pattern, or an autoimmune condition.',
      hi: 'बालों के झड़ने के कई अलग-अलग कारण होते हैं, और हर कारण का इलाज अलग होता है। इन्हें पहचानना ही त्वचा रोग परामर्श का उद्देश्य है — एक जैसा दिखने वाला झड़ना अस्थायी प्रतिक्रिया, थायरॉइड या आयरन की कमी, वंशानुगत पैटर्न, या ऑटोइम्यून स्थिति हो सकता है।'
    },
    treats: {
      en: ['Pattern hair loss in men and women', 'Alopecia areata (patchy hair loss)',
           'Telogen effluvium (sudden diffuse shedding)', 'Dandruff and seborrhoeic dermatitis',
           'Fungal and bacterial scalp infections', 'Hair loss related to thyroid or iron deficiency'],
      hi: ['पुरुषों और महिलाओं में पैटर्न बाल झड़ना', 'एलोपेसिया एरीटा (चकत्तेदार बाल झड़ना)',
           'टेलोजन एफ्लुवियम (अचानक फैला हुआ झड़ना)', 'रूसी और सेबोरहाइक डर्मेटाइटिस',
           'खोपड़ी के फंगल और बैक्टीरियल संक्रमण', 'थायरॉइड या आयरन की कमी से जुड़ा बाल झड़ना']
    },
    seeDoctor: {
      en: ['Hair comes out in defined round patches', 'Shedding starts suddenly or gets rapidly worse',
           'The scalp is itchy, scaly, painful or has sores', 'The hairline is visibly receding or the parting is widening',
           'Hair loss follows a fever, illness, surgery, childbirth or a new medicine'],
      hi: ['बाल गोल चकत्तों में निकल रहे हों', 'झड़ना अचानक शुरू हो या तेज़ी से बढ़े',
           'खोपड़ी में खुजली, पपड़ी, दर्द या घाव हो', 'हेयरलाइन पीछे हट रही हो या माँग चौड़ी हो रही हो',
           'बुख़ार, बीमारी, सर्जरी, प्रसव या नई दवा के बाद बाल झड़ना शुरू हुआ हो']
    },
    visit: {
      en: 'Dr. Gupta examines the scalp and hair, asks about how and when the shedding started, family history, diet, medicines and any recent illness, and may suggest blood tests where a deficiency or thyroid problem is suspected. Treatment depends entirely on the cause, and hair conditions are followed up over months rather than judged in a single visit.',
      hi: 'डॉ गुप्ता खोपड़ी और बालों की जाँच करते हैं, झड़ना कब और कैसे शुरू हुआ, पारिवारिक इतिहास, आहार, दवाएँ और हाल की किसी बीमारी के बारे में पूछते हैं, और कमी या थायरॉइड की आशंका होने पर रक्त जाँच बता सकते हैं। इलाज पूरी तरह कारण पर निर्भर करता है, और बालों की स्थितियों को महीनों तक देखा जाता है, एक ही मुलाक़ात में नहीं।'
    }
  },

  {
    slug: 'skin-allergy-fungal-infection-moradabad.html',
    schemaName: 'Skin allergy and fungal infection',
    title: { en: 'Skin Allergy & Fungal Infection — Moradabad',
             hi: 'दाद, खुजली और त्वचा एलर्जी का इलाज — मुरादाबाद' },
    desc: { en: 'Itching, rashes, hives, eczema and fungal infections such as ringworm, treated by an MD dermatologist in Gandhi Nagar, Moradabad. Consultation ₹800.',
            hi: 'खुजली, दाद, चकत्ते, पित्ती और एक्जिमा का इलाज — गांधी नगर, मुरादाबाद में MD चर्म रोग विशेषज्ञ द्वारा। परामर्श ₹800।' },
    h1: { en: 'Skin Allergy and Fungal Infection Treatment', hi: 'त्वचा एलर्जी और फंगल संक्रमण का इलाज' },
    intro: {
      en: 'Itching and rashes are the most common reasons people come to a skin clinic, and also the easiest to treat incorrectly. An allergic rash and a fungal infection can look similar but need opposite treatments — a steroid cream that settles eczema will often make ringworm spread further and become harder to clear.',
      hi: 'खुजली और चकत्ते त्वचा क्लिनिक आने का सबसे आम कारण हैं, और इनका ग़लत इलाज होना भी सबसे आम है। एलर्जी के चकत्ते और फंगल संक्रमण दिखने में एक जैसे हो सकते हैं पर इनका इलाज उल्टा होता है — जो स्टेरॉयड क्रीम एक्जिमा में आराम देती है, वही दाद को अक्सर और फैला देती है।'
    },
    treats: {
      en: ['Eczema and dermatitis', 'Urticaria (hives) and recurring itching',
           'Ringworm and other fungal infections', 'Contact and cosmetic allergies',
           'Bacterial skin infections', 'Nail fungal infections'],
      hi: ['एक्जिमा और डर्मेटाइटिस', 'पित्ती (अर्टिकेरिया) और बार-बार होने वाली खुजली',
           'दाद और अन्य फंगल संक्रमण', 'संपर्क और कॉस्मेटिक एलर्जी',
           'बैक्टीरियल त्वचा संक्रमण', 'नाखून के फंगल संक्रमण']
    },
    seeDoctor: {
      en: ['A rash keeps coming back after creams are stopped', 'The patch is spreading outward with a raised edge',
           'Itching disturbs sleep', 'Skin is broken, weeping, crusted or painful',
           'Several people in the household have the same rash'],
      hi: ['क्रीम बंद करते ही चकत्ता फिर लौट आए', 'चकत्ता उभरे हुए किनारे के साथ बाहर की ओर फैल रहा हो',
           'खुजली से नींद ख़राब हो', 'त्वचा फट गई हो, रिस रही हो, पपड़ी जमी हो या दर्द हो',
           'घर में कई लोगों को एक जैसा चकत्ता हो']
    },
    visit: {
      en: 'Dr. Gupta examines the affected skin, asks what has already been applied to it, and looks for the pattern and distribution that separates an allergy from an infection. Where fungal infection is suspected, treatment usually needs to continue for a set period after the skin looks normal, because stopping early is the most common reason it returns.',
      hi: 'डॉ गुप्ता प्रभावित त्वचा की जाँच करते हैं, पूछते हैं कि उस पर पहले क्या लगाया गया है, और उस पैटर्न को देखते हैं जो एलर्जी को संक्रमण से अलग करता है। फंगल संक्रमण की आशंका होने पर इलाज आमतौर पर त्वचा ठीक दिखने के बाद भी एक तय अवधि तक जारी रखना पड़ता है, क्योंकि जल्दी बंद कर देना ही इसके लौटने का सबसे आम कारण है।'
    }
  },

  {
    slug: 'vitiligo-treatment-moradabad.html',
    schemaName: 'Vitiligo',
    title: { en: 'Vitiligo (White Patches) Treatment — Moradabad',
             hi: 'सफेद दाग का इलाज और डॉक्टर — मुरादाबाद' },
    desc: { en: 'White patches on the skin assessed and treated by an MD dermatologist in Gandhi Nagar, Moradabad. Vitiligo is not contagious. Consultation ₹800.',
            hi: 'सफेद दाग (विटिलिगो) की जाँच और इलाज — गांधी नगर, मुरादाबाद में MD चर्म रोग विशेषज्ञ डॉक्टर द्वारा। सफेद दाग छूत की बीमारी नहीं है। परामर्श ₹800।' },
    h1: { en: 'Vitiligo and White Patch Treatment', hi: 'सफेद दाग (विटिलिगो) का इलाज' },
    intro: {
      en: 'Vitiligo is a condition in which the cells that give skin its colour stop working in patches. It is not contagious, it is not caused by anything the patient ate or did, and it cannot be passed on by touch or by sharing food — a point worth stating plainly, because the social burden of vitiligo in India is often heavier than the medical one.',
      hi: 'सफेद दाग (विटिलिगो) एक ऐसी स्थिति है जिसमें त्वचा को रंग देने वाली कोशिकाएँ कुछ जगहों पर काम करना बंद कर देती हैं। यह छूत की बीमारी नहीं है, यह किसी खाने-पीने या किसी की गलती से नहीं होती, और छूने या साथ खाने से नहीं फैलती — यह साफ़ कहना ज़रूरी है, क्योंकि भारत में सफेद दाग का सामाजिक बोझ अक्सर चिकित्सीय बोझ से भारी होता है।'
    },
    treats: {
      en: ['Vitiligo and leucoderma', 'White patches after burns, cuts or inflammation',
           'Loss of colour around moles', 'Patches on the face, hands, lips and feet',
           'Vitiligo in children'],
      hi: ['विटिलिगो और ल्यूकोडर्मा', 'जलने, कटने या सूजन के बाद बने सफेद दाग',
           'तिल के आसपास रंग का जाना', 'चेहरे, हाथ, होंठ और पैर पर दाग',
           'बच्चों में सफेद दाग']
    },
    seeDoctor: {
      en: ['A pale patch appears and slowly enlarges', 'Patches appear on both sides of the body',
           'Colour is lost around the eyes, mouth, hands or feet', 'Hair within a patch turns white',
           'New patches keep appearing over a few months'],
      hi: ['हल्के रंग का दाग दिखे और धीरे-धीरे बड़ा हो', 'शरीर के दोनों ओर दाग दिखें',
           'आँख, मुँह, हाथ या पैर के आसपास रंग चला जाए', 'दाग के भीतर के बाल सफेद हो जाएँ',
           'कुछ महीनों में लगातार नए दाग बनते रहें']
    },
    visit: {
      en: 'Dr. Gupta examines the patches and their distribution, asks how long they have been present and whether they are still spreading, and checks for associated conditions such as thyroid disorders. Vitiligo is managed over the long term, and treatment is judged by whether new patches stop appearing and whether colour returns gradually — not by any single visit.',
      hi: 'डॉ गुप्ता दागों और उनके फैलाव की जाँच करते हैं, पूछते हैं कि ये कब से हैं और अब भी बढ़ रहे हैं या नहीं, और थायरॉइड जैसी जुड़ी स्थितियों की जाँच करते हैं। सफेद दाग का इलाज लंबे समय तक चलता है, और इसका आकलन इससे होता है कि नए दाग बनना रुके या नहीं और रंग धीरे-धीरे लौट रहा है या नहीं — किसी एक मुलाक़ात से नहीं।'
    }
  },

  {
    slug: 'acne-treatment-moradabad.html',
    schemaName: 'Acne',
    title: { en: 'Acne & Pimple Treatment in Moradabad — Dr. Gupta',
             hi: 'मुरादाबाद में मुँहासों का इलाज — डॉ विकास गुप्ता' },
    desc: { en: 'Acne, pimples and acne scarring treated by an MD dermatologist in Gandhi Nagar, Moradabad. Suitable for teenagers and adults. Consultation ₹800.',
            hi: 'मुँहासे, पिंपल्स, फोड़ा-फुंसी और मुँहासों के निशान का इलाज — गांधी नगर, मुरादाबाद में MD चर्म रोग विशेषज्ञ द्वारा। परामर्श ₹800।' },
    h1: { en: 'Acne and Pimple Treatment', hi: 'मुँहासे और पिंपल्स का इलाज' },
    intro: {
      en: 'Acne is common enough to be dismissed as something to wait out, but it is also one of the few skin conditions that can leave permanent marks. Scarring is far easier to prevent than to correct, which is the main reason to treat acne properly rather than manage it with whatever is available over the counter.',
      hi: 'मुँहासे इतने आम हैं कि लोग इन्हें अपने आप ठीक होने के लिए छोड़ देते हैं, पर यह उन कुछ त्वचा स्थितियों में से है जो स्थायी निशान छोड़ सकती है। निशान बनने से रोकना उन्हें ठीक करने से कहीं आसान है — यही मुख्य कारण है कि मुँहासों का सही इलाज कराना चाहिए, न कि बिना सलाह मिलने वाली चीज़ों से काम चलाना।'
    },
    treats: {
      en: ['Acne vulgaris in teenagers and adults', 'Blackheads and whiteheads',
           'Painful cystic and nodular acne', 'Acne marks and scarring',
           'Acne that flares with periods or medication', 'Acne on the back and chest'],
      hi: ['किशोरों और वयस्कों में एक्ने वल्गेरिस', 'ब्लैकहेड्स और व्हाइटहेड्स',
           'दर्दनाक सिस्टिक और नोड्यूलर मुँहासे', 'मुँहासों के दाग और निशान',
           'माहवारी या दवा से बढ़ने वाले मुँहासे', 'पीठ और छाती पर मुँहासे']
    },
    seeDoctor: {
      en: ['Spots are deep, painful or leaving marks', 'Over-the-counter products have not helped after a few weeks',
           'Acne is affecting confidence or mood', 'Breakouts began after starting a new medicine',
           'Acne appears alongside irregular periods or excess hair growth'],
      hi: ['दाने गहरे, दर्दनाक हों या निशान छोड़ रहे हों', 'बिना सलाह मिलने वाली चीज़ों से कुछ हफ़्तों में फ़र्क़ न पड़ा हो',
           'मुँहासों से आत्मविश्वास या मन प्रभावित हो रहा हो', 'नई दवा शुरू करने के बाद दाने निकलने लगे हों',
           'मुँहासों के साथ अनियमित माहवारी या अत्यधिक बाल वृद्धि हो']
    },
    visit: {
      en: 'Dr. Gupta assesses the type and severity of the acne, asks about skincare products, medicines and — where relevant — menstrual history, and explains what to expect over the coming weeks. Acne treatment takes time to show results and usually needs review, so the first visit is the start of a course rather than a one-off fix.',
      hi: 'डॉ गुप्ता मुँहासों के प्रकार और गंभीरता का आकलन करते हैं, त्वचा उत्पादों, दवाओं और ज़रूरत पड़ने पर माहवारी के इतिहास के बारे में पूछते हैं, और बताते हैं कि आने वाले हफ़्तों में क्या उम्मीद रखनी है। मुँहासों के इलाज में असर दिखने में समय लगता है और आमतौर पर दोबारा दिखाना पड़ता है, इसलिए पहली मुलाक़ात एक इलाज की शुरुआत होती है, एक बार का समाधान नहीं।'
    }
  }
];

module.exports = { CONDITIONS, REVIEWED_ON };
