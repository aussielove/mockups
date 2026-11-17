const view = document.querySelector("#view");
const toast = document.querySelector("#toast");
let toastTimer;

const initialState = {
  version: 3,
  annualSavings: 2480,
  sessionSavings: 0,
  actionsCompleted: 0,
  activeTab: "safeblock",
  nudges: [
    { id: "streaming", type: "Subscription", title: "Streaming Bundle", detail: "A $7 monthly price increase was detected.", impact: 84, action: "Review charge", done: false },
    { id: "offset", type: "Offset", title: "Put your offset to work", detail: "Move $200 from Choice for 30 days to reduce loan interest.", impact: 120, action: "Move $200", done: false },
    { id: "cashback", type: "Rewards", title: "An offer matches your spending", detail: "Activate a Westpac partner offer before it expires.", impact: 32, action: "View offer", done: false }
  ],
  activity: [
    { title: "Your money review is ready", detail: "Cash Flow IQ found opportunities across your accounts", amount: 2480, date: "Today" }
  ],
  preferences: { smartNudges: true, weeklyDigest: true, quietHours: false }
};

let state = loadState();

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem("westpac-demo-state") || "null");
    return saved?.version === initialState.version ? { ...initialState, ...saved } : structuredClone(initialState);
  } catch { return structuredClone(initialState); }
}

function saveState() { localStorage.setItem("westpac-demo-state", JSON.stringify(state)); }
function money(value) { return `$${value.toLocaleString("en-AU", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`; }
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function headerChip() {
  return `<span class="active-chip"><i></i> Cash Flow IQ is on</span>`;
}

function homeView() {
  const completed = state.nudges.filter(nudge => nudge.done).length;
  return `
    <section class="hero">
      <div class="hero-tools">${headerChip()}<button class="outline-button" data-toast="Westpac support is ready">♧ Contact us</button><button class="outline-button" aria-label="Profile">◯</button></div>
      <p class="hero-kicker">Banking that fits around your life</p>
      <h1>How can we help you today?</h1>
      <button class="search-box" data-toast="Search is ready"><span class="search-icon">⌕</span><span>Search your money, payments or help</span><span style="margin-left:auto">♩</span></button>
    </section>
    <section class="home-content">
      <p class="welcome-label">Alex Morgan · Your personalised view</p>
      <article class="impact-card">
        <div class="impact-top"><div><span class="eyebrow light">Your impact this year</span><strong>${money(state.annualSavings)}<small> saved</small></strong></div><span class="impact-badge">↗ ${money(state.sessionSavings)} this session</span></div>
        <div class="impact-progress"><span style="width:${Math.min(100, 38 + completed * 15)}%"></span></div>
        <div class="impact-bottom"><span>${completed} of ${state.nudges.length} recommendations completed</span><button data-view-jump="insights">View your plan →</button></div>
      </article>
      <article class="forecast-card">
        <div class="forecast-heading"><div><span class="eyebrow">Next 30 days</span><h2>Your cash flow is on track</h2></div><span class="forecast-status">Comfortable</span></div>
        <p>After your planned bills and transfers, you could have <strong>$1,340</strong> available to spend while keeping your buffer intact.</p>
        <div class="forecast-line"><span>Income expected <b>$3,800</b></span><span>Committed <b>$2,460</b></span><span>Available <b>$1,340</b></span></div>
        <button data-toast="Cash flow forecast opened">See your cash flow →</button>
      </article>
      <article class="panel nudge-panel">
        <div class="panel-heading"><div><span class="eyebrow">Recommended for you</span><h2>Small steps, real progress</h2></div><span class="sparkle">✧</span></div>
        ${state.nudges.map(nudge => nudgeRow(nudge)).join("")}
      </article>
      <article class="panel">
        <div class="panel-heading"><div><span class="eyebrow">A goal worth keeping in sight</span><h2>Japan holiday</h2></div><button data-toast="Goals opened">All goals →</button></div>
        <div class="goal-summary"><div class="goal-ring"><strong>41%</strong><span>complete</span></div><div class="goal-copy"><strong>$1,240 of $3,000</strong><span>Target: 30 June 2025</span><div class="goal-bar"><i></i></div><small>$180 monthly transfer is on track</small></div></div>
      </article>
      <article class="panel">
        <div class="panel-heading"><h2>♧ &nbsp;Accounts</h2><button data-toast="New account flow opened">New account</button></div>
        ${accountCard("Westpac Choice", "032-000 ••4821", "$4,286.52")}
        ${accountCard("Westpac Life", "032-000 ••7710", "$18,940.10")}
        ${accountCard("Rocket Repay Home Loan", "032-000 ••3302", "$486,210.00")}
        ${accountCard("Altitude Black Mastercard", "Card ending ••1234", "−$1,248.30", true)}
      </article>
      <article class="panel timeline-panel"><div class="panel-heading"><div><span class="eyebrow">Your progress</span><h2>Impact ledger</h2></div><button data-view-jump="insights">View all →</button></div>${state.activity.slice(-3).reverse().map(item => `<div class="ledger-row"><span class="ledger-dot">✓</span><div><strong>${item.title}</strong><span>${item.detail} · ${item.date}</span></div><b>+${money(item.amount)}</b></div>`).join("")}</article>
    </section>`;
}

function accountCard(name, number, balance, credit = false) {
  return `<div class="account-card ${credit ? "credit-card" : ""}"><div class="account-card-row"><div><div class="account-name">${name}</div><div class="account-number">${number}</div></div><strong class="account-balance">${balance}</strong></div>${credit ? `<div class="credit-footer"><span>Min of $46.30 due tomorrow</span><button class="pay-button" data-toast="Payment scheduled">Pay now</button></div>` : ""}</div>`;
}

function nudgeRow(nudge) {
  return `<div class="nudge-row ${nudge.done ? "done" : ""}"><span class="nudge-icon">${nudge.type === "Offset" ? "↗" : nudge.type === "Rewards" ? "♢" : "ϟ"}</span><div class="nudge-copy"><div><strong>${nudge.title}</strong><span class="nudge-impact">Estimated ${money(nudge.impact)}/yr</span></div><p>${nudge.detail}</p></div><button class="nudge-action" data-nudge="${nudge.id}">${nudge.done ? "Completed ✓" : nudge.action}</button></div>`;
}

function accountsView() {
  return `<section class="more-view"><p class="eyebrow">Your money</p><h1>Accounts</h1><article class="panel"><div class="panel-heading"><h2>Everyday banking</h2><button data-toast="Account management opened">Manage</button></div>${accountCard("Westpac Choice", "032-000 ••4821", "$4,286.52")}${accountCard("Westpac Life", "032-000 ••7710", "$18,940.10")}</article><article class="panel"><div class="panel-heading"><h2>Borrowing</h2><button data-toast="Loan details opened">Details</button></div>${accountCard("Rocket Repay Home Loan", "032-000 ••3302", "$486,210.00")}</article><div class="more-card" data-toast="Account opening flow opened"><span class="more-card-icon">＋</span><div><h3>Open a new account</h3><p>Find an account that works for you</p></div></div></section>`;
}

function paymentsView() {
  return `<section class="more-view"><p class="eyebrow">Move money with confidence</p><h1>Payments</h1><div class="payment-hero"><span>Next payday</span><strong>Friday, 27 Sep</strong><small>$3,800 expected</small></div><div class="more-card" data-toast="Pay someone flow opened"><span class="more-card-icon">↗</span><div><h3>Pay someone</h3><p>Send money to a saved payee or new contact</p></div></div><div class="more-card" data-toast="Transfer flow opened"><span class="more-card-icon">↔</span><div><h3>Transfer between accounts</h3><p>Move money instantly between your accounts</p></div></div><div class="more-card" data-toast="Scheduled payments opened"><span class="more-card-icon">◷</span><div><h3>Scheduled payments</h3><p>Review and manage your upcoming payments</p></div></div><article class="panel"><div class="panel-heading"><h2>Upcoming</h2><button data-toast="All payments opened">See all</button></div><div class="ledger-row"><span class="ledger-dot neutral">$</span><div><strong>Rent</strong><span>Tomorrow · Scheduled</span></div><b>−$1,860</b></div><div class="ledger-row"><span class="ledger-dot neutral">$</span><div><strong>Electricity</strong><span>28 Sep · Scheduled</span></div><b>−$142</b></div></article></section>`;
}

function subscriptionCard(item) {
  return `<article class="subscription ${item.done ? "locked" : ""}" data-subscription="${item.title}"><div class="subscription-main"><span class="merchant-mark">${item.title[0]}</span><div class="subscription-copy"><strong>${item.title}</strong><p>${item.detail}</p><span class="verified">◉ Verified recurring payment</span><span class="risk">${item.done ? "Completed" : "Review recommended"}</span></div><div class="subscription-price">${item.id === "streaming" ? "$7/mo" : item.id === "offset" ? "$200" : "Offer"}<span>Est. ${money(item.impact)}/yr</span></div></div><div class="sweep-row"><span><span class="rocket">♧</span>${item.id === "offset" ? "Move automatically to offset" : "Move surplus to Westpac Life"}</span><button class="toggle ${item.done ? "" : "off"}" aria-label="Toggle automatic transfer"></button></div><button class="lock-button" data-nudge="${item.id}">${item.done ? "✓ &nbsp; Completed · Undo" : "ϟ &nbsp; ${item.action} · Est. ${money(item.impact)}/yr"}</button></article>`;
}

function insightContent(tab) {
  if (tab === "payday") return `<div class="insight-tab-content"><h2>Payday planner</h2><p>Make payday work for the whole month. Your personalised plan protects bills first, then gives every dollar a job.</p><div class="payday-meter"><span style="width:72%"></span></div><div class="planner-row"><span>Essentials protected</span><strong>$2,140</strong></div><div class="planner-row"><span>Available to enjoy</span><strong>$860</strong></div><button class="primary-button" data-toast="Payday plan applied">Apply my payday plan</button></div>`;
  if (tab === "products") return `<div class="insight-tab-content"><h2>Products that fit your life</h2><p>Not every product is right for everyone. These are matched to your cash flow, goals and current habits.</p><div class="recommendation"><span class="product-icon">↗</span><div><strong>Westpac Life</strong><small>Earn more on money you do not need this month</small></div><b>92% fit</b></div><div class="recommendation"><span class="product-icon">⌁</span><div><strong>Offset boost</strong><small>Use your existing home loan to reduce interest</small></div><b>86% fit</b></div><button class="primary-button" data-toast="Product comparison opened">Compare recommendations</button></div>`;
  if (tab === "shield") return `<div class="insight-tab-content"><h2>Scam Shield</h2><p>Your protection is on. We watch for unusual payment patterns and give you a moment to check before money leaves.</p><div class="shield-status"><span>✓</span><div><strong>Protected today</strong><small>3 payments checked · 0 blocked</small></div><b>ON</b></div><div class="shield-feature"><span>♢</span><div><strong>Safe contacts</strong><small>Only your trusted people can receive large first-time payments without a pause.</small></div></div><div class="shield-feature"><span>ϟ</span><div><strong>Payment pause</strong><small>We will pause suspicious payments so you stay in control.</small></div></div><button class="primary-button" data-toast="Protection settings opened">Review protection settings</button></div>`;
  return `<div class="safe-block"><h2>SafeBlock subscription review</h2><p>Westpac Choice ••4821 · ${state.nudges.length} opportunities identified from your regular payments</p><button class="intercept" data-intercept>ϟ &nbsp; Review all opportunities (${money(state.nudges.reduce((sum, nudge) => sum + (nudge.done ? 0 : nudge.impact), 0))}/yr estimated)</button>${state.nudges.map(subscriptionCard).join("")}</div>`;
}

function insightsView() {
  const tabs = ["safeblock", "payday", "products", "shield"];
  return `<div class="insights-view"><section class="insight-hero"><div class="insight-kicker">Westpac Cash Flow IQ</div><h1>Make more of<br><span>your money</span></h1><p class="insight-sub">Helpful prompts based on the way you bank, with you in control at every step.</p><div class="money-card"><div class="eyebrow">Estimated annual benefit</div><div class="money-total">${money(state.annualSavings)}<small>/yr</small></div><div class="money-divider"></div><div class="money-stats"><div><strong>${money(state.sessionSavings)}</strong><span>Recorded this<br>session</span></div><div><strong>${state.actionsCompleted}</strong><span>Recommendations<br>completed</span></div><div><strong>${state.nudges.length}</strong><span>Opportunities<br>identified</span></div></div></div><button class="ai-prompt" data-ai>✧ &nbsp; Ask Westpac what could help next...</button></section><div class="insight-tabs">${tabs.map(tab => `<button class="${state.activeTab === tab ? "active" : ""}" data-tab="${tab}">${tab === "safeblock" ? "SafeBlock" : tab[0].toUpperCase() + tab.slice(1)}</button>`).join("")}</div>${insightContent(state.activeTab)}</div>`;
}

function moreView() {
  return `<section class="more-view"><p class="eyebrow">Make it yours</p><h1>More</h1><div class="personalisation-card"><span class="sparkle">✧</span><div><strong>Your experience, tailored to you</strong><p>Cash Flow IQ learns what matters to you and only prompts you when it can help.</p></div><span class="status-on">ON</span></div><h2 class="more-section-title">Services</h2><div class="more-card" data-toast="Calculators opened"><span class="more-card-icon">▦</span><div><h3>Calculators</h3><p>Plan your next financial move</p></div></div><div class="more-card" data-toast="Contact us opened"><span class="more-card-icon">♧</span><div><h3>Contact us</h3><p>We're here to help</p></div></div><h2 class="more-section-title">Your preferences</h2><div class="settings-card">${settingRow("Helpful reminders", "Receive timely prompts when they may benefit you", "smartNudges")}${settingRow("Weekly money summary", "A Sunday summary of your progress", "weeklyDigest")}${settingRow("Quiet hours", "Pause non-urgent notifications after 8pm", "quietHours")}</div><button class="sign-out" data-reset>↻ &nbsp; Reset demo data</button></section>`;
}

function settingRow(title, detail, key) {
  return `<div class="setting-row"><div><strong>${title}</strong><span>${detail}</span></div><button class="toggle ${state.preferences[key] ? "" : "off"}" data-setting="${key}" aria-label="Toggle ${title}"></button></div>`;
}

const views = { home: homeView, accounts: accountsView, payments: paymentsView, insights: insightsView, more: moreView };
let currentView = "home";

function render(name = currentView) {
  currentView = name;
  view.innerHTML = views[name]();
  document.querySelectorAll(".nav-item").forEach(item => item.classList.toggle("active", item.dataset.view === name));
  wireActions();
}

function completeNudge(id) {
  const nudge = state.nudges.find(item => item.id === id);
  if (!nudge) return;
  if (nudge.done) {
    nudge.done = false;
    state.annualSavings -= nudge.impact;
    state.sessionSavings = Math.max(0, state.sessionSavings - nudge.impact);
    state.actionsCompleted = Math.max(0, state.actionsCompleted - 1);
    showToast("Change reversed — your plan has been updated");
  } else {
    nudge.done = true;
    state.annualSavings += nudge.impact;
    state.sessionSavings += nudge.impact;
    state.actionsCompleted += 1;
    state.activity.push({ title: `${nudge.title} completed`, detail: `Cash Flow IQ recorded an estimated ${money(nudge.impact)} annual benefit`, amount: nudge.impact, date: "Just now" });
    showToast(`${nudge.title} completed — estimated ${money(nudge.impact)} per year`);
  }
  saveState();
  render(currentView);
}

function openAi() {
  const modal = document.createElement("div");
  modal.className = "modal-backdrop";
  modal.innerHTML = `<section class="ai-modal"><button class="modal-close" aria-label="Close">×</button><span class="ai-spark">✧</span><p class="eyebrow">Westpac Cash Flow IQ</p><h2>Your money, made clearer</h2><p class="modal-intro">I’ve reviewed your recent money patterns. What would you like to understand or improve today?</p><div class="ai-suggestions"><button data-ai-question="How can I save more this month?">How can I save more this month?</button><button data-ai-question="Which subscriptions should I review?">Which payments should I review?</button><button data-ai-question="Can I afford a weekend away?">Can I afford a weekend away?</button></div><div class="ai-response" hidden></div></section>`;
  document.body.appendChild(modal);
  modal.querySelector(".modal-close").addEventListener("click", () => modal.remove());
  modal.addEventListener("click", event => { if (event.target === modal) modal.remove(); });
  modal.querySelectorAll("[data-ai-question]").forEach(button => button.addEventListener("click", () => {
    const response = modal.querySelector(".ai-response");
    response.hidden = false;
    response.innerHTML = `<strong>${button.textContent}</strong><p>${button.dataset.aiQuestion.includes("subscription") ? "You have three regular payments worth reviewing. The clearest opportunity is a recent price increase; reviewing it could save an estimated $84 a year without changing your everyday banking." : button.dataset.aiQuestion.includes("weekend") ? "Your planned bills are covered. Based on your current balances, a $320 spending limit would leave a comfortable buffer for the rest of the month." : "A good next step is the $200 offset transfer. It is optional, reversible and could reduce your loan interest by an estimated $120 over a year."}</p>`;
  }));
}

function openNotifications() {
  const modal = document.createElement("div");
  modal.className = "modal-backdrop";
  modal.innerHTML = `<section class="notification-modal"><button class="modal-close" aria-label="Close">×</button><div class="notification-title"><span class="more-card-icon">♧</span><div><p class="eyebrow">Your updates</p><h2>Notifications</h2></div></div><div class="notification-item unread"><span class="notification-dot-icon">✧</span><div><strong>Your money review is ready</strong><p>We found three opportunities that may help you this month.</p><small>Just now</small></div></div><div class="notification-item"><span class="notification-dot-icon">ϟ</span><div><strong>Price change detected</strong><p>Review your Streaming Bundle before the next payment.</p><small>Today</small></div></div><div class="notification-item"><span class="notification-dot-icon">✓</span><div><strong>Weekly money summary</strong><p>You are $180 ahead of your savings plan this month.</p><small>Yesterday</small></div></div></section>`;
  document.body.appendChild(modal);
  modal.querySelector(".modal-close").addEventListener("click", () => modal.remove());
  modal.addEventListener("click", event => { if (event.target === modal) modal.remove(); });
}

function wireActions() {
  document.querySelectorAll("[data-toast]").forEach(button => button.addEventListener("click", () => showToast(button.dataset.toast)));
  document.querySelectorAll("[data-view-jump]").forEach(button => button.addEventListener("click", () => render(button.dataset.viewJump)));
  document.querySelectorAll("[data-nudge]").forEach(button => button.addEventListener("click", () => completeNudge(button.dataset.nudge)));
  document.querySelectorAll("[data-tab]").forEach(button => button.addEventListener("click", () => { state.activeTab = button.dataset.tab; saveState(); render("insights"); }));
  document.querySelectorAll(".toggle").forEach(toggle => toggle.addEventListener("click", () => toggle.classList.toggle("off")));
  document.querySelectorAll("[data-setting]").forEach(toggle => toggle.addEventListener("click", () => { state.preferences[toggle.dataset.setting] = !state.preferences[toggle.dataset.setting]; saveState(); render("more"); }));
  document.querySelector("[data-intercept]")?.addEventListener("click", () => state.nudges.filter(nudge => !nudge.done).forEach(nudge => completeNudge(nudge.id)));
  document.querySelector("[data-ai]")?.addEventListener("click", openAi);
  document.querySelector("[data-reset]")?.addEventListener("click", () => { state = JSON.parse(JSON.stringify(initialState)); saveState(); render("home"); showToast("Demo data reset"); });
  document.querySelector("#notifications-button")?.addEventListener("click", openNotifications);
  document.querySelector("#back-button")?.addEventListener("click", () => currentView === "home" ? showToast("You are already on Home") : render("home"));
}

document.querySelectorAll(".nav-item").forEach(item => item.addEventListener("click", () => render(item.dataset.view)));
render();
