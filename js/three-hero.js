/**
 * three-hero.js
 * Animated hero background using Three.js
 * Creates a subtle floating-particle / leaf constellation effect
 * that fits the emerald-green brand of Only For Seniors.
 */

(function initThreeHero() {
  'use strict';

  // Wait until THREE is available and DOM is ready
  function waitForThree(cb, attempts) {
    attempts = attempts || 0;
    if (typeof THREE !== 'undefined') {
      cb();
    } else if (attempts < 50) {
      setTimeout(function () { waitForThree(cb, attempts + 1); }, 100);
    }
  }

  function setup() {
    var canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    // ── Renderer ──────────────────────────────────────────────────────────
    var renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    renderer.setClearColor(0x000000, 0); // transparent

    // ── Scene & Camera ────────────────────────────────────────────────────
    var scene  = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(
      60,
      canvas.offsetWidth / canvas.offsetHeight,
      0.1,
      1000
    );
    camera.position.z = 80;

    // ── Particles ─────────────────────────────────────────────────────────
    var PARTICLE_COUNT = 180;
    var positions = new Float32Array(PARTICLE_COUNT * 3);
    var colors    = new Float32Array(PARTICLE_COUNT * 3);
    var speeds    = new Float32Array(PARTICLE_COUNT); // y drift speed

    // Colour palette — shades of emerald, teal, and a few amber sparkles
    var palette = [
      new THREE.Color(0x10b981), // green-500
      new THREE.Color(0x34d399), // green-400
      new THREE.Color(0x059669), // green-600
      new THREE.Color(0x6ee7b7), // green-300
      new THREE.Color(0xfbbf24), // amber-400  (accent sparkles)
      new THREE.Color(0xffffff), // white
      new THREE.Color(0xa7f3d0), // green-200
    ];

    for (var i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 160; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;  // z

      var col = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3]     = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      speeds[i] = 0.008 + Math.random() * 0.018; // drift upward
    }

    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color',    new THREE.BufferAttribute(colors,    3));

    var material = new THREE.PointsMaterial({
      size: 1.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      sizeAttenuation: true
    });

    var particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // ── Connection Lines (constellation effect) ────────────────────────────
    var LINE_MAX_DIST = 22;
    var linePositions  = [];
    var lineMat = new THREE.LineBasicMaterial({
      color: 0x34d399,
      transparent: true,
      opacity: 0.12
    });
    var lineGeo  = new THREE.BufferGeometry();
    var linesMesh = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(linesMesh);

    // ── Floating geometric shapes ─────────────────────────────────────────
    var shapes = [];
    var shapeCount = 8;
    var shapeGeo = [
      new THREE.IcosahedronGeometry(3, 0),
      new THREE.OctahedronGeometry(2.5, 0),
      new THREE.TetrahedronGeometry(2.8, 0)
    ];

    for (var s = 0; s < shapeCount; s++) {
      var mat = new THREE.MeshBasicMaterial({
        color: s % 3 === 0 ? 0xfbbf24 : 0x34d399,
        wireframe: true,
        transparent: true,
        opacity: 0.18
      });
      var geo  = shapeGeo[s % shapeGeo.length];
      var mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 140,
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 40 - 20
      );
      mesh.userData.rotX = (Math.random() - 0.5) * 0.008;
      mesh.userData.rotY = (Math.random() - 0.5) * 0.01;
      mesh.userData.drift = 0.003 + Math.random() * 0.005;
      scene.add(mesh);
      shapes.push(mesh);
    }

    // ── Subtle mouse parallax ─────────────────────────────────────────────
    var mouseX = 0, mouseY = 0;
    var targetX = 0, targetY = 0;

    document.addEventListener('mousemove', function (e) {
      mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Touch support
    document.addEventListener('touchmove', function (e) {
      if (e.touches.length > 0) {
        mouseX = (e.touches[0].clientX / window.innerWidth  - 0.5) * 2;
        mouseY = (e.touches[0].clientY / window.innerHeight - 0.5) * 2;
      }
    }, { passive: true });

    // ── Resize ────────────────────────────────────────────────────────────
    window.addEventListener('resize', function () {
      var w = canvas.offsetWidth;
      var h = canvas.offsetHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });

    // ── Animate ───────────────────────────────────────────────────────────
    var clock = new THREE.Clock();

    function buildLines() {
      linePositions = [];
      var pos = geometry.attributes.position.array;
      for (var a = 0; a < PARTICLE_COUNT; a++) {
        for (var b = a + 1; b < PARTICLE_COUNT; b++) {
          var dx = pos[a*3]   - pos[b*3];
          var dy = pos[a*3+1] - pos[b*3+1];
          var dz = pos[a*3+2] - pos[b*3+2];
          var dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
          if (dist < LINE_MAX_DIST) {
            linePositions.push(
              pos[a*3], pos[a*3+1], pos[a*3+2],
              pos[b*3], pos[b*3+1], pos[b*3+2]
            );
          }
        }
      }
      lineGeo.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(linePositions, 3)
      );
      lineGeo.attributes.position.needsUpdate = true;
    }

    var lineRebuildTimer = 0;

    function animate() {
      requestAnimationFrame(animate);

      var elapsed = clock.getElapsedTime();

      // Smooth camera parallax
      targetX += (mouseX * 8 - targetX) * 0.04;
      targetY += (mouseY * 4 - targetY) * 0.04;
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (-targetY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      // Drift particles upward, wrap around
      var pos = geometry.attributes.position.array;
      for (var i = 0; i < PARTICLE_COUNT; i++) {
        pos[i * 3 + 1] += speeds[i];
        if (pos[i * 3 + 1] > 55) {
          pos[i * 3 + 1] = -55;
          pos[i * 3]     = (Math.random() - 0.5) * 160;
          pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
        }
      }
      geometry.attributes.position.needsUpdate = true;

      // Rotate shapes
      for (var s = 0; s < shapes.length; s++) {
        shapes[s].rotation.x += shapes[s].userData.rotX;
        shapes[s].rotation.y += shapes[s].userData.rotY;
        shapes[s].position.y += shapes[s].userData.drift;
        if (shapes[s].position.y > 50) shapes[s].position.y = -50;
      }

      // Rebuild connection lines every ~30 frames for performance
      lineRebuildTimer++;
      if (lineRebuildTimer >= 30) {
        buildLines();
        lineRebuildTimer = 0;
      }

      // Slow rotation of whole particle cloud
      particles.rotation.y = elapsed * 0.025;

      renderer.render(scene, camera);
    }

    buildLines();
    animate();
  }

  waitForThree(setup);
})();
