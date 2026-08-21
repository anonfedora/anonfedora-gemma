(() => {
  const IMAGES = [
    "WhatsApp Image 2026-08-21 at 01.21.49.jpeg",
    "WhatsApp Image 2026-08-21 at 01.22.00.jpeg",
    "WhatsApp Image 2026-08-21 at 01.22.00 (1).jpeg",
    "WhatsApp Image 2026-08-21 at 01.22.03.jpeg",
    "WhatsApp Image 2026-08-21 at 01.22.06.jpeg",
    "WhatsApp Image 2026-08-21 at 01.22.07.jpeg",
    "WhatsApp Image 2026-08-21 at 01.22.08.jpeg",
    "WhatsApp Image 2026-08-21 at 01.22.09.jpeg",
    "WhatsApp Image 2026-08-21 at 01.22.16.jpeg",
    "WhatsApp Image 2026-08-21 at 01.22.27.jpeg",
    "WhatsApp Image 2026-08-21 at 01.22.38.jpeg",
    "WhatsApp Image 2026-08-21 at 01.23.50.jpeg",
    "WhatsApp Image 2026-08-21 at 01.23.53.jpeg",
    "WhatsApp Image 2026-08-21 at 01.24.05.jpeg",
    "WhatsApp Image 2026-08-21 at 01.24.12.jpeg",
    "WhatsApp Image 2026-08-21 at 01.24.13.jpeg",
    "WhatsApp Image 2026-08-21 at 01.24.13 (1).jpeg",
    "WhatsApp Image 2026-08-21 at 01.24.13 (2).jpeg",
    "WhatsApp Image 2026-08-21 at 01.24.14.jpeg",
    "WhatsApp Image 2026-08-21 at 01.24.14 (1).jpeg",
    "WhatsApp Image 2026-08-21 at 01.24.14 (2).jpeg",
    "WhatsApp Image 2026-08-21 at 01.24.15.jpeg",
    "WhatsApp Image 2026-08-21 at 01.24.31.jpeg",
    "WhatsApp Image 2026-08-21 at 01.24.33.jpeg",
    "WhatsApp Image 2026-08-21 at 01.24.35.jpeg",
    "WhatsApp Image 2026-08-21 at 01.24.36.jpeg",
    "WhatsApp Image 2026-08-21 at 01.24.36 (1).jpeg",
    "WhatsApp Image 2026-08-21 at 01.24.36 (2).jpeg",
    "WhatsApp Image 2026-08-21 at 01.24.37.jpeg",
    "WhatsApp Image 2026-08-21 at 01.24.37 (1).jpeg",
    "WhatsApp Image 2026-08-21 at 01.24.37 (2).jpeg",
    "WhatsApp Image 2026-08-21 at 01.24.37 (3).jpeg",
    "WhatsApp Image 2026-08-21 at 01.24.38.jpeg",
    "WhatsApp Image 2026-08-21 at 01.24.38 (1).jpeg",
    "WhatsApp Image 2026-08-21 at 01.24.38 (2).jpeg",
    "WhatsApp Image 2026-08-21 at 01.24.39.jpeg",
    "WhatsApp Image 2026-08-21 at 01.24.40.jpeg",
    "WhatsApp Image 2026-08-21 at 01.24.41.jpeg",
    "WhatsApp Image 2026-08-21 at 01.24.43.jpeg",
  ].map((name) => "assets/" + encodeURIComponent(name));

  const TRANSITION_MS = 500;
  const HOLD_MS = 2200;

  const carousel = document.getElementById("carousel");
  const slotA = carousel.querySelector(".slot-a");
  const slotB = carousel.querySelector(".slot-b");
  const dotsWrap = document.getElementById("dots");
  const counterNow = document.getElementById("counterNow");
  const counterTotal = document.getElementById("counterTotal");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  let index = 0;
  let activeSlot = slotA;
  let hiddenSlot = slotB;
  let timer = null;
  let animating = false;

  counterTotal.textContent = IMAGES.length;

  // build dots
  const dotEls = IMAGES.map((_, i) => {
    const d = document.createElement("span");
    d.className = "dot" + (i === 0 ? " active" : "");
    d.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(d);
    return d;
  });

  function preload(i) {
    const img = new Image();
    img.src = IMAGES[i];
  }

  function setSlide(el, i) {
    el.style.backgroundImage = `url("${IMAGES[i]}")`;
  }

  setSlide(activeSlot, 0);
  activeSlot.style.transition = "none";
  activeSlot.style.transform = "translateX(0%)";
  hiddenSlot.style.transition = "none";
  hiddenSlot.style.transform = "translateX(-100%)";
  preload(1);

  function updateUI() {
    counterNow.textContent = index + 1;
    dotEls.forEach((d, i) => d.classList.toggle("active", i === index));
    const active = dotEls[index];
    if (active) {
      const target = active.offsetLeft - dotsWrap.clientWidth / 2 + active.clientWidth / 2;
      dotsWrap.scrollTo({ left: target, behavior: "smooth" });
    }
  }

  function slide(newIndex, dir) {
    if (animating || newIndex === index) return;
    animating = true;

    const incomingFrom = dir === "next" ? "-100%" : "100%";
    const outgoingTo = dir === "next" ? "100%" : "-100%";

    setSlide(hiddenSlot, newIndex);
    hiddenSlot.style.transition = "none";
    hiddenSlot.style.transform = `translateX(${incomingFrom})`;

    // force reflow so the transition kicks in
    void hiddenSlot.offsetWidth;

    activeSlot.style.transition = `transform ${TRANSITION_MS}ms cubic-bezier(0.65,0,0.35,1)`;
    hiddenSlot.style.transition = `transform ${TRANSITION_MS}ms cubic-bezier(0.65,0,0.35,1)`;
    activeSlot.style.transform = `translateX(${outgoingTo})`;
    hiddenSlot.style.transform = "translateX(0%)";

    index = newIndex;
    updateUI();

    setTimeout(() => {
      const tmp = activeSlot;
      activeSlot = hiddenSlot;
      hiddenSlot = tmp;
      animating = false;
      preload((index + 1) % IMAGES.length);
    }, TRANSITION_MS);
  }

  function goTo(newIndex) {
    if (newIndex === index) return;
    const dir = newIndex > index || (index === IMAGES.length - 1 && newIndex === 0) ? "next" : "prev";
    slide(newIndex, dir);
    restartAutoplay();
  }

  function next() {
    slide((index + 1) % IMAGES.length, "next");
  }

  function prev() {
    slide((index - 1 + IMAGES.length) % IMAGES.length, "prev");
  }

  function restartAutoplay() {
    clearInterval(timer);
    timer = setInterval(next, HOLD_MS + TRANSITION_MS);
  }

  nextBtn.addEventListener("click", () => { next(); restartAutoplay(); });
  prevBtn.addEventListener("click", () => { prev(); restartAutoplay(); });

  carousel.addEventListener("mouseenter", () => clearInterval(timer));
  carousel.addEventListener("mouseleave", restartAutoplay);

  updateUI();
  restartAutoplay();
})();
