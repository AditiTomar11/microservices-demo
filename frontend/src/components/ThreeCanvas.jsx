import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeCanvas({ variant = 'default' }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer = null;
    let animationFrameId = null;
    let handleMouseMove = null;
    let handleResize = null;

    let coreGeometry = null;
    let wireframeMaterial = null;
    let innerGeometry = null;
    let innerMaterial = null;
    let ringGeo = null;
    let ringMat = null;
    let particlesGeo = null;
    let particlesMat = null;

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        60,
        container.clientWidth / container.clientHeight || 1,
        0.1,
        1000
      );
      camera.position.z = 12;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(container.clientWidth || 300, container.clientHeight || 300);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      container.appendChild(renderer.domElement);

      const group = new THREE.Group();
      scene.add(group);

      // Geometry selection for Light Theme
      if (variant === 'hero') {
        coreGeometry = new THREE.TorusKnotGeometry(2.5, 0.7, 120, 16);
      } else if (variant === 'auth') {
        coreGeometry = new THREE.IcosahedronGeometry(3.2, 2);
      } else {
        coreGeometry = new THREE.OctahedronGeometry(3, 2);
      }

      wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0x4f46e5, // Light theme indigo accent
        wireframe: true,
        transparent: true,
        opacity: 0.15,
      });
      const coreMesh = new THREE.Mesh(coreGeometry, wireframeMaterial);
      group.add(coreMesh);

      innerGeometry = new THREE.IcosahedronGeometry(1.6, 1);
      innerMaterial = new THREE.MeshBasicMaterial({
        color: 0x0284c7, // Cyan
        wireframe: true,
        transparent: true,
        opacity: 0.22,
      });
      const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
      group.add(innerMesh);

      ringGeo = new THREE.RingGeometry(4.2, 4.3, 64);
      ringMat = new THREE.MeshBasicMaterial({
        color: 0x7c3aed, // Violet
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.2,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 3;
      group.add(ringMesh);

      // Particle Field
      const particlesCount = variant === 'hero' ? 600 : 300;
      const posArray = new Float32Array(particlesCount * 3);
      const colorArray = new Float32Array(particlesCount * 3);

      const colors = [
        new THREE.Color('#4f46e5'),
        new THREE.Color('#0284c7'),
        new THREE.Color('#7c3aed'),
        new THREE.Color('#94a3b8'),
      ];

      for (let i = 0; i < particlesCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 35;
        posArray[i + 1] = (Math.random() - 0.5) * 35;
        posArray[i + 2] = (Math.random() - 0.5) * 35;

        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        colorArray[i] = randomColor.r;
        colorArray[i + 1] = randomColor.g;
        colorArray[i + 2] = randomColor.b;
      }

      particlesGeo = new THREE.BufferGeometry();
      particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      particlesGeo.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

      particlesMat = new THREE.PointsMaterial({
        size: 0.08,
        vertexColors: true,
        transparent: true,
        opacity: 0.45,
      });

      const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
      scene.add(particlesMesh);

      let mouseX = 0;
      let mouseY = 0;
      let targetX = 0;
      let targetY = 0;

      handleMouseMove = (event) => {
        mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
      };

      window.addEventListener('mousemove', handleMouseMove);

      handleResize = () => {
        if (!container || !renderer) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };

      window.addEventListener('resize', handleResize);

      const clock = new THREE.Clock();

      const animate = () => {
        const elapsedTime = clock.getElapsedTime();

        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        coreMesh.rotation.x = elapsedTime * 0.2;
        coreMesh.rotation.y = elapsedTime * 0.3;

        innerMesh.rotation.x = -elapsedTime * 0.4;
        innerMesh.rotation.y = -elapsedTime * 0.5;

        ringMesh.rotation.z = elapsedTime * 0.15;

        particlesMesh.rotation.y = elapsedTime * 0.05;

        group.rotation.y = targetX * 0.5;
        group.rotation.x = -targetY * 0.5;

        renderer.render(scene, camera);
        animationFrameId = requestAnimationFrame(animate);
      };

      animate();
    } catch (err) {
      console.warn('ThreeCanvas WebGL fallback active:', err);
    }

    return () => {
      if (handleMouseMove) window.removeEventListener('mousemove', handleMouseMove);
      if (handleResize) window.removeEventListener('resize', handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);

      if (container && renderer && renderer.domElement) {
        try {
          container.removeChild(renderer.domElement);
        } catch (e) {
          // ignore
        }
      }

      if (coreGeometry) coreGeometry.dispose();
      if (wireframeMaterial) wireframeMaterial.dispose();
      if (innerGeometry) innerGeometry.dispose();
      if (innerMaterial) innerMaterial.dispose();
      if (ringGeo) ringGeo.dispose();
      if (ringMat) ringMat.dispose();
      if (particlesGeo) particlesGeo.dispose();
      if (particlesMat) particlesMat.dispose();
      if (renderer) renderer.dispose();
    };
  }, [variant]);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    />
  );
}
