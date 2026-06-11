gsap.registerPlugin(ScrollTrigger);

const vid1 = document.getElementById("vid1");
const vid2 = document.getElementById("vid2");
const vid3 = document.getElementById("vid3");

const videos = [vid1, vid2, vid3];

videos.forEach(v => {
    v.pause();
    v.preload = "auto";
    v.currentTime = 0.01;
});

// iOS Mobile Unlocker: Browsers block programmatic video control until a user interacts with the page.
let isUnlocked = false;
function unlockVideos() {
    if (isUnlocked) return;
    videos.forEach(v => {
        const p = v.play();
        if (p !== undefined) {
            p.then(() => { v.pause(); }).catch(() => {});
        }
    });
    isUnlocked = true;
    window.removeEventListener('touchstart', unlockVideos);
    window.removeEventListener('click', unlockVideos);
}
window.addEventListener('touchstart', unlockVideos);
window.addEventListener('click', unlockVideos);

// helper: set time synchronously. GSAP already runs inside requestAnimationFrame!
function setVideoTime(video, time) {
    if (!isNaN(time) && video.readyState >= 1) {
        video.currentTime = time;
    }
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