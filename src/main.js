/* ==========================================================================
   3D WEBGL DEVELOPER PORTFOLIO - MAIN ORCHESTRATOR
   VISHNU VARDHAN (vishnuvardhan077)
   ========================================================================== */

import { initHeroScene, toggleWireframe, switchGeometryCore, triggerParticleBurst, updateHeroThemeColor } from './three/heroScene.js';
import { initSkillUniverse, SKILL_DATA, setLayout } from './three/skillUniverse.js';
import { initPlayground, setPlaygroundGeometry, setPlaygroundColor, setPlaygroundSpeed, setPlaygroundMetalness, setPlaygroundRoughness, togglePlaygroundWireframe, spawnStudioParticles } from './three/playground.js';
import { toggleAudio, playHoverSound, playClickSound, playWarpSound, isAudioEnabled } from './utils/audio.js';
import { parseThemePrompt, THEME_DEFINITIONS } from './utils/themePromptParser.js';

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initAudioControls();
  initThemeSwitcher();
  initAIPromptThemeCustomizer();
  initHeroSection();
  initTypewriter();
  initSkillsUniverseSection();
  init3DTiltCards();
  initProjectFilters();
  initGitHubSync();
  init3DStudioSection();
  initContactForm();
  initNavigation();
});

/* Custom Glowing Cursor Tracker */
function initCustomCursor() {
  const cursor = document.getElementById('custom-cursor');
  const blur = document.getElementById('cursor-blur');

  if (!cursor || !blur) return;

  window.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;

    blur.style.left = `${e.clientX}px`;
    blur.style.top = `${e.clientY}px`;
  });

  // Scale up on interactive hover
  const interactables = document.querySelectorAll('a, button, input, textarea, .tilt-card, .btn-chip, .prompt-chip');
  interactables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '24px';
      cursor.style.height = '24px';
      playHoverSound();
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '10px';
      cursor.style.height = '10px';
    });
  });
}

/* Audio Controls */
function initAudioControls() {
  const soundBtn = document.getElementById('sound-btn');
  const soundIcon = document.getElementById('sound-icon');
  const toast = document.getElementById('audio-toast');
  const toastText = document.getElementById('toast-text');

  if (!soundBtn) return;

  soundBtn.addEventListener('click', () => {
    const enabled = toggleAudio();
    soundIcon.className = enabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
    
    if (toast && toastText) {
      toastText.textContent = enabled ? 'Audio FX Enabled' : 'Audio Muted';
      toast.classList.remove('hidden');
      setTimeout(() => toast.classList.add('hidden'), 2500);
    }
  });
}

/* Theme Switcher */
function initThemeSwitcher() {
  const themeOpts = document.querySelectorAll('.theme-opt');
  
  themeOpts.forEach(btn => {
    btn.addEventListener('click', () => {
      playClickSound();
      const theme = btn.getAttribute('data-theme');
      const themeKey = theme.replace('theme-', '');

      themeOpts.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (THEME_DEFINITIONS[themeKey]) {
        applyThemeFromDefinition(THEME_DEFINITIONS[themeKey]);
      }
    });
  });
}

/* AI Prompt Theme Customizer Engine */
function initAIPromptThemeCustomizer() {
  const input = document.getElementById('prompt-theme-input');
  const micBtn = document.getElementById('mic-btn');
  const chips = document.querySelectorAll('.prompt-chip');

  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        processPrompt(input.value);
      }
    });
  }

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const prompt = chip.getAttribute('data-prompt');
      if (input) input.value = prompt;
      processPrompt(prompt);
    });
  });

  // Web Speech API Voice Recognition
  if (micBtn) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';

      micBtn.addEventListener('click', () => {
        playWarpSound();
        micBtn.classList.add('listening');
        showToast('🎙️ Listening for voice prompt...');
        try {
          recognition.start();
        } catch (err) {
          micBtn.classList.remove('listening');
        }
      });

      recognition.onresult = (event) => {
        micBtn.classList.remove('listening');
        const transcript = event.results[0][0].transcript;
        if (input) input.value = transcript;
        processPrompt(transcript);
      };

      recognition.onerror = () => {
        micBtn.classList.remove('listening');
        showToast('Mic error. Type prompt instead!');
      };

      recognition.onend = () => {
        micBtn.classList.remove('listening');
      };
    } else {
      micBtn.addEventListener('click', () => {
        showToast('Type your prompt in the search box!');
      });
    }
  }
}

function processPrompt(promptText) {
  if (!promptText) return;
  const themeDef = parseThemePrompt(promptText);

  if (themeDef) {
    applyThemeFromDefinition(themeDef);
  }
}

function applyThemeFromDefinition(def) {
  playWarpSound();
  triggerParticleBurst();

  document.body.className = def.className;

  if (def.isCustomHex) {
    document.documentElement.style.setProperty('--primary', def.primaryHex);
    document.documentElement.style.setProperty('--border-glow', def.primaryHex);
  }

  // Update Three.js 3D WebGL Scene Lights and Core Colors
  updateHeroThemeColor(def.primaryNum, def.secondaryNum);
  setPlaygroundColor(def.primaryHex);

  // Update active state in theme dropdown
  const themeOpts = document.querySelectorAll('.theme-opt');
  themeOpts.forEach(b => {
    const attr = b.getAttribute('data-theme');
    b.classList.toggle('active', attr === def.className);
  });

  showToast(`🎨 ${def.desc || 'Theme updated!'}`);
}

function showToast(msg) {
  const toast = document.getElementById('audio-toast');
  const toastText = document.getElementById('toast-text');
  if (toast && toastText) {
    toastText.textContent = msg;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3500);
  }
}

/* Hero Section 3D Scene */
function initHeroSection() {
  const container = document.getElementById('hero-canvas-container');
  if (container) {
    initHeroScene(container);
  }

  const wireframeBtn = document.getElementById('hero-wireframe-toggle');
  if (wireframeBtn) {
    wireframeBtn.addEventListener('click', () => {
      playClickSound();
      const active = toggleWireframe();
      wireframeBtn.classList.toggle('active', active);
    });
  }

  const burstBtn = document.getElementById('hero-particle-burst');
  if (burstBtn) {
    burstBtn.addEventListener('click', () => {
      playWarpSound();
      triggerParticleBurst();
    });
  }

  const shapeBtn = document.getElementById('hero-shape-change');
  if (shapeBtn) {
    shapeBtn.addEventListener('click', () => {
      playWarpSound();
      const geo = switchGeometryCore();
      shapeBtn.querySelector('i').className = 'fa-solid fa-sync fa-spin';
      setTimeout(() => {
        shapeBtn.querySelector('i').className = 'fa-solid fa-shapes';
      }, 500);
    });
  }
}

/* Typewriter Animation */
function initTypewriter() {
  const typewriter = document.getElementById('typewriter');
  if (!typewriter) return;

  const phrases = [
    '3D Web Experiences',
    'MERN Stack Architecture',
    'WebGL Graphics & Shaders',
    'Interactive Extensions'
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function type() {
    const current = phrases[phraseIdx];
    
    if (isDeleting) {
      typewriter.textContent = current.substring(0, charIdx - 1);
      charIdx--;
    } else {
      typewriter.textContent = current.substring(0, charIdx + 1);
      charIdx++;
    }

    let typeSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && charIdx === current.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
  }

  type();
}

/* 3D Skills Universe */
function initSkillsUniverseSection() {
  const container = document.getElementById('skills-canvas-container');
  if (!container) return;

  initSkillUniverse(container, (skill) => {
    playWarpSound();
    updateSkillDetailCard(skill);
  });

  const layoutBtns = document.querySelectorAll('.layout-toggle-btns .btn-chip');
  layoutBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playClickSound();
      layoutBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (btn.id === 'skill-layout-sphere') setLayout('sphere');
      if (btn.id === 'skill-layout-helix') setLayout('helix');
      if (btn.id === 'skill-layout-grid') setLayout('grid');
    });
  });
}

function updateSkillDetailCard(skill) {
  const nameEl = document.getElementById('skill-detail-name');
  const catEl = document.getElementById('skill-detail-category');
  const progressEl = document.getElementById('skill-detail-progress');
  const descEl = document.getElementById('skill-detail-desc');
  const iconEl = document.getElementById('skill-detail-icon');
  const projectsEl = document.getElementById('skill-detail-projects');

  if (nameEl) nameEl.textContent = skill.name;
  if (catEl) catEl.textContent = skill.category;
  if (progressEl) progressEl.style.width = skill.level;
  if (descEl) descEl.textContent = skill.desc;
  if (iconEl) iconEl.innerHTML = `<i class="${skill.icon}"></i>`;

  if (projectsEl) {
    projectsEl.innerHTML = skill.projects.map(p => `<span class="tag">${p}</span>`).join('');
  }
}

/* 3D Tilt Card Effect */
function init3DTiltCards() {
  const cards = document.querySelectorAll('.tilt-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/* Project Filter Pills */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playClickSound();
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });

  // Modal Inspection Handlers
  const inspectBtns = document.querySelectorAll('.inspect-project-btn');
  const modal = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalRepo = document.getElementById('modal-repo-link');
  const closeBtn = document.getElementById('modal-close-btn');
  const dismissBtn = document.getElementById('modal-dismiss-btn');

  const projectDetails = {
    'portfolio-mern': {
      title: 'portfolio-mern',
      desc: 'Full-Stack MERN Developer Portfolio application featuring responsive dark design, REST API endpoints, MongoDB schemas, and dynamic project showcasing.',
      repo: 'https://github.com/vishnuvardhan077/portfolio-mern',
      tags: ['MongoDB', 'Express', 'React', 'Node.js', 'REST API']
    },
    'Student_Course_Management_System': {
      title: 'Student Course Management System',
      desc: 'System application developed in Java for managing student course enrollments, grade calculations, professor allocations, and academic reports.',
      repo: 'https://github.com/vishnuvardhan077/Student_Course_Management_System',
      tags: ['Java', 'OOP', 'Data Structures', 'Database Design']
    },
    'cricket-extension': {
      title: 'Cricket Hub Chrome Extension',
      desc: 'Manifest v3 Google Chrome Extension providing live match scores, team schedules, custom new tab widgets, and background score notifications.',
      repo: '#',
      tags: ['JavaScript ES6+', 'Manifest V3', 'HTML5/CSS3', 'Storage API']
    },
    'Mini-project': {
      title: 'Mini-project Full Stack Application',
      desc: 'Modular full-stack application exploring state management, component lifecycles, and rapid API integrations.',
      repo: 'https://github.com/vishnuvardhan077/Mini-project',
      tags: ['JavaScript', 'React', 'Node.js', 'CSS Modules']
    },
    'java-project': {
      title: 'java-project Repository',
      desc: 'Core Java repository containing algorithmic challenges, clean software architecture, object-oriented concepts, and data structures.',
      repo: 'https://github.com/vishnuvardhan077/java-project',
      tags: ['Java Core', 'Algorithms', 'Data Structures']
    }
  };

  inspectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playWarpSound();
      const id = btn.getAttribute('data-id');
      const details = projectDetails[id];
      if (details && modal) {
        if (modalTitle) modalTitle.textContent = details.title;
        if (modalDesc) modalDesc.textContent = details.desc;
        if (modalRepo) modalRepo.href = details.repo;

        const tagsContainer = document.getElementById('modal-tags');
        if (tagsContainer) {
          tagsContainer.innerHTML = details.tags.map(t => `<span class="tag">${t}</span>`).join('');
        }

        modal.classList.remove('hidden');
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
  if (dismissBtn) dismissBtn.addEventListener('click', () => modal.classList.add('hidden'));
}

/* GitHub Live Sync */
async function initGitHubSync() {
  try {
    const res = await fetch('https://api.github.com/users/vishnuvardhan077/repos');
    if (!res.ok) return;
    const repos = await res.json();

    repos.forEach(repo => {
      const card = document.querySelector(`.project-card[data-id="${repo.name}"]`);
      if (card) {
        const descEl = card.querySelector('.project-desc');
        if (descEl && repo.description) {
          descEl.textContent = repo.description;
        }

        if (repo.stargazers_count > 0) {
          const tags = card.querySelector('.project-tags');
          if (tags) {
            tags.innerHTML += `<span class="tag"><i class="fa-solid fa-star" style="color:#f59e0b;"></i> ${repo.stargazers_count}</span>`;
          }
        }
      }
    });
  } catch (e) {
    // Fallback gracefully
  }
}

/* 3D Studio Playground Section */
function init3DStudioSection() {
  const container = document.getElementById('playground-canvas-container');
  const fpsEl = document.getElementById('fps-counter');

  if (container) {
    initPlayground(container, (fps) => {
      if (fpsEl) fpsEl.textContent = `${fps} FPS`;
    });
  }

  const geoChips = document.querySelectorAll('.studio-controls-panel .chip-btn');
  geoChips.forEach(chip => {
    chip.addEventListener('click', () => {
      playClickSound();
      geoChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      setPlaygroundGeometry(chip.getAttribute('data-geo'));
    });
  });

  const colorDots = document.querySelectorAll('.color-dot');
  colorDots.forEach(dot => {
    dot.addEventListener('click', () => {
      playClickSound();
      colorDots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      setPlaygroundColor(dot.getAttribute('data-color'));
    });
  });

  const speedSlider = document.getElementById('slider-speed');
  if (speedSlider) {
    speedSlider.addEventListener('input', (e) => {
      document.getElementById('val-speed').textContent = `${e.target.value}x`;
      setPlaygroundSpeed(e.target.value);
    });
  }

  const metalSlider = document.getElementById('slider-metal');
  if (metalSlider) {
    metalSlider.addEventListener('input', (e) => {
      document.getElementById('val-metal').textContent = e.target.value;
      setPlaygroundMetalness(e.target.value);
    });
  }

  const roughSlider = document.getElementById('slider-rough');
  if (roughSlider) {
    roughSlider.addEventListener('input', (e) => {
      document.getElementById('val-rough').textContent = e.target.value;
      setPlaygroundRoughness(e.target.value);
    });
  }

  const wireframeBtn = document.getElementById('studio-wireframe-toggle');
  if (wireframeBtn) {
    wireframeBtn.addEventListener('click', () => {
      playClickSound();
      const active = togglePlaygroundWireframe();
      wireframeBtn.classList.toggle('active', active);
    });
  }

  const particleBtn = document.getElementById('studio-spawn-particles');
  if (particleBtn) {
    particleBtn.addEventListener('click', () => {
      playWarpSound();
      spawnStudioParticles();
    });
  }
}

/* Contact Form Handling */
function initContactForm() {
  const form = document.getElementById('contact-form');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    playWarpSound();
    triggerParticleBurst();
    showToast('🚀 3D Signal Transmitted to Vishnu!');
    form.reset();
  });
}

/* Navigation scroll & mobile menu */
function initNavigation() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const backToTop = document.getElementById('back-to-top');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      playClickSound();
      navMenu.classList.toggle('active');
    });
  }

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      playWarpSound();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
