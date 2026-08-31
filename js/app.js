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
  var speakBtn = document.getElementById("popup-speak");
  var hint = document.getElementById("hint");
  var hotspotsEl = document.getElementById("hotspots");
  var popup = overlay.querySelector(".popup");
  var popupBody = overlay.querySelector(".popup-body");
  var stage = document.getElementById("map-stage");
  var pan = document.getElementById("map-pan");
  var mapImg = document.getElementById("map-image");
  var canSpeak = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  var currentSpeechText = "";
  var currentUtterance = null;
  var speechActive = false;
  var preferredVoice = null;
  var preferredMandarinVoices = [
    "Siri",
    "Microsoft Xiaoxiao Online",
    "Microsoft Xiaoxiao",
    "Xiaoxiao",
    "Microsoft Yunxi Online",
    "Microsoft Yunxi",
    "Yunxi",
    "Microsoft Xiaoyi Online",
    "Microsoft Xiaoyi",
    "Xiaoyi",
    "Ting-Ting",
    "Tingting"
  ];

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
    stopSpeech();

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
    currentSpeechText = buildSpeechText(spot.name, paras);
    updateSpeakButton(false);
  }

  function renderUnknown(id) {
    stopSpeech();
    gallery.style.display = "none";
    titleEl.textContent = "未找到该景点";
    introEl.className = "popup-intro error";
    introEl.innerHTML = "";
    var p = document.createElement("p");
    p.textContent = '抱歉，没有找到编号为 "' + id + '" 的景点。请关闭后查看导览图，或重新扫码。';
    introEl.appendChild(p);
    currentSpeechText = "";
    updateSpeakButton(false);
  }

  function buildSpeechText(name, paras) {
    var parts = [name].concat(paras.filter(Boolean));
    return parts.join("。")
      .replace(/[“”]/g, "")
      .replace(/[·]/g, "")
      .replace(/[；;]+/g, "，")
      .replace(/[。！？!?]+/g, "。")
      .replace(/\s+/g, "")
      .replace(/。+/g, "。");
  }

  function scoreVoice(voice) {
    var lang = (voice.lang || "").replace("_", "-").toLowerCase();
    var name = (voice.name || "").toLowerCase();
    var score = 0;
    preferredMandarinVoices.forEach(function (preferredName, index) {
      if (name.indexOf(preferredName.toLowerCase()) !== -1) score += 120 - index * 6;
    });
    if (lang === "zh-cn" || lang === "cmn-cn" || lang === "zh-hans-cn") score += 80;
    else if (lang.indexOf("zh") === 0 || lang.indexOf("cmn") === 0) score += 45;
    if (/xiaoxiao|xiaoyi|xiaobei|xiaoni|yunxi|yunjian|ting-ting|tingting|mei-jia|meijia|siri/i.test(name)) score += 30;
    if (/premium|enhanced|natural|neural|online/i.test(name)) score += 20;
    if (/hong|cantonese|yue|taiwan|hk|tw/i.test(name + " " + lang)) score -= 25;
    if (voice.localService) score += 4;
    return score;
  }

  function pickChineseVoice() {
    if (!canSpeak) return null;
    var voices = window.speechSynthesis.getVoices();
    var best = null;
    var bestScore = -Infinity;
    for (var i = 0; i < voices.length; i++) {
      var score = scoreVoice(voices[i]);
      if (score > bestScore) {
        best = voices[i];
        bestScore = score;
      }
    }
    preferredVoice = bestScore > 0 ? best : null;
    return preferredVoice;
  }

  function updateSpeakButton(isSpeaking) {
    if (!speakBtn) return;
    speakBtn.disabled = !canSpeak || !currentSpeechText;
    speakBtn.textContent = isSpeaking ? "停止" : "朗读";
    speakBtn.classList.toggle("is-speaking", !!isSpeaking);
    speakBtn.setAttribute("aria-pressed", isSpeaking ? "true" : "false");
    speakBtn.setAttribute("aria-label", isSpeaking ? "停止朗读景点介绍" : "朗读景点介绍");
  }

  function stopSpeech() {
    if (!canSpeak) return;
    speechActive = false;
    currentUtterance = null;
    window.speechSynthesis.cancel();
    updateSpeakButton(false);
  }

  function speakCurrentSpot() {
    if (!canSpeak || !currentSpeechText) return;
    if (speechActive) {
      stopSpeech();
      return;
    }

    window.speechSynthesis.cancel();
    var utterance = new SpeechSynthesisUtterance(currentSpeechText);
    utterance.lang = "zh-CN";
    utterance.rate = 1.22;
    utterance.pitch = 1.03;
    utterance.volume = 1;
    utterance.voice = preferredVoice || pickChineseVoice();
    currentUtterance = utterance;
    speechActive = true;
    updateSpeakButton(true);

    utterance.onstart = function () {
      if (currentUtterance === utterance) {
        speechActive = true;
        updateSpeakButton(true);
      }
    };
    utterance.onend = function () {
      if (currentUtterance === utterance) {
        speechActive = false;
        currentUtterance = null;
        updateSpeakButton(false);
      }
    };
    utterance.onerror = utterance.onend;
    window.speechSynthesis.speak(utterance);
  }

  /* ---------------- 地图自定义缩放 / 拖动 ----------------
   * 自己处理手势（不用浏览器原生缩放），从而：
   *  - 放大时地图铺开、圆点保持恒定屏幕大小（相对地图变小，不再挤满屏）；
   *  - 打开弹窗时把地图复位，弹窗始终以正常尺寸显示。
   */
  var mapZoom = (function () {
    var s = 1, tx = 0, ty = 0;
    var mapW = 0, mapH = 0, stageW = 0, stageH = 0, fitScale = 1;
    var MAX = 1.6;
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
      if (mapImg.naturalWidth) {
        pan.style.width = mapImg.naturalWidth + "px";
      }
      mapW = pan.offsetWidth;          // 使用原图像素宽度，放大时文字更清晰
      mapH = pan.offsetHeight;         // 图片等比高度
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

    function isMobileView() {
      return window.matchMedia("(max-width: 600px)").matches;
    }

    function setView(animate, nextScale, focusX, focusY) {
      if (!mapW) measure();
      if (animate) pan.style.transition = "transform 0.3s ease";
      else pan.style.transition = "none";
      s = Math.max(fitScale, Math.min(MAX, nextScale));
      tx = stageW / 2 - mapW * focusX * s;
      ty = stageH / 2 - mapH * focusY * s;
      apply();
      if (animate) setTimeout(function () { pan.style.transition = "none"; }, 320);
    }

    function reset(animate) {
      setView(animate, fitScale, 0.5, 0.5);
    }

    function resetToStart(animate) {
      if (!mapW) measure();
      if (!isMobileView()) {
        reset(animate);
        return;
      }
      // 手机默认聚焦左侧茶园主体；用户仍可双指缩小到整张导览图。
      var mobileScale = Math.max(fitScale, stageH / (mapH * 0.82));
      setView(animate, mobileScale, 0.37, 0.56);
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
      if (s > fitScale * 1.2) resetToStart(true);
      else setScaleAround(fitScale * 2.6, p.x, p.y);
      setTimeout(function () { pan.style.transition = "none"; }, 260);
    });

    // 尺寸 / 旋转变化时重新适配
    var rt = null;
    window.addEventListener("resize", function () {
      if (rt) clearTimeout(rt);
      rt = setTimeout(function () { measure(); resetToStart(false); }, 150);
    });

    function init() { measure(); resetToStart(false); }
    if (mapImg.complete && mapImg.naturalWidth) init();
    else mapImg.addEventListener("load", init);

    return {
      reset: reset,
      resetToStart: resetToStart,
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
    mapZoom.resetToStart(false);
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    popup.style.transform = "";   // 清除上次下滑遗留的位移
    if (popupBody) popupBody.scrollTop = 0;
  }

  function closePopup() {
    stopSpeech();
    overlay.hidden = true;
    document.body.style.overflow = "";
    popup.style.transition = "";
    popup.style.transform = "";
    mapZoom.resetToStart(false);
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
  if (canSpeak) {
    pickChineseVoice();
    window.speechSynthesis.onvoiceschanged = pickChineseVoice;
  }
  closeBtn.addEventListener("click", closePopup);
  if (speakBtn) speakBtn.addEventListener("click", speakCurrentSpot);
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
