const toast = document.querySelector("#toast");
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

document.querySelectorAll(".action-card").forEach((button) => {
  button.addEventListener("click", () => showToast(`${button.dataset.action} is ready to set up`));
});

document.querySelector("#view-accounts").addEventListener("click", () => {
  document.querySelector("#accounts").scrollIntoView({ behavior: "smooth", block: "start" });
});

document.querySelector("#toggle-balance").addEventListener("click", (event) => {
  const balance = document.querySelector("#balance");
  const hidden = balance.textContent.includes("•");
  balance.textContent = hidden ? "12,480.70" : "••••••••";
  event.currentTarget.setAttribute("aria-label", hidden ? "Hide balance" : "Show balance");
});

document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", () => {
    if (item.classList.contains("nav-pay")) {
      showToast("Choose an action to get started");
      return;
    }
    document.querySelectorAll(".nav-item").forEach((nav) => nav.classList.remove("active"));
    item.classList.add("active");
    showToast(`${item.querySelector("span:last-child").textContent} selected`);
  });
});
