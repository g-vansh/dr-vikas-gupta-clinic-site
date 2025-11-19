# Dr. Vikas Gupta Skin Care Clinic Website

A comprehensive, bilingual (English/Hindi) website for Dr. Vikas Gupta's dermatology practice in Moradabad, designed for high conversion and excellent SEO performance.

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines and contribution tips.

## 🌟 Project Overview

This website serves as a digital front for Dr. Vikas Gupta's Skin Care Clinic, featuring:
- **Bilingual support** (English/Hindi toggle)
- **Responsive design** (mobile-first approach)
- **SEO optimized** for local search in Moradabad and surrounding areas
- **High conversion focus** with integrated appointment booking
- **Professional medical design** building trust and credibility

## ✨ Key Features

### 🌐 Bilingual Experience
- Seamless English/Hindi language toggle
- Complete content translation including medical terms
- Persistent language preference storage
- Hindi font support with Noto Sans

### 📱 Responsive & Modern
- Mobile-first responsive design
- Professional medical color scheme
- Interactive elements and animations
- Print-friendly styles
- Accessibility compliance (WCAG guidelines)

### 🔍 SEO Optimized
- Structured data (Schema.org) markup
- Meta tags and Open Graph tags
- Semantic HTML structure
- Fast loading times
- Local SEO optimization for Moradabad

### 🎯 High Conversion Features
- **Interactive patient origin map** (Leaflet.js)
- **Auto-rotating testimonials carousel**
- **Integrated Eka Care booking**
- Clear call-to-action buttons
- Trust indicators and social proof

### 📋 Comprehensive Content
- **Homepage**: Hero section, highlights, services overview, testimonials
- **About Page**: Dr. Gupta's credentials, experience, treatment philosophy
- **Services Page**: Complete list of treatments with descriptions
- **Testimonials Page**: Patient reviews and success stories
- **Appointment Page**: Booking options, clinic hours, contact information

## 🛠 Technical Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Fonts**: Google Fonts (Noto Sans for bilingual support)
- **Maps**: Leaflet.js with OpenStreetMap
- **Icons**: Unicode emojis and CSS-generated icons
- **Hosting**: GitHub Pages
- **Domain**: Custom domain (www.drvikasgupta.skin)

## 📁 Project Structure

```
dr-vikas-gupta-clinic-site/
├── index.html              # Homepage
├── about.html               # About Dr. Gupta
├── services.html            # Services offered
├── testimonials.html        # Patient reviews
├── appointment.html         # Booking page
├── CNAME                   # GitHub Pages domain config
├── assets/
│   ├── css/
│   │   └── style.css       # Main stylesheet
│   ├── js/
│   │   └── script.js       # Main JavaScript
│   └── images/
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- Git installed
- GitHub account
- Domain configured (www.drvikasgupta.skin)

### Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/dr-vikas-gupta-clinic-site.git
   cd dr-vikas-gupta-clinic-site
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   npm run serve
   ```

4. Navigate to `http://localhost:8080`

## 📸 Adding Images

The website is designed to work without images, but adding professional photos will enhance the experience:

### Required Images:
- `assets/images/dr-vikas-gupta.jpg` (150x150px) - Hero section photo
- `assets/images/dr-vikas-gupta-profile.jpg` (300x400px) - About page photo

### Image Guidelines:
- Format: JPG for photos
- Optimize for web (under 500KB each)
- Professional medical appearance
- High quality for retina displays

## 🌍 Deployment to GitHub Pages

### Step 1: Repository Setup
1. Create a new GitHub repository named `dr-vikas-gupta-clinic-site`
2. Push your code to the repository
3. Ensure the `CNAME` file contains `www.drvikasgupta.skin`

### Step 2: Enable GitHub Pages
1. Go to repository Settings
2. Navigate to Pages section
3. Set source to "Deploy from a branch"
4. Select `main` branch and `/` (root) folder
5. Save settings

### Step 3: Domain Configuration
1. In your GoDaddy account, access DNS Management
2. Add/modify these DNS records:
   ```
   Type: CNAME
   Host: www
   Points to: yourusername.github.io
   TTL: 600 (or default)
   ```

3. Add A records for root domain (optional):
   ```
   Type: A
   Host: @
   Points to: 185.199.108.153
   Points to: 185.199.109.153
   Points to: 185.199.110.153
   Points to: 185.199.111.153
   ```

### Step 4: Verify Deployment
1. Wait for DNS propagation (up to 24 hours)
2. Visit `https://www.drvikasgupta.skin`
3. Check HTTPS is working
4. Test all pages and functionality

## 🔧 Customization

### Language Content
- Edit HTML files to modify English content
- Add Hindi content within `<span class="lang-hi">` tags
- Ensure all user-facing text has both language versions

### Styling
- Modify `assets/css/style.css` for visual changes
- CSS variables in `:root` control color scheme
- Responsive breakpoints defined in media queries

### Functionality
- Edit `assets/js/script.js` for behavior changes
- Language toggle, carousel, and map functionality included
- Add new features by extending existing JavaScript

## 📞 Contact Integration

### Eka Care Booking
- Update the Eka Care URL in `appointment.html`
- Current link: `https://login.eka.care/workspace/patient-sign-in?mobileonly=true&next=https%3A%2F%2Fwww.eka.care%2Fdoctor%2Fdr-vikas-gupta-dermatology-moradabad%2Fcalendar`

### Phone Number
- All phone links use: `+918273112888`
- Update in HTML files if number changes

### Clinic Address
```
A-73, Prince Road, Gandhi Nagar
Moradabad, UP 244001
Opposite Wazid Nagar Complex
```

## 🔍 SEO Configuration

### Local SEO
- Schema.org markup implemented for LocalBusiness
- Google My Business integration ready
- Local keywords optimized for Moradabad area

### Meta Tags
- Unique title and description for each page
- Open Graph tags for social sharing
- Keywords include English and Hindi terms

### Performance
- Optimized images and assets
- Minimal external dependencies
- Fast loading times

## 📱 Mobile Optimization

- Mobile-first responsive design
- Touch-friendly interface
- Optimized for slow connections
- Progressive enhancement approach

## ♿ Accessibility Features

- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Reduced motion preferences

## 🧪 Testing Checklist

Before going live, test (see `TESTING.md` for a detailed sequence):
- [ ] All pages load correctly
- [ ] Language toggle works on all pages
- [ ] Mobile responsiveness
- [ ] All links and phone numbers work
- [ ] Map displays correctly
- [ ] Testimonials carousel functions
- [ ] Forms submit properly
- [ ] SEO meta tags present
- [ ] Page speed optimization
- [ ] Cross-browser compatibility

### Running Automated Tests

1. Install dependencies with `npm install` (this will also download a headless Chromium browser for Playwright).
2. Run `npm test` to start a local server and execute the automated Playwright suite. The tests verify that key pages load and that the language toggle switches to Hindi correctly.

## 📈 Analytics Setup

Consider adding:
- Google Analytics 4
- Google Search Console
- Facebook Pixel (if using Facebook ads)
- Call tracking for phone conversions

## 🔄 Maintenance

### Regular Updates
- Keep patient testimonials current
- Update clinic hours if changed
- Add new services as offered
- Monitor and fix any broken links

### Content Freshness
- Add blog posts about skin care (optional)
- Update doctor credentials/achievements
- Refresh patient success stories

## 📞 Support

For technical issues or questions about this implementation:
- Check the code comments for guidance
- Ensure all files are properly uploaded
- Verify DNS settings are correct
- Test thoroughly before announcing the website

## 📝 Contributing

General development guidelines are available in [CONTRIBUTING.md](CONTRIBUTING.md).

## 🤖 AI Contribution Guide

See [AGENTS.md](AGENTS.md) for guidelines when using automated coding tools. Run `npm install` and `npm run dev` to preview the site locally. Preserve all existing features and SEO tags.

## 📄 License

This website is created specifically for Dr. Vikas Gupta's Skin Care Clinic. All content and design elements are proprietary to the clinic.

---

**Website URL**: [www.drvikasgupta.skin](https://www.drvikasgupta.skin)  
**Last Updated**: January 2025  
**Version**: 1.0.0

For any questions about the website, please contact the clinic directly at +91-8273112888.
