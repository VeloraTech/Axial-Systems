if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);

  const heroSections = gsap.utils.toArray(".hero-section");
  const aboutSection = document.getElementById("about");
  const adSection = document.querySelector(".scene");
  const topBlinder = document.querySelector(".top-blinder");
  const bottomBlinder = document.querySelector(".bottom-blinder");
  const featureSteps = gsap.utils.toArray(".feature-step");
  const featureImages = gsap.utils.toArray(".feature-img");
  const journeyIntroText = document.querySelector(".journey-intro-text");

  heroSections.forEach((section) => {
    gsap.set(section, { opacity: 1, scale: 1 });

    const heroTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom center",
        scrub: true,
      },
    });

    heroTimeline
      .to(section, { duration: 0.5 })
      .to(section, { duration: 1 })
      .to(section, { duration: 0.5 });

    if (bottomBlinder) {
      heroTimeline.to(
        bottomBlinder,
        {
          height: "20vh",
          ease: "power4.out",
        },
        0,
      );
    }
  });

  if (aboutSection) {
    gsap.set(aboutSection, { opacity: 1, borderRadius: 90 });

    const aboutTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: aboutSection,
        start: "top bottom",
        end: "bottom center",
        scrub: true,
        // pin: true,
      },
    });

    aboutTimeline
      .to(aboutSection, {
        opacity: 1,
        scale: 0.935,
        background: "#222",
        borderRadius: 90,
        duration: 0.5,
      })
      .to(aboutSection, {
        opacity: 1,
        scale: 1,
        borderRadius: 0,
        background: "black",
        duration: 1,
      })
      .to(aboutSection, {
        opacity: 0,
        scale: 1,
        borderRadius: 90,
        background: "#222",
        duration: 0.5,
      });
  }

  if (journeyIntroText) {
    gsap.set(journeyIntroText, { opacity: 0, x: -50 });

    const journeyIntroTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: journeyIntroText,
        start: "top center",
        end: "bottom top",
        scrub: true,
        // pin: true,
      },
    });

    journeyIntroTimeline
      .to(journeyIntroText, {
        opacity: 0.3,
        x: -50,
        duration: 0.5,
      })
      .to(journeyIntroText, {
        opacity: 1,
        x: 0,
        duration: 1,
      })
      .to(journeyIntroText, {
        opacity: 0.3,
        duration: 0.5,
      });
  }

  featureSteps.forEach((step, i) => {
    gsap.set(step, { opacity: 0.3, y: 40 });

    const featureTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: step,
        start: "top center",
        end: "bottom center",
        scrub: true,
        onEnter: () => {
          featureImages.forEach((img) => img.classList.remove("active"));
          if (featureImages[i]) featureImages[i].classList.add("active");
        },
        onEnterBack: () => {
          featureImages.forEach((img) => img.classList.remove("active"));
          if (featureImages[i]) featureImages[i].classList.add("active");
        },
      },
    });

    featureTimeline.to(step, { opacity: 1, y: 0, duration: 1 });
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".scene",
      start: "top 4%",
      end: "top 70%",
      toggleActions: "play none none none",
    },
  });

  tl.to({}, { duration: 0.8 });

  if (topBlinder) {
    tl.to(topBlinder, {
      opacity: 0,
      height: 0,
    }).to(topBlinder, {
      opacity: 1,
      transform: "translateY(0)",
      height: "30vh",
    });
  }

  if (bottomBlinder) {
    tl.to(bottomBlinder, {
      height: "20vh",
      ease: "power4.out",
    });
  }

  tl.to(".text", {
    onStart: () => {
      const text = document.querySelector(".text");
      if (text) text.classList.add("active");
    },
  });

  ScrollTrigger.create({
    trigger: ".bg",
    start: "top top",
    end: "bottom bottom",
    onLeaveBack: () => {
      const bg = document.querySelector(".bg");
      if (bg) bg.classList.add("dark");
    },
  });
}

if (adSection) {
  gsap.to(adSection, {
    transform: "translateY(0)",
    opacity: 1,
    duration: 1.3,
    ease: "power3.out",
    scrollTrigger: {
      trigger: adSection,
      start: "top 80%",
      end: "+=800",
      scrub: true,
      toggleActions: "play none none none",
    },
  });
}
