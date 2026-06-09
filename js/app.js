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
  var stage = document.getElementById("map-stage");
  var pan = document.getElementById("map-pan");
  var mapImg = document.getElementById("map-image");

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

  /* ---------------- 地图自定义缩放 / 拖动 ----------------
   * 自己处理手势（不用浏览器原生缩放），从而：
   *  - 放大时地图铺开、圆点保持恒定屏幕大小（相对地图变小，不再挤满屏）；
   *  - 打开弹窗时把地图复位，弹窗始终以正常尺寸显示。
   */
  var mapZoom = (function () {
    var s = 1, tx = 0, ty = 0;
    var mapW = 0, mapH = 0, stageW = 0, stageH = 0, fitScale = 1;
    var MAX = 6;
    var dragged = false, dragFlagTimer = null;

    function localPoint(clientX, clientY) {
      var r = stage.getBoundingClientRect();
      return { x: clientX - r.left, y: clientY - r.top };
    }

    function measure() {
      stageW = stage.clientWidth;
      stageH = stage.clientHeight;
      var prev = pan.style.transform;
      pan.style.transform = "none";
      mapW = pan.offsetWidth;          // = 舞台宽度（width:100%）
      mapH = pan.offsetHeight;         // = 图片等比高度
      pan.style.transform = prev;
      // 适配整图可见：宽或高任一受限
      fitScale = Math.min(stageW / mapW, stageH / mapH) || 1;
    }

    function clampPan() {
      var dispW = mapW * s, dispH = mapH * s;
      tx = dispW <= stageW ? (stageW - dispW) / 2 : Math.min(0, Math.max(stageW - dispW, tx));
      ty = dispH <= stageH ? (stageH - dispH) / 2 : Math.min(0, Math.max(stageH - dispH, ty));
    }

    function apply() {
      clampPan();
      pan.style.transform = "translate(" + tx + "px," + ty + "px) scale(" + s + ")";
      hotspotsEl.style.setProperty("--inv", String(1 / s));
    }

    function setScaleAround(newS, px, py) {
      newS = Math.max(fitScale, Math.min(MAX, newS));
      var cx = (px - tx) / s, cy = (py - ty) / s;   // 焦点对应的内容坐标
      tx = px - cx * newS;
      ty = py - cy * newS;
      s = newS;
      apply();
    }

    function reset(animate) {
      if (!mapW) measure();
      if (animate) pan.style.transition = "transform 0.3s ease";
      else pan.style.transition = "none";
      s = fitScale;
      tx = (stageW - mapW * s) / 2;
      ty = (stageH - mapH * s) / 2;
      apply();
      if (animate) setTimeout(function () { pan.style.transition = "none"; }, 320);
    }

    // ---- 指针手势（鼠标 + 触摸统一） ----
    var pointers = {};
    var count = 0;
    var startX = 0, startY = 0, startTx = 0, startTy = 0;
    var startDist = 0, startMid = null, startS = 1;

    function pts() { return Object.keys(pointers).map(function (k) { return pointers[k]; }); }

    function onDown(e) {
      pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
      count++;
      pan.style.transition = "none";
      if (count === 1) {
        dragged = false;
        var p = localPoint(e.clientX, e.clientY);
        startX = p.x; startY = p.y; startTx = tx; startTy = ty;
      } else if (count === 2) {
        var a = pts()[0], b = pts()[1];
        startDist = Math.hypot(a.x - b.x, a.y - b.y) || 1;
        startMid = localPoint((a.x + b.x) / 2, (a.y + b.y) / 2);
        startTx = tx; startTy = ty; startS = s;
      }
    }

    function onMove(e) {
      if (!pointers[e.pointerId]) return;
      pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
      if (count === 1) {
        var p = localPoint(e.clientX, e.clientY);
        var dx = p.x - startX, dy = p.y - startY;
        if (Math.abs(dx) > 6 || Math.abs(dy) > 6) dragged = true;
        tx = startTx + dx; ty = startTy + dy;
        apply();
      } else if (count >= 2) {
        var a = pts()[0], b = pts()[1];
        var dist = Math.hypot(a.x - b.x, a.y - b.y) || 1;
        var mid = localPoint((a.x + b.x) / 2, (a.y + b.y) / 2);
        var newS = Math.max(fitScale, Math.min(MAX, startS * (dist / startDist)));
        // 以双指中点为焦点缩放
        var cx = (startMid.x - startTx) / startS, cy = (startMid.y - startTy) / startS;
        tx = mid.x - cx * newS;
        ty = mid.y - cy * newS;
        s = newS;
        dragged = true;
        apply();
      }
    }

    function onUp(e) {
      if (!pointers[e.pointerId]) return;
      delete pointers[e.pointerId];
      count = Math.max(0, count - 1);
      if (count === 1) {
        // 还剩一指，重置拖动基准，避免跳变
        var r = pts()[0];
        var p = localPoint(r.x, r.y);
        startX = p.x; startY = p.y; startTx = tx; startTy = ty;
      }
      if (count === 0 && dragged) {
        // 拖动/缩放刚结束，短暂屏蔽热点点击，避免误触
        if (dragFlagTimer) clearTimeout(dragFlagTimer);
        dragFlagTimer = setTimeout(function () { dragged = false; }, 60);
      }
    }

    stage.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    // 滚轮缩放（桌面）
    stage.addEventListener("wheel", function (e) {
      e.preventDefault();
      var p = localPoint(e.clientX, e.clientY);
      var factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
      pan.style.transition = "none";
      setScaleAround(s * factor, p.x, p.y);
    }, { passive: false });

    // 双击放大 / 复位
    stage.addEventListener("dblclick", function (e) {
      var p = localPoint(e.clientX, e.clientY);
      pan.style.transition = "transform 0.25s ease";
      if (s > fitScale * 1.2) reset(true);
      else setScaleAround(fitScale * 2.6, p.x, p.y);
      setTimeout(function () { pan.style.transition = "none"; }, 260);
    });

    // 尺寸 / 旋转变化时重新适配
    var rt = null;
    window.addEventListener("resize", function () {
      if (rt) clearTimeout(rt);
      rt = setTimeout(function () { measure(); reset(false); }, 150);
    });

    function init() { measure(); reset(false); }
    if (mapImg.complete && mapImg.naturalWidth) init();
    else mapImg.addEventListener("load", init);

    return {
      reset: reset,
      didDrag: function () { return dragged; }
    };
  })();

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
      dot.addEventListener("click", function () {
        if (mapZoom.didDrag()) return;   // 刚拖动/缩放过，忽略这次点击
        showSpot(spot);
      });
      hotspotsEl.appendChild(dot);
    });
  }

  function showSpot(spot) {
    renderPopup(spot);
    openPopup();
  }

  function openPopup() {
    mapZoom.reset(false);         // 复位地图缩放，弹窗以正常尺寸显示
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
