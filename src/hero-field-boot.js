(function () {
  var COUNT = 3500;
  var CAMERA_Z = 900;
  var TAN_HALF = Math.tan((75 * Math.PI) / 180 / 2);
  var DOT = 2.8;

  function ease(t) {
    return 1 - (1 - t) ** 3;
  }

  function band() {
    if (window.matchMedia("(max-width: 767px)").matches) return { inner: 180, outer: 320 };
    var compact = window.matchMedia("(max-width: 1599px)").matches;
    return compact ? { inner: 480, outer: 700 } : { inner: 350, outer: 610 };
  }

  function createParticles(inner, outer, settled) {
    var particles = [];
    var span = outer * 4;
    for (var index = 0; index < COUNT; index++) {
      var theta = Math.random() * Math.PI * 2;
      var radius = inner + Math.random() ** 2.5 * (outer - inner);
      var depth = (2 * Math.random() - 1) ** 4 * 100;
      var homeX = Math.cos(theta) * radius;
      var homeY = Math.sin(theta) * radius;
      particles.push({
        theta: theta,
        r: radius,
        speed: 0.0001 + Math.random() * 0.0003,
        homeX: homeX,
        homeY: homeY,
        homeZ: depth,
        fromX: settled ? homeX : (Math.random() - 0.5) * span,
        fromY: settled ? homeY : (Math.random() - 0.5) * span,
        fromZ: settled ? depth : (Math.random() - 0.5) * 1000,
        progress: settled ? 1 : 0,
        flyX: (Math.random() - 0.5) * span,
        flyY: (Math.random() - 0.5) * span,
        flyZ: (Math.random() - 0.5) * 1000,
        flyProgress: 0,
        flyBack: 0,
        offsetX: 0,
        offsetY: 0,
        offsetZ: 0,
      });
    }
    return particles;
  }

  function boot(canvas) {
    if (!canvas || canvas.__hero) return null;
    var context = canvas.getContext("2d");
    if (!context) return null;

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var finePointer = window.matchMedia("(min-width: 769px)").matches;
    var limits = band();
    var inner = limits.inner;
    var outer = limits.outer;
    var particles = createParticles(inner, outer, reduce);
    var flyOut = false;
    var pixelRatio = 1;
    var state = { alive: true, frame: 0 };
    var started = performance.now();
    var last = started;
    var pointer = { x: 0, y: 0, time: last, speed: 0 };
    canvas.__hero = state;

    function resize() {
      var rect = canvas.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      var nextWidth = Math.max(1, Math.round(rect.width * pixelRatio));
      var nextHeight = Math.max(1, Math.round(rect.height * pixelRatio));
      if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
        canvas.width = nextWidth;
        canvas.height = nextHeight;
      }
      var next = band();
      if (next.inner !== inner || next.outer !== outer) {
        inner = next.inner;
        outer = next.outer;
        particles = createParticles(inner, outer, reduce || performance.now() - started > 2800);
      }
    }

    var resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    var visibility = new IntersectionObserver(
      function (entries) {
        flyOut = !entries[0].isIntersecting;
      },
      { threshold: 0.45 },
    );
    visibility.observe(canvas);

    function onMove(event) {
      if (!finePointer) return;
      var now = performance.now();
      var dt = now - pointer.time || 16;
      var traveled = Math.hypot(event.clientX - pointer.x, event.clientY - pointer.y);
      pointer.speed = pointer.speed * 0.8 + (traveled / dt) * 0.2;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.time = now;

      var rect = canvas.getBoundingClientRect();
      var nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      var ny = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      var worldX = nx * TAN_HALF * (rect.width / rect.height) * CAMERA_Z;
      var worldY = ny * TAN_HALF * CAMERA_Z;
      var strength = Math.min(pointer.speed, 1);
      var reach = 20 + 80 * strength;
      var force = 0.25 + 0.25 * strength;

      for (var i = 0; i < particles.length; i++) {
        var particle = particles[i];
        var dxHome = particle.homeX - worldX;
        var dyHome = particle.homeY - worldY;
        var dzHome = particle.homeZ;
        var distance = Math.hypot(dxHome, dyHome, dzHome);
        if (distance <= 0 || distance >= reach) continue;
        var push = (reach - distance) * force * (0.8 + 0.4 * Math.random());
        var side = 0.5 + 0.8 * Math.max(0, particle.homeY / outer);
        var nextX = particle.homeX + particle.offsetX + (dxHome / distance) * push * side;
        var nextY = particle.homeY + particle.offsetY + (dyHome / distance) * push;
        var radius = Math.hypot(nextX, nextY);
        if (radius < inner && radius > 0) {
          var fit = inner / radius;
          particle.offsetX = nextX * fit - particle.homeX;
          particle.offsetY = nextY * fit - particle.homeY;
        } else {
          particle.offsetX += (dxHome / distance) * push * side;
          particle.offsetY += (dyHome / distance) * push;
        }
        particle.offsetZ += (dzHome / distance) * push;
      }
    }
    window.addEventListener("mousemove", onMove);

    function draw(now) {
      if (!state.alive) return;
      var dt = Math.min(48, now - last);
      last = now;
      var frames = dt / 16.67;
      var width = canvas.width;
      var height = canvas.height;
      context.clearRect(0, 0, width, height);
      context.fillStyle = "#b2c7eb";
      canvas.style.opacity = reduce ? "1" : String(Math.min(1, (now - started) / 1000));
      context.beginPath();

      for (var i = 0; i < particles.length; i++) {
        var particle = particles[i];
        var x;
        var y;
        var z;

        if (!reduce && flyOut) {
          particle.flyProgress = Math.min(1, particle.flyProgress + 0.02 * frames);
          particle.flyBack = 0;
          var away = ease(particle.flyProgress);
          x = particle.homeX + (particle.flyX - particle.homeX) * away;
          y = particle.homeY + (particle.flyY - particle.homeY) * away;
          z = particle.homeZ + (particle.flyZ - particle.homeZ) * away;
        } else if (!reduce && particle.flyProgress > 0) {
          if (particle.flyProgress >= 1) {
            particle.flyProgress = 0.99;
            particle.flyBack = 0;
          }
          particle.flyBack = Math.min(1, particle.flyBack + 0.006 * frames);
          var back = ease(particle.flyBack);
          x = particle.flyX + (particle.homeX - particle.flyX) * back;
          y = particle.flyY + (particle.homeY - particle.flyY) * back;
          z = particle.flyZ + (particle.homeZ - particle.flyZ) * back;
          if (particle.flyBack === 1) particle.flyProgress = 0;
        } else if (!reduce && particle.progress < 1) {
          particle.flyProgress = 0;
          particle.progress = Math.min(1, particle.progress + 0.006 * frames);
          var gather = ease(particle.progress);
          x = particle.fromX + (particle.homeX - particle.fromX) * gather;
          y = particle.fromY + (particle.homeY - particle.fromY) * gather;
          z = particle.fromZ + (particle.homeZ - particle.fromZ) * gather;
        } else {
          var settle = 1 - 0.92 ** frames;
          particle.offsetX += (0 - particle.offsetX) * settle;
          particle.offsetY += (0 - particle.offsetY) * settle;
          particle.offsetZ += (0 - particle.offsetZ) * settle;
          if (!reduce) {
            particle.theta -= particle.speed * frames;
            particle.homeX = Math.cos(particle.theta) * particle.r;
            particle.homeY = Math.sin(particle.theta) * particle.r;
          }
          x = particle.homeX + particle.offsetX;
          y = particle.homeY + particle.offsetY;
          z = particle.homeZ + particle.offsetZ;
        }

        var depth = CAMERA_Z - z;
        if (depth <= 1) continue;
        var scale = height / 2 / (depth * TAN_HALF);
        var sx = width / 2 + x * scale;
        var sy = height / 2 - y * scale;
        var dot = (DOT * scale) / 2;
        if (dot < 0.45) dot = 0.45;
        if (sx < -dot || sy < -dot || sx > width + dot || sy > height + dot) continue;
        context.moveTo(sx + dot, sy);
        context.arc(sx, sy, dot, 0, Math.PI * 2);
      }

      context.fill();
      state.frame = requestAnimationFrame(draw);
    }

    draw(performance.now());

    return function stop() {
      state.alive = false;
      cancelAnimationFrame(state.frame);
      resizeObserver.disconnect();
      visibility.disconnect();
      window.removeEventListener("mousemove", onMove);
      if (canvas.__hero === state) canvas.__hero = null;
    };
  }

  window.bootHeroField = boot;

  function scan(node) {
    if (!node) return;
    if (node.nodeType === 1 && node.matches && node.matches("[data-hero-field]")) boot(node);
    if (!node.querySelectorAll) return;
    var found = node.querySelectorAll("[data-hero-field]");
    for (var i = 0; i < found.length; i++) boot(found[i]);
  }

  scan(document);
  new MutationObserver(function (records) {
    for (var i = 0; i < records.length; i++) {
      var added = records[i].addedNodes;
      for (var j = 0; j < added.length; j++) scan(added[j]);
    }
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
