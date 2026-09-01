/* ==========================================================================
   3D INTERACTIVE PLAYGROUND & STUDIO ENGINE (THREE.JS)
   ========================================================================== */

import * as THREE from 'three';

let scene, camera, renderer;
let playgroundMesh, wireframeMesh, studioParticles;
let pointLight;
let rotationSpeed = 1.0;
let frameCount = 0, fps = 60, lastTime = performance.now();

export function initPlayground(container, fpsCallback) {
  if (!container) return;

  // Scene
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  pointLight = new THREE.PointLight(0x06b6d4, 3, 50);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
  dirLight.position.set(-5, 5, 5);
  scene.add(dirLight);

  // Create Mesh
  setPlaygroundGeometry('icosahedron');

  // Event Listener
  window.addEventListener('resize', () => {
    if (!container || !renderer || !camera) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  animate(fpsCallback);
}

export function setPlaygroundGeometry(type) {
  if (playgroundMesh) scene.remove(playgroundMesh);
  if (wireframeMesh) scene.remove(wireframeMesh);

  let geo;
  switch (type) {
    case 'torusKnot':
      geo = new THREE.TorusKnotGeometry(1.1, 0.35, 128, 32);
      break;
    case 'dodecahedron':
      geo = new THREE.DodecahedronGeometry(1.4, 0);
      break;
    case 'sphere':
      geo = new THREE.SphereGeometry(1.4, 32, 32);
      break;
    case 'octahedron':
      geo = new THREE.OctahedronGeometry(1.5, 0);
      break;
    case 'tetrahedron':
      geo = new THREE.TetrahedronGeometry(1.5, 0);
      break;
    case 'torus':
      geo = new THREE.TorusGeometry(1.2, 0.4, 16, 100);
      break;
    case 'cylinder':
      geo = new THREE.CylinderGeometry(1, 1, 2, 32);
      break;
    case 'cone':
      geo = new THREE.ConeGeometry(1.2, 2.2, 32);
      break;
    case 'icosahedron':
    default:
      geo = new THREE.IcosahedronGeometry(1.4, 1);
      break;
  }

  const mat = new THREE.MeshStandardMaterial({
    color: 0x0a0f1d,
    emissive: 0x06b6d4,
    emissiveIntensity: 0.4,
    roughness: 0.2,
    metalness: 0.7,
    flatShading: true,
  });

  playgroundMesh = new THREE.Mesh(geo, mat);
  scene.add(playgroundMesh);

  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x06b6d4,
    wireframe: true,
    transparent: true,
    opacity: 0.3,
  });
  wireframeMesh = new THREE.Mesh(geo, wireMat);
  wireframeMesh.scale.set(1.03, 1.03, 1.03);
  scene.add(wireframeMesh);
}

export function setPlaygroundColor(hexColor) {
  if (!playgroundMesh || !wireframeMesh) return;
  const col = new THREE.Color(hexColor);
  playgroundMesh.material.emissive.set(col);
  wireframeMesh.material.color.set(col);
  if (pointLight) pointLight.color.set(col);
}

export function setPlaygroundSpeed(val) {
  rotationSpeed = parseFloat(val);
}

export function setPlaygroundMetalness(val) {
  if (playgroundMesh) playgroundMesh.material.metalness = parseFloat(val);
}

export function setPlaygroundRoughness(val) {
  if (playgroundMesh) playgroundMesh.material.roughness = parseFloat(val);
}

export function togglePlaygroundWireframe() {
  if (!wireframeMesh) return false;
  const isWire = wireframeMesh.material.wireframe;
  wireframeMesh.material.wireframe = !isWire;
  wireframeMesh.material.opacity = !isWire ? 0.9 : 0.3;
  return !isWire;
}

export function spawnStudioParticles() {
  if (studioParticles) scene.remove(studioParticles);

  const count = 400;
  const positions = new Float32Array(count * 3);
  const col = playgroundMesh ? playgroundMesh.material.emissive : new THREE.Color(0x06b6d4);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.08,
    color: col,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
  });

  studioParticles = new THREE.Points(geo, mat);
  scene.add(studioParticles);
}

function animate(fpsCallback) {
  requestAnimationFrame(() => animate(fpsCallback));

  // FPS calculation
  frameCount++;
  const now = performance.now();
  if (now - lastTime >= 1000) {
    fps = Math.round((frameCount * 1000) / (now - lastTime));
    frameCount = 0;
    lastTime = now;
    if (fpsCallback) fpsCallback(fps);
  }

  if (playgroundMesh) {
    playgroundMesh.rotation.x += 0.01 * rotationSpeed;
    playgroundMesh.rotation.y += 0.015 * rotationSpeed;
  }

  if (wireframeMesh) {
    wireframeMesh.rotation.x += 0.01 * rotationSpeed;
    wireframeMesh.rotation.y += 0.015 * rotationSpeed;
  }

  if (studioParticles) {
    studioParticles.rotation.y += 0.005;
  }

  renderer.render(scene, camera);
}
