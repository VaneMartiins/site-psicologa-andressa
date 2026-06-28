const WHATSAPP_NUMBER = "5521998971737";
const DEFAULT_MESSAGE = "Olá, Andressa. Gostaria de saber mais sobre a psicoterapia online.";

function buildWhatsAppUrl(message = DEFAULT_MESSAGE) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

document.querySelectorAll(".whatsapp-link").forEach((link) => {
  link.href = buildWhatsAppUrl();
});

const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");

if (header && navToggle) {
  navToggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  header.querySelectorAll(".site-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      header.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const contactForm = document.querySelector("#contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const text = [
      `Olá, Andressa. Meu nome é ${name}.`,
      email ? `Meu e-mail é ${email}.` : "",
      message,
    ]
      .filter(Boolean)
      .join("\n\n");

    window.open(buildWhatsAppUrl(text), "_blank", "noreferrer");
  });
}
