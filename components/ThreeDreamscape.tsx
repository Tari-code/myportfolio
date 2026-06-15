"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

export default function ThreeDreamscape() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, 0.035);

    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0.6, 16);

    const root = new THREE.Group();
    scene.add(root);

    const ambient = new THREE.AmbientLight(0x8b5cf6, 1.2);
    scene.add(ambient);

    const glow = new THREE.PointLight(0x38bdf8, 2.6, 100);
    glow.position.set(0, 6, 12);
    scene.add(glow);

    const glowAlt = new THREE.PointLight(0xa78bfa, 1.4, 100);
    glowAlt.position.set(-8, -4, 8);
    scene.add(glowAlt);

    const terrain = new THREE.Mesh(
      new THREE.CircleGeometry(8, 96),
      new THREE.MeshStandardMaterial({
        color: 0x111827,
        emissive: 0x06202a,
        metalness: 0.08,
        roughness: 0.95,
      })
    );
    terrain.rotation.x = -Math.PI / 2;
    terrain.position.y = -3.3;
    terrain.receiveShadow = true;
    scene.add(terrain);

    const grid = new THREE.GridHelper(18, 36, 0x22d3ee, 0x1f2937);
    grid.position.y = -3.2;
    grid.material.opacity = 0.18;
    (grid.material as THREE.Material).transparent = true;
    scene.add(grid);

    const torus = new THREE.Mesh(
      new THREE.TorusKnotGeometry(2.6, 0.42, 160, 24),
      new THREE.MeshStandardMaterial({
        color: 0x6366f1,
        emissive: 0x111827,
        metalness: 0.45,
        roughness: 0.2,
      })
    );
    torus.rotation.x = 0.65;
    torus.rotation.y = 0.45;
    root.add(torus);

    const orb = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.25, 1),
      new THREE.MeshStandardMaterial({
        color: 0x22d3ee,
        emissive: 0x0f172a,
        metalness: 0.35,
        roughness: 0.18,
        wireframe: false,
      })
    );
    orb.position.set(4.2, 1.8, -2);
    root.add(orb);

    const orbTwo = new THREE.Mesh(
      new THREE.OctahedronGeometry(1.05, 0),
      new THREE.MeshStandardMaterial({
        color: 0xc084fc,
        emissive: 0x111827,
        metalness: 0.2,
        roughness: 0.25,
      })
    );
    orbTwo.position.set(-4, -1.2, 1.2);
    root.add(orbTwo);

    const pathNodes = Array.from({ length: 8 }, (_, index) => {
      const node = new THREE.Mesh(
        new THREE.SphereGeometry(0.18 + (index % 3) * 0.04, 12, 12),
        new THREE.MeshBasicMaterial({ color: index % 2 === 0 ? 0x38bdf8 : 0xa78bfa })
      );
      node.position.set((index - 3.5) * 1.1, 0.4 + (index % 2) * 0.25, -2.5 + index * 0.4);
      root.add(node);
      return node;
    });

    const stars = new THREE.BufferGeometry();
    const starPositions = new Float32Array(180 * 3);
    for (let i = 0; i < 180; i++) {
      const radius = 14 + Math.random() * 18;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.cos(phi);
      starPositions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    stars.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));

    const starsMaterial = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 0.08,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
    });
    const starField = new THREE.Points(stars, starsMaterial);
    scene.add(starField);

    const onMove = (event: MouseEvent) => {
      mouseRef.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      };
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize", onResize);

    gsap.to(camera.position, {
      y: 1.3,
      z: 13,
      ease: "none",
      scrollTrigger: {
        trigger: "main",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });

    gsap.to(root.rotation, {
      y: Math.PI / 5,
      x: 0.18,
      ease: "none",
      scrollTrigger: {
        trigger: "main",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });

    let frame = 0;
    const animate = () => {
      frame += 1;
      const time = frame * 0.008;

      torus.rotation.y += 0.003;
      torus.rotation.x = 0.65 + Math.sin(time * 0.6) * 0.08;
      torus.position.y = Math.sin(time * 0.9) * 0.14;

      orb.rotation.y += 0.008;
      orb.rotation.x += 0.004;
      orbTwo.rotation.y -= 0.01;
      orbTwo.rotation.x += 0.006;

      pathNodes.forEach((node, index) => {
        node.position.y = 0.35 + Math.sin(time * 1.3 + index * 0.7) * 0.12;
        node.rotation.y += 0.01 + index * 0.002;
      });

      root.rotation.y = THREE.MathUtils.lerp(root.rotation.y, mouseRef.current.x * 0.18, 0.04);
      root.rotation.x = THREE.MathUtils.lerp(root.rotation.x, mouseRef.current.y * 0.12, 0.04);
      starField.rotation.y += 0.0005;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      scene.clear();
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 h-full w-full pointer-events-none" />;
}
