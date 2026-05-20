# 🏛️ Olympus Research, Evaluation & Training Services

A modern, responsive website for Olympus RETS - delivering world-class consulting, evaluation and training services to governments, NGOs, development agencies and the corporate world.

**Live Demo:** https://olympus-rets.com

---

## 📋 Features

✨ **Modern Design**
- Responsive layout for all devices (mobile, tablet, desktop)
- Professional navigation with scroll progress indicators
- Smooth animations and micro-interactions
- Dark/Light color scheme with gold accents

📱 **User Experience**
- Animated counters for KPIs
- Smooth scroll navigation with vertical progress dots
- Accessible accordion FAQ section
- Mobile-optimized interface
- Back-to-top & scroll-to-bottom buttons

🔍 **SEO & Performance**
- Schema.org structured data (JSON-LD)
- Meta tags and Open Graph integration
- robots.txt & sitemap.xml
- Lazy-loaded images
- Optimized CSS/JS

🔐 **Features**
- Contact form with email integration (EmailJS)
- Cookie consent banner (GDPR compliant)
- Google Analytics integration
- Loading animation preloader
- Custom 404 error page
- Accessibility audit compliance

---

## 🚀 Quick Start

### Prerequisites
- Web browser (Chrome, Firefox, Safari, Edge)
- Optional: Node.js for local development

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/olympus-rets.git
cd olympus-rets
```

2. **Open locally**
```bash
# Using Python
python -m http.server 8000

# Or use any local server
# Then visit http://localhost:8000
```

3. **Configure Email Integration**
   - Get free account at [EmailJS](https://www.emailjs.com)
   - Update `script.js` with your:
     - Public Key
     - Service ID
     - Template ID

---

## 📁 Project Structure

```
olympus-rets/
├── index.html          # Main HTML file
├── styles.css          # All styling
├── script.js           # JavaScript functionality
├── robots.txt          # SEO robots file
├── sitemap.xml         # SEO sitemap
├── favicon.ico         # Website icon
├── 404.html            # Error page
├── README.md           # This file
├── .gitignore          # Git ignore rules
└── assets/             # Images, fonts, etc.
```

---

## 🔧 Configuration

### Email Setup (EmailJS)

1. Sign up at https://www.emailjs.com
2. Create a service and email template
3. Update these variables in `script.js`:

```javascript
emailjs.init("YOUR_PUBLIC_KEY_HERE");
emailjs.send('SERVICE_ID', 'TEMPLATE_ID', templateParams);
```

### Google Analytics

1. Create account at https://analytics.google.com
2. Get your Measurement ID (G-XXXXX)
3. Add to `<head>` in `olympus.html`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXX"></script>
```

### Cookie Consent

Customize banner text in `script.js` - modify cookie consent settings as needed.

---

## 🌐 Deployment

### GitHub Pages
```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```
Then enable GitHub Pages in repository settings.

### Vercel
1. Connect your GitHub repository
2. Select "Other" as framework
3. Deploy with one click

### Netlify
1. Connect your GitHub repository
2. Build command: (leave empty)
3. Publish directory: (leave empty or `.`)
4. Deploy

---

## 📊 SEO Checklist

- ✅ Meta descriptions
- ✅ Keyword optimization
- ✅ Schema.org markup
- ✅ sitemap.xml
- ✅ robots.txt
- ✅ Mobile responsive
- ✅ Page speed optimized
- ✅ Open Graph tags

---

## ♿ Accessibility

- ARIA labels and semantic HTML
- Keyboard navigation support
- Color contrast compliance
- Image alt text
- Form labels

---

## 🎨 Customization

### Colors
Edit CSS variables in `styles.css`:
```css
:root{
  --navy:#0c1f3d;
  --gold:#c9921e;
  --cream:#f7f4ef;
  /* etc */
}
```

### Content
Edit sections directly in `olympus.html`:
- Hero section
- About
- Services
- Team
- FAQ
- Contact

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 👥 Credits

Built with:
- [Bootstrap 5](https://getbootstrap.com)
- [Font Awesome Icons](https://fontawesome.com)
- [Google Fonts](https://fonts.google.com)
- [EmailJS](https://www.emailjs.com)

---

## 📞 Support

For questions or issues:
- Email: coschik44@gmail.com
- Phone: +263 4 792543

---

## 🚀 Future Enhancements

- Blog section
- Client testimonials carousel
- Live chat integration
- Dark mode toggle
- Multi-language support
- Video backgrounds
- Advanced analytics

---

**Last Updated:** May 2026
