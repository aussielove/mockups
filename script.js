const view = document.querySelector("#view");
const toast = document.querySelector("#toast");
let toastTimer;

const subscriptions = [
  { letter: "S", name: "Streaming Bundle", detail: "Price hike detected: +$7/mo", monthly: "$7/mo", annual: "$84/yr", risk: "Price hike" },
  { letter: "F", name: "FitPulse Fitness App", detail: "No logins in 94 days", monthly: "$29/mo", annual: "$348/yr", risk: "Unused" },
  { letter: "C", name: "CloudVault Pro Trial", detail: "Converts to paid in 48h", monthly: "$19/mo", annual: "$228/yr", risk: "Trial ending" },
  { letter: "E", name: "Energy Plan", detail: "Loyalty tax vs. best market offer", monthly: "$68/mo", annual: "$816/yr", risk: "Loyalty tax" }
];

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2300);
}

function homeView() {
  return `
    <section class="hero">
      <div class="hero-tools"><button class="outline-button" data-toast="Connecting you to Westpac support">♧ Contact us</button><button class="outline-button" aria-label="Profile">◯</button></div>
      <h1>How can we help you this afternoon?</h1>
      <button class="search-box" data-toast="Search is ready"><span class="search-icon">⌕</span><span>Search</span><span style="margin-left:auto">♩</span></button>
    </section>
    <section class="home-content">
      <p class="welcome-label">Alex Morgan</p>
      <article class="panel">
        <div class="panel-heading"><h2>♧ &nbsp;Accounts</h2><button data-toast="New account flow opened">New account</button></div>
        <div class="account-card"><div class="account-card-row"><div><div class="account-name">Westpac Choice</div><div class="account-number">032-000 ••4821</div></div><strong class="account-balance">$4,286.52</strong></div></div>
        <div class="account-card"><div class="account-card-row"><div><div class="account-name">Westpac Life</div><div class="account-number">032-000 ••7710</div></div><strong class="account-balance">$18,940.10</strong></div></div>
        <div class="account-card"><div class="account-card-row"><div><div class="account-name">Rocket Repay Home<br>Loan</div><div class="account-number">032-000 ••3302</div></div><strong class="account-balance">$486,210.00</strong></div></div>
        <div class="account-card credit-card"><div class="account-card-row"><div><div class="account-name">Altitude Black<br>Mastercard</div><div class="account-number">Card ending ••1234</div></div><strong class="account-balance">−$1,248.30</strong></div><div class="credit-footer"><span>Min of $46.30 due tomorrow</span><button class="pay-button" data-toast="Payment scheduled">Pay now</button></div></div>
      </article>
      <div class="panel"><div class="panel-heading"><h2>Shortcuts</h2></div><div class="quick-grid"><button class="quick-tile" data-toast="Payments opened"><span class="tile-icon">＋</span><strong>Pay someone</strong></button><button class="quick-tile" data-toast="Transfers opened"><span class="tile-icon">↔</span><strong>Transfer</strong></button><button class="quick-tile" data-toast="Calculators opened"><span class="tile-icon">▦</span><strong>Calculators</strong></button></div></div>
    </section>`;
}

function accountsView() {
  return `<section class="more-view"><h1>Accounts</h1><article class="panel"><div class="panel-heading"><h2>Everyday banking</h2><button data-toast="Account management opened">Manage</button></div><div class="account-card"><div class="account-card-row"><div><div class="account-name">Westpac Choice</div><div class="account-number">032-000 ••4821</div></div><strong class="account-balance">$4,286.52</strong></div></div><div class="account-card"><div class="account-card-row"><div><div class="account-name">Westpac Life</div><div class="account-number">032-000 ••7710</div></div><strong class="account-balance">$18,940.10</strong></div></div></article><div class="more-card" data-toast="Account details opened"><span class="more-card-icon">＋</span><div><h3>Open a new account</h3><p>Find an account that works for you</p></div></div></section>`;
}

function paymentsView() {
  return `<section class="more-view"><h1>Payments</h1><div class="more-card" data-toast="Pay someone flow opened"><span class="more-card-icon">↗</span><div><h3>Pay someone</h3><p>Send money to a saved payee or new contact</p></div></div><div class="more-card" data-toast="Transfer flow opened"><span class="more-card-icon">↔</span><div><h3>Transfer between accounts</h3><p>Move money instantly between your accounts</p></div></div><div class="more-card" data-toast="Scheduled payments opened"><span class="more-card-icon">◷</span><div><h3>Scheduled payments</h3><p>Review and manage your upcoming payments</p></div></div></section>`;
}

function subscriptionCard(item) {
  return `<article class="subscription" data-subscription="${item.name}"><div class="subscription-main"><span class="merchant-mark">${item.letter}</span><div class="subscription-copy"><strong>${item.name}</strong><p>${item.detail}</p><span class="verified">◉ Ethoca Verified Receipt</span><span class="risk">${item.risk}</span></div><div class="subscription-price">${item.monthly}<span>${item.annual}</span></div></div><div class="sweep-row"><span><span class="rocket">♧</span>Sweep to Life / Rocket Repay</span><button class="toggle" aria-label="Toggle sweep"></button></div><button class="lock-button" data-lock>♧ &nbsp; Lock via SafeBlock &amp; Cancel</button></article>`;
}

function insightsView() {
  return `<div class="insights-view"><section class="insight-hero"><div class="insight-kicker">Powered by Westpac Cash Flow IQ</div><h1>Save over $12k<br><span>in interest</span></h1><p class="insight-sub">Zero-Day Offset Float + LVR Auto-Repricing</p><div class="money-card"><div class="eyebrow">Total annual money found</div><div class="money-total">$2,480<small>/yr</small></div><div class="money-divider"></div><div class="money-stats"><div><strong>$0</strong><span>Subscriptions<br>blocked/yr</span></div><div><strong>$0</strong><span>Offset float<br>earned/yr</span></div><div><strong>$0</strong><span>LVR rate saved/yr</span></div></div></div><button class="ai-prompt" data-toast="Westpac AI is ready">✧ &nbsp; Ask Westpac AI anything about your money...</button></section><div class="insight-tabs"><button class="active">SafeBlock</button><button>Payday</button><button>Products</button><button>Shield</button></div><section class="safe-block"><h2>SafeBlock subscription &amp; price-hike radar</h2><p>Westpac Choice ••4821 · 5 verified recurring charges · Simulated merchant controls</p><button class="intercept" data-intercept>ϟ &nbsp; 1-Tap Intercept All 5 Leaks ($1,656/yr)</button>${subscriptions.map(subscriptionCard).join("")}</section></div>`;
}

function moreView() {
  return `<section class="more-view"><h1>More</h1><div class="more-card" data-toast="Calculators opened"><span class="more-card-icon">▦</span><div><h3>Calculators</h3><p>Plan your next financial move</p></div></div><h2 class="more-section-title">Services</h2><div class="more-card" data-toast="Contact us opened"><span class="more-card-icon">♧</span><div><h3>Contact us</h3><p>We're here to help</p></div></div><h2 class="more-section-title">Popular areas</h2><div class="more-card" data-toast="Rewards and offers opened"><span class="more-card-icon">♢</span><div><h3>Rewards and offers</h3><p>Get access to discounts, deals and cashback</p></div></div><div class="more-card" data-toast="Cash Flow IQ opened"><span class="more-card-icon" style="background:#211e5a;color:#f5a3dc">✧</span><div><h3>Cash Flow IQ</h3><p>Your private banker finds leaks and sweeps savings</p></div></div><div class="more-card" data-toast="SafeBlock and Scam Shield opened"><span class="more-card-icon" style="background:#ed1018;color:white">♢</span><div><h3>SafeBlock &amp; Scam Shield</h3><p>Lock merchants and make single-use cards for trials</p></div></div><button class="sign-out" data-toast="Signed out of demo mode">⇥ &nbsp; Sign out</button></section>`;
}

const views = { home: homeView, accounts: accountsView, payments: paymentsView, insights: insightsView, more: moreView };
let currentView = "home";

function render(name = currentView) {
  currentView = name;
  view.innerHTML = views[name]();
  document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("active", item.dataset.view === name));
  wireActions();
}

function wireActions() {
  document.querySelectorAll("[data-toast]").forEach((button) => button.addEventListener("click", () => showToast(button.dataset.toast)));
  document.querySelectorAll("[data-lock]").forEach((button) => button.addEventListener("click", () => {
    const card = button.closest(".subscription");
    card.classList.toggle("locked");
    button.textContent = card.classList.contains("locked") ? "♧  Locked & cancelled · Undo" : "♧  Lock via SafeBlock & Cancel";
    showToast(card.classList.contains("locked") ? `${card.dataset.subscription} locked via SafeBlock` : "Cancellation reversed");
  }));
  document.querySelectorAll(".toggle").forEach((toggle) => toggle.addEventListener("click", () => toggle.classList.toggle("off")));
  document.querySelector("[data-intercept]")?.addEventListener("click", () => {
    document.querySelectorAll(".subscription").forEach((card) => {
      card.classList.add("locked");
      const button = card.querySelector("[data-lock]");
      button.textContent = "♧  Locked & cancelled · Undo";
    });
    showToast("All five subscription leaks intercepted");
  });
}

document.querySelectorAll(".nav-item").forEach((item) => item.addEventListener("click", () => render(item.dataset.view)));
render();
