/* ==========================================================================
   HERO 3D WEBGL SCENE ENGINE (THREE.JS)
   ========================================================================== */

import * as THREE from 'three';

let scene, camera, renderer;
let mainMesh, wireframeMesh, particleSystem, satelliteGroup;
let pointLight1, pointLight2;
let targetMouseX = 0, targetMouseY = 0;
let mouseX = 0, mouseY = 0;
let currentGeoType = 'icosahedron';
let isWireframeActive = false;
let clock = new THREE.Clock();

export function initHeroScene(container) {
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
  camera.position.z = 7;

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  container.appendChild(renderer.domElement);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  pointLight1 = new THREE.PointLight(0x06b6d4, 3, 50);
  pointLight1.position.set(5, 5, 5);
  scene.add(pointLight1);

  pointLight2 = new THREE.PointLight(0x8b5cf6, 3, 50);
  pointLight2.position.set(-5, -5, 5);
  scene.add(pointLight2);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
  dirLight.position.set(0, 10, 10);
  scene.add(dirLight);

  // Create Main Core Geometry
  createCoreMesh(currentGeoType);

  // Create Orbiting Satellites
  createSatellites();

  // Create Particle Field
  createParticleStarfield();

  // Event Listeners
  window.addEventListener('resize', () => onWindowResize(container));
  window.addEventListener('mousemove', onMouseMove);

  // Animation Loop
  animate();
}

function getGeometry(type) {
  switch (type) {
    case 'torusKnot':
      return new THREE.TorusKnotGeometry(1.4, 0.45, 128, 32);
    case 'dodecahedron':
      return new THREE.DodecahedronGeometry(1.8, 1);
    case 'octahedron':
      return new THREE.OctahedronGeometry(2, 2);
    case 'icosahedron':
    default:
      return new THREE.IcosahedronGeometry(1.8, 2);
  }
}

function createCoreMesh(geoType) {
  if (mainMesh) scene.remove(mainMesh);
  if (wireframeMesh) scene.remove(wireframeMesh);

  const geo = getGeometry(geoType);

  // Solid Inner Mesh
  const material = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.15,
    metalness: 0.85,
    emissive: 0x06b6d4,
    emissiveIntensity: 0.2,
    flatShading: true,
  });

  mainMesh = new THREE.Mesh(geo, material);
  scene.add(mainMesh);

  // Outer Glowing Wireframe Mesh
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x06b6d4,
    wireframe: true,
    transparent: true,
    opacity: 0.4,
  });

  wireframeMesh = new THREE.Mesh(geo, wireMat);
  wireframeMesh.scale.set(1.05, 1.05, 1.05);
  scene.add(wireframeMesh);
}

function createSatellites() {
  satelliteGroup = new THREE.Group();

  const satGeo = new THREE.IcosahedronGeometry(0.25, 0);
  const satMat = new THREE.MeshStandardMaterial({
    color: 0x8b5cf6,
    roughness: 0.2,
    metalness: 0.9,
    emissive: 0x8b5cf6,
    emissiveIntensity: 0.5,
  });

  for (let i = 0; i < 6; i++) {
    const sat = new THREE.Mesh(satGeo, satMat);
    const angle = (i / 6) * Math.PI * 2;
    const radius = 3.2;
    sat.position.x = Math.cos(angle) * radius;
    sat.position.y = Math.sin(angle) * radius;
    sat.position.z = (Math.random() - 0.5) * 1.5;
    satelliteGroup.add(sat);
  }

  scene.add(satelliteGroup);
}

function createParticleStarfield() {
  const count = 1200;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  const color1 = new THREE.Color(0x06b6d4);
  const color2 = new THREE.Color(0x8b5cf6);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 25;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 25;

    const mixedColor = color1.clone().lerp(color2, Math.random());
    colors[i * 3] = mixedColor.r;
    colors[i * 3 + 1] = mixedColor.g;
    colors[i * 3 + 2] = mixedColor.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.06,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
  });

  particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);
}

function onMouseMove(event) {
  targetMouseX = (event.clientX / window.innerWidth - 0.5) * 2;
  targetMouseY = (event.clientY / window.innerHeight - 0.5) * 2;
}

function onWindowResize(container) {
  if (!container || !renderer || !camera) return;
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

function animate() {
  requestAnimationFrame(animate);

  const elapsedTime = clock.getElapsedTime();

  // Smooth mouse interpolation
  mouseX += (targetMouseX - mouseX) * 0.05;
  mouseY += (targetMouseY - mouseY) * 0.05;

  // Core mesh rotation & vertex float effect
  if (mainMesh) {
    mainMesh.rotation.x = elapsedTime * 0.3 + mouseY * 0.5;
    mainMesh.rotation.y = elapsedTime * 0.4 + mouseX * 0.5;
  }

  if (wireframeMesh) {
    wireframeMesh.rotation.x = elapsedTime * 0.3 + mouseY * 0.5;
    wireframeMesh.rotation.y = elapsedTime * 0.4 + mouseX * 0.5;
  }

  // Satellite orbit
  if (satelliteGroup) {
    satelliteGroup.rotation.z = elapsedTime * 0.2;
    satelliteGroup.rotation.y = elapsedTime * 0.15;
  }

  // Particle float
  if (particleSystem) {
    particleSystem.rotation.y = elapsedTime * 0.05 + mouseX * 0.1;
    particleSystem.rotation.x = mouseY * 0.1;
  }

  // Parallax camera move
  camera.position.x = mouseX * 0.5;
  camera.position.y = -mouseY * 0.5;
  camera.lookAt(scene.position);

  renderer.render(scene, camera);
}

// Public Controls
export function toggleWireframe() {
  if (!wireframeMesh) return false;
  isWireframeActive = !isWireframeActive;
  wireframeMesh.material.opacity = isWireframeActive ? 0.95 : 0.4;
  wireframeMesh.material.wireframe = isWireframeActive;
  return isWireframeActive;
}

export function switchGeometryCore() {
  const geos = ['icosahedron', 'torusKnot', 'dodecahedron', 'octahedron'];
  const nextIdx = (geos.indexOf(currentGeoType) + 1) % geos.length;
  currentGeoType = geos[nextIdx];
  createCoreMesh(currentGeoType);
  return currentGeoType;
}

export function triggerParticleBurst() {
  if (!particleSystem) return;
  const positions = particleSystem.geometry.attributes.position.array;
  for (let i = 0; i < positions.length; i += 3) {
    positions[i] += (Math.random() - 0.5) * 1.5;
    positions[i + 1] += (Math.random() - 0.5) * 1.5;
    positions[i + 2] += (Math.random() - 0.5) * 1.5;
  }
  particleSystem.geometry.attributes.position.needsUpdate = true;
}

export function updateHeroThemeColor(hexPrimary, hexSecondary) {
  if (pointLight1) pointLight1.color.set(hexPrimary);
  if (pointLight2) pointLight2.color.set(hexSecondary);
  if (wireframeMesh) wireframeMesh.material.color.set(hexPrimary);
  if (mainMesh) mainMesh.material.emissive.set(hexPrimary);
}
