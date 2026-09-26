import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeCanvas({ variant = 'default' }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group to hold objects
    const group = new THREE.Group();
    scene.add(group);

    // 1. Central 3D Geometry (Futuristic Core)
    let coreGeometry;
    if (variant === 'hero') {
      coreGeometry = new THREE.TorusKnotGeometry(2.5, 0.7, 120, 16);
    } else if (variant === 'auth') {
      coreGeometry = new THREE.IcosahedronGeometry(3.2, 2);
    } else {
      coreGeometry = new THREE.OctahedronGeometry(3, 2);
    }

    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x5865f2,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, wireframeMaterial);
    group.add(coreMesh);

    // Inner glowing solid mesh
    const innerGeometry = new THREE.IcosahedronGeometry(1.6, 1);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    group.add(innerMesh);

    // 2. Outer Ring
    const ringGeo = new THREE.RingGeometry(4.2, 4.3, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x7928ca,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.3,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 3;
    group.add(ringMesh);

    // 3. Particle Starfield
    const particlesCount = variant === 'hero' ? 700 : 350;
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);

    const colors = [
      new THREE.Color('#5865f2'),
      new THREE.Color('#00f2fe'),
      new THREE.Color('#7928ca'),
      new THREE.Color('#ffffff'),
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

    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeo.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const particlesMat = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });

    const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particlesMesh);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse follow
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // Rotate group
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

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      // Dispose geometries and materials
      coreGeometry.dispose();
      wireframeMaterial.dispose();
      innerGeometry.dispose();
      innerMaterial.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      particlesGeo.dispose();
      particlesMat.dispose();
      renderer.dispose();
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
