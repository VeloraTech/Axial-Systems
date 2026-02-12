const track = document.getElementById("track");
const items = document.querySelectorAll(".item");
let scrollPos = 0;

function animate() {
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

    // 1. INVERSE SCALE (Shrink center, grow edges)
    const scale = 0.75 + absDist * 0.45;

    // 2. ROTATION Y (Face the center)
    const rotateY = distNormalized * -40;

    // 3. ROTATION X (Forward lean at edges)
    const rotateX = absDist * 12;

    // 4. TRANSLATE Y (The Top Curve/Dip)
    const translateY = absDist * -40;

    // 5. TRANSLATE Z (Receding depth)
    const translateZ = (1 - absDist) * -250;

    item.style.transform = `
                    translateX(${scrollPos}px)
                    translateY(${translateY}px)
                    translateZ(${translateZ}px)
                    scale(${scale})
                    rotateY(${rotateY}deg)
                `;
  });

  requestAnimationFrame(animate);
}

animate();

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
        // If element still exists, keep it; else it was removed by user.
        if (notifications.length) {
          index = (index + 1) % notifications.length;
          showNotification();
        }
      }, 600);
    }, 2500);
  }

  // Close button handling
  function removeNotificationElement(el) {
    const removeIdx = notifications.indexOf(el);
    if (removeIdx === -1) return;

    // Animate exit then remove from DOM and array
    el.classList.remove("active");
    el.classList.add("exit");

    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
      // remove from array
      notifications.splice(removeIdx, 1);
      // adjust index
      if (removeIdx < index) index = Math.max(0, index - 1);
      if (index >= notifications.length) index = 0;
      // restart rotation
      clearTimeout(rotationTimer);
      showNotification();
    }, 300);
  }

  document.querySelectorAll(".close-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const parent = e.currentTarget.closest(".notification");
      if (!parent) return;
      removeNotificationElement(parent);
    });
  });

  showNotification();
});
