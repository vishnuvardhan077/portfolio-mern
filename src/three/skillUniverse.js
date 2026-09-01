/* ==========================================================================
   3D SKILL CONSTELLATION UNIVERSE (THREE.JS)
   ========================================================================== */

import * as THREE from 'three';

export const SKILL_DATA = [
  { id: 'react', name: 'React.js', category: 'Frontend Framework', level: '90%', icon: 'fa-brands fa-react', projects: ['portfolio-mern', 'Mini-project'], color: 0x61dafb, desc: 'Building dynamic stateful UI components, hooks architecture, and responsive single-page web applications.' },
  { id: 'node', name: 'Node.js', category: 'Backend Runtime', level: '85%', icon: 'fa-brands fa-node-js', projects: ['portfolio-mern'], color: 0x68a063, desc: 'Developing asynchronous RESTful backend services, middleware, and server-side business logic.' },
  { id: 'three', name: 'Three.js & WebGL', category: '3D Graphics', level: '80%', icon: 'fa-solid fa-cubes', projects: ['3d-portfolio'], color: 0x06b6d4, desc: 'Creating immersive WebGL 3D scenes, particle physics, custom mesh geometries, lighting, and raycast interactions.' },
  { id: 'mongo', name: 'MongoDB', category: 'NoSQL Database', level: '82%', icon: 'fa-solid fa-database', projects: ['portfolio-mern'], color: 0x47a248, desc: 'Designing BSON document schemas, aggregation pipelines, and high-performance database indexing.' },
  { id: 'express', name: 'Express.js', category: 'Web Framework', level: '85%', icon: 'fa-solid fa-server', projects: ['portfolio-mern'], color: 0x888888, desc: 'Architecting robust API routing, JWT authentication flow, and middleware chains.' },
  { id: 'js', name: 'JavaScript (ES6+)', category: 'Core Language', level: '92%', icon: 'fa-brands fa-js', projects: ['cricket-extension', 'portfolio-mern', 'Mini-project'], color: 0xf7df1e, desc: 'Mastery of event loops, asynchronous promises, DOM manipulation, and functional patterns.' },
  { id: 'java', name: 'Java & Systems', category: 'OOP Systems', level: '80%', icon: 'fa-brands fa-java', projects: ['Student_Course_Management_System', 'java-project'], color: 0xf89820, desc: 'Object-oriented programming, data structures, algorithm design, and enterprise course management software.' },
  { id: 'extension', name: 'Chrome Extension V3', category: 'Browser Tooling', level: '88%', icon: 'fa-solid fa-puzzle-piece', projects: ['cricket-extension'], color: 0xec4899, desc: 'Manifest V3 extension development, background service workers, storage API, and live dashboard widgets.' },
  { id: 'css', name: 'CSS3 & Glassmorphism', category: 'Design System', level: '90%', icon: 'fa-brands fa-css3-alt', projects: ['All Projects'], color: 0x2965f1, desc: 'Advanced CSS grid/flexbox, custom properties, glassmorphism backdrop filters, keyframe animations, and HSL palettes.' },
  { id: 'git', name: 'Git & GitHub', category: 'Version Control', level: '88%', icon: 'fa-brands fa-github', projects: ['All Repositories'], color: 0xf05032, desc: 'Branching workflows, version control management, remote repository syncing, and continuous updates.' }
];

let scene, camera, renderer;
let nodes = [];
let linesGroup;
let raycaster, mouse;
let selectedCallback = null;
let currentLayout = 'sphere';
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

export function initSkillUniverse(container, onSelectSkill) {
  if (!container) return;

  selectedCallback = onSelectSkill;

  // Scene
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(
    55,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 12;

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Raycaster for mouse selection
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const light = new THREE.PointLight(0x06b6d4, 2, 50);
  light.position.set(0, 10, 10);
  scene.add(light);

  // Group for lines connecting nodes
  linesGroup = new THREE.Group();
  scene.add(linesGroup);

  // Create Skill Nodes
  createNodes();

  // Position nodes into initial layout
  setLayout('sphere');

  // Event Listeners for Orbit Dragging
  const dom = renderer.domElement;
  dom.addEventListener('mousedown', onMouseDown);
  dom.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
  dom.addEventListener('click', onClickNode);

  window.addEventListener('resize', () => {
    if (!container || !renderer || !camera) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  animate();
}

function createNodes() {
  nodes = [];
  const nodeGeo = new THREE.SphereGeometry(0.65, 32, 32);

  SKILL_DATA.forEach((skill, index) => {
    const mat = new THREE.MeshStandardMaterial({
      color: skill.color,
      roughness: 0.2,
      metalness: 0.7,
      emissive: skill.color,
      emissiveIntensity: 0.3,
    });

    const mesh = new THREE.Mesh(nodeGeo, mat);
    mesh.userData = { skill, index };

    // Outer Ring
    const ringGeo = new THREE.RingGeometry(0.85, 0.95, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: skill.color, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    mesh.add(ringMesh);

    scene.add(mesh);
    nodes.push(mesh);
  });

  updateConnectingLines();
}

function updateConnectingLines() {
  // Clear old lines
  while (linesGroup.children.length > 0) {
    linesGroup.remove(linesGroup.children[0]);
  }

  const lineMat = new THREE.LineBasicMaterial({
    color: 0x06b6d4,
    transparent: true,
    opacity: 0.25,
  });

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dist = nodes[i].position.distanceTo(nodes[j].position);
      if (dist < 7) {
        const points = [nodes[i].position, nodes[j].position];
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(lineGeo, lineMat);
        linesGroup.add(line);
      }
    }
  }
}

export function setLayout(mode) {
  currentLayout = mode;
  const count = nodes.length;

  nodes.forEach((node, i) => {
    let targetX = 0, targetY = 0, targetZ = 0;

    if (mode === 'sphere') {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const radius = 5.5;
      targetX = radius * Math.cos(theta) * Math.sin(phi);
      targetY = radius * Math.sin(theta) * Math.sin(phi);
      targetZ = radius * Math.cos(phi);
    } else if (mode === 'helix') {
      const angle = i * 0.8;
      const radius = 4.5;
      targetX = Math.cos(angle) * radius;
      targetY = (i - count / 2) * 1.2;
      targetZ = Math.sin(angle) * radius;
    } else if (mode === 'grid') {
      const cols = 4;
      const row = Math.floor(i / cols);
      const col = i % cols;
      targetX = (col - 1.5) * 2.8;
      targetY = (1 - row) * 2.8;
      targetZ = 0;
    }

    // Animate position change smoothly
    node.position.set(targetX, targetY, targetZ);
  });

  setTimeout(updateConnectingLines, 100);
}

function onMouseDown(e) {
  isDragging = true;
  previousMousePosition = { x: e.clientX, y: e.clientY };
}

function onMouseMove(e) {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  if (isDragging) {
    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;

    scene.rotation.y += deltaX * 0.005;
    scene.rotation.x += deltaY * 0.005;

    previousMousePosition = { x: e.clientX, y: e.clientY };
  }
}

function onMouseUp() {
  isDragging = false;
}

function onClickNode() {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(nodes);

  if (intersects.length > 0) {
    const clickedMesh = intersects[0].object;
    const skillData = clickedMesh.userData.skill;

    // Highlight clicked node
    nodes.forEach(n => {
      n.scale.set(1, 1, 1);
      n.material.emissiveIntensity = 0.3;
    });
    clickedMesh.scale.set(1.4, 1.4, 1.4);
    clickedMesh.material.emissiveIntensity = 0.9;

    if (selectedCallback) {
      selectedCallback(skillData);
    }
  }
}

function animate() {
  requestAnimationFrame(animate);

  if (!isDragging) {
    scene.rotation.y += 0.003;
  }

  // Rotate individual ring child meshes
  nodes.forEach(node => {
    if (node.children[0]) {
      node.children[0].rotation.z += 0.02;
    }
  });

  renderer.render(scene, camera);
}
