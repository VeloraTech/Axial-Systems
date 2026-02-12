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
  const notifications = document.querySelectorAll(".notification");
  let index = 0;

  function showNotification() {
    const current = notifications[index];
    current.classList.add("active");

    setTimeout(() => {
      current.classList.remove("active");
      current.classList.add("exit");

      setTimeout(() => {
        current.classList.remove("exit");
        index = (index + 1) % notifications.length;
        showNotification();
      }, 600);
    }, 2500);
  }
  showNotification();
});
