/* Minimal JS: mobile menu, active links, theme toggle, book modal, copy helpers */
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

const topbar = document.querySelector("[data-elevate]");
const navToggle = $(".nav__toggle");
const navLinks = $("#navlinks");
const themeBtn = $("#themeBtn");
const themeLabel = $("#themeLabel");

const toast = $("#toast");
function showToast(msg){
  toast.textContent = msg;
  toast.classList.add("is-on");
  window.clearTimeout(showToast._t);
  showToast._t = window.setTimeout(() => toast.classList.remove("is-on"), 1600);
}

// Elevation on scroll
function onScroll(){
  if (window.scrollY > 6) topbar.classList.add("is-elevated");
  else topbar.classList.remove("is-elevated");
}
window.addEventListener("scroll", onScroll, {passive:true});
onScroll();

// Mobile nav
navToggle?.addEventListener("click", () => {
  const open = navLinks.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(open));
});
$$(".nav__link").forEach(a => a.addEventListener("click", () => {
  navLinks.classList.remove("is-open");
  navToggle?.setAttribute("aria-expanded", "false");
}));

// Active link highlight
const sections = ["about","books","media","contact"].map(id => document.getElementById(id)).filter(Boolean);
const navMap = new Map($$(".nav__link").map(a => [a.getAttribute("href")?.replace("#",""), a]));
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    navMap.forEach(a => a?.classList.remove("is-active"));
    const link = navMap.get(e.target.id);
    link?.classList.add("is-active");
  });
}, {rootMargin: "-35% 0px -55% 0px", threshold: 0.01});
sections.forEach(s => io.observe(s));

// Theme toggle (remembered)
const storageKey = "mih_theme";
function applyTheme(t){
  document.documentElement.dataset.theme = t;
  themeLabel.textContent = t === "light" ? "Light" : "Dark";
}
const saved = localStorage.getItem(storageKey);
if (saved === "light" || saved === "dark") applyTheme(saved);
themeBtn?.addEventListener("click", () => {
  const current = document.documentElement.dataset.theme === "light" ? "light" : "dark";
  const next = current === "light" ? "dark" : "light";
  applyTheme(next);
  localStorage.setItem(storageKey, next);
});

// Book modal
const modal = $("#bookModal");
const mTitle = $("#mTitle");
const mMeta = $("#mMeta");
const mLang = $("#mLang");
const mDesc = $("#mDesc");
const mBuy = $("#mBuy");

function openBook(btn){
  mTitle.textContent = btn.dataset.title || "Book";
  mMeta.textContent = btn.dataset.year || "";
  mLang.textContent = btn.dataset.lang || "Poetry";
  mDesc.textContent = btn.dataset.desc || "";
  const href = btn.dataset.buy || "#";
  mBuy.setAttribute("href", href);

  if (typeof modal.showModal === "function") modal.showModal();
  else modal.setAttribute("open", "true");
}

$$(".book").forEach(btn => btn.addEventListener("click", () => openBook(btn)));

// Contact form copy
const form = $("#contactForm");
const clearBtn = $("#clearBtn");
const copyEmailBtn = $("#copyEmailBtn");

async function copyText(text){
  try{
    await navigator.clipboard.writeText(text);
    return true;
  }catch{
    // fallback
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  }
}

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = $("#name").value.trim();
  const email = $("#email").value.trim();
  const message = $("#message").value.trim();

  const compiled =
`Hello Mihaela,

${message}

— ${name}
${email}`.trim();

  const ok = await copyText(compiled);
  showToast(ok ? "Message copied" : "Copy failed");
});

clearBtn?.addEventListener("click", () => {
  $("#name").value = "";
  $("#email").value = "";
  $("#message").value = "";
  showToast("Cleared");
});

copyEmailBtn?.addEventListener("click", async () => {
  const em = copyEmailBtn.dataset.email || copyEmailBtn.textContent.trim();
  const ok = await copyText(em);
  showToast(ok ? "Email copied" : "Copy failed");
});

// Footer year
$("#year").textContent = String(new Date().getFullYear());
