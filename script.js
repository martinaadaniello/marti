gsap.registerPlugin(ScrollTrigger);

const videos = [
  document.getElementById("vid1"),
  document.getElementById("vid2"),
  document.getElementById("vid3")
];

const texts = [
  document.getElementById("scene1"),
  document.getElementById("scene2"),
  document.getElementById("scene3")
];

videos.forEach((video, index) => {
  video.pause();
  video.preload = "auto";
  video.currentTime = 0;
  video.classList.toggle("active", index === 0);
});

texts.forEach((text, index) => {
  text.classList.toggle("active", index === 0);
});

function setActiveScene(index) {
  videos.forEach((video, i) => {
    video.classList.toggle("active", i === index);
  });

  texts.forEach((text, i) => {
    text.classList.toggle("active", i === index);
  });
}

function createVideoScroll(video, index) {
  video.addEventListener("loadedmetadata", () => {
    const sceneLength = window.innerHeight * 2;

    ScrollTrigger.create({
  trigger: ".scroll-container",
  start: "top top",
  end: () => `+=${window.innerHeight * 6}`,
  pin: ".sticky-section",
  pinSpacing: false,
  scrub: 1,
  invalidateOnRefresh: true
});

        setActiveScene(index);
      }
    });
  });
}

videos.forEach((video, index) => {
  createVideoScroll(video, index);
});

ScrollTrigger.create({
  trigger: ".scroll-container",
  start: "top top",
  end: () => `+=${window.innerHeight * 6}`,
  pin: ".sticky-section",
  scrub: 1,
  invalidateOnRefresh: true
});

document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("custom-navbar");

  if (!navbar) return;

  let mouseInsideNavbar = false;

  navbar.addEventListener("mouseenter", () => {
    mouseInsideNavbar = true;
    navbar.classList.add("visible");
  });

  navbar.addEventListener("mouseleave", () => {
    mouseInsideNavbar = false;
    navbar.classList.remove("visible");
  });

  document.addEventListener("mousemove", (e) => {
    if (e.clientY <= 50 || mouseInsideNavbar) {
      navbar.classList.add("visible");
    } else {
      navbar.classList.remove("visible");
    }
  });
});
