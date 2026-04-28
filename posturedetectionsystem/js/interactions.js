/* ============================================
   SpineUp — UI Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initToggles();
  initPasswordToggles();
  initTabs();
  initCheckboxes();
  initDeviceActions();
  initShopActions();
});

/* ── Toggle Switches ─────────────────────── */
function initToggles() {
  document.querySelectorAll('.toggle-switch[data-toggle]').forEach(toggle => {
    const key = toggle.dataset.toggle;
    const isOn = AppState.reminders[key] !== undefined
      ? AppState.reminders[key]
      : toggle.classList.contains('active');

    toggle.classList.toggle('active', isOn);

    toggle.addEventListener('click', () => {
      const newState = !toggle.classList.contains('active');
      toggle.classList.toggle('active', newState);

      if (AppState.reminders[key] !== undefined) {
        AppState.reminders[key] = newState;
        localStorage.setItem('reminder_' + key, newState);
      }

      // BLE command simulation for private/dare mode
      if (key === 'private') {
        console.log(`[BLE] Sending: ${newState ? 'PRIVATE_ON' : 'PRIVATE_OFF'}`);
        AppState.device.mode = newState ? 'private' : 'normal';
      }
      if (key === 'dare') {
        if (newState) {
          showModal('dareModal');
        } else {
          console.log('[BLE] Sending: DARE_OFF');
        }
      }
    });
  });
}

/* ── Password Toggle ─────────────────────── */
function initPasswordToggles() {
  document.querySelectorAll('.password-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('input');
      if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = '🙈';
      } else {
        input.type = 'password';
        btn.textContent = '👁';
      }
    });
  });
}

/* ── Tab Switching ───────────────────────── */
function initTabs() {
  document.querySelectorAll('[data-tab-group]').forEach(tabGroup => {
    const tabs = tabGroup.querySelectorAll('[data-tab]');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const group = tabGroup.dataset.tabGroup;
        const target = tab.dataset.tab;

        // Filter content based on tab
        if (group === 'shop-category') filterShopProducts(target);
        if (group === 'exercise-level') filterExercises(target);
        if (group === 'progress-period') {
          // Just visual for now
        }
      });
    });
  });
}

/* ── Checkboxes ──────────────────────────── */
function initCheckboxes() {
  document.querySelectorAll('.checkbox').forEach(cb => {
    cb.addEventListener('click', () => {
      cb.classList.toggle('checked');
    });
  });
}

/* ── Device Actions ──────────────────────── */
function initDeviceActions() {
  const calibrateBtn = document.getElementById('calibrateBtn');
  if (calibrateBtn) {
    calibrateBtn.addEventListener('click', () => {
      calibrateBtn.querySelector('.device-menu-desc').textContent = 'Calibrating...';
      console.log('[BLE] Sending: CALIBRATE');
      setTimeout(() => {
        calibrateBtn.querySelector('.device-menu-desc').textContent = 'Calibrated ✓';
      }, 2000);
    });
  }

  const disconnectBtn = document.getElementById('disconnectBtn');
  if (disconnectBtn) {
    disconnectBtn.addEventListener('click', () => {
      AppState.device.connected = !AppState.device.connected;
      updateDeviceUI();
    });
  }
}

function updateDeviceUI() {
  const conn = AppState.device.connected;
  const statusDots = document.querySelectorAll('.status-dot');
  statusDots.forEach(dot => {
    dot.classList.toggle('connected', conn);
    dot.classList.toggle('disconnected', !conn);
  });

  const statusTexts = document.querySelectorAll('.device-conn-text');
  statusTexts.forEach(el => {
    el.textContent = conn ? 'Connected' : 'Disconnected';
    el.style.color = conn ? 'var(--color-primary)' : 'var(--color-red)';
  });

  const discBtn = document.getElementById('disconnectBtn');
  if (discBtn) discBtn.textContent = conn ? 'Disconnect Device' : 'Connect Device';
}

/* ── Shop Actions ────────────────────────── */
function initShopActions() {
  document.querySelectorAll('.product-btn.buy').forEach(btn => {
    btn.addEventListener('click', () => {
      const productId = parseInt(btn.dataset.productId);
      const product = MOCK_DATA.products.find(p => p.id === productId);
      if (!product) return;

      if (AppState.user.ht < product.price) {
        showToast(`Need ${product.price - AppState.user.ht} more HT`);
        return;
      }

      // Show confirmation modal
      const modal = document.getElementById('redeemModal');
      if (modal) {
        document.getElementById('redeemProductName').textContent = product.name;
        document.getElementById('redeemProductCost').textContent = product.price + ' HT';
        document.getElementById('confirmRedeem').onclick = () => {
          AppState.user.ht -= product.price;
          updateHTDisplay();
          hideModal('redeemModal');
          showToast(`✅ ${product.name} redeemed! Voucher sent to email.`);
          showHTAnimation();
        };
        showModal('redeemModal');
      }
    });
  });
}

function filterShopProducts(category) {
  document.querySelectorAll('.product-card').forEach(card => {
    if (category === 'all' || card.dataset.category === category) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

function filterExercises(level) {
  document.querySelectorAll('.exercise-item').forEach(item => {
    if (level === 'all' || item.dataset.level === level.toLowerCase()) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  });
}

/* ── Modal ───────────────────────────────── */
function showModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('active');
}

function hideModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('active');
}

/* ── Toast Notification ──────────────────── */
function showToast(message) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed; bottom: 90px; left: 50%; transform: translateX(-50%);
    background: var(--bg-elevated); color: var(--text-primary);
    padding: 12px 20px; border-radius: var(--radius-full);
    border: 1px solid var(--border-color); font-size: 13px;
    z-index: 300; animation: slideUp 0.3s ease;
    box-shadow: var(--shadow-glow);
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

/* ── HT Award Animation ─────────────────── */
function showHTAnimation() {
  const popup = document.createElement('div');
  popup.textContent = '✨';
  popup.style.cssText = `
    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
    font-size: 60px; z-index: 300; animation: htPopup 1s ease forwards;
    pointer-events: none;
  `;
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 1000);
}

/* ── CSS animation for shake ─────────────── */
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-8px); }
    40% { transform: translateX(8px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }
`;
document.head.appendChild(shakeStyle);
