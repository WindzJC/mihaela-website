const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const header = $("[data-header]");
const navToggle = $(".nav__toggle");
const navLinks = $(".nav__links");

function onScroll(){
  if (window.scrollY > 8) header.classList.add("is-sticky");
  else header.classList.remove("is-sticky");
}
window.addEventListener("scroll", onScroll, {passive:true});
onScroll();

navToggle?.addEventListener("click", () => {
  const open = navLinks.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(open));
});
$$('.nav__link').forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

const themeToggle = $("#themeToggle");
const themeText = $("#themeText");
const themeKey = "mih_theme";

function applyTheme(mode){
  if (mode === "light") document.documentElement.dataset.theme = "light";
  else document.documentElement.removeAttribute("data-theme");
  themeText.textContent = mode === "light" ? "Light" : "Dark";
}

const stored = localStorage.getItem(themeKey);
if (stored === "light" || stored === "dark") applyTheme(stored);

themeToggle?.addEventListener("click", () => {
  const current = document.documentElement.dataset.theme === "light" ? "light" : "dark";
  const next = current === "light" ? "dark" : "light";
  applyTheme(next);
  localStorage.setItem(themeKey, next);
});

const modal = $("#bookModal");
const modalTitle = $("#modalTitle");
const modalDesc = $("#modalDesc");
const modalImage = $("#modalImage");
const modalLink = $("#modalLink");
const modalClose = $("#closeModal");
let lastFocus = null;

function getFocusable(root){
  return $$('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])', root)
    .filter(el => !el.hasAttribute("disabled"));
}

function trapFocus(e){
  if (e.key !== "Tab") return;
  const focusable = getFocusable(modal);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first){
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last){
    e.preventDefault();
    first.focus();
  }
}

function openModal(card){
  lastFocus = document.activeElement;
  modalTitle.textContent = card.dataset.title || "Book";
  modalDesc.textContent = card.dataset.desc || "";
  modalImage.src = card.dataset.img || "";
  modalImage.alt = `${card.dataset.title || "Book"} cover`;
  modalLink.href = card.dataset.link || "#";
  if (typeof modal.showModal === "function") modal.showModal();
  else modal.setAttribute("open", "true");
  modal.addEventListener("keydown", trapFocus);
  modalClose.focus();
}

function closeModal(){
  modal.removeEventListener("keydown", trapFocus);
  if (typeof modal.close === "function") modal.close();
  else modal.removeAttribute("open");
  lastFocus?.focus();
}

$$('.bookCard').forEach(card => {
  card.addEventListener("click", () => openModal(card));
});

modalClose?.addEventListener("click", closeModal);
modal?.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});
modal?.addEventListener("cancel", (e) => {
  e.preventDefault();
  closeModal();
});

const toast = $("#toast");
let toastTimer;
function showToast(message){
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 1600);
}

async function copyText(text){
  try{
    await navigator.clipboard.writeText(text);
    return true;
  }catch{
    const temp = document.createElement("textarea");
    temp.value = text;
    temp.style.position = "fixed";
    temp.style.left = "-9999px";
    document.body.appendChild(temp);
    temp.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(temp);
    return ok;
  }
}

const form = $("#contactForm");
const clearForm = $("#clearForm");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = $("#name").value.trim();
  const email = $("#email").value.trim();
  const message = $("#message").value.trim();
  const body = `Hello Mihaela,\n\n${message}\n\n— ${name}\n${email}`.trim();
  const ok = await copyText(body);
  showToast(ok ? "Message copied" : "Copy failed");
});

clearForm?.addEventListener("click", () => {
  $("#name").value = "";
  $("#email").value = "";
  $("#message").value = "";
  showToast("Cleared");
});

const copyEmail = $("#copyEmail");
copyEmail?.addEventListener("click", async () => {
  const email = copyEmail.dataset.email || copyEmail.textContent.trim();
  const ok = await copyText(email);
  showToast(ok ? "Email copied" : "Copy failed");
});

$("#year").textContent = String(new Date().getFullYear());
