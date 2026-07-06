// ── NAVBAR + SCROLL ──
const nav = document.getElementById('mainNav');
const btt = document.getElementById('btt');
const btb = document.getElementById('btb');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link:not(.nav-cta)');

// Scroll progress dots
const scrollProgress = document.getElementById('scrollProgress');
const sectionNames = {
  'hero':'Hero','about':'About','services':'Services',
  'clients':'Clients','work':'Work','team':'Team',
  'faq':'FAQ','contact':'Contact'
};

sections.forEach(section => {
  const dot = document.createElement('div');
  dot.className = 'scroll-dot';
  dot.setAttribute('data-section', sectionNames[section.id] || section.id);
  dot.setAttribute('data-target', section.id);
  dot.setAttribute('role', 'button');
  dot.setAttribute('tabindex', '0');
  dot.setAttribute('aria-label', `Go to ${sectionNames[section.id] || section.id}`);
  dot.onclick = () => document.getElementById(section.id).scrollIntoView({behavior:'smooth'});
  dot.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' '){ e.preventDefault(); dot.click(); }});
  scrollProgress.appendChild(dot);
});

const scrollDots = document.querySelectorAll('.scroll-dot');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  nav.classList.toggle('solid', y > 50);
  btt.classList.toggle('on', y > 300);
  btb.classList.toggle('on', y < docH - 300);
  let current = '';
  sections.forEach(s => { if(y >= s.offsetTop - 120) current = s.id; });
  navLinks.forEach(a => {
    a.classList.remove('active-link');
    if(a.getAttribute('href') === '#'+current) a.classList.add('active-link');
  });
  scrollDots.forEach(dot => {
    dot.classList.remove('active');
    if(dot.getAttribute('data-target') === current) dot.classList.add('active');
  });
});

// ── ANIMATED COUNTERS ──
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting && !entry.target.classList.contains('counted')){
      entry.target.classList.add('counted');
      const target = parseInt(entry.target.dataset.target);
      const el = entry.target;
      let current = 0;
      const inc = target / 30;
      const timer = setInterval(() => {
        current += inc;
        if(current >= target){ el.textContent = target+'+'; clearInterval(timer); }
        else el.textContent = Math.floor(current);
      }, 30);
      counterObserver.unobserve(el);
    }
  });
}, {threshold:0.8});
document.querySelectorAll('.counter').forEach(c => counterObserver.observe(c));

// ── SCROLL REVEAL ──
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); obs.unobserve(e.target); }});
}, {threshold:0.1});
document.querySelectorAll('.rv').forEach(el => obs.observe(el));

// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if(t){ e.preventDefault(); t.scrollIntoView({behavior:'smooth'}); }
  });
});

// ── TOAST HELPER ──
function showToast(msg, isError = false){
  const t = document.getElementById('toast');
  t.innerHTML = isError
    ? `<i class="fas fa-exclamation-circle me-2"></i>${msg}`
    : `<i class="fas fa-check-circle me-2"></i>${msg}`;
  t.classList.toggle('error', isError);
  t.classList.add('on');
  setTimeout(() => t.classList.remove('on'), 5000);
}

// ── FORM VALIDATION ──
function validateForm(){
  const form = document.getElementById('contactForm');
  let valid = true;

  const fields = [
    { id:'fn',  check: v => v.trim().length >= 2,       msg: 'Please enter your full name.' },
    { id:'fe',  check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), msg: 'Please enter a valid email.' },
    { id:'fs',  check: v => v !== '',                   msg: 'Please select a service.' },
    { id:'fm',  check: v => v.trim().length >= 10,      msg: 'Message must be at least 10 characters.' },
  ];

  fields.forEach(f => {
    const el = document.getElementById(f.id);
    const fb = el.nextElementSibling;
    if(!f.check(el.value)){
      el.classList.add('is-invalid');
      el.classList.remove('is-valid');
      if(fb && fb.classList.contains('invalid-feedback')) fb.textContent = f.msg;
      valid = false;
    } else {
      el.classList.remove('is-invalid');
      el.classList.add('is-valid');
    }
  });

  return valid;
}

// Clear validation state on input
['fn','fe','fs','fm','fp'].forEach(id => {
  const el = document.getElementById(id);
  if(el) el.addEventListener('input', () => {
    el.classList.remove('is-invalid','is-valid');
  });
});

// ── FORM SUBMIT — now posts to our own /api/contact serverless function ──
function doSend(e){
  if(e) e.preventDefault();

  if(!validateForm()) return;

  const sendBtn = document.getElementById('sendBtn');
  sendBtn.disabled = true;
  sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending…';

  const payload = {
    from_name:    document.getElementById('fn').value.trim(),
    from_email:   document.getElementById('fe').value.trim(),
    organisation: document.getElementById('org').value.trim(),
    phone:        document.getElementById('fp').value.trim(),
    service:      document.getElementById('fs').value,
    message:      document.getElementById('fm').value.trim(),
    website:      document.getElementById('hp')?.value || '', // honeypot — should always be empty
  };

  fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
    .then(async (res) => {
      const data = await res.json().catch(() => ({}));
      return { ok: res.ok, data };
    })
    .then(({ ok, data }) => {
      sendBtn.disabled = false;
      sendBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Send Message';

      if (ok && data.success) {
        showToast("Message sent — we'll be in touch soon!");
        document.getElementById('contactForm').reset();
        ['fn','fe','fs','fm'].forEach(id => {
          const el = document.getElementById(id);
          if(el) el.classList.remove('is-valid','is-invalid');
        });
      } else {
        showToast(data.error || 'Failed to send. Please email us directly at info@olympusrets.net', true);
      }
    })
    .catch(() => {
      sendBtn.disabled = false;
      sendBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Send Message';
      showToast('Failed to send. Please email us directly at info@olympusrets.net', true);
    });
}

// ── COOKIE CONSENT ──
const cookieBanner = document.getElementById('cookieBanner');
const cookieAccept = document.getElementById('cookieAccept');
const cookieReject = document.getElementById('cookieReject');

if(cookieBanner && !localStorage.getItem('cookieConsent')){
  setTimeout(() => cookieBanner.classList.add('show'), 1500);
}
cookieAccept?.addEventListener('click', () => {
  localStorage.setItem('cookieConsent', 'accepted');
  cookieBanner.classList.remove('show');
});
cookieReject?.addEventListener('click', () => {
  localStorage.setItem('cookieConsent', 'rejected');
  cookieBanner.classList.remove('show');
});

// ── CURSOR GLOW ──
const glow = document.querySelector('.cursor-glow');
if(glow){
  let mx=0, my=0, gx=0, gy=0;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; glow.style.opacity='1'; });
  document.addEventListener('mouseleave', () => glow.style.opacity='0');
  const animGlow = () => {
    gx += (mx-gx)*.1; gy += (my-gy)*.1;
    glow.style.left = gx+'px'; glow.style.top = gy+'px';
    requestAnimationFrame(animGlow);
  };
  animGlow();
}

// ── KEYBOARD ACCORDION ──
document.querySelectorAll('.accordion-button').forEach(btn => {
  btn.addEventListener('keydown', e => {
    if(e.key==='Enter'||e.key===' '){ e.preventDefault(); btn.click(); }
  });
});
