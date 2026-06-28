/* ============================================================
   Green Thumb Landscapes — interaction engine
   Hand-rolled, dependency-free. Runs after components.js.
   ============================================================ */
(() => {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- preloader ---------- */
  const pre = $("#preloader");
  window.addEventListener("load", () => setTimeout(() => pre && pre.classList.add("is-done"), 450));
  setTimeout(() => pre && pre.classList.add("is-done"), 2500); // safety net

  /* ---------- custom cursor (desktop, fine pointer) ---------- */
  const fine = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
  if (fine && !reduce) {
    document.body.classList.add("has-cursor");
    const cur = $("#cursor"), dot = $("#cursorDot");
    let cx = innerWidth / 2, cy = innerHeight / 2, dx = cx, dy = cy;
    addEventListener("mousemove", (e) => { dot.style.transform = `translate(${e.clientX - 3}px,${e.clientY - 3}px)`; cx = e.clientX; cy = e.clientY; });
    const loop = () => { dx += (cx - dx) * .18; dy += (cy - dy) * .18; cur.style.transform = `translate(${dx - 19}px,${dy - 19}px)`; requestAnimationFrame(loop); };
    loop();
    $$("a,button,.tilt,.g-item,[data-magnetic]").forEach((el) => {
      el.addEventListener("mouseenter", () => cur.classList.add("is-hover"));
      el.addEventListener("mouseleave", () => cur.classList.remove("is-hover"));
    });
  }

  /* ---------- magnetic buttons ---------- */
  if (fine && !reduce) $$("[data-magnetic]").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .3}px,${(e.clientY - r.top - r.height / 2) * .4}px)`;
    });
    el.addEventListener("mouseleave", () => { el.style.transform = ""; });
  });

  /* ---------- nav: scrolled + hide-on-scroll-down + progress + back-to-top ---------- */
  const nav = $("#nav"), prog = $("#scrollProgress"), toTop = $("#toTop");
  let lastY = 0;
  const onScroll = () => {
    const y = scrollY;
    nav.classList.toggle("is-scrolled", y > 24);
    nav.classList.toggle("is-hidden", y > 240 && y > lastY);
    const h = document.documentElement.scrollHeight - innerHeight;
    if (prog) prog.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    if (toTop) toTop.classList.toggle("is-show", y > 600);
    lastY = y;
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }));

  /* ---------- mobile menu ---------- */
  const toggle = $("#navToggle"), navLinks = $("#navLinks");
  const closeMenu = () => { toggle.classList.remove("is-open"); navLinks.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); };
  toggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("is-open");
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  $$("#navLinks a").forEach((a) => a.addEventListener("click", closeMenu));

  /* ---------- scroll reveal (variants + stagger) ---------- */
  const revealEls = $$("[data-reveal], .mask-reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const delay = parseFloat(e.target.dataset.delay || 0);
        const peers = $$("[data-reveal]", e.target.parentElement).filter((p) => p.parentElement === e.target.parentElement);
        const auto = e.target.hasAttribute("data-stagger-child") ? 0 : Math.min(peers.indexOf(e.target), 6) * 70;
        e.target.style.transitionDelay = (delay || auto) + "ms";
        e.target.classList.add("is-in");
        obs.unobserve(e.target);
      });
    }, { threshold: .14, rootMargin: "0px 0px -7% 0px" });
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------- kinetic hero words ---------- */
  $$(".kinetic").forEach((k) => {
    if (reduce) return;
    const words = k.textContent.trim().split(" ");
    k.innerHTML = words.map((w, i) =>
      `<span class="word"><span style="animation-delay:${i * 90 + 150}ms">${w}</span></span>`).join(" ");
  });

  /* ---------- count-up stats ---------- */
  const counters = $$("[data-count]");
  const run = (el) => {
    const target = +el.dataset.count, suffix = el.dataset.suffix || "", t0 = performance.now(), dur = 1500;
    if (reduce) { el.textContent = target + suffix; return; }
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * e) + (p === 1 ? suffix : "");
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ("IntersectionObserver" in window) {
    const cO = new IntersectionObserver((ents, obs) => ents.forEach((e) => { if (e.isIntersecting) { run(e.target); obs.unobserve(e.target); } }), { threshold: .6 });
    counters.forEach((c) => cO.observe(c));
  } else counters.forEach(run);

  /* ---------- parallax (data-parallax = speed) ---------- */
  const px = $$("[data-parallax]");
  if (px.length && !reduce) {
    let ticking = false;
    const upd = () => {
      const vh = innerHeight;
      px.forEach((el) => {
        const r = el.getBoundingClientRect();
        const speed = parseFloat(el.dataset.parallax);
        const offset = (r.top + r.height / 2 - vh / 2) * speed;
        el.style.transform = `translate3d(0,${offset}px,0)`;
      });
      ticking = false;
    };
    addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
    upd();
  }

  /* ---------- 3D tilt cards ---------- */
  if (fine && !reduce) $$(".tilt").forEach((el) => {
    const max = 9;
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const rx = (e.clientY - r.top - r.height / 2) / (r.height / 2) * -max;
      const ry = (e.clientX - r.left - r.width / 2) / (r.width / 2) * max;
      el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    });
    el.addEventListener("mouseleave", () => { el.style.transform = ""; });
  });

  /* ---------- testimonials carousel ---------- */
  $$("[data-carousel]").forEach((root) => {
    const slides = $$(".tcar__slide", root), dotsWrap = $(".dots", root);
    if (!slides.length) return;
    let i = 0, timer;
    slides.forEach((_, n) => {
      const b = document.createElement("button");
      if (n === 0) b.classList.add("is-active");
      b.setAttribute("aria-label", `Slide ${n + 1}`);
      b.addEventListener("click", () => { show(n); restart(); });
      dotsWrap.appendChild(b);
    });
    const dots = $$("button", dotsWrap);
    const show = (n) => {
      slides[i].classList.remove("is-active"); dots[i].classList.remove("is-active");
      i = n; slides[i].classList.add("is-active"); dots[i].classList.add("is-active");
    };
    const next = () => show((i + 1) % slides.length);
    const restart = () => { clearInterval(timer); timer = setInterval(next, 5500); };
    restart();
  });

  /* ---------- project drag slider ---------- */
  $$("[data-pslider]").forEach((root) => {
    const track = $(".pslider__track", root);
    const prevB = $("[data-prev]", root), nextB = $("[data-next]", root);
    let x = 0, max = 0;
    const measure = () => { max = Math.max(0, track.scrollWidth - root.clientWidth); };
    const apply = () => { x = Math.max(-max, Math.min(0, x)); track.style.transform = `translate3d(${x}px,0,0)`; };
    measure(); addEventListener("resize", () => { measure(); apply(); });
    const step = () => (track.firstElementChild?.getBoundingClientRect().width || 320) + 22;
    nextB?.addEventListener("click", () => { x -= step(); apply(); });
    prevB?.addEventListener("click", () => { x += step(); apply(); });
    // drag / swipe
    let down = false, sx = 0, sX = 0;
    const start = (px) => { down = true; sx = px; sX = x; root.classList.add("is-drag"); };
    const move = (px) => { if (down) { x = sX + (px - sx); apply(); } };
    const end = () => { down = false; root.classList.remove("is-drag"); };
    root.addEventListener("mousedown", (e) => { e.preventDefault(); start(e.clientX); });
    addEventListener("mousemove", (e) => move(e.clientX));
    addEventListener("mouseup", end);
    root.addEventListener("touchstart", (e) => start(e.touches[0].clientX), { passive: true });
    root.addEventListener("touchmove", (e) => move(e.touches[0].clientX), { passive: true });
    root.addEventListener("touchend", end);
  });

  /* ---------- before / after slider ---------- */
  $$("[data-ba]").forEach((root) => {
    const after = $(".ba__after", root), line = $(".ba__line", root), handle = $(".ba__handle", root);
    let down = false;
    const set = (clientX) => {
      const r = root.getBoundingClientRect();
      let p = ((clientX - r.left) / r.width) * 100;
      p = Math.max(2, Math.min(98, p));
      after.style.clipPath = `inset(0 0 0 ${p}%)`;
      line.style.left = p + "%"; handle.style.left = p + "%";
    };
    const dn = (x) => { down = true; set(x); };
    const mv = (x) => { if (down) set(x); };
    handle.addEventListener("mousedown", (e) => { e.preventDefault(); down = true; });
    root.addEventListener("mousedown", (e) => dn(e.clientX));
    addEventListener("mousemove", (e) => mv(e.clientX));
    addEventListener("mouseup", () => down = false);
    root.addEventListener("touchstart", (e) => dn(e.touches[0].clientX), { passive: true });
    root.addEventListener("touchmove", (e) => mv(e.touches[0].clientX), { passive: true });
    root.addEventListener("touchend", () => down = false);
  });

  /* ---------- lightbox gallery ---------- */
  const gItems = $$("[data-lightbox]");
  if (gItems.length) {
    const box = document.createElement("div");
    box.className = "lightbox";
    box.innerHTML = `<button class="lightbox__close" aria-label="Close">✕</button>
      <button class="lightbox__nav lightbox__nav--prev" aria-label="Previous">‹</button>
      <button class="lightbox__nav lightbox__nav--next" aria-label="Next">›</button>
      <img alt=""><div class="lightbox__cap"></div>`;
    document.body.appendChild(box);
    const img = $("img", box), cap = $(".lightbox__cap", box);
    const data = gItems.map((el) => ({ src: el.dataset.full || $("img", el).src, cap: el.dataset.caption || "" }));
    let idx = 0;
    const open = (n) => { idx = n; img.src = data[idx].src; cap.textContent = data[idx].cap; box.classList.add("is-open"); };
    const close = () => box.classList.remove("is-open");
    const go = (d) => open((idx + d + data.length) % data.length);
    gItems.forEach((el, n) => el.addEventListener("click", () => open(n)));
    $(".lightbox__close", box).addEventListener("click", close);
    $(".lightbox__nav--prev", box).addEventListener("click", (e) => { e.stopPropagation(); go(-1); });
    $(".lightbox__nav--next", box).addEventListener("click", (e) => { e.stopPropagation(); go(1); });
    box.addEventListener("click", (e) => { if (e.target === box) close(); });
    addEventListener("keydown", (e) => {
      if (!box.classList.contains("is-open")) return;
      if (e.key === "Escape") close(); if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1);
    });
  }

  /* ---------- dummy contact form (no backend) ---------- */
  const form = $("#contactForm");
  if (form) {
    const status = $("#formStatus"), btn = $("#submitBtn");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const d = Object.fromEntries(new FormData(form).entries());
      status.className = "form__status";
      if (!d.name || !d.email || !d.message) { status.textContent = "Please add your name, email and message."; return; }
      btn.disabled = true; btn.textContent = "Sending…";
      setTimeout(() => {
        status.textContent = `Thanks ${String(d.name).split(" ")[0]}! This is a demo form — we'll wire it up before launch. 🌱`;
        status.classList.add("is-ok");
        form.reset(); btn.disabled = false; btn.textContent = "Send my enquiry";
      }, 900);
    });
  }
})();
