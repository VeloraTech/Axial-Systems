const track = document.getElementById("track");
const items = document.querySelectorAll(".item");
let scrollPos = 0;
let animationFrameId = null;

function animate() {
  if (!track || items.length === 0) {
    animationFrameId = null;
    return;
  }

  if (document.hidden) {
    animationFrameId = null;
    return;
  }

  scrollPos -= 1.2;

  const halfTrack = track.offsetWidth / 2;
  if (Math.abs(scrollPos) >= halfTrack) {
    scrollPos = 0;
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

    item.style.transform = `
      translateX(${scrollPos}px)
      translateY(${translateY}px)
      translateZ(${translateZ}px)
      scale(${scale})
      rotateY(${rotateY}deg)
    `;
  });

  animationFrameId = requestAnimationFrame(animate);
}

if (track && items.length) {
  animationFrameId = requestAnimationFrame(animate);
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden && animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
    return;
  }

  if (!document.hidden && !animationFrameId && track && items.length) {
    animationFrameId = requestAnimationFrame(animate);
  }
});

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
