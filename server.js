const express = require('express');
const path = require('path');
const fs = require('fs');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;

// Gzip/Brotli compression for fast delivery of HTML/CSS/JS assets
app.use(compression());

// Static files (Vercel handles public folder, but keeping this for local and fallback)
app.use(express.static(path.join(__dirname, 'public')));

// Body parser for contact form
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ─── SEO Meta Data per Page ───────────────────────────────────────────────────
const seoData = {
  home: {
    title: 'Hyatt Photography | Premium Photography Studio — Australia',
    description: 'Award-winning photography studio in Australia. Specialising in weddings, portraits, commercial & landscape photography. Book your session today.',
    canonical: 'https://hyattphotography.au/',
    ogImage: 'https://hyattphotography.au/images/og-home.webp',
  },
  portfolio: {
    title: 'Portfolio | Hyatt Photography — Our Finest Work',
    description: 'Explore our curated portfolio of stunning wedding photography, intimate portraits, breathtaking landscapes and commercial shoots across Australia.',
    canonical: 'https://hyattphotography.au/portfolio',
    ogImage: 'https://hyattphotography.au/images/og-portfolio.webp',
  },
  about: {
    title: 'About | Hyatt Photography — Our Story & Vision',
    description: 'Discover the story behind Hyatt Photography. Learn about our philosophy, creative approach, and passion for capturing life\'s most extraordinary moments.',
    canonical: 'https://hyattphotography.au/about',
    ogImage: 'https://hyattphotography.au/images/og-about.webp',
  },
  contact: {
    title: 'Contact | Hyatt Photography — Book Your Session',
    description: 'Ready to create something extraordinary? Get in touch with Hyatt Photography to discuss your vision and book your photography session in Australia.',
    canonical: 'https://hyattphotography.au/contact',
    ogImage: 'https://hyattphotography.au/images/og-contact.webp',
  },
};

// ─── Template Engine (Simple SSR - Updated for Vercel Serverless Paths) ─────────
function renderPage(page, seo) {
  // process.cwd() used to guarantee correct root path inside Vercel environment
  const head = fs.readFileSync(path.join(process.cwd(), 'views', 'partials', 'head.html'), 'utf-8');
  const nav = fs.readFileSync(path.join(process.cwd(), 'views', 'partials', 'nav.html'), 'utf-8');
  const footer = fs.readFileSync(path.join(process.cwd(), 'views', 'partials', 'footer.html'), 'utf-8');
  const body = fs.readFileSync(path.join(process.cwd(), 'views', `${page}.html`), 'utf-8');

  let html = head
    .replace(/{{TITLE}}/g, seo.title)
    .replace(/{{DESCRIPTION}}/g, seo.description)
    .replace(/{{CANONICAL}}/g, seo.canonical)
    .replace(/{{OG_IMAGE}}/g, seo.ogImage)
    .replace('{{NAV}}', nav)
    .replace('{{BODY}}', body)
    .replace('{{FOOTER}}', footer);

  return html;
}

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.send(renderPage('index', seoData.home));
});

app.get('/portfolio', (req, res) => {
  res.send(renderPage('portfolio', seoData.portfolio));
});

app.get('/about', (req, res) => {
  res.send(renderPage('about', seoData.about));
});

app.get('/contact', (req, res) => {
  res.send(renderPage('contact', seoData.contact));
});

// Contact form submission
app.post('/contact', (req, res) => {
  const { name, email, phone, service, message } = req.body;
  console.log('📩 New inquiry:', { name, email, phone, service, message });
  // In production, send email or save to DB
  res.send(renderPage('contact', {
    ...seoData.contact,
    title: 'Thank You | Hyatt Photography',
  }));
});

// ─── SEO: Sitemap ─────────────────────────────────────────────────────────────
app.get('/sitemap.xml', (req, res) => {
  res.header('Content-Type', 'application/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://hyattphotography.au/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>https://hyattphotography.au/portfolio</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>https://hyattphotography.au/about</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://hyattphotography.au/contact</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
</urlset>`);
});

// ─── SEO: Robots.txt ──────────────────────────────────────────────────────────
app.get('/robots.txt', (req, res) => {
  res.header('Content-Type', 'text/plain');
  res.send(`User-agent: *
Allow: /
Sitemap: https://hyattphotography.au/sitemap.xml`);
});

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).send(renderPage('index', {
    ...seoData.home,
    title: '404 — Page Not Found | Hyatt Photography',
  }));
});

// ─── Start Server (Only for Local Development) ────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`\n  ✦ Hyatt Photography running at http://localhost:${PORT}\n`);
  });
}

// Export the Express app for Vercel Serverless Functions
module.exports = app;