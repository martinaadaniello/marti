gsap.registerPlugin(ScrollTrigger);

const vid1 = document.getElementById('vid1');
const vid2 = document.getElementById('vid2');
const vid3 = document.getElementById('vid3');

[vid1, vid2, vid3].forEach(video => {
    video.pause();
    video.addEventListener('loadedmetadata', () => {
        video.currentTime = 0.01;
    });
});

gsap.set("#text-1a", { autoAlpha: 1, y: 0 });
gsap.set(["#text-1b", "#text-1c", "#text-2a", "#text-2b", "#text-3a"], { autoAlpha: 0, y: 30 });
gsap.set(["#vid2", "#vid3"], { autoAlpha: 0 });

function getDuration(video) {
    return new Promise(resolve => {
        if (video.readyState >= 1 && video.duration) {
            resolve(video.duration);
        } else {
            video.addEventListener('loadedmetadata', () => resolve(video.duration));
        }
    });
}

Promise.all([getDuration(vid1), getDuration(vid2), getDuration(vid3)]).then((durations) => {

    const d1 = (isNaN(durations[0]) || durations[0] === Infinity) ? 10 : durations[0];
    const d2 = (isNaN(durations[1]) || durations[1] === Infinity) ? 10 : durations[1];
    const d3 = (isNaN(durations[2]) || durations[2] === Infinity) ? 10 : durations[2];

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".scroll-container",
            start: "top top",
            end: "bottom bottom",
            scrub: 2, // Maximum smoothing to prevent video decoder frame drops
        }
    });

    let proxy = { v1: 0, v2: 0, v3: 0 };

    tl.addLabel("chap1")
      .to(proxy, {
          v1: d1 - 0.1, 
          duration: 4, 
          ease: "none",
          onUpdate: () => { vid1.currentTime = proxy.v1; }
      }, "chap1")
      .to("#text-1a", { autoAlpha: 0, y: -30, duration: 0.5 }, "chap1+=0.5")
      .to("#text-1b", { autoAlpha: 1, y: 0, duration: 0.5 }, "chap1+=1")
      .to("#text-1b", { autoAlpha: 0, y: -30, duration: 0.5 }, "chap1+=2.5")
      .to("#text-1c", { autoAlpha: 1, y: 0, duration: 0.5 }, "chap1+=3")

    tl.addLabel("cross1")
      .to("#text-1c", { autoAlpha: 0, y: -30, duration: 0.5 }, "cross1")
      .to(vid1, { autoAlpha: 0, duration: 1 }, "cross1")
      .to(vid2, { autoAlpha: 1, duration: 1 }, "cross1")
      .to("#text-2a", { autoAlpha: 1, y: 0, duration: 0.5 }, "cross1+=0.5")

    tl.addLabel("chap2")
      .to(proxy, {
          v2: d2 - 0.1, 
          duration: 4, 
          ease: "none",
          onUpdate: () => { vid2.currentTime = proxy.v2; }
      }, "chap2")
      .to("#text-2a", { autoAlpha: 0, y: -30, duration: 0.5 }, "chap2+=1")
      .to("#text-2b", { autoAlpha: 1, y: 0, duration: 0.5 }, "chap2+=2")

    tl.addLabel("cross2")
      .to("#text-2b", { autoAlpha: 0, y: -30, duration: 0.5 }, "cross2")
      .to(vid2, { autoAlpha: 0, duration: 1 }, "cross2")
      .to(vid3, { autoAlpha: 1, duration: 1 }, "cross2")
      .to("#text-3a", { autoAlpha: 1, y: 0, duration: 0.5 }, "cross2+=0.5")

    tl.addLabel("chap3")
      .to(proxy, {
          v3: d3 - 0.1, 
          duration: 4, 
          ease: "none",
          onUpdate: () => { vid3.currentTime = proxy.v3; }
      }, "chap3");

}).catch(err => {
    console.error("Error loading video metadata.", err);
});

document.getElementById('cta-btn').addEventListener('click', () => {
    alert('Thank you for exploring the Gisou Honey Universe.');
});
