/* ============================================
   SpineUp — SPA Router & State Management
   ============================================ */

// Global App State
const AppState = {
  currentScreen: 'splash',
  auth: { isLoggedIn: false },
  user: { ...MOCK_DATA.user },
  device: { ...MOCK_DATA.device },
  reminders: {},
  postureInterval: null
};

// Initialize reminders from localStorage or defaults
MOCK_DATA.reminders.forEach(r => {
  const saved = localStorage.getItem('reminder_' + r.id);
  AppState.reminders[r.id] = saved !== null ? saved === 'true' : r.on;
});

/* ── Router ──────────────────────────────── */
function navigateTo(screenId) {
  const prev = document.querySelector('.screen.active');
  const next = document.getElementById('screen-' + screenId);
  if (!next || (prev && prev.id === 'screen-' + screenId)) return;

  if (prev) prev.classList.remove('active');
  next.classList.add('active');
  AppState.currentScreen = screenId;

  // Show/hide bottom nav
  const nav = document.getElementById('bottomNav');
  const navScreens = ['home','device','progress','insight','shop','exercises','reminders','profile'];
  if (nav) nav.style.display = navScreens.includes(screenId) ? 'flex' : 'none';

  // Update nav active state
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.screen === screenId);
  });

  // Screen-specific init
  if (screenId === 'home') initHomeScreen();
  if (screenId === 'progress') initProgressCharts();
  if (screenId === 'insight') initInsightCharts();
  if (screenId === 'profile') initProfile();
  if (screenId === 'shop') initShop();
}

/* ── Splash Auto-advance ────────────────── */
function startSplash() {
  navigateTo('splash');
  setTimeout(() => navigateTo('onboarding'), 3000);
}

/* ── Home Screen Init ────────────────────── */
function initHomeScreen() {
  // Set greeting based on time
  const hour = new Date().getHours();
  let greeting = 'Good evening';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 17) greeting = 'Good afternoon';

  const el = document.getElementById('homeGreeting');
  if (el) el.textContent = `Hello, ${AppState.user.name} 👋`;

  const motiv = document.getElementById('homeMotivational');
  if (motiv) {
    if (AppState.user.streak > 0) {
      motiv.textContent = `Keep your spine, own your day. Day ${AppState.user.streak} streak! 🔥`;
    } else {
      motiv.textContent = 'Start your streak today!';
    }
  }

  // Update HT display
  updateHTDisplay();

  // Update score
  updatePostureScore(AppState.user.currentScore);

  // Start live simulation
  startPostureSimulation();

  // Update daily goal
  updateDailyGoal();

  // Update streak
  updateStreak();
}

function updateHTDisplay() {
  document.querySelectorAll('.ht-value').forEach(el => {
    el.textContent = AppState.user.ht.toLocaleString();
  });
}

function updatePostureScore(score) {
  AppState.user.currentScore = score;
  const scoreEl = document.getElementById('scoreValue');
  const messageEl = document.getElementById('scoreMessage');
  const circleFill = document.getElementById('scoreCircleFill');

  if (scoreEl) scoreEl.textContent = score;

  if (messageEl) {
    if (score >= 75) messageEl.textContent = "You're doing amazing today!";
    else if (score >= 50) messageEl.textContent = "Room for improvement!";
    else messageEl.textContent = "Let's fix that posture!";
  }

  if (circleFill) {
    const circumference = 440;
    const offset = circumference - (score / 100) * circumference;
    circleFill.style.strokeDashoffset = offset;

    if (score >= 75) circleFill.style.stroke = 'var(--color-primary)';
    else if (score >= 50) circleFill.style.stroke = 'var(--color-amber)';
    else circleFill.style.stroke = 'var(--color-red)';
  }

  // Update score label
  const labelEl = document.getElementById('scoreLabel');
  if (labelEl) {
    if (score >= 75) labelEl.textContent = 'Great Posture!';
    else if (score >= 50) labelEl.textContent = 'Needs Work';
    else labelEl.textContent = 'Poor Posture';
  }
}

function startPostureSimulation() {
  if (AppState.postureInterval) clearInterval(AppState.postureInterval);
  AppState.postureInterval = setInterval(() => {
    if (AppState.currentScreen !== 'home') return;
    const current = AppState.user.currentScore;
    const change = (Math.random() - 0.48) * 6;
    const newScore = Math.max(30, Math.min(100, Math.round(current + change)));
    updatePostureScore(newScore);
  }, 2000);
}

function updateDailyGoal() {
  const percent = Math.round((AppState.user.goodPostureHours / AppState.user.dailyGoalHours) * 100);
  const fill = document.getElementById('goalFill');
  const pct = document.getElementById('goalPercent');
  const time = document.getElementById('goalTime');

  if (fill) fill.style.width = percent + '%';
  if (pct) pct.textContent = percent + '%';
  if (time) time.textContent = `Hold good posture for ${AppState.user.dailyGoalHours}h · ${AppState.user.goodPostureHours}h / ${AppState.user.dailyGoalHours}h`;
}

function updateStreak() {
  const container = document.getElementById('streakRow');
  if (!container) return;
  container.innerHTML = MOCK_DATA.streakDays.map(d => {
    let cls = 'missed';
    let icon = '';
    if (d.met === true) { cls = 'met'; icon = '✓'; }
    else if (d.met === 'today') { cls = 'today'; icon = '◉'; }
    return `<div class="streak-day">
      <span class="streak-day-label">${d.day}</span>
      <div class="streak-dot ${cls}">${icon}</div>
    </div>`;
  }).join('');
}

/* ── Profile Init ────────────────────────── */
function initProfile() {
  const xpFill = document.getElementById('xpFill');
  if (xpFill) {
    const pct = (AppState.user.xp / AppState.user.xpToNext) * 100;
    setTimeout(() => xpFill.style.width = pct + '%', 100);
  }
  updateHTDisplay();
}

/* ── Shop Init ───────────────────────────── */
function initShop() {
  updateHTDisplay();
}

/* ── Login Handler ───────────────────────── */
function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const pass = document.getElementById('loginPassword').value;

  if (!email || !pass) {
    shakeElement(e.target.querySelector('.btn-primary'));
    return;
  }

  AppState.auth.isLoggedIn = true;
  navigateTo('home');
}

function handleSignup(e) {
  e.preventDefault();
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const pass = document.getElementById('signupPassword').value;
  const confirm = document.getElementById('signupConfirm').value;
  const terms = document.getElementById('termsCheck');

  if (!name || !email || !pass || !confirm) {
    shakeElement(e.target.querySelector('.btn-primary'));
    return;
  }
  if (pass !== confirm) {
    alert('Passwords do not match');
    return;
  }
  if (!terms || !terms.classList.contains('checked')) {
    alert('Please accept Terms of Service');
    return;
  }

  AppState.user.name = name;
  AppState.auth.isLoggedIn = true;
  navigateTo('home');
}

function shakeElement(el) {
  if (!el) return;
  el.style.animation = 'none';
  el.offsetHeight;
  el.style.animation = 'shake 0.4s ease';
  setTimeout(() => el.style.animation = '', 400);
}

/* ── App Init ────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Bottom nav clicks
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => navigateTo(item.dataset.screen));
  });

  // Start the app
  startSplash();
});
