/* ==========================================================================
   MINI 3D WEBGL MODELS FOR PROJECT CARDS
   ========================================================================== */

import * as THREE from 'three';

const miniScenes = [];

export function initProjectMini3D() {
  const cardBanners = document.querySelectorAll('.project-banner');

  cardBanners.forEach((banner, idx) => {
    const card = banner.closest('.project-card');
    const projectType = card ? card.getAttribute('data-id') : 'default';

    // Canvas container
    const canvasContainer = document.createElement('div');
    canvasContainer.className = 'project-mini-canvas';
    canvasContainer.style.cssText = 'position:absolute; inset:0; z-index:1; pointer-events:none;';
    banner.insertBefore(canvasContainer, banner.firstChild);

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(50, banner.clientWidth / banner.clientHeight, 0.1, 100);
    camera.position.z = 4;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(banner.clientWidth, banner.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    canvasContainer.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    const light = new THREE.PointLight(0xffffff, 2, 20);
    light.position.set(3, 3, 3);
    scene.add(light);

    // Geometry based on project
    let geo, color;
    if (projectType === 'portfolio-mern') {
      geo = new THREE.BoxGeometry(1.4, 1.4, 1.4);
      color = 0x06b6d4;
    } else if (projectType === 'Student_Course_Management_System') {
      geo = new THREE.OctahedronGeometry(1.3, 0);
      color = 0x8b5cf6;
    } else if (projectType === 'cricket-extension') {
      geo = new THREE.TorusGeometry(1, 0.35, 16, 100);
      color = 0x10b981;
    } else if (projectType === 'Mini-project') {
      geo = new THREE.DodecahedronGeometry(1.2, 0);
      color = 0xf59e0b;
    } else {
      geo = new THREE.TetrahedronGeometry(1.3, 0);
      color = 0xef4444;
    }

    const mat = new THREE.MeshStandardMaterial({
      color: 0x0a0e1a,
      emissive: color,
      emissiveIntensity: 0.5,
      roughness: 0.2,
      metalness: 0.8,
      flatShading: true,
    });

    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    const wireMat = new THREE.MeshBasicMaterial({ color: color, wireframe: true, transparent: true, opacity: 0.35 });
    const wireMesh = new THREE.Mesh(geo, wireMat);
    wireMesh.scale.set(1.05, 1.05, 1.05);
    scene.add(wireMesh);

    miniScenes.push({ scene, camera, renderer, mesh, wireMesh, container: banner });
  });

  window.addEventListener('resize', onResize);
  animateMiniScenes();
}

function onResize() {
  miniScenes.forEach(item => {
    if (item.container && item.renderer && item.camera) {
      const w = item.container.clientWidth;
      const h = item.container.clientHeight;
      item.camera.aspect = w / h;
      item.camera.updateProjectionMatrix();
      item.renderer.setSize(w, h);
    }
  });
}

function animateMiniScenes() {
  requestAnimationFrame(animateMiniScenes);

  miniScenes.forEach(item => {
    if (item.mesh) {
      item.mesh.rotation.x += 0.01;
      item.mesh.rotation.y += 0.015;
    }
    if (item.wireMesh) {
      item.wireMesh.rotation.x += 0.01;
      item.wireMesh.rotation.y += 0.015;
    }
    item.renderer.render(item.scene, item.camera);
  });
}

export function updateProjectMiniColors(hexColor) {
  const col = new THREE.Color(hexColor);
  miniScenes.forEach(item => {
    if (item.mesh) item.mesh.material.emissive.set(col);
    if (item.wireMesh) item.wireMesh.material.color.set(col);
  });
}
