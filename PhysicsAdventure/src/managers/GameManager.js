/**
 * Modern GameManager using external libraries
 */
class GameManager {
    constructor() {
        console.log('Creating GameManager...');
        
        // Initialize Matter.js physics engine
        this.engine = Matter.Engine.create();
        this.world = this.engine.world;
        this.render = null;
        this.runner = null;
        
        // Game state
        this.gameState = 'menu';
        this.currentLevel = 0;
        this.isInitialized = false;
        
        // Managers
        this.soundManager = null;
        this.uiManager = null;
        this.storyManager = null;
        
        // Game objects
        this.player = null;
        this.escapist = null;
        this.objects = [];
        
        // Event system
        this.events = new EventTarget();
        
        console.log('GameManager created successfully');
    }
    
    async initialize() {
        try {
            console.log('Initializing GameManager...');
            
            // Initialize physics renderer
            this.emitProgress('Initializing Physics Engine...', 20);
            await this.initializePhysics();
            
            // Initialize sound system
            this.emitProgress('Loading Audio System...', 40);
            await this.initializeAudio();
            
            // Initialize UI
            this.emitProgress('Setting up Interface...', 60);
            await this.initializeUI();
            
            // Initialize story system
            this.emitProgress('Loading Story System...', 80);
            await this.initializeStory();
            
            // Initialize input handling
            this.emitProgress('Configuring Controls...', 90);
            await this.initializeInput();
            
            this.emitProgress('Game Ready!', 100);
            this.isInitialized = true;
            
            console.log('GameManager initialized successfully');
            
        } catch (error) {
            console.error('GameManager initialization failed:', error);
            this.emitError(error);
            throw error;
        }
    }
    
    async initializePhysics() {
        const canvas = document.getElementById('gameCanvas');
        if (!canvas) {
            throw new Error('Game canvas not found');
        }
        
        // Create Matter.js renderer
        this.render = Matter.Render.create({
            canvas: canvas,
            engine: this.engine,
            options: {
                width: window.innerWidth,
                height: window.innerHeight,
                wireframes: false,
                background: 'transparent',
                showAngleIndicator: true,
                showVelocity: true
            }
        });
        
        // Create physics runner
        this.runner = Matter.Runner.create();
        
        // Add some test objects
        const ground = Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight - 30, window.innerWidth, 60, { 
            isStatic: true,
            render: { fillStyle: '#00d4ff' }
        });
        
        Matter.World.add(this.world, [ground]);
        
        console.log('Physics engine initialized');
    }
    
    async initializeAudio() {
        this.soundManager = {
            sounds: {},
            play: (name) => {
                console.log(`Playing sound: ${name}`);
                // Simplified sound system
            },
            load: (name, src) => {
                console.log(`Loading sound: ${name}`);
            }
        };
        
        console.log('Audio system initialized');
    }
    
    async initializeUI() {
        this.uiManager = {
            showModal: (id) => {
                console.log(`Showing modal: ${id}`);
            },
            hideModal: (id) => {
                console.log(`Hiding modal: ${id}`);
            },
            updateHUD: (data) => {
                // Update physics display
                const velocity = document.getElementById('velocityDisplay');
                const force = document.getElementById('forceDisplay');
                const energy = document.getElementById('energyDisplay');
                
                if (velocity) velocity.textContent = `${(data.velocity || 0).toFixed(1)} m/s`;
                if (force) force.textContent = `${(data.force || 0).toFixed(1)} N`;
                if (energy) energy.textContent = `${(data.energy || 0).toFixed(1)} J`;
            }
        };
        
        console.log('UI system initialized');
    }
    
    async initializeStory() {
        this.storyManager = {
            currentChapter: 0,
            start: () => {
                console.log('Story system started');
                this.showStory();
            },
            startChapter: (chapterId) => {
                console.log(`Starting chapter: ${chapterId}`);
                this.showStory();
            }
        };
        
        console.log('Story system initialized');
    }
    
    async initializeInput() {
        // Mouse controls for canvas
        const canvas = document.getElementById('gameCanvas');
        if (canvas) {
            canvas.addEventListener('click', (e) => {
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Add a physics object at click position
                this.addPhysicsObject(x, y);
            });
        }
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'Escape':
                    this.pause();
                    break;
                case ' ':
                    e.preventDefault();
                    this.addRandomObject();
                    break;
            }
        });
        
        console.log('Input system initialized');
    }
    
    // Game control methods
    start() {
        console.log('Starting game...');
        this.gameState = 'playing';
        
        if (this.render && this.runner) {
            Matter.Render.run(this.render);
            Matter.Runner.run(this.runner, this.engine);
        }
        
        this.startGameLoop();
    }
    
    pause() {
        console.log('Pausing game...');
        this.gameState = 'paused';
        
        if (this.runner) {
            Matter.Runner.stop(this.runner);
        }
    }
    
    resume() {
        console.log('Resuming game...');
        this.gameState = 'playing';
        
        if (this.runner) {
            Matter.Runner.run(this.runner, this.engine);
        }
    }
    
    startGameLoop() {
        const update = () => {
            if (this.gameState === 'playing') {
                this.update();
            }
            requestAnimationFrame(update);
        };
        update();
    }
    
    update() {
        // Update physics display
        this.uiManager.updateHUD({
            velocity: Math.random() * 10, // Placeholder
            force: Math.random() * 5,
            energy: Math.random() * 20
        });
    }
    
    // Physics object creation
    addPhysicsObject(x, y) {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        const ball = Matter.Bodies.circle(x, y, 20, {
            restitution: 0.8,
            render: { fillStyle: color }
        });
        
        Matter.World.add(this.world, ball);
        this.objects.push(ball);
        
        console.log(`Added physics object at (${x}, ${y})`);
    }
    
    addRandomObject() {
        const x = Math.random() * window.innerWidth;
        const y = 100;
        this.addPhysicsObject(x, y);
    }
    
    // Screen management
    showStory() {
        console.log('Showing story screen');
        // Use SweetAlert2 for story display
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'The Great Escape',
                html: `
                    <div class="text-left space-y-4">
                        <p>In the vast cosmos, physics governs all - gravity pulls, momentum carries, energy transforms.</p>
                        <p>But something impossible has happened... an entity known as <strong>The Escapist</strong> has broken free from these fundamental laws!</p>
                        <p>Reality itself begins to unravel. You must restore order to the universe!</p>
                    </div>
                `,
                icon: 'info',
                background: '#1a1a3e',
                color: '#ffffff',
                confirmButtonText: 'Begin Adventure',
                confirmButtonColor: '#00d4ff',
                allowOutsideClick: false
            }).then((result) => {
                if (result.isConfirmed) {
                    this.showScreen('gameScreen');
                    this.start();
                }
            });
        }
    }
    
    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show target screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            console.log(`Showing screen: ${screenId}`);
        }
    }
    
    // Event system
    emitProgress(message, progress) {
        this.events.dispatchEvent(new CustomEvent('progress', {
            detail: { message, progress }
        }));
    }
    
    emitError(error) {
        this.events.dispatchEvent(new CustomEvent('error', {
            detail: { error: error.message }
        }));
    }
    
    on(event, callback) {
        this.events.addEventListener(event, callback);
    }
    
    // Utility methods
    isRunning() {
        return this.gameState === 'playing';
    }
    
    isPaused() {
        return this.gameState === 'paused';
    }
    
    destroy() {
        if (this.render) {
            Matter.Render.stop(this.render);
        }
        if (this.runner) {
            Matter.Runner.stop(this.runner);
        }
        Matter.Engine.clear(this.engine);
    }
}

// Export for use
window.GameManager = GameManager;