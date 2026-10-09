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
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

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

    if (!prefersReducedMotion) {
      const heroStage = section.querySelector(".stage");
      const heroCopy = section.querySelector(".hero-text");
      if (heroStage) {
        gsap.fromTo(
          heroStage,
          { scale: 1, y: 0 },
          {
            scale: 1.14,
            y: -24,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "center top",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          },
        );
        gsap.to(heroStage, {
          scale: 0.88,
          y: -68,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "center top",
            end: "bottom top",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
      }
      if (heroCopy) {
        gsap.to(heroCopy, {
          y: -36,
          autoAlpha: 0.45,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "center top",
            end: "bottom top",
            scrub: 0.7,
          },
        });
      }
    }

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

  if (aboutSection && !prefersReducedMotion) {
    gsap.set(aboutSection, { opacity: 1, borderRadius: 90 });

    const aboutTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: aboutSection,
        start: "top bottom",
        end: "bottom center",
        scrub: 0.65,
        // pin: true,
      },
    });

    aboutTimeline
      .to(aboutSection, {
        opacity: 1,
        scale: 0.95,
        // background: "#222",
        borderRadius: 90,
        duration: 0.5,
        background: "#292a28",
      })
      .to(aboutSection, {
        opacity: 1,
        scale: 1,
        borderRadius: 0,
        // background: "#222",
        duration: 1,
        background: "#171817",
      })
      .to(aboutSection, {
        opacity: 1,
        // scale: 0.,
        // borderRadius: 9,
        // background: "#222",
        duration: 0.5,
        background: "#171817",
      });
  }

  if (journeyIntroText && !prefersReducedMotion) {
    gsap.fromTo(
      journeyIntroText,
      { autoAlpha: 0, y: 24 },
      {
        autoAlpha: 1,
        y: 0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: journeyIntroText,
          start: "top 88%",
          end: "top 56%",
          scrub: 0.55,
          invalidateOnRefresh: true,
        },
      },
    );
  }

  const taskExample = document.querySelector(".task-example");
  if (taskExample && !prefersReducedMotion) {
    gsap.fromTo(
      taskExample,
      { autoAlpha: 0, x: 90, y: 35, rotateY: -14, scale: 0.88 },
      {
        autoAlpha: 1,
        x: 0,
        y: 0,
        rotateY: -4,
        scale: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: taskExample,
          start: "top 82%",
          end: "top 38%",
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      },
    );
  }

  const principleRows = gsap.utils.toArray(".principle-row");
  principleRows.forEach((row, index) => {
    if (prefersReducedMotion) return;
    gsap.fromTo(
      row,
      { autoAlpha: 0.2, x: -55, rotateY: 8 },
      {
        autoAlpha: 1,
        x: 0,
        rotateY: 0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: row,
          start: "top 84%",
          end: "top 54%",
          scrub: 0.65,
          invalidateOnRefresh: true,
        },
        delay: index * 0.04,
      },
    );
  });

  featureSteps.forEach((step, i) => {
    if (prefersReducedMotion) return;
    gsap.set(step, { opacity: 0.3, y: 40 });

    const featureTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: step,
        start: "top center",
        end: "bottom center",
        scrub: 0.55,
        invalidateOnRefresh: true,
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

  // Pinned journey section with scrubbed timeline (no progress bar dependency)
  const journeySection = document.querySelector(".journey-section");
  const journeyCards = gsap.utils.toArray(".journey-card");

  if (journeySection && journeyCards.length) {
    const journeyMotion = gsap.matchMedia();

    journeyMotion.add(
      "(min-width: 701px) and (prefers-reduced-motion: no-preference)",
      () => {
        gsap.set(journeyCards, { autoAlpha: 0, y: 22 });

        const journeyTL = gsap.timeline({
          scrollTrigger: {
            trigger: journeySection,
            start: "top top",
            end: "+=1650",
            scrub: 0.65,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        journeyCards.forEach((card, i) => {
          journeyTL.to(
            card,
            { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" },
            i * 0.35,
          );
        });
      },
    );
  }
}

const adSectionReveal = document.querySelector(".scene");

if (
  adSectionReveal &&
  typeof gsap !== "undefined" &&
  typeof ScrollTrigger !== "undefined"
) {
  gsap.to(adSectionReveal, {
    transform: "translateY(0)",
    opacity: 1,
    duration: 1.3,
    ease: "power3.out",
    scrollTrigger: {
      trigger: adSectionReveal,
      start: "top 80%",
      end: "+=800",
      scrub: true,
      toggleActions: "play none none none",
    },
  });
}
