const track = document.getElementById("track");
const items = document.querySelectorAll(".item");
let scrollPos = 0;
let animationFrameId = null;
let lastFrameTime = 0;
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

function animate(now) {
  if (!track || items.length === 0 || motionPreference.matches) {
    animationFrameId = null;
    return;
  }

  if (document.hidden) {
    animationFrameId = null;
    return;
  }

  const elapsed = lastFrameTime ? Math.min((now - lastFrameTime) / 1000, 0.05) : 0;
  lastFrameTime = now;
  scrollPos -= elapsed * 48;

  const itemsPerLoop = Math.floor(items.length / 3);
  const loopWidth = itemsPerLoop < items.length
    ? items[itemsPerLoop].offsetLeft - items[0].offsetLeft
    : track.scrollWidth;
  if (loopWidth > 0 && Math.abs(scrollPos) >= loopWidth) {
    scrollPos += loopWidth;
  }

  const centerX = window.innerWidth / 2;

  items.forEach((item) => {
    const rect = item.getBoundingClientRect();
    const itemCenter = rect.left + rect.width / 2;
    const distNormalized = (itemCenter - centerX) / centerX;
    const absDist = Math.abs(distNormalized);

    const scale = 0.75 + absDist * 0.45;
    const rotateY = distNormalized * -40;
    const translateY = absDist * -40;
    const translateZ = (1 - absDist) * -250;

    item.style.transform = `translate3d(${scrollPos}px, ${translateY}px, ${translateZ}px) scale(${scale}) rotateY(${rotateY}deg)`;
  });

  animationFrameId = requestAnimationFrame(animate);
}

function startCarousel() {
  if (!track || items.length === 0 || document.hidden || motionPreference.matches || animationFrameId) {
    return;
  }
  lastFrameTime = 0;
  animationFrameId = requestAnimationFrame(animate);
}

function stopCarousel() {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  animationFrameId = null;
  lastFrameTime = 0;
}

startCarousel();

document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopCarousel();
  else startCarousel();
});

const handleMotionPreference = () => {
  if (motionPreference.matches) stopCarousel();
  else startCarousel();
};

if (motionPreference.addEventListener) {
  motionPreference.addEventListener("change", handleMotionPreference);
} else if (motionPreference.addListener) {
  motionPreference.addListener(handleMotionPreference);
}

document.addEventListener("DOMContentLoaded", function () {
  let notifications = Array.from(document.querySelectorAll(".notification"));
  let index = 0;
  let rotationTimer = null;

  function cleanupClasses() {
    notifications.forEach((n) => n.classList.remove("active", "exit"));
  }

  function showNotification() {
    if (!notifications.length) return;
    cleanupClasses();
    if (index >= notifications.length) index = 0;

    const current = notifications[index];
    current.classList.add("active");

    clearTimeout(rotationTimer);
    rotationTimer = setTimeout(() => {
      current.classList.remove("active");
      current.classList.add("exit");

      rotationTimer = setTimeout(() => {
        current.classList.remove("exit");
        if (notifications.length) {
          index = (index + 1) % notifications.length;
          showNotification();
        }
      }, 600);
    }, 2500);
  }

  showNotification();

  const section = document.getElementById("about");
  const title = document.getElementById("title");
  const description = document.getElementById("description");
  const image = document.getElementById("image");
  const bgShape = document.querySelector(".bg-shape");
  const wipeTargets = Array.from(document.querySelectorAll(".wipe-reveal"));

  if (wipeTargets.length) {
    const wipeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      {
        threshold: 0.55,
      },
    );

    wipeTargets.forEach((target) => wipeObserver.observe(target));
  }

  const content = [
    {
      title: "Define YOur Goal",
      description: "Start by describing what youre building",
      image: "image1.jpg",
    },
    {
      title: "Ai breaks it down",
      description: "Taska and dependencies are generated automatically",
      image: "image2.jpg",
    },
    {
      title: "Workflow Exceutes",
      description: "  Ai monoitors proegress And updates status in real-time",
      image: "image3.jpg",
    },
  ];

  if (!section || !title || !description || !image) {
    return;
  }

  let currentIndex = 0;
  let scrollTicking = false;

  function updateAboutOnScroll() {
    const rect = section.getBoundingClientRect();
    const scrollRange = section.offsetHeight - window.innerHeight;
    const safeRange = scrollRange <= 0 ? 1 : scrollRange;

    let progress = -rect.top / safeRange;
    if (progress < 0) progress = 0;
    if (progress > 1) progress = 1;

    const segment = progress * (content.length - 1);
    const nextIndex = Math.floor(segment);
    const localProgress = segment - nextIndex;

    if (nextIndex !== currentIndex) {
      currentIndex = nextIndex;
      title.textContent = content[nextIndex].title;
      description.textContent = content[nextIndex].description;
      image.src = content[nextIndex].image;
    }

    title.style.opacity = 1 - localProgress;
    description.style.opacity = 1 - localProgress;
    image.style.opacity = 1 - localProgress;

    title.style.transform = `translateY(${localProgress * 40}px)`;
    description.style.transform = `translateY(${localProgress * 40}px)`;
    image.style.transform = `scale(${1 - localProgress * 0.05})`;

    if (bgShape) {
      bgShape.style.transform = `translateX(-50%) translateY(${progress * 150}px)`;
    }
  }

  window.addEventListener(
    "scroll",
    () => {
      if (scrollTicking) return;
      scrollTicking = true;
      requestAnimationFrame(() => {
        updateAboutOnScroll();
        scrollTicking = false;
      });
    },
    { passive: true },
  );

  updateAboutOnScroll();
});
