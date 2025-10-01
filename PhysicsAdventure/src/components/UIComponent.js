/**
 * UI Component Manager - Handles all UI interactions using external libraries
 * Uses SweetAlert2 for modals, CSS animations, and Tailwind CSS classes
 */

class UIComponent {
    constructor() {
        this.isInitialized = false;
        this.currentLevel = 1;
        this.gameState = 'menu';
        this.audioEnabled = true;
        
        // Initialize after DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }
    
    init() {
        this.setupEventListeners();
        this.initializeAnimations();
        this.isInitialized = true;
        console.log('UI Component initialized with external libraries');
    }
    
    setupEventListeners() {
        // Start Game Button
        const startBtn = document.getElementById('startGame');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startGame());
        }
        
        // Instructions Button
        const instructionsBtn = document.getElementById('showInstructions');
        if (instructionsBtn) {
            instructionsBtn.addEventListener('click', () => this.showInstructions());
        }
        
        // Level Buttons
        document.querySelectorAll('.level-btn').forEach((btn, index) => {
            btn.addEventListener('click', () => this.loadLevel(index + 1));
        });
        
        // Back to Menu Button
        const backBtn = document.getElementById('backToMenu');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.showMenu());
        }
        
        // Audio Toggle
        const audioBtn = document.getElementById('toggleAudio');
        if (audioBtn) {
            audioBtn.addEventListener('click', () => this.toggleAudio());
        }
    }
    
    initializeAnimations() {
        console.log('UI animations initialized with CSS fallback');
        // All animations are now handled by CSS classes in main.html
        // No GSAP dependencies needed
    }
    
    async startGame() {
        console.log('Starting Physics Adventure...');
        
        // This function is now handled by the main app.js
        // Screen transitions are managed there
        this.gameState = 'playing';
        
        // Show welcome message using SweetAlert2
        await Swal.fire({
            title: 'Welcome to Physics Adventure!',
            html: `
                <div class="text-left space-y-3">
                    <p class="text-blue-400">🚀 <strong>Your Mission:</strong></p>
                    <p class="text-sm text-gray-300">Help The Escapist understand physics laws by creating interactive demonstrations!</p>
                    <p class="text-purple-400">🌟 <strong>Level 1: Basic Gravity</strong></p>
                    <p class="text-sm text-gray-300">Click anywhere to create objects and watch them fall under Earth's gravity.</p>
                </div>
            `,
            icon: 'info',
            background: 'rgba(15, 23, 42, 0.95)',
            color: '#e2e8f0',
            confirmButtonColor: '#3b82f6',
            confirmButtonText: 'Start Adventure!',
            customClass: {
                popup: 'border border-blue-500/30'
            }
        });
        
        // Start the game logic
        if (window.gameManager) {
            window.gameManager.startLevel(1);
        }
    }
    
    async showInstructions() {
        await Swal.fire({
            title: '🎮 How to Play',
            html: `
                <div class="text-left space-y-4">
                    <div class="bg-blue-900/20 p-3 rounded border border-blue-500/30">
                        <h3 class="text-blue-400 font-bold mb-2">🎯 Objective</h3>
                        <p class="text-sm text-gray-300">The Escapist has broken free from the laws of physics! Help them understand fundamental physics concepts through interactive demonstrations.</p>
                    </div>
                    
                    <div class="bg-purple-900/20 p-3 rounded border border-purple-500/30">
                        <h3 class="text-purple-400 font-bold mb-2">🎮 Controls</h3>
                        <ul class="text-sm text-gray-300 space-y-1">
                            <li>• <strong>Click:</strong> Create physics objects</li>
                            <li>• <strong>Drag:</strong> Apply forces to objects</li>
                            <li>• <strong>Space:</strong> Pause/Resume simulation</li>
                            <li>• <strong>R:</strong> Reset level</li>
                        </ul>
                    </div>
                    
                    <div class="bg-green-900/20 p-3 rounded border border-green-500/30">
                        <h3 class="text-green-400 font-bold mb-2">🌍 Physics Concepts</h3>
                        <ul class="text-sm text-gray-300 space-y-1">
                            <li>• <strong>Gravity:</strong> Objects fall towards massive bodies</li>
                            <li>• <strong>Momentum:</strong> Moving objects tend to stay in motion</li>
                            <li>• <strong>Energy:</strong> Kinetic and potential energy conservation</li>
                            <li>• <strong>Forces:</strong> Push and pull interactions</li>
                        </ul>
                    </div>
                </div>
            `,
            background: 'rgba(15, 23, 42, 0.95)',
            color: '#e2e8f0',
            confirmButtonColor: '#3b82f6',
            confirmButtonText: 'Got It!',
            customClass: {
                popup: 'border border-blue-500/30'
            },
            width: '600px'
        });
    }
    
    showMenu() {
        this.gameState = 'menu';
        
        // Screen transitions are now handled by main app.js
        // Just update the game state
        console.log('Returning to menu');
    }
    
    loadLevel(levelNumber) {
        this.currentLevel = levelNumber;
        console.log(`Loading level ${levelNumber}`);
        
        if (window.gameManager) {
            window.gameManager.startLevel(levelNumber);
        }
        
        // Update UI to show current level
        this.updateLevelIndicator(levelNumber);
        
        // Show level briefing
        this.showLevelBriefing(levelNumber);
    }
    
    updateLevelIndicator(level) {
        const indicator = document.getElementById('levelIndicator');
        if (indicator) {
            indicator.textContent = `Level ${level}`;
            // Use CSS transitions instead of GSAP
            indicator.style.transition = 'all 0.5s ease';
            indicator.style.transform = 'scale(1.1)';
            indicator.style.color = '#10b981';
            
            setTimeout(() => {
                indicator.style.transform = 'scale(1)';
                indicator.style.color = '#3b82f6';
            }, 500);
        }
    }
    
    async showLevelBriefing(level) {
        const briefings = {
            1: {
                title: '🌍 Level 1: Earth Gravity',
                content: 'Learn about gravitational force on Earth. Objects fall at 9.8 m/s². Click to create objects and observe gravity!'
            },
            2: {
                title: '🌙 Level 2: Moon Gravity',
                content: 'Experience reduced gravity on the Moon (1.6 m/s²). Notice how objects fall more slowly!'
            },
            3: {
                title: '💫 Level 3: Space Station',
                content: 'Zero gravity environment! Objects float unless acted upon by external forces.'
            },
            4: {
                title: '🪐 Level 4: Jupiter',
                content: 'Intense gravity (24.8 m/s²)! Objects fall much faster on this gas giant.'
            },
            5: {
                title: '⭐ Level 5: Asteroid',
                content: 'Minimal gravity on a small asteroid. Master precise movements and momentum!'
            }
        };
        
        const briefing = briefings[level];
        if (briefing) {
            await Swal.fire({
                title: briefing.title,
                text: briefing.content,
                icon: 'info',
                background: 'rgba(15, 23, 42, 0.95)',
                color: '#e2e8f0',
                confirmButtonColor: '#3b82f6',
                confirmButtonText: 'Start Level!',
                customClass: {
                    popup: 'border border-blue-500/30'
                }
            });
        }
    }
    
    toggleAudio() {
        this.audioEnabled = !this.audioEnabled;
        const audioBtn = document.getElementById('toggleAudio');
        
        if (audioBtn) {
            audioBtn.textContent = this.audioEnabled ? '🔊' : '🔇';
            audioBtn.title = this.audioEnabled ? 'Mute Audio' : 'Enable Audio';
        }
        
        // Simple audio feedback
        if (this.audioEnabled) {
            this.playSound('toggle');
        }
        
        console.log(`Audio ${this.audioEnabled ? 'enabled' : 'disabled'}`);
    }
    
    playSound(type) {
        if (!this.audioEnabled) return;
        
        // Simple Web Audio API sound generation
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Different sounds for different actions
        const frequencies = {
            click: 800,
            success: 1000,
            toggle: 600,
            error: 300
        };
        
        oscillator.frequency.setValueAtTime(frequencies[type] || 500, audioContext.currentTime);
        oscillator.type = 'square';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    }
    
    showPhysicsData(data) {
        const dataContainer = document.getElementById('physicsData');
        if (dataContainer && data) {
            dataContainer.innerHTML = `
                <div class="grid grid-cols-2 gap-2 text-xs">
                    <div class="bg-blue-900/20 p-2 rounded border border-blue-500/30">
                        <div class="text-blue-400 font-bold">Gravity</div>
                        <div class="text-white">${data.gravity?.toFixed(1)} m/s²</div>
                    </div>
                    <div class="bg-green-900/20 p-2 rounded border border-green-500/30">
                        <div class="text-green-400 font-bold">Objects</div>
                        <div class="text-white">${data.objectCount || 0}</div>
                    </div>
                    <div class="bg-purple-900/20 p-2 rounded border border-purple-500/30">
                        <div class="text-purple-400 font-bold">Energy</div>
                        <div class="text-white">${data.totalEnergy?.toFixed(0)} J</div>
                    </div>
                    <div class="bg-yellow-900/20 p-2 rounded border border-yellow-500/30">
                        <div class="text-yellow-400 font-bold">Time</div>
                        <div class="text-white">${data.time?.toFixed(1)} s</div>
                    </div>
                </div>
            `;
        }
    }
    
    showError(message) {
        Swal.fire({
            title: 'Error',
            text: message,
            icon: 'error',
            background: 'rgba(15, 23, 42, 0.95)',
            color: '#e2e8f0',
            confirmButtonColor: '#ef4444'
        });
    }
    
    showSuccess(message) {
        Swal.fire({
            title: 'Success!',
            text: message,
            icon: 'success',
            background: 'rgba(15, 23, 42, 0.95)',
            color: '#e2e8f0',
            confirmButtonColor: '#10b981'
        });
    }
}

// Initialize UI component
window.uiComponent = new UIComponent();