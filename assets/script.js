// assets/script.js
(function () {
  function initFadeCarousel(root, { interval = 4000 } = {}) {
    if (!root) return;
    const slides = Array.from(root.querySelectorAll("img"));
    if (slides.length === 0) return;

    let i = 0, timer = null;

    function show(idx) {
      i = (idx + slides.length) % slides.length;
      slides.forEach((img, k) => {
        img.style.opacity = k === i ? "1" : "0";
        img.style.transition = "opacity 1000ms"; // 保底，避免样式被覆盖
        img.style.position = "absolute";
        img.style.inset = "0";
        img.style.width = "100%";
      });
    }

    function play() {
      stop();
      timer = setInterval(() => show(i + 1), interval);
    }
    function stop() {
      if (timer) clearInterval(timer);
      timer = null;
    }

    // 悬停暂停
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", play);

    // 页面失焦暂停、回焦继续
    document.addEventListener("visibilitychange", () => {
      document.hidden ? stop() : play();
    });

    // 初始化
    root.style.position = "relative"; // 保障绝对定位基准
    show(0);
    play();
  }

  // 页面就绪后初始化（如果以后有多个轮播，可都加上类名来批量初始化）
  window.addEventListener("DOMContentLoaded", () => {
    const el = document.getElementById("fadeCarousel");
    initFadeCarousel(el, { interval: 4000 });
  });
})();
