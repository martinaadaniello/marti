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
      start: () => `top top-=${index * sceneLength}`,
      end: () => `top top-=${(index + 1) * sceneLength}`,
      scrub: 1,
      invalidateOnRefresh: true,

      onUpdate: self => {
        const time = self.progress * video.duration;

        if (!isNaN(time) && video.readyState >= 1) {
          video.currentTime = time;
        }

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
  end: () => `+=${window.innerHeight * 7}`,
  pin: ".sticky-section",
  pinSpacing: false,
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

const buyBtn = document.getElementById("floating-buy-btn");

if (buyBtn) {

  document.addEventListener("mousemove", (e) => {

    if (e.clientY >= window.innerHeight * 0.7) {
      buyBtn.classList.add("visible");
    } else {
      buyBtn.classList.remove("visible");
    }

  });

  buyBtn.addEventListener("click", (e) => {

    e.preventDefault();

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct = cart.find(
      item => item.name === "Honey Gloss"
    );

    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cart.push({
        name: "Honey Gloss",
        price: 28,
        quantity: 1
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    window.location.href = "cart.html";

  });

}
