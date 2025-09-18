// assets/script.js
(function () {
  // ===== 导航：手机端菜单开关（保留原功能） =====
  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }

  // ===== 平移轮播：匹配 #carousel / #carouselInner 结构 =====
  const root = document.getElementById("carousel");
  const track = document.querySelector("#carouselInner") ||
                document.querySelector("#carousel .whitespace-nowrap");
  if (!root || !track) return;

  const slides = Array.from(track.querySelectorAll("img"));
  const dots = Array.from(root.querySelectorAll("[data-dot]"));
  const prev = root.querySelector("#prevBtn");
  const next = root.querySelector("#nextBtn");
  const total = slides.length;

  let index = 0;
  let timer = null;
  const INTERVAL = 4000;
  const SWIPE_THRESHOLD = 72; // 提高阈值，减少误触

  // 无障碍：更新小圆点状态
  function updateDots(active) {
    dots.forEach((d, i) => {
      const isActive = i === active;
      d.setAttribute("data-active", isActive ? "true" : "false");
      if (isActive) d.setAttribute("aria-current", "true");
      else d.removeAttribute("aria-current");
    });
  }

  // 平移到 i
  function go(i) {
    index = (i + total) % total;
    track.style.transform = `translateX(-${index * 100}%)`;
    updateDots(index);
  }

  function play() {
    stop();
    timer = setInterval(() => go(index + 1), INTERVAL);
  }
  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  // 点击小圆点
  dots.forEach((d, di) => {
    d.addEventListener("click", () => { go(di); play(); });
    d.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        go(di); play();
      }
    });
  });

  // 左右按钮
  prev && prev.addEventListener("click", () => { go(index - 1); play(); });
  next && next.addEventListener("click", () => { go(index + 1); play(); });

  // 悬停暂停 / 失焦暂停
  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", play);
  document.addEventListener("visibilitychange", () => {
    document.hidden ? stop() : play();
  });

  // 触摸滑动
  let sx = 0, dx = 0;
  track.addEventListener("touchstart", (e) => {
    stop();
    sx = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener("touchmove", (e) => {
    dx = e.touches[0].clientX - sx;
  }, { passive: true });

  track.addEventListener("touchend", () => {
    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      go(index + (dx < 0 ? 1 : -1));
    }
    dx = 0;
    play();
  });

  // 初始化：确保容器样式与首帧状态
  track.style.willChange = "transform";
  go(0);
  play();
})();
