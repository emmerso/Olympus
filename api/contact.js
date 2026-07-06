// /api/contact.js
// Vercel Serverless Function — sends contact form submissions via WebZim SMTP
// to info@olympusrets.net (CC: team@olympusrets.net)

const nodemailer = require('nodemailer');

// Reuse the transporter across warm invocations instead of recreating it every request
let transporter = null;
function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,          // mail.olympusrets.net
      port: Number(process.env.SMTP_PORT),  // 465
      secure: true,                          // true for port 465
      auth: {
        user: process.env.SMTP_USER,        // e.g. info@olympusrets.net
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 10000,  // 10s — don't let a slow mail server hang the request
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });
  }
  return transporter;
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

module.exports = async (req, res) => {
  // CORS not needed if form is served from the same domain, but harmless to allow same-origin only
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const {
      from_name = '',
      from_email = '',
      organisation = '',
      phone = '',
      service = '',
      message = '',
      website = '', // honeypot field — real users never fill this in
    } = body;

    // Honeypot check: if this hidden field has anything in it, silently pretend success.
    // Bots that auto-fill every field will trip this; real visitors never see or touch it.
    if (website && website.trim() !== '') {
      return res.status(200).json({ success: true });
    }

    // Server-side validation (never trust the client alone)
    const errors = [];
    if (!from_name || from_name.trim().length < 2) errors.push('Full name is required.');
    if (!from_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(from_email)) errors.push('A valid email is required.');
    if (!service) errors.push('Service selection is required.');
    if (!message || message.trim().length < 10) errors.push('Message must be at least 10 characters.');

    if (errors.length) {
      return res.status(400).json({ success: false, error: errors.join(' ') });
    }

    const safeName = escapeHtml(from_name);
    const safeEmail = escapeHtml(from_email);
    const safeOrg = escapeHtml(organisation || 'Not provided');
    const safePhone = escapeHtml(phone || 'Not provided');
    const safeService = escapeHtml(service);
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br/>');

    const mailer = getTransporter();

    await mailer.sendMail({
      from: `"Olympus RETS Website" <${process.env.SMTP_USER}>`,
      to: 'info@olympusrets.net',
      cc: 'team@olympusrets.net',
      replyTo: from_email, // so hitting "Reply" goes straight to the enquirer
      subject: `New Contact Form Submission — ${service}`,
      text:
        `New contact form submission\n\n` +
        `Name: ${from_name}\n` +
        `Email: ${from_email}\n` +
        `Organisation: ${organisation || 'Not provided'}\n` +
        `Phone: ${phone || 'Not provided'}\n` +
        `Service: ${service}\n\n` +
        `Message:\n${message}\n`,
      html:
        `<h2>New Contact Form Submission</h2>` +
        `<p><strong>Name:</strong> ${safeName}</p>` +
        `<p><strong>Email:</strong> ${safeEmail}</p>` +
        `<p><strong>Organisation:</strong> ${safeOrg}</p>` +
        `<p><strong>Phone:</strong> ${safePhone}</p>` +
        `<p><strong>Service:</strong> ${safeService}</p>` +
        `<p><strong>Message:</strong><br/>${safeMessage}</p>`,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Contact form send error:', err);
    return res.status(500).json({ success: false, error: 'Failed to send message. Please try again or email us directly.' });
  }
};
