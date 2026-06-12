gsap.registerPlugin(ScrollTrigger);

const vid1 = document.getElementById("vid1");
const vid2 = document.getElementById("vid2");
const vid3 = document.getElementById("vid3");

const videos = [vid1, vid2, vid3];
const texts = [
  document.getElementById("scene1"),
  document.getElementById("scene2"),
  document.getElementById("scene3")
];

videos.forEach((v, i) => {
  v.pause();
  v.preload = "auto";
  v.currentTime = 0;

  v.style.opacity = i === 0 ? "1" : "0";
});

texts.forEach((t, i) => {
  t.style.opacity = i === 0 ? "1" : "0";
  t.style.pointerEvents = i === 0 ? "auto" : "none";
});

let isUnlocked = false;

function unlockVideos() {
  if (isUnlocked) return;

  videos.forEach(v => {
    const p = v.play();
    if (p !== undefined) {
      p.then(() => {
        v.pause();
        v.currentTime = 0;
      }).catch(() => {});
    }
  });

  isUnlocked = true;
  window.removeEventListener("touchstart", unlockVideos);
  window.removeEventListener("click", unlockVideos);
}

window.addEventListener("touchstart", unlockVideos);
window.addEventListener("click", unlockVideos);

function setActiveScene(index) {
  videos.forEach((video, i) => {
    video.style.opacity = i === index ? "1" : "0";
  });

  texts.forEach((text, i) => {
    text.style.opacity = i === index ? "1" : "0";
    text.style.pointerEvents = i === index ? "auto" : "none";
  });
}

function createVideoScroll(video, index) {
  video.addEventListener("loadedmetadata", () => {
    const sceneLength = window.innerHeight * 2;

    ScrollTrigger.create({
      trigger: ".scroll-container",
      start: () => `top top-=${index * sceneLength}`,
      end: () => `top top-=${(index + 1) * sceneLength}`,
      scrub: true,
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
  end: () => `+=${window.innerHeight * 6}`,
  pin: ".sticky-section",
  scrub: true,
  invalidateOnRefresh: true
});
}

const tl = gsap.timeline({
    scrollTrigger: {
        trigger: ".scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5, // 🔥 IMPORTANT: 'true' causes stuttering because it tracks rigid mouse wheel clicks. 1.5 adds smooth momentum!
        onUpdate: (self) => {

            const p = self.progress;

            // ---------------- VID1 ----------------
            if (p < 0.33) {
                if (vid1.paused === false) vid1.pause();
                vid1.style.opacity = 1;
                vid2.style.opacity = 0;
                vid3.style.opacity = 0;

                setVideoTime(vid1, vid1.duration * (p / 0.33));
            }

            // ---------------- VID2 ----------------
            else if (p < 0.66) {
                vid1.style.opacity = 0;
                vid2.style.opacity = 1;
                vid3.style.opacity = 0;

                setVideoTime(vid2, vid2.duration * ((p - 0.33) / 0.33));
            }

            // ---------------- VID3 ----------------
            else {
                vid1.style.opacity = 0;
                vid2.style.opacity = 0;
                vid3.style.opacity = 1;

                setVideoTime(vid3, vid3.duration * ((p - 0.66) / 0.34));
            }
        }
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('custom-navbar');

    if (!navbar) return;

    let hoveringNavbar = false;

    navbar.addEventListener('mouseenter', () => {
        hoveringNavbar = true;
    });

    navbar.addEventListener('mouseleave', () => {
        hoveringNavbar = false;
    });

    document.addEventListener('mousemove', (e) => {
        if (e.clientY < 80 || hoveringNavbar) {
            navbar.classList.add('visible');
        } else {
            navbar.classList.remove('visible');
        }
    });
});
/* ==========================================
   CARTIER HOVER NAVBAR
========================================== */

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

        if (e.clientY <= 50) {
            navbar.classList.add("visible");
        } else if (!mouseInsideNavbar) {
            navbar.classList.remove("visible");
        }

    });

});
