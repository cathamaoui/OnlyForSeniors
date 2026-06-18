"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * A gentle, lightweight Three.js scene for the hero.
 * Renders floating emerald + ember shapes that drift slowly.
 * Senior-friendly: subtle motion, no rapid spinning, low opacity.
 */
export function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Respect reduced motion
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(2, 4, 5);
    scene.add(dir);

    // Floating shapes - soft, friendly, low-poly
    const shapes: THREE.Mesh[] = [];
    const palette = [0x047857, 0xea580c, 0xf59e0b, 0xfdf8e8];
    const geometries = [
      new THREE.IcosahedronGeometry(0.7, 0),
      new THREE.TorusKnotGeometry(0.4, 0.18, 64, 8),
      new THREE.SphereGeometry(0.55, 24, 24),
      new THREE.BoxGeometry(0.8, 0.8, 0.8),
    ];

    for (let i = 0; i < 14; i++) {
      const geo = geometries[i % geometries.length];
      const mat = new THREE.MeshStandardMaterial({
        color: palette[i % palette.length],
        roughness: 0.45,
        metalness: 0.1,
        transparent: true,
        opacity: 0.85,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4
      );
      mesh.userData = {
        rotSpeed: 0.002 + Math.random() * 0.004,
        floatSpeed: 0.0008 + Math.random() * 0.0012,
        floatOffset: Math.random() * Math.PI * 2,
        driftX: (Math.random() - 0.5) * 0.0008,
        driftY: (Math.random() - 0.5) * 0.0008,
        basePos: mesh.position.clone(),
      };
      scene.add(mesh);
      shapes.push(mesh);
    }

    // Mouse parallax
    const mouse = { x: 0, y: 0 };
    const onMouse = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    container.addEventListener("mousemove", onMouse);

    // Resize
    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", onResize);

    // Animate
    let raf = 0;
    let t = 0;
    const tick = () => {
      t += 1;
      shapes.forEach((m) => {
        const u = m.userData;
        m.rotation.x += u.rotSpeed;
        m.rotation.y += u.rotSpeed * 1.3;
        m.position.y =
          u.basePos.y + Math.sin(t * u.floatSpeed + u.floatOffset) * 0.6;
        m.position.x = u.basePos.x + mouse.x * 0.4;
      });
      camera.position.y = mouse.y * 0.2;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      container.removeEventListener("mousemove", onMouse);
      renderer.dispose();
      geometries.forEach((g) => g.dispose());
      shapes.forEach((m) => (m.material as THREE.Material).dispose());
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
