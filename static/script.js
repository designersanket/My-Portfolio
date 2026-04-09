// ============================================
// SANKET JAGADALE PORTFOLIO — MAIN SCRIPT
// ============================================

// ---- AOS Init ----
AOS.init({ once: true, offset: 60, duration: 700, easing: 'ease-out-cubic' });

// ---- Navbar Scroll Effect ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.style.background = 'rgba(8,9,13,0.92)';
  } else {
    navbar.style.background = 'rgba(8,9,13,0.7)';
  }
});

// ---- Mobile Hamburger ----
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ---- Active Nav Link on Scroll ----
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 100;
  sections.forEach(sec => {
    const top    = sec.offsetTop;
    const height = sec.offsetHeight;
    const id     = sec.getAttribute('id');
    const link   = document.querySelector(`nav a[href="#${id}"]`);
    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        link.style.color = '#00f5ff';
      } else {
        link.style.color = '';
      }
    }
  });
});

// ---- Typing Animation ----
const typedEl = document.getElementById('typedText');
const phrases = [
  'scalable MERN apps',
  'AI-powered features',
  'clean, fast UIs',
  'full-stack products',
];
let phraseIndex = 0, charIndex = 0, isDeleting = false;

function typeWriter() {
  const phrase = phrases[phraseIndex];
  if (isDeleting) {
    typedEl.textContent = phrase.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedEl.textContent = phrase.substring(0, charIndex + 1);
    charIndex++;
  }
  let delay = isDeleting ? 50 : 90;
  if (!isDeleting && charIndex === phrase.length) {
    delay = 1800; isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 400;
  }
  setTimeout(typeWriter, delay);
}
typeWriter();

// ---- Toast Utility ----
function showToast(msg, type = 'success') {
  const toast   = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  const toastIcon = document.getElementById('toast-icon');
  toastMsg.textContent = msg;
  toast.className = 'toast ' + type;
  toastIcon.className = type === 'success'
    ? 'fas fa-check-circle'
    : 'fas fa-times-circle';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

// ---- Contact Form Validation + EmailJS ----
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameEl    = document.getElementById('contact-name');
    const emailEl   = document.getElementById('contact-email');
    const subjectEl = document.getElementById('contact-subject');
    const msgEl     = document.getElementById('contact-message');

    let valid = true;

    function setError(inputEl, errId, msg) {
      const grp  = inputEl.closest('.input-group');
      const errEl = document.getElementById(errId);
      if (msg) {
        grp.classList.add('error');
        errEl.textContent = msg;
        valid = false;
      } else {
        grp.classList.remove('error');
        errEl.textContent = '';
      }
    }

    // Reset errors
    setError(nameEl,    'err-name',    '');
    setError(emailEl,   'err-email',   '');
    setError(subjectEl, 'err-subject', '');
    setError(msgEl,     'err-message', '');

    // Validate
    if (!nameEl.value.trim())
      setError(nameEl, 'err-name', 'Name is required.');
    if (!emailEl.value.trim())
      setError(emailEl, 'err-email', 'Email is required.');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim()))
      setError(emailEl, 'err-email', 'Please enter a valid email.');
    if (!subjectEl.value.trim())
      setError(subjectEl, 'err-subject', 'Subject is required.');
    if (!msgEl.value.trim())
      setError(msgEl, 'err-message', 'Message cannot be empty.');
    else if (msgEl.value.trim().length < 10)
      setError(msgEl, 'err-message', 'Message must be at least 10 characters.');

    if (!valid) return;

    const btn      = document.getElementById('submitBtn');
    const btnText  = document.getElementById('btnText');
    const btnLoader = document.getElementById('btnLoader');
    btn.disabled  = true;
    btnText.style.display  = 'none';
    btnLoader.style.display = 'flex';

    const templateParams = {
      from_name:  nameEl.value.trim(),
      from_email: emailEl.value.trim(),
      subject:    subjectEl.value.trim(),
      message:    msgEl.value.trim(),
    };

    try {
      // ⚠️ Replace YOUR_SERVICE_ID and YOUR_TEMPLATE_ID with your real EmailJS values
      await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams);
      showToast('Message sent! I\'ll reply within 24 hours. 🎉', 'success');
      form.reset();
    } catch (err) {
      console.error('EmailJS error:', err);
      showToast('Something went wrong. Please email me directly.', 'error');
    } finally {
      btn.disabled   = false;
      btnText.style.display  = 'flex';
      btnLoader.style.display = 'none';
    }
  });

  // Live remove error on input
  form.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', () => {
      el.closest('.input-group').classList.remove('error');
    });
  });
}
