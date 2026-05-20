 // Hide preloader on page load
  window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
      preloader.classList.add('hide');
    }, 500);
  });

  // Navbar solid on scroll
  const nav = document.getElementById('mainNav');
  const btt = document.getElementById('btt');
  const btb = document.getElementById('btb');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link:not(.nav-cta)');

  // Create scroll progress indicators
  const scrollProgress = document.getElementById('scrollProgress');
  const sectionNames = {
    'hero': 'Hero',
    'about': 'About',
    'services': 'Services',
    'clients': 'Clients',
    'work': 'Work',
    'team': 'Team',
    'faq': 'FAQ',
    'contact': 'Contact'
  };

  sections.forEach(section => {
    const dot = document.createElement('div');
    dot.className = 'scroll-dot';
    dot.setAttribute('data-section', sectionNames[section.id] || section.id);
    dot.setAttribute('data-target', section.id);
    dot.onclick = () => {
      document.getElementById(section.id).scrollIntoView({ behavior: 'smooth' });
    };
    scrollProgress.appendChild(dot);
  });

  const scrollDots = document.querySelectorAll('.scroll-dot');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    nav.classList.toggle('solid', y > 50);
    btt.classList.toggle('on', y > 300);
    btb.classList.toggle('on', y < docHeight - 300);

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

  // Animated Counters
  const animateCounters = () => {
    const counters = document.querySelectorAll('.counter');
    const observerOpts = { threshold: 0.8 };
    
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          entry.target.classList.add('counted');
          const target = parseInt(entry.target.dataset.target);
          const element = entry.target;
          const increment = target / 30;
          let current = 0;
          
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              element.textContent = target + '+';
              clearInterval(timer);
            } else {
              element.textContent = Math.floor(current);
            }
          }, 30);
          
          counterObserver.unobserve(entry.target);
        }
      });
    }, observerOpts);
    
    counters.forEach(counter => counterObserver.observe(counter));
  };
  
  animateCounters();

  // Scroll reveal
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); obs.unobserve(e.target); }});
  }, {threshold:0.1});
  document.querySelectorAll('.rv').forEach(el => obs.observe(el));

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if(t){ e.preventDefault(); t.scrollIntoView({behavior:'smooth'}); }
    });
  });

  // Send form with EmailJS
  emailjs.init("YOUR_PUBLIC_KEY_HERE");
  
  function doSend(){
    const n=document.getElementById('fn').value.trim();
    const e=document.getElementById('fe').value.trim();
    const s=document.getElementById('fs').value;
    const m=document.getElementById('fm').value.trim();
    
    if(!n||!e||!s||!m){ alert('Please fill in all required fields.'); return; }
    
    const sendBtn = document.getElementById('sendBtn');
    sendBtn.disabled = true;
    sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
    
    const templateParams = {
      to_email: 'coschik44@gmail.com',
      from_name: n,
      from_email: e,
      service: s,
      message: m
    };
    
    emailjs.send('SERVICE_ID', 'TEMPLATE_ID', templateParams)
      .then(function(response) {
        const t=document.getElementById('toast');
        t.classList.add('on');
        setTimeout(()=>t.classList.remove('on'),4000);
        document.getElementById('fn').value='';
        document.getElementById('fe').value='';
        document.getElementById('fs').selectedIndex=0;
        document.getElementById('fm').value='';
        sendBtn.disabled = false;
        sendBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Send Message';
      }, function(error) {
        alert('Failed to send message. Please try again.');
        sendBtn.disabled = false;
        sendBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Send Message';
      });
  }

  // Cookie Consent Management
  const cookieBanner = document.getElementById('cookieBanner');
  const cookieAccept = document.getElementById('cookieAccept');
  const cookieReject = document.getElementById('cookieReject');

  // Check if user has already made a choice
  const cookieConsent = localStorage.getItem('cookieConsent');
  if (!cookieConsent) {
    setTimeout(() => {
      cookieBanner.classList.add('show');
    }, 1500);
  }

  cookieAccept.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'accepted');
    cookieBanner.classList.remove('show');
    // Here you can enable Google Analytics and other tracking
    enableAnalytics();
  });

  cookieReject.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'rejected');
    cookieBanner.classList.remove('show');
  });

  function enableAnalytics() {
    // Google Analytics will already be loaded if cookies are accepted
    console.log('Analytics enabled');
  }

  // Accessibility Improvements
  // Skip to main content link
  document.addEventListener('keydown', (e) => {
    if (e.key === 's' && e.ctrlKey) {
      document.getElementById('mainNav').focus();
      e.preventDefault();
    }
  });

  // Keyboard navigation for accordions
  document.querySelectorAll('.accordion-button').forEach(btn => {
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });

  // Add ARIA labels to scroll dots
  document.querySelectorAll('.scroll-dot').forEach((dot, index) => {
    dot.setAttribute('role', 'button');
    dot.setAttribute('aria-label', `Navigate to ${dot.getAttribute('data-section')} section`);
    dot.setAttribute('tabindex', '0');
  });

  // Add keyboard support to scroll dots
  document.querySelectorAll('.scroll-dot').forEach(dot => {
    dot.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        dot.click();
      }
    });
  });