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

const targetProgress = [0, 0, 0];
const currentProgress = [0, 0, 0];
const lerpFactor = 0.06; // Coefficiente di fluidità per lo scroll cinematico
let activeSceneIndex = 0;

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
        // Nessun lavoro pesante o aggiornamento diretto del video qui dentro
        targetProgress[index] = self.progress;
        if (self.isActive) {
          activeSceneIndex = index;
        }
      },
      onToggle: self => {
        if (self.isActive) {
          activeSceneIndex = index;
        }
      }
    });
  });
}

videos.forEach((video, index) => {
  createVideoScroll(video, index);
});

// Loop requestAnimationFrame per aggiornare i video e applicare le trasformazioni
function updateVideosLoop() {
  videos.forEach((video, index) => {
    // Interpolazione (lerp) tra il progresso corrente e quello target
    currentProgress[index] += (targetProgress[index] - currentProgress[index]) * lerpFactor;

    // Aggiornamento fluido del tempo corrente del video
    const time = currentProgress[index] * video.duration;
    if (!isNaN(time) && video.readyState >= 1) {
      video.currentTime = time;
    }

    // Applicazione delle trasformazioni di parallasse ed effetto cinematico
    if (index === activeSceneIndex) {
      const scale = 1.05 - (currentProgress[index] * 0.05); // Zoom-out cinematico
      const translateY = (currentProgress[index] - 0.5) * -15; // Leggera parallasse Y
      video.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
    } else {
      video.style.transform = "translate3d(0, 0, 0) scale(1)";
    }
  });

  setActiveScene(activeSceneIndex);

  requestAnimationFrame(updateVideosLoop);
}

// Avvio del loop di animazione
requestAnimationFrame(updateVideosLoop);

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

  // Visibile all'apertura della pagina
  navbar.classList.add("visible");

  function updateNavbar(mouseY) {
    const atTop = window.scrollY <= 10;
    const cursorInTopZone = mouseY !== null && mouseY <= 100;

    if (atTop || cursorInTopZone) {
      navbar.classList.add("visible");
    } else {
      navbar.classList.remove("visible");
    }
  }

  // Aggiorna alla scroll
  window.addEventListener("scroll", () => {
    updateNavbar(null);
  }, { passive: true });

  // Aggiorna al movimento del cursore
  document.addEventListener("mousemove", (e) => {
    updateNavbar(e.clientY);
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
