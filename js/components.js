/* ============================================================
   Shared chrome injected on every page: preloader, cursor,
   nav, footer, back-to-top, scroll progress.
   Keeps the "great navbar" defined in exactly one place.
   ============================================================ */
(() => {
  const page = document.body.dataset.page || "home";
  const LOGO = `<span class="brand__mark" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <path d="M14 9V5a3 3 0 0 0-3-3l-1 5-3 3v9h11.28a2 2 0 0 0 2-1.7l1.38-9A2 2 0 0 0 19.66 6H14zM2 13h3v9H2a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1z"/>
      </svg></span>`;

  const links = [
    ["index.html", "Home", "home"],
    ["services.html", "Services", "services"],
    ["gallery.html", "Our Work", "gallery"],
    ["about.html", "About", "about"],
    ["contact.html", "Contact", "contact"],
  ];

  const navLinks = links
    .map(([href, label, id]) => `<a href="${href}" class="${id === page ? "is-active" : ""}">${label}</a>`)
    .join("");

  // ---- inject markup at top of body ----
  const chrome = `
    <div class="preloader" id="preloader">
      <div class="preloader__logo">${LOGO}</div>
      <div class="preloader__bar"><i></i></div>
    </div>
    <div class="scroll-progress" id="scrollProgress"></div>
    <div class="cursor" id="cursor"></div><div class="cursor-dot" id="cursorDot"></div>

    <header class="nav" id="nav">
      <div class="nav__inner container">
        <a href="index.html" class="brand" aria-label="Green Thumb Landscapes home">
          ${LOGO}<span class="brand__text">Green&nbsp;Thumb<span class="brand__sub">Landscapes</span></span>
        </a>
        <nav class="nav__links" id="navLinks" aria-label="Primary">
          ${navLinks}
          <a href="contact.html" class="btn btn--small" data-magnetic>Free Quote</a>
        </nav>
        <button class="nav__toggle" id="navToggle" aria-label="Menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>`;
  document.body.insertAdjacentHTML("afterbegin", chrome);

  // ---- footer ----
  const footer = `
    <footer class="footer">
      <div class="container">
        <div class="footer__grid">
          <div>
            <div class="brand brand--footer">${LOGO}<span class="brand__text">Green Thumb<span class="brand__sub">Landscapes</span></span></div>
            <p class="footer__about">Thoughtful garden design, build and maintenance. We turn outdoor spaces into places you love to live.</p>
            <div class="socials">
              <a href="#" aria-label="Instagram">📷</a><a href="#" aria-label="Facebook">📘</a><a href="#" aria-label="Pinterest">📌</a>
            </div>
          </div>
          <div><h4>Explore</h4><ul>
            <li><a href="index.html">Home</a></li><li><a href="services.html">Services</a></li>
            <li><a href="gallery.html">Our Work</a></li><li><a href="about.html">About</a></li><li><a href="contact.html">Contact</a></li>
          </ul></div>
          <div><h4>Services</h4><ul>
            <li><a href="services.html">Garden Design</a></li><li><a href="services.html">Paving &amp; Patios</a></li>
            <li><a href="services.html">Lawns &amp; Turf</a></li><li><a href="services.html">Maintenance</a></li>
          </ul></div>
          <div><h4>Get in touch</h4><ul>
            <li>📞 <a href="tel:+10000000000">(000) 000-0000</a></li>
            <li>✉️ <a href="mailto:hello@greenthumb.example">hello@greenthumb.example</a></li>
            <li>📍 Serving [Your Region]</li><li>🕒 Mon–Sat · 7am–6pm</li>
          </ul></div>
        </div>
        <div class="footer__bar">
          <span>© <span id="year"></span> Green Thumb Landscapes · Locally owned &amp; operated</span>
          <span>Sample draft · Built for preview</span>
        </div>
      </div>
    </footer>
    <button class="totop" id="toTop" aria-label="Back to top">↑</button>`;
  document.body.insertAdjacentHTML("beforeend", footer);

  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
