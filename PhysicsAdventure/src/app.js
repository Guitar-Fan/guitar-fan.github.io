/**
 * Main Application Controller - Fixed version
 * Uses external libraries for most functionality
 */

// Global game instance
let gameManager = null;

// Loading tips
const loadingTips = [
    "🚀 Tip: Click anywhere on the game screen to add physics objects!",
    "⚡ Tip: Press SPACE to add random objects and watch them fall!",
    "🌍 Tip: Each planet has different gravity - experiment with forces!",
    "🎯 Tip: Use the physics data panel to understand object behavior!",
    "🔬 Tip: The Escapist challenges the laws of physics - teach them!"
];

// Sound effects using simple Web Audio API
const simpleSounds = {
    buttonClick: () => {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'square';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            // Ignore audio errors
        }
    },
    
    buttonHover: () => {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 600;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.05);
        } catch (e) {
            // Ignore audio errors
        }
    }
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('🚀 Starting Physics Adventure...');
        
        // Initialize background effects
        initializeBackgroundEffects();
        
        // Initialize loading system
        initializeLoadingSystem();
        
        // Create and initialize Phaser game manager
        updateLoadingProgress('Creating Game Manager...', 10);
        gameManager = new PhaserGameManager();
        
        if (!gameManager) {
            throw new Error('PhaserGameManager could not be created');
        }
        
        // Initialize components step by step
        updateLoadingProgress('Initializing Physics Engine...', 30);
        await delay(500);
        
        updateLoadingProgress('Setting up User Interface...', 50);
        await delay(500);
        
        updateLoadingProgress('Loading Audio Systems...', 70);
        await delay(500);
        
        updateLoadingProgress('Finalizing Setup...', 90);
        await delay(500);
        
        // Setup UI interactions
        setupUIInteractions();
        
        updateLoadingProgress('Ready to Play!', 100);
        
        // Hide loading and show menu
        setTimeout(() => {
            hideLoadingScreen(); // This will automatically show main menu
            initializeMenuAnimations();
        }, 1000);
        
        console.log('✅ Physics Adventure initialized successfully!');
        
    } catch (error) {
        console.error('❌ Failed to initialize Physics Adventure:', error);
        showError(`Initialization failed: ${error.message}`);
    }
});

// Helper function for delays
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Background effects initialization
function initializeBackgroundEffects() {
    console.log('🌟 Initializing background effects...');
    
    // Initialize particles.js
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 100 },
                color: { value: "#00d4ff" },
                shape: { type: "circle" },
                opacity: {
                    value: 0.6,
                    random: true,
                    anim: { enable: true, speed: 1 }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: { enable: true, speed: 2 }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#00d4ff",
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: "none",
                    random: true,
                    out_mode: "out"
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "repulse" },
                    onclick: { enable: true, mode: "push" }
                }
            },
            retina_detect: true
        });
        console.log('✨ Particles.js initialized');
    }
}

// Loading system
function initializeLoadingSystem() {
    let currentTipIndex = 0;
    
    // Rotate loading tips
    setInterval(() => {
        const tipElement = document.getElementById('loadingTip');
        if (tipElement && document.getElementById('loadingScreen').classList.contains('active')) {
            currentTipIndex = (currentTipIndex + 1) % loadingTips.length;
            
            // Animate tip change
            tipElement.style.opacity = '0';
            setTimeout(() => {
                tipElement.textContent = loadingTips[currentTipIndex];
                tipElement.style.opacity = '1';
            }, 300);
        }
    }, 3000);
}

function updateLoadingProgress(message, progress) {
    console.log(`📊 Loading: ${message} (${progress}%)`);
    
    const messageEl = document.getElementById('loadingMessage');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const stepEl = document.getElementById('loadingStep');
    
    if (messageEl) messageEl.textContent = message;
    if (progressBar) progressBar.style.width = `${progress}%`;
    if (progressText) progressText.textContent = `${progress}%`;
    if (stepEl) stepEl.textContent = getStepName(progress);
}

function getStepName(progress) {
    if (progress < 20) return 'Initializing...';
    if (progress < 40) return 'Loading Physics...';
    if (progress < 60) return 'Setting up Audio...';
    if (progress < 80) return 'Preparing UI...';
    if (progress < 90) return 'Loading Story...';
    if (progress < 100) return 'Configuring Controls...';
    return 'Ready!';
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        // Use CSS transition for smooth fade out
        loadingScreen.style.transition = 'opacity 1s ease-in-out, transform 1s ease-in-out';
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            loadingScreen.classList.remove('active');
            loadingScreen.style.display = 'none';
            // Show main menu after loading screen is hidden
            showScreen('mainMenu');
        }, 1000);
    }
}

// Screen management
function showScreen(screenId) {
    console.log(`🖥️ Showing screen: ${screenId}`);
    
    // Hide all screens first
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
        screen.style.display = 'none';
    });
    
    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.style.display = 'flex';
        targetScreen.classList.add('active');
        
        // Screen-specific animations using CSS
        targetScreen.style.opacity = '0';
        targetScreen.style.transform = 'scale(0.9)';
        targetScreen.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        
        // Trigger animation
        setTimeout(() => {
            targetScreen.style.opacity = '1';
            targetScreen.style.transform = 'scale(1)';
        }, 50);
    } else {
        console.error(`Screen not found: ${screenId}`);
    }
}

// Menu animations
function initializeMenuAnimations() {
    console.log('🎭 Initializing menu animations (CSS fallback)...');
    
    // CSS animations are already applied via classes in HTML
    // Just add event listeners for interactions
    
    // Add hover sound effects and visual feedback to buttons
    document.querySelectorAll('.menu-button').forEach((button, index) => {
        // Add staggered animation delay
        button.style.animationDelay = `${index * 0.2}s`;
        
        button.addEventListener('mouseenter', () => {
            simpleSounds.buttonHover();
            // CSS hover effects are already defined
        });
        
        button.addEventListener('click', () => {
            simpleSounds.buttonClick();
            // Add click feedback with CSS class
            button.classList.add('clicked');
            setTimeout(() => {
                button.classList.remove('clicked');
            }, 150);
        });
    });
    
    // Trigger the title animation
    const gameTitle = document.getElementById('gameTitle');
    if (gameTitle) {
        gameTitle.classList.add('animate-float');
    }
}

// UI Interactions
function setupUIInteractions() {
    console.log('🎮 Setting up UI interactions...');
    
    // Start Game Button
    document.getElementById('startGameBtn')?.addEventListener('click', () => {
        console.log('🎯 Starting adventure with story...');
        showScreen('introStoryScreen');
        
        // Initialize story manager if not already done
        if (!window.storyManager) {
            window.storyManager = new StoryManager();
        } else {
            window.storyManager.reset();
        }
    });
    
    // Tutorial Button
    document.getElementById('tutorialBtn')?.addEventListener('click', () => {
        console.log('📚 Opening tutorial...');
        Swal.fire({
            title: '🎓 Physics Tutorial',
            html: `
                <div class="text-left space-y-4">
                    <div class="bg-blue-900/20 p-3 rounded border border-blue-500/30">
                        <h3 class="text-blue-400 font-bold mb-2">🎯 How to Play</h3>
                        <ul class="text-sm text-gray-300 space-y-1">
                            <li>• Click anywhere to create physics objects</li>
                            <li>• Drag objects to apply forces</li>
                            <li>• Watch objects interact under gravity</li>
                            <li>• Learn by experimenting!</li>
                        </ul>
                    </div>
                    
                    <div class="bg-purple-900/20 p-3 rounded border border-purple-500/30">
                        <h3 class="text-purple-400 font-bold mb-2">🎮 Controls</h3>
                        <ul class="text-sm text-gray-300 space-y-1">
                            <li>• <strong>Click:</strong> Create objects</li>
                            <li>• <strong>Drag:</strong> Apply forces</li>
                            <li>• <strong>Space:</strong> Pause/Resume</li>
                            <li>• <strong>R:</strong> Reset level</li>
                            <li>• <strong>1-5:</strong> Switch levels</li>
                        </ul>
                    </div>
                </div>
            `,
            background: 'rgba(15, 23, 42, 0.95)',
            color: '#e2e8f0',
            confirmButtonColor: '#3b82f6',
            confirmButtonText: 'Start Learning!',
            customClass: {
                popup: 'border border-blue-500/30'
            },
            width: '600px'
        });
    });
    
    // Concepts Button
    document.getElementById('conceptsBtn')?.addEventListener('click', () => {
        console.log('🧪 Opening physics lab...');
        Swal.fire({
            title: '🧪 Physics Lab',
            html: `
                <div class="text-left space-y-4">
                    <div class="grid grid-cols-2 gap-3">
                        <div class="bg-green-900/20 p-3 rounded border border-green-500/30">
                            <h3 class="text-green-400 font-bold mb-2">🌍 Gravity</h3>
                            <p class="text-xs text-gray-300">F = G(m₁m₂)/r²</p>
                            <p class="text-sm text-gray-300">Objects attract each other with force proportional to their masses</p>
                        </div>
                        <div class="bg-yellow-900/20 p-3 rounded border border-yellow-500/30">
                            <h3 class="text-yellow-400 font-bold mb-2">⚡ Energy</h3>
                            <p class="text-xs text-gray-300">E = KE + PE</p>
                            <p class="text-sm text-gray-300">Energy is conserved in all interactions</p>
                        </div>
                        <div class="bg-red-900/20 p-3 rounded border border-red-500/30">
                            <h3 class="text-red-400 font-bold mb-2">🎯 Momentum</h3>
                            <p class="text-xs text-gray-300">p = mv</p>
                            <p class="text-sm text-gray-300">Moving objects have momentum that is conserved</p>
                        </div>
                        <div class="bg-purple-900/20 p-3 rounded border border-purple-500/30">
                            <h3 class="text-purple-400 font-bold mb-2">💪 Force</h3>
                            <p class="text-xs text-gray-300">F = ma</p>
                            <p class="text-sm text-gray-300">Force equals mass times acceleration</p>
                        </div>
                    </div>
                </div>
            `,
            background: 'rgba(15, 23, 42, 0.95)',
            color: '#e2e8f0',
            confirmButtonColor: '#3b82f6',
            confirmButtonText: 'Experiment!',
            customClass: {
                popup: 'border border-blue-500/30'
            },
            width: '700px'
        });
    });
    
    // Story Manager Event Listener - Transition to First Puzzle
    document.addEventListener('startFirstPuzzle', () => {
        console.log('🧩 Starting first puzzle...');
        showScreen('gameScreen');
        
        // Initialize Phaser game manager for the first puzzle
        if (!gameManager) {
            gameManager = new PhaserGameManager();
        }
        
        const success = gameManager.init('gameCanvas');
        if (success) {
            console.log('✅ Phaser game initialized successfully');
        } else {
            showError('Failed to initialize Phaser game engine');
        }
    });
    
    // Back buttons
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            console.log('🔙 Returning to menu...');
            showScreen('mainMenu');
        });
    });
    
    // Pause button
    document.getElementById('pauseBtn')?.addEventListener('click', () => {
        if (gameManager && gameManager.game) {
            if (gameManager.game.scene.isPaused()) {
                gameManager.game.scene.resume();
            } else {
                gameManager.game.scene.pause();
            }
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'Escape':
                if (gameManager && gameManager.game) {
                    showScreen('mainMenu');
                }
                break;
            case 'F1':
                Swal.fire({
                    title: '🎓 Tutorial',
                    text: 'Tutorial functionality coming soon!',
                    icon: 'info'
                });
                break;
            case 'F2':
                Swal.fire({
                    title: '🧪 Physics Lab',
                    text: 'Physics lab functionality coming soon!',
                    icon: 'info'
                });
                break;
        }
    });
}

// Physics Lab initialization
function initializePhysicsLab() {
    const conceptsGrid = document.querySelector('#conceptsScreen .grid');
    if (!conceptsGrid) return;
    
    const concepts = [
        {
            title: "Gravity",
            formula: "F = G(m₁m₂)/r²",
            description: "Objects with mass attract each other",
            icon: "🌍"
        },
        {
            title: "Energy",
            formula: "E = KE + PE",
            description: "Energy cannot be created or destroyed",
            icon: "⚡"
        },
        {
            title: "Momentum",
            formula: "p = mv",
            description: "Moving objects have momentum",
            icon: "🎯"
        },
        {
            title: "Force",
            formula: "F = ma",
            description: "Force equals mass times acceleration",
            icon: "💪"
        },
        {
            title: "Friction",
            formula: "f = μN",
            description: "Friction opposes motion",
            icon: "🔥"
        },
        {
            title: "Waves",
            formula: "v = fλ",
            description: "Wave speed equals frequency times wavelength",
            icon: "🌊"
        }
    ];
    
    conceptsGrid.innerHTML = concepts.map(concept => `
        <div class="glass-effect rounded-xl p-6 space-y-4 hover:bg-white/20 transition-all cursor-pointer transform hover:scale-105">
            <div class="text-4xl">${concept.icon}</div>
            <h3 class="text-2xl font-bold text-physics-blue">${concept.title}</h3>
            <div class="bg-black/30 rounded p-3 font-mono text-physics-light text-lg">
                ${concept.formula}
            </div>
            <p class="text-white/80">${concept.description}</p>
        </div>
    `).join('');
}

// Error handling
function showError(message) {
    console.error('❌ Error:', message);
    
    const errorDisplay = document.getElementById('errorDisplay');
    const errorMessage = document.getElementById('errorMessage');
    
    if (errorDisplay && errorMessage) {
        errorMessage.textContent = message;
        errorDisplay.classList.remove('hidden');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorDisplay.classList.add('hidden');
        }, 5000);
    }
    
    // Also show with SweetAlert2 if available
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: 'Error',
            text: message,
            icon: 'error',
            background: '#1a1a3e',
            color: '#ffffff',
            confirmButtonColor: '#ff4444'
        });
    }
}

// Window resize handler
window.addEventListener('resize', () => {
    if (gameManager && gameManager.game) {
        gameManager.game.scale.refresh();
    }
});

// Export globals for debugging
window.gameManager = gameManager;
window.showScreen = showScreen;
window.simpleSounds = simpleSounds;

console.log('📋 App.js loaded successfully');