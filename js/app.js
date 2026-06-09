/*
 * 主逻辑：
 *  1. 解析 URL 中的 ?spot=<id>；
 *  2. 命中则弹出该景点的介绍与图片；
 *  3. 关闭弹窗后展示全屏导览图 map.jpg。
 */
(function () {
  "use strict";

  var overlay = document.getElementById("popup-overlay");
  var gallery = document.getElementById("popup-gallery");
  var titleEl = document.getElementById("popup-title");
  var introEl = document.getElementById("popup-intro");
  var closeBtn = document.getElementById("popup-close");
  var viewMapBtn = document.getElementById("popup-view-map");
  var hint = document.getElementById("hint");
  var hotspotsEl = document.getElementById("hotspots");
  var popup = overlay.querySelector(".popup");
  var popupBody = overlay.querySelector(".popup-body");

  function getSpotId() {
    var params = new URLSearchParams(window.location.search);
    return params.get("spot");
  }

  function findSpot(id) {
    if (!id) return null;
    for (var i = 0; i < SPOTS.length; i++) {
      if (SPOTS[i].id === id) return SPOTS[i];
    }
    return null;
  }

  function renderPopup(spot) {
    // 图片
    gallery.innerHTML = "";
    (spot.images || []).forEach(function (src) {
      var img = document.createElement("img");
      img.src = src;
      img.alt = spot.name;
      img.loading = "lazy";
      gallery.appendChild(img);
    });
    gallery.style.display = (spot.images && spot.images.length) ? "flex" : "none";

    // 文字
    titleEl.textContent = spot.name;
    introEl.className = "popup-intro";
    introEl.innerHTML = "";
    var paras = Array.isArray(spot.intro) ? spot.intro : [spot.intro];
    paras.forEach(function (text) {
      var p = document.createElement("p");
      p.textContent = text;
      introEl.appendChild(p);
    });
  }

  function renderUnknown(id) {
    gallery.style.display = "none";
    titleEl.textContent = "未找到该景点";
    introEl.className = "popup-intro error";
    introEl.innerHTML = "";
    var p = document.createElement("p");
    p.textContent = '抱歉，没有找到编号为 "' + id + '" 的景点。请关闭后查看导览图，或重新扫码。';
    introEl.appendChild(p);
  }

  // 在地图上渲染可点击的圆形热点标记
  function renderHotspots() {
    if (!hotspotsEl) return;
    hotspotsEl.innerHTML = "";
    SPOTS.forEach(function (spot) {
      if (!spot.coords) return;
      var dot = document.createElement("button");
      dot.className = "hotspot";
      dot.style.left = spot.coords.x + "%";
      dot.style.top = spot.coords.y + "%";
      dot.title = spot.name;
      dot.setAttribute("aria-label", spot.name);
      dot.addEventListener("click", function () { showSpot(spot); });
      hotspotsEl.appendChild(dot);
    });
  }

  function showSpot(spot) {
    renderPopup(spot);
    openPopup();
  }

  function openPopup() {
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    popup.style.transform = "";   // 清除上次下滑遗留的位移
    if (popupBody) popupBody.scrollTop = 0;
  }

  function closePopup() {
    overlay.hidden = true;
    document.body.style.overflow = "";
    popup.style.transition = "";
    popup.style.transform = "";
    autoFadeHint();
    // 关闭后从地址栏移除 spot 参数，刷新/分享时直接看到地图
    if (window.history && window.history.replaceState) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }

  // 手机端：底部抽屉下滑关闭
  (function enableSwipeToClose() {
    var startX = 0, startY = 0, dy = 0, dragging = false, decided = false, owns = false;

    function isSheet() {
      return window.matchMedia("(max-width: 600px)").matches;
    }

    popup.addEventListener("touchstart", function (e) {
      if (!isSheet() || e.touches.length !== 1) return;
      // 内容已向下滚动时，优先让其滚动，不触发关闭
      var insideScrolled = popupBody && popupBody.contains(e.target) && popupBody.scrollTop > 0;
      if (insideScrolled) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      dy = 0; dragging = true; decided = false; owns = false;
      popup.style.transition = "none";
    }, { passive: true });

    popup.addEventListener("touchmove", function (e) {
      if (!dragging) return;
      var t = e.touches[0];
      var dx = t.clientX - startX;
      dy = t.clientY - startY;
      if (!decided) {
        decided = true;
        owns = dy > 0 && Math.abs(dy) > Math.abs(dx); // 主要为向下滑动
      }
      if (!owns) return;
      e.preventDefault();                 // 接管手势，阻止页面滚动
      popup.style.transform = "translateY(" + dy + "px)";
    }, { passive: false });

    function endDrag() {
      if (!dragging) return;
      dragging = false;
      popup.style.transition = "";
      if (owns && dy > 90) {
        closePopup();
      } else {
        popup.style.transform = "";
      }
    }
    popup.addEventListener("touchend", endDrag);
    popup.addEventListener("touchcancel", endDrag);
  })();

  function autoFadeHint() {
    if (!hint) return;
    hint.classList.remove("fade");
    setTimeout(function () { hint.classList.add("fade"); }, 4000);
  }

  // 事件绑定
  closeBtn.addEventListener("click", closePopup);
  viewMapBtn.addEventListener("click", closePopup);
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closePopup();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !overlay.hidden) closePopup();
  });

  // 启动
  renderHotspots();
  var id = getSpotId();
  if (id) {
    var spot = findSpot(id);
    if (spot) renderPopup(spot); else renderUnknown(id);
    openPopup();
  } else {
    autoFadeHint();
  }
})();
