/**
 * Game Manager - Enhanced with Phaser.js Graphics
 * Now supports both Matter.js (legacy) and Phaser.js (new enhanced graphics)
 */

class GameManager {
    constructor() {
        // Legacy Matter.js properties (kept for compatibility)
        this.engine = null;
        this.world = null;
        this.render = null;
        this.runner = null;
        this.bodies = [];
        this.isRunning = false;
        this.physicsUtils = null;
        
        // New Phaser.js game manager
        this.phaserGame = null;
        this.usePhaser = true; // Flag to enable new graphics system
        
        // Physics and game state
        this.canvas = null;
        this.canvasWidth = 1200;
        this.canvasHeight = 700;
        
        // Physics Units System - Real world scaling
        this.physics = {
            // 1 meter = 100 pixels for realistic physics
            pixelsPerMeter: 100,
            // Conversion functions
            metersToPixels: (meters) => meters * this.physics.pixelsPerMeter,
            pixelsToMeters: (pixels) => pixels / this.physics.pixelsPerMeter,
            // Standard gravity in m/s² (scaled for Matter.js)
            gravity: 9.81 / 1000, // Matter.js works better with smaller gravity values
            // Human physical constants
            human: {
                height: 1.75, // meters (average human height)
                width: 0.45,  // meters (shoulder width)
                mass: 70,     // kg (average adult mass)
                walkSpeed: 1.4, // m/s (average walking speed)
                runSpeed: 4.0,  // m/s (average running speed)
                jumpVelocity: 3.5 // m/s (vertical jump velocity)
            }
        };
        
        // Game objects
        this.spriteManager = null;
        this.platform = null;
        this.ziplineConstraint = null;
        
        // Puzzle configuration - now in real-world units (meters)
        this.puzzleConfig = {
            gapWidth: 4.0,        // 4 meters gap
            platformWidth: 0.8,   // 80cm platform
            platformHeight: 0.2,  // 20cm thick
            ziplineHeight: 1.5,   // 1.5m high zipline
            leftGroundWidth: 3.0, // 3m ground section
            rightGroundWidth: 3.0,// 3m ground section
            groundHeight: 0.8,    // 80cm ground thickness
            caveWidth: 1.5,       // 1.5m cave entrance
            caveHeight: 2.0       // 2m cave height
        };
        
        // Puzzle state
        this.puzzleState = {
            isActive: false,
            forceApplied: 0,
            platformInPosition: false,
            playerCanJump: false,
            puzzleComplete: false
        };
        
        // Disable object spawning for puzzle mode
        this.objectSpawningEnabled = false; // Future powerup feature
        
        console.log('Zipline Puzzle GameManager initialized');
    }
    
    init() {
        // Get canvas element
        this.canvas = document.getElementById('gameCanvas');
        if (!this.canvas) {
            console.error('Game canvas not found!');
            return false;
        }
        
        // Check if we should use the new Phaser.js graphics system
        if (this.usePhaser && typeof PhaserGameManager !== 'undefined') {
            console.log('🎮 Initializing with enhanced Phaser.js graphics...');
            return this.initPhaserGame();
        } else {
            console.log('🔧 Falling back to Matter.js renderer...');
            return this.initMatterGame();
        }
    }
    
    initPhaserGame() {
        try {
            // Create new Phaser game manager
            this.phaserGame = new PhaserGameManager();
            
            // Initialize the Phaser game
            const success = this.phaserGame.init('gameCanvas');
            
            if (success) {
                this.isRunning = true;
                console.log('✅ Enhanced Phaser graphics system initialized successfully');
                return true;
            } else {
                console.warn('⚠️ Phaser initialization failed, falling back to Matter.js');
                return this.initMatterGame();
            }
        } catch (error) {
            console.error('❌ Error initializing Phaser game:', error);
            console.log('🔧 Falling back to Matter.js system...');
            return this.initMatterGame();
        }
    }
    
    initMatterGame() {
        // Initialize physics utilities
        this.physicsUtils = new PhysicsUtils();
        
        // Set canvas size for proper puzzle layout
        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;
        
        // Create Matter.js engine with realistic physics
        this.engine = Matter.Engine.create();
        this.world = this.engine.world;
        
        // Configure physics engine with real-world gravity
        this.engine.world.gravity.y = this.physics.gravity; // 9.81 m/s² scaled
        this.engine.world.gravity.scale = 0.001; // Matter.js gravity scaling
        this.engine.enableSleeping = false; // Keep physics active for responsive gameplay
        
        // Create Matter.js renderer
        this.render = Matter.Render.create({
            canvas: this.canvas,
            engine: this.engine,
            options: {
                width: this.canvasWidth,
                height: this.canvasHeight,
                wireframes: false,
                background: 'transparent',
                showAngleIndicator: false,
                showVelocity: false
            }
        });
        
        // Initialize sprite manager with physics configuration
        this.spriteManager = new SpriteManager(this.canvas, this.world, this.physics);
        
        // Create a test environment for character movement (even without puzzle)
        this.createTestEnvironment();
        
        // Start renderer
        Matter.Render.run(this.render);
        
        // Setup physics loop
        this.startPhysicsLoop();
        
        // Setup input controls for character movement
        this.setupPuzzleControls();
        
        this.isRunning = true;
        console.log('GameManager initialized successfully with Matter.js fallback');
        return true;
    }
    
    createTestEnvironment() {
        // Create basic ground for character to walk on (even outside puzzle mode)
        const groundWidth = this.canvasWidth;
        const groundHeight = 60;
        const groundY = this.canvasHeight - groundHeight / 2;
        
        const testGround = Matter.Bodies.rectangle(
            groundWidth / 2,
            groundY,
            groundWidth,
            groundHeight,
            {
                isStatic: true,
                label: 'testGround',
                render: {
                    fillStyle: '#444444',
                    strokeStyle: '#666666',
                    lineWidth: 2
                }
            }
        );
        
        Matter.World.add(this.world, testGround);
        
        // Position character on the ground
        if (this.spriteManager) {
            this.spriteManager.setPosition(200, groundY - 100);
        }
        
        console.log('✅ Test environment created - character should be visible and moveable with WASD/Arrow keys');
    }
    
    startPhysicsLoop() {
        this.runner = Matter.Runner.create();
        Matter.Runner.run(this.runner, this.engine);
        
        // Custom render loop for sprites
        const gameLoop = () => {
            if (this.spriteManager) {
                this.spriteManager.update();
                this.drawCustomElements();
            }
            requestAnimationFrame(gameLoop);
        };
        requestAnimationFrame(gameLoop);
        
        console.log('Physics loop started');
    }
    
    drawCustomElements() {
        // Clear canvas for custom drawing
        const ctx = this.canvas.getContext('2d');
        
        // Draw sprites on top of physics bodies
        if (this.spriteManager) {
            this.spriteManager.draw();
        }
        
        // Draw UI elements specific to puzzle
        this.drawPuzzleElements(ctx);
    }
    
    drawPuzzleElements(ctx) {
        // Draw target zone indicator with metric measurements
        if (this.puzzleState.isActive) {
            const gapStartX = this.physics.metersToPixels(3.0); // Left ground ends at 3m
            const targetX = gapStartX + this.physics.metersToPixels(2.0); // 2m into gap
            const targetWidth = this.physics.metersToPixels(0.6); // 60cm target zone
            const targetY = this.canvasHeight - this.physics.metersToPixels(1.0) - this.physics.metersToPixels(1.5) + this.physics.metersToPixels(0.8);
            
            ctx.save();
            ctx.fillStyle = 'rgba(255, 107, 53, 0.4)';
            ctx.fillRect(targetX - targetWidth/2, targetY, targetWidth, this.physics.metersToPixels(0.1));
            
            ctx.fillStyle = '#FF6B35';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('TARGET ZONE', targetX, targetY - 5);
            ctx.font = '10px Arial';
            ctx.fillText('60cm wide', targetX, targetY + this.physics.metersToPixels(0.15));
            ctx.restore();
        }
    }
    
    setupPuzzleControls() {
        // Movement controls for character - works in all game modes
        this.movementKeys = {
            w: false, a: false, s: false, d: false,
            ArrowUp: false, ArrowLeft: false, ArrowDown: false, ArrowRight: false
        };
        
        document.addEventListener('keydown', (e) => {
            // Don't interfere with input fields
            if (e.target.tagName === 'INPUT') return;
            
            // Allow movement in game screen, regardless of puzzle state
            if (this.isRunning && this.spriteManager) {
                if (e.key.toLowerCase() in this.movementKeys || e.key in this.movementKeys) {
                    e.preventDefault();
                    this.movementKeys[e.key.toLowerCase()] = true;
                    this.movementKeys[e.key] = true;
                    this.moveProtagonist();
                }
            }
        });
        
        document.addEventListener('keyup', (e) => {
            if (e.target.tagName === 'INPUT') return;
            
            if (this.isRunning && this.spriteManager) {
                if (e.key.toLowerCase() in this.movementKeys || e.key in this.movementKeys) {
                    this.movementKeys[e.key.toLowerCase()] = false;
                    this.movementKeys[e.key] = false;
                }
            }
        });
        
        // Continuous movement loop for smooth character control
        this.setupContinuousMovement();
    }
    
    setupContinuousMovement() {
        // Use smooth movement updates for responsive character control
        const moveLoop = () => {
            if (this.isRunning && this.spriteManager) {
                this.moveProtagonist();
            }
            requestAnimationFrame(moveLoop);
        };
        requestAnimationFrame(moveLoop);
    }
    
    moveProtagonist() {
        if (!this.spriteManager) return;
        
        // Enhanced movement forces for responsive character control
        const walkForce = 50; // Newtons - realistic human walking force
        const runForce = 100;  // Newtons - for faster movement when holding multiple keys
        const jumpForce = 350; // Newtons - realistic human jump force
        
        let currentForce = walkForce;
        let isMoving = false;
        
        // Horizontal movement with smooth acceleration
        if (this.movementKeys.a || this.movementKeys.ArrowLeft) {
            this.spriteManager.moveLeft(currentForce);
            isMoving = true;
            
            // GSAP animation for smooth movement effect
            if (typeof gsap !== 'undefined') {
                gsap.to(this.spriteManager.protagonist, {
                    duration: 0.1,
                    ease: "power2.out"
                });
            }
        }
        
        if (this.movementKeys.d || this.movementKeys.ArrowRight) {
            this.spriteManager.moveRight(currentForce);
            isMoving = true;
            
            // GSAP animation for smooth movement effect
            if (typeof gsap !== 'undefined') {
                gsap.to(this.spriteManager.protagonist, {
                    duration: 0.1,
                    ease: "power2.out"
                });
            }
        }
        
        // Jump with enhanced force and GSAP animation
        if ((this.movementKeys.w || this.movementKeys.ArrowUp) && this.spriteManager.protagonist.isGrounded) {
            this.spriteManager.jump(jumpForce);
            
            // GSAP jump animation with bounce effect
            if (typeof gsap !== 'undefined') {
                const protagonist = this.spriteManager.protagonist;
                gsap.timeline()
                    .to(protagonist, {
                        duration: 0.2,
                        scaleY: 0.8,
                        scaleX: 1.2,
                        ease: "power2.out"
                    })
                    .to(protagonist, {
                        duration: 0.6,
                        scaleY: 1,
                        scaleX: 1,
                        ease: "bounce.out"
                    });
            }
        }
        
        // Crouch/slide (S or Down arrow)
        if (this.movementKeys.s || this.movementKeys.ArrowDown) {
            this.spriteManager.setAnimation('crouch');
            
            // GSAP crouch animation
            if (typeof gsap !== 'undefined') {
                gsap.to(this.spriteManager.protagonist, {
                    duration: 0.2,
                    scaleY: 0.7,
                    ease: "power2.out"
                });
            }
        } else if (!isMoving) {
            // Return to normal scale when not moving
            if (typeof gsap !== 'undefined') {
                gsap.to(this.spriteManager.protagonist, {
                    duration: 0.3,
                    scaleY: 1,
                    scaleX: 1,
                    ease: "power2.out"
                });
            }
        }
        
        // Visual feedback for movement
        this.updateMovementFeedback(isMoving);
    }
    
    updateMovementFeedback(isMoving) {
        // Update HUD with movement data
        const velocityDisplay = document.getElementById('velocityDisplay');
        const forceDisplay = document.getElementById('forceDisplay');
        
        if (velocityDisplay && this.spriteManager) {
            const velocity = this.spriteManager.protagonist.velocity;
            const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
            const speedMS = this.physics.pixelsToMeters(speed);
            velocityDisplay.textContent = `${speedMS.toFixed(2)} m/s`;
        }
        
        if (forceDisplay) {
            const currentForce = isMoving ? 50 : 0;
            forceDisplay.textContent = `${currentForce} N`;
        }
    }
    
    // Enhanced zipline puzzle setup
    startZiplinePuzzle() {
        console.log('🧩 Starting Enhanced Zipline Platform Puzzle...');
        
        this.puzzleState.isActive = true;
        
        // Use Phaser game if available
        if (this.usePhaser && this.phaserGame) {
            console.log('🎮 Starting Phaser-based Level 1...');
            this.phaserGame.startLevel1();
            return;
        }
        
        // Fallback to Matter.js version
        console.log('🔧 Starting Matter.js fallback puzzle...');
        
        // Clear any existing objects
        this.clearObjects();
        
        // Create the puzzle environment
        this.createPuzzleEnvironment();
        
        // Position protagonist at starting location
        if (this.spriteManager) {
            this.spriteManager.setPosition(150, this.canvasHeight - this.puzzleConfig.groundHeight - 100);
        }
        
        // Setup UI
        this.createPuzzleUI();
        
        console.log('Zipline puzzle initialized successfully');
    }
    
    createPuzzleEnvironment() {
        const config = this.puzzleConfig;
        
        // Convert all measurements from meters to pixels
        const groundY = this.canvasHeight - this.physics.metersToPixels(config.groundHeight) / 2;
        const leftGroundWidth = this.physics.metersToPixels(config.leftGroundWidth);
        const rightGroundWidth = this.physics.metersToPixels(config.rightGroundWidth);
        const gapWidth = this.physics.metersToPixels(config.gapWidth);
        const groundHeight = this.physics.metersToPixels(config.groundHeight);
        const caveWidth = this.physics.metersToPixels(config.caveWidth);
        const caveHeight = this.physics.metersToPixels(config.caveHeight);
        
        // Enhanced left grass ground (3 meters wide)
        const leftGround = Matter.Bodies.rectangle(
            leftGroundWidth / 2,
            groundY,
            leftGroundWidth,
            groundHeight,
            {
                isStatic: true,
                label: 'leftGround',
                render: {
                    fillStyle: '#66BB6A', // Vibrant grass green
                    strokeStyle: '#2E7D32', // Dark green border
                    lineWidth: 4
                }
            }
        );
        
        // Add grass tufts on left ground for texture (scaled to meters)
        const grassTuft1 = Matter.Bodies.rectangle(
            this.physics.metersToPixels(0.8), groundY - groundHeight/2 - 8, 
            this.physics.metersToPixels(0.15), this.physics.metersToPixels(0.16),
            { isStatic: true, isSensor: true, render: { fillStyle: '#4CAF50' } }
        );
        const grassTuft2 = Matter.Bodies.rectangle(
            this.physics.metersToPixels(1.8), groundY - groundHeight/2 - 6, 
            this.physics.metersToPixels(0.12), this.physics.metersToPixels(0.12),
            { isStatic: true, isSensor: true, render: { fillStyle: '#66BB6A' } }
        );
        const grassTuft3 = Matter.Bodies.rectangle(
            this.physics.metersToPixels(2.5), groundY - groundHeight/2 - 10, 
            this.physics.metersToPixels(0.18), this.physics.metersToPixels(0.20),
            { isStatic: true, isSensor: true, render: { fillStyle: '#388E3C' } }
        );
        
        // Right grass ground (3 meters wide, near 4 meter gap)
        const rightGroundX = leftGroundWidth + gapWidth + rightGroundWidth / 2;
        const rightGround = Matter.Bodies.rectangle(
            rightGroundX,
            groundY,
            rightGroundWidth,
            groundHeight,
            {
                isStatic: true,
                label: 'rightGround',
                render: {
                    fillStyle: '#2E7D32', // Darker grass near cave
                    strokeStyle: '#1B5E20', // Very dark green border
                    lineWidth: 4
                }
            }
        );
        
        // Add darker grass patches near cave (scaled to meters)
        const darkGrass1 = Matter.Bodies.rectangle(
            rightGroundX - this.physics.metersToPixels(0.8), groundY - groundHeight/2 - 5, 
            this.physics.metersToPixels(0.20), this.physics.metersToPixels(0.10),
            { isStatic: true, isSensor: true, render: { fillStyle: '#1B5E20' } }
        );
        const darkGrass2 = Matter.Bodies.rectangle(
            rightGroundX + this.physics.metersToPixels(0.6), groundY - groundHeight/2 - 8, 
            this.physics.metersToPixels(0.16), this.physics.metersToPixels(0.16),
            { isStatic: true, isSensor: true, render: { fillStyle: '#263238' } }
        );
        
        // Cave entrance - Enhanced visual design (1.5m wide, 2m high)
        const caveX = this.canvasWidth - caveWidth / 2;
        const caveY = this.canvasHeight - groundHeight - caveHeight / 2;
        const cave = Matter.Bodies.rectangle(
            caveX,
            caveY,
            caveWidth,
            caveHeight,
            {
                isStatic: true,
                isSensor: true,
                label: 'cave',
                render: {
                    fillStyle: '#0A0A0A', // Deeper black for cave entrance
                    strokeStyle: '#2C1810', // Brown rocky cave edge
                    lineWidth: 6
                }
            }
        );
        
        // Cave mouth rocks for realistic entrance (scaled to meters)
        const caveRock1 = Matter.Bodies.polygon(
            caveX - caveWidth/2 - this.physics.metersToPixels(0.1), 
            caveY + caveHeight/2 - this.physics.metersToPixels(0.2), 
            6, this.physics.metersToPixels(0.25), {
            isStatic: true,
            render: { fillStyle: '#3E2723', strokeStyle: '#2C1810', lineWidth: 2 }
        });
        
        const caveRock2 = Matter.Bodies.polygon(
            caveX + caveWidth/2 + this.physics.metersToPixels(0.1), 
            caveY + caveHeight/2 - this.physics.metersToPixels(0.15), 
            5, this.physics.metersToPixels(0.20), {
            isStatic: true,
            render: { fillStyle: '#424242', strokeStyle: '#2C1810', lineWidth: 2 }
        });
        
        // Cave details - stalactites with varied sizes (realistic cave formations)
        const stalactiteY = caveY - caveHeight / 2 + this.physics.metersToPixels(0.3);
        const stalactite1 = Matter.Bodies.polygon(
            caveX - this.physics.metersToPixels(0.35), stalactiteY, 3, 
            this.physics.metersToPixels(0.18), {
            isStatic: true,
            isSensor: true,
            render: { fillStyle: '#616161', strokeStyle: '#424242', lineWidth: 1 }
        });
        
        const stalactite2 = Matter.Bodies.polygon(
            caveX + this.physics.metersToPixels(0.25), stalactiteY, 3, 
            this.physics.metersToPixels(0.15), {
            isStatic: true,
            isSensor: true,
            render: { fillStyle: '#757575', strokeStyle: '#424242', lineWidth: 1 }
        });
        
        const stalactite3 = Matter.Bodies.polygon(
            caveX, stalactiteY - this.physics.metersToPixels(0.1), 3, 
            this.physics.metersToPixels(0.22), {
            isStatic: true,
            isSensor: true,
            render: { fillStyle: '#5D4037', strokeStyle: '#424242', lineWidth: 1 }
        });
        
        // Enhanced zipline post on left side (20cm wide, 2m high)
        const ziplinePostX = this.physics.metersToPixels(0.5); // 50cm from edge
        const ziplinePostHeight = this.physics.metersToPixels(2.0); // 2 meters high
        const ziplinePostWidth = this.physics.metersToPixels(0.2); // 20cm wide
        const ziplinePostY = this.canvasHeight - groundHeight - ziplinePostHeight / 2;
        const ziplinePost = Matter.Bodies.rectangle(
            ziplinePostX,
            ziplinePostY,
            ziplinePostWidth,
            ziplinePostHeight,
            {
                isStatic: true,
                label: 'ziplinePost',
                render: {
                    fillStyle: '#8B4513', // Wooden brown
                    strokeStyle: '#5D2C04', // Dark brown border
                    lineWidth: 3
                }
            }
        );
        
        // Zipline post cross-beam for stability (60cm wide, 12cm thick)
        const crossBeam = Matter.Bodies.rectangle(
            ziplinePostX,
            ziplinePostY - ziplinePostHeight/2 + this.physics.metersToPixels(0.3),
            this.physics.metersToPixels(0.6), this.physics.metersToPixels(0.12),
            {
                isStatic: true,
                label: 'crossBeam',
                render: {
                    fillStyle: '#A0522D',
                    strokeStyle: '#5D2C04',
                    lineWidth: 2
                }
            }
        );
        
        // Zipline cable endpoint at cave with anchor mechanism (35cm x 18cm)
        const ziplineCaveEndX = this.canvasWidth - caveWidth - this.physics.metersToPixels(0.2);
        const ziplineCaveEndY = caveY - caveHeight / 2;
        const ziplineCaveEnd = Matter.Bodies.rectangle(
            ziplineCaveEndX,
            ziplineCaveEndY,
            this.physics.metersToPixels(0.35), this.physics.metersToPixels(0.18),
            {
                isStatic: true,
                label: 'ziplineEnd',
                render: {
                    fillStyle: '#757575', // Metal gray
                    strokeStyle: '#424242',
                    lineWidth: 3
                }
            }
        );
        
        // Cable anchor bolt details (3cm diameter bolts)
        const anchorBolt1 = Matter.Bodies.circle(
            ziplineCaveEndX - this.physics.metersToPixels(0.08), 
            ziplineCaveEndY - this.physics.metersToPixels(0.04), 
            this.physics.metersToPixels(0.03), {
            isStatic: true,
            render: { fillStyle: '#263238' }
        });
        
        const anchorBolt2 = Matter.Bodies.circle(
            ziplineCaveEndX + this.physics.metersToPixels(0.08), 
            ziplineCaveEndY + this.physics.metersToPixels(0.04), 
            this.physics.metersToPixels(0.03), {
            isStatic: true,
            render: { fillStyle: '#263238' }
        });
        
        // Optimized zipline platform with metric units
        const platformStartX = ziplinePostX + this.physics.metersToPixels(0.6); // 60cm from post
        const platformStartY = ziplinePostY - this.physics.metersToPixels(0.6); // 60cm below top
        this.platform = Matter.Bodies.rectangle(
            platformStartX,
            platformStartY,
            this.physics.metersToPixels(0.8), // 80cm platform width
            this.physics.metersToPixels(0.2), // 20cm platform height
            {
                render: {
                    fillStyle: '#CD853F', // Sandy brown platform
                    strokeStyle: '#8B4513', // Dark brown border
                    lineWidth: 3
                },
                mass: 25, // 25kg wooden platform (realistic weight)
                frictionAir: 0.02, // Realistic air resistance
                friction: 0.9, // High wood-on-wood friction
                restitution: 0.2 // Minimal bounce for stability
            }
        );
        
        // Platform grip handles with metric dimensions
        const handle1 = Matter.Bodies.rectangle(
            platformStartX - this.physics.metersToPixels(0.35), // 35cm from center
            platformStartY - this.physics.metersToPixels(0.15), // 15cm above platform
            this.physics.metersToPixels(0.06), // 6cm wide handle
            this.physics.metersToPixels(0.08), // 8cm tall handle
            {
                isStatic: true,
                isSensor: true,
                render: { fillStyle: '#654321' }
            }
        );
        
        const handle2 = Matter.Bodies.rectangle(
            platformStartX + this.physics.metersToPixels(0.35), // 35cm from center
            platformStartY - this.physics.metersToPixels(0.15), // 15cm above platform
            this.physics.metersToPixels(0.06), // 6cm wide handle
            this.physics.metersToPixels(0.08), // 8cm tall handle
            {
                isStatic: true,
                isSensor: true,
                render: { fillStyle: '#654321' }
            }
        );
        
        // Enhanced zipline constraint with metric cable properties
        this.ziplineConstraint = Matter.Constraint.create({
            pointA: { x: platformStartX, y: ziplinePostY - ziplinePostHeight / 2 + this.physics.metersToPixels(0.15) },
            bodyB: this.platform,
            pointB: { x: 0, y: -this.physics.metersToPixels(0.12) }, // 12cm above platform center
            length: this.physics.metersToPixels(0.5), // 50cm cable length
            stiffness: 0.9, // Steel cable stiffness
            damping: 0.05, // Minimal damping for steel cable
            render: {
                visible: true,
                strokeStyle: '#2C2C2C', // Steel cable color
                lineWidth: 4,
                type: 'line'
            }
        });
        
        // Add all bodies to world including enhanced visual elements
        Matter.World.add(this.world, [
            leftGround,
            rightGround,
            grassTuft1, grassTuft2, grassTuft3, // Left ground grass details
            darkGrass1, darkGrass2, // Right ground vegetation
            cave,
            caveRock1, caveRock2, // Cave entrance rocks
            stalactite1, stalactite2, stalactite3, // Enhanced cave stalactites
            ziplinePost,
            crossBeam, // Zipline post stabilizer
            ziplineCaveEnd,
            anchorBolt1, anchorBolt2, // Cable anchor details
            this.platform,
            handle1, handle2, // Platform grip handles
            this.ziplineConstraint
        ]);
        
        // Store references
        this.puzzleElements = {
            leftGround,
            rightGround,
            cave,
            ziplinePost,
            platform: this.platform,
            constraint: this.ziplineConstraint
        };
        
        // Update constraint dynamically for sliding
        Matter.Events.on(this.engine, 'beforeUpdate', () => {
            if (this.platform && this.ziplineConstraint) {
                this.ziplineConstraint.pointA.x = this.platform.position.x;
            }
        });
    }
    
    createPuzzleUI() {
        const gameScreen = document.getElementById('gameScreen');
        
        // Remove existing UI
        const existingUI = document.getElementById('ziplinePuzzleUI');
        if (existingUI) existingUI.remove();
        
        // Create compact instruction panel
        const instructionPanel = document.createElement('div');
        instructionPanel.id = 'instructionPanel';
        instructionPanel.className = 'absolute top-4 left-1/2 transform -translate-x-1/2 z-20';
        
        instructionPanel.innerHTML = `
            <div class="glass-effect rounded-lg p-4 max-w-lg text-center">
                <h3 class="text-lg font-bold text-physics-blue mb-2">🧩 Zipline Platform Puzzle</h3>
                <p class="text-sm text-gray-300 mb-2">Calculate the force needed to position the 25kg platform in the target zone</p>
                <div class="flex justify-center space-x-4 text-xs text-yellow-400">
                    <span>🎮 WASD/Arrows: Move character</span>
                    <span>🎯 Target: Center of 4m gap (±30cm)</span>
                </div>
                <div class="text-xs text-blue-300 mt-2">
                    <span>📏 Gap: 4.0m wide | Platform: 80cm × 20cm | Mass: 25kg</span>
                </div>
            </div>
        `;
        
        gameScreen.appendChild(instructionPanel);
        
        // Create proximity-based force dialog
        const forceDialog = document.createElement('div');
        forceDialog.id = 'ziplinePuzzleUI';
        forceDialog.className = 'absolute bottom-4 right-4 z-20 hidden';
        
        forceDialog.innerHTML = `
            <div class="glass-effect rounded-lg p-4 max-w-xs">
                <h4 class="text-md font-bold text-physics-blue mb-3">⚡ Platform Physics</h4>
                
                <div class="space-y-3">
                    <div class="grid grid-cols-2 gap-2 text-xs">
                        <div><span class="text-blue-400">Mass:</span> 25 kg</div>
                        <div><span class="text-blue-400">Size:</span> 80×20 cm</div>
                        <div><span class="text-blue-400">Gap:</span> 4.0 m</div>
                        <div><span class="text-blue-400">Target:</span> ±30 cm</div>
                    </div>
                    
                    <div class="space-y-2">
                        <label class="text-blue-400 block text-sm">Applied Force (Newtons):</label>
                        <div class="flex space-x-2">
                            <input type="number" id="forceInput" 
                                   class="bg-gray-800 text-white px-2 py-1 rounded border border-blue-500 flex-1 text-sm" 
                                   min="0" max="150" step="5" placeholder="20-100" value="" autocomplete="off" />
                            <button id="applyForceBtn" 
                                    class="px-3 py-1 bg-green-500 hover:bg-green-600 text-white font-bold rounded text-sm">
                                Apply
                            </button>
                        </div>
                        <div class="text-xs text-gray-400">
                            Hint: Try 50-80N for a 25kg platform
                        </div>
                    </div>
                    
                    <div id="puzzleStatus" class="text-center py-1 rounded hidden text-xs"></div>
                    
                    <button id="jumpBtn" 
                            class="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded text-sm hidden">
                        🏃‍♂️ Jump Across!
                    </button>
                </div>
            </div>
        `;
        
        gameScreen.appendChild(forceDialog);
        
        // Setup proximity detection and event handlers
        this.setupProximityDetection();
        this.setupForceControls();
    }
    
    setupProximityDetection() {
        this.proximityCheckInterval = setInterval(() => {
            if (!this.spriteManager || !this.platform) return;
            
            const playerPos = this.spriteManager.getPosition();
            const platformPos = this.platform.position;
            
            const distance = Math.sqrt(
                Math.pow(playerPos.x - platformPos.x, 2) +
                Math.pow(playerPos.y - platformPos.y, 2)
            );
            
            const dialog = document.getElementById('ziplinePuzzleUI');
            
            if (distance < 120) {
                dialog.classList.remove('hidden');
            } else {
                dialog.classList.add('hidden');
            }
        }, 100);
    }
    
    setupForceControls() {
        setTimeout(() => {
            const applyBtn = document.getElementById('applyForceBtn');
            const jumpBtn = document.getElementById('jumpBtn');
            const forceInput = document.getElementById('forceInput');
            
            if (applyBtn) {
                applyBtn.addEventListener('click', () => this.applyForceToPlatform());
            }
            
            if (jumpBtn) {
                jumpBtn.addEventListener('click', () => this.initiateJumpSequence());
            }
            
            if (forceInput) {
                forceInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.applyForceToPlatform();
                    }
                });
            }
        }, 100);
    }
    
    applyForceToPlatform() {
        const forceInput = document.getElementById('forceInput');
        const force = parseFloat(forceInput.value);
        
        if (isNaN(force) || force < 0) {
            this.showPuzzleStatus('Enter a valid force value!', 'error');
            return;
        }
        
        if (force > 150) { // 150N is reasonable max force for this puzzle
            this.showPuzzleStatus('Maximum force is 150N (about 15kg push)!', 'warning');
            return;
        }
        
        // Reset platform to starting position (1.1m from left edge)
        const platformStartX = this.physics.metersToPixels(1.1);
        const platformStartY = this.canvasHeight - this.physics.metersToPixels(1.0) - this.physics.metersToPixels(1.5) - this.physics.metersToPixels(0.1);
        
        Matter.Body.setPosition(this.platform, { x: platformStartX, y: platformStartY });
        Matter.Body.setVelocity(this.platform, { x: 0, y: 0 });
        Matter.Body.setAngularVelocity(this.platform, 0);
        
        // Apply realistic force (F = ma, where a is desired acceleration)
        // Force scaling: 1N = 1kg⋅m/s² in real physics
        const realForceScale = 1 / (this.platform.mass * this.physics.pixelsPerMeter);
        const forceVector = { 
            x: force * realForceScale, 
            y: -0.1 * force * realForceScale // Slight upward component
        };
        Matter.Body.applyForce(this.platform, this.platform.position, forceVector);
        
        this.puzzleState.forceApplied = force;
        this.showPuzzleStatus(`Applied ${force}N force (${Math.round(force/9.8)}kg equivalent)!`, 'info');
        
        // Visual feedback - platform glow effect
        if (this.platform) {
            this.platform.render.strokeStyle = '#FFD700';
            this.platform.render.lineWidth = 5;
            
            setTimeout(() => {
                this.platform.render.strokeStyle = '#8B4513';
                this.platform.render.lineWidth = 3;
            }, 1000);
        }
        
        // Check result after physics settle (2 seconds)
        setTimeout(() => this.checkPlatformPosition(), 2000);
        
        console.log(`Applied ${force}N force to ${this.platform.mass}kg platform`);
    }
    
    checkPlatformPosition() {
        // Target: center of the 4m gap (2m from left edge of gap)
        const gapStartX = this.physics.metersToPixels(3.0); // Left ground ends at 3m
        const targetX = gapStartX + this.physics.metersToPixels(2.0); // 2m into the gap
        const currentX = this.platform.position.x;
        const toleranceMeters = 0.3; // 30cm tolerance
        const tolerance = this.physics.metersToPixels(toleranceMeters);
        
        const distancePixels = Math.abs(currentX - targetX);
        const distanceMeters = this.physics.pixelsToMeters(distancePixels);
        
        if (distancePixels <= tolerance) {
            this.puzzleState.platformInPosition = true;
            this.showPuzzleStatus(`🎯 Perfect! Platform within ${Math.round(distanceMeters*100)}cm of target!`, 'success');
            document.getElementById('jumpBtn').classList.remove('hidden');
            
            // Visual success feedback
            if (this.platform) {
                this.platform.render.fillStyle = '#32CD32';
                setTimeout(() => {
                    this.platform.render.fillStyle = '#CD853F';
                }, 2000);
            }
        } else if (currentX < targetX - tolerance) {
            const shortfallCm = Math.round(distanceMeters * 100);
            this.showPuzzleStatus(`Need more force! Platform is ${shortfallCm}cm short of target.`, 'warning');
            this.resetPlatform();
        } else {
            const overshootCm = Math.round(distanceMeters * 100);
            this.showPuzzleStatus(`Too much force! Platform overshot by ${overshootCm}cm.`, 'warning');
            this.resetPlatform();
        }
    }
    
    resetPlatform() {
        setTimeout(() => {
            // Reset to starting position (1.1m from left edge)
            const platformStartX = this.physics.metersToPixels(1.1);
            const platformStartY = this.canvasHeight - this.physics.metersToPixels(1.0) - this.physics.metersToPixels(1.5) - this.physics.metersToPixels(0.1);
            
            // Smooth reset with visual feedback
            if (typeof gsap !== 'undefined') {
                gsap.to(this.platform.position, {
                    duration: 1,
                    x: platformStartX,
                    y: platformStartY,
                    ease: "power2.out",
                    onUpdate: () => {
                        Matter.Body.setPosition(this.platform, this.platform.position);
                    },
                    onComplete: () => {
                        Matter.Body.setVelocity(this.platform, { x: 0, y: 0 });
                        Matter.Body.setAngularVelocity(this.platform, 0);
                    }
                });
            } else {
                Matter.Body.setPosition(this.platform, { x: platformStartX, y: platformStartY });
                Matter.Body.setVelocity(this.platform, { x: 0, y: 0 });
                Matter.Body.setAngularVelocity(this.platform, 0);
            }
            
            this.showPuzzleStatus('🔄 Platform reset. Recalculate force needed!', 'info');
            document.getElementById('forceInput').value = '';
            document.getElementById('jumpBtn').classList.add('hidden');
        }, 1500);
    }
    
    initiateJumpSequence() {
        if (!this.puzzleState.platformInPosition) {
            this.showPuzzleStatus('Position platform correctly first!', 'error');
            return;
        }
        
        // Use GSAP for smooth jump animation if available
        if (typeof gsap !== 'undefined' && this.spriteManager) {
            this.spriteManager.highlight();
            
            // Animate protagonist to platform, then to cave
            const platformPos = this.platform.position;
            const cavePos = { x: this.canvasWidth - 100, y: this.canvasHeight - this.puzzleConfig.groundHeight - 50 };
            
            gsap.timeline()
                .to(this.spriteManager.getPosition(), {
                    duration: 1.5,
                    x: platformPos.x,
                    y: platformPos.y + 30,
                    ease: "power2.out",
                    onUpdate: () => {
                        const pos = this.spriteManager.getPosition();
                        this.spriteManager.setPosition(pos.x, pos.y);
                    }
                })
                .to(this.spriteManager.getPosition(), {
                    duration: 1.5,
                    x: cavePos.x,
                    y: cavePos.y,
                    ease: "power2.out",
                    onUpdate: () => {
                        const pos = this.spriteManager.getPosition();
                        this.spriteManager.setPosition(pos.x, pos.y);
                    },
                    onComplete: () => this.completePuzzle()
                });
                
            this.showPuzzleStatus('🏃‍♂️ Jumping to safety!', 'success');
        } else {
            // Fallback without GSAP
            this.completePuzzle();
        }
    }
    
    completePuzzle() {
        this.puzzleState.puzzleComplete = true;
        this.showPuzzleStatus('🎉 Puzzle Complete!', 'success');
        
        if (this.spriteManager) {
            this.spriteManager.celebrate();
        }
        
        // Show completion dialog
        setTimeout(() => {
            this.showCompletionDialog();
        }, 2000);
    }
    
    showCompletionDialog() {
        const gameScreen = document.getElementById('gameScreen');
        const completionOverlay = document.createElement('div');
        completionOverlay.id = 'completionOverlay';
        completionOverlay.className = 'absolute inset-0 z-30 flex items-center justify-center bg-black/70';
        
        completionOverlay.innerHTML = `
            <div class="glass-effect rounded-lg p-8 max-w-md text-center space-y-6">
                <h2 class="text-3xl font-orbitron font-bold text-physics-blue animate-glow">
                    🎉 Puzzle Solved! 🎉
                </h2>
                
                <div class="space-y-3 text-white">
                    <p>Excellent work! You successfully calculated the correct force and made it across the chasm.</p>
                    <p>Dr. Vector has fled deeper into the cave system, but you're hot on his trail!</p>
                    <p class="text-physics-blue font-semibold">Physics mastery level: Rising! 📈</p>
                </div>
                
                <div class="flex justify-center space-x-4">
                    <button id="continueAdventureBtn" class="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors">
                        Continue Adventure →
                    </button>
                    <button id="backToMenuBtn" class="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg transition-colors">
                        Back to Menu
                    </button>
                </div>
                
                <div class="text-xs text-gray-400">
                    <p>🔬 <strong>Physics Lesson:</strong> You applied F = ma (Force = mass × acceleration)!</p>
                    <p>📏 <strong>Real Units:</strong> 25kg platform moved ${this.puzzleState.forceApplied || 'X'}N across 4m gap</p>
                    <p>⚖️ <strong>Force Conversion:</strong> ${this.puzzleState.forceApplied || 'X'}N ≈ ${Math.round((this.puzzleState.forceApplied || 0)/9.8 * 10)/10}kg of push force</p>
                    <p>Understanding motion, forces, and measurement units is key to solving physics puzzles!</p>
                </div>
            </div>
        `;
        
        gameScreen.appendChild(completionOverlay);
        
        // Add event listeners
        document.getElementById('continueAdventureBtn').addEventListener('click', () => {
            alert('More puzzles coming soon! Dr. Vector is preparing new challenges...');
            this.returnToMenu();
        });
        
        document.getElementById('backToMenuBtn').addEventListener('click', () => {
            this.returnToMenu();
        });
    }
    
    showPuzzleStatus(message, type = 'info') {
        const statusElement = document.getElementById('puzzleStatus');
        if (!statusElement) return;
        
        statusElement.textContent = message;
        statusElement.className = 'text-center py-1 rounded text-xs';
        
        switch (type) {
            case 'success':
                statusElement.classList.add('bg-green-900/50', 'text-green-400', 'border', 'border-green-500');
                break;
            case 'error':
                statusElement.classList.add('bg-red-900/50', 'text-red-400', 'border', 'border-red-500');
                break;
            case 'warning':
                statusElement.classList.add('bg-yellow-900/50', 'text-yellow-400', 'border', 'border-yellow-500');
                break;
            default:
                statusElement.classList.add('bg-blue-900/50', 'text-blue-400', 'border', 'border-blue-500');
        }
        
        statusElement.classList.remove('hidden');
    }
    
    clearObjects() {
        // Clear all dynamic objects
        this.bodies.forEach(body => {
            Matter.World.remove(this.world, body);
        });
        this.bodies = [];
        
        console.log('All objects cleared');
    }
    
    returnToMenu() {
        // Clean up
        this.puzzleState.isActive = false;
        
        if (this.proximityCheckInterval) {
            clearInterval(this.proximityCheckInterval);
        }
        
        this.clearObjects();
        
        // Remove UI elements
        const elements = ['ziplinePuzzleUI', 'instructionPanel', 'completionOverlay'];
        elements.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.remove();
        });
        
        // Return to main menu
        if (window.showScreen) {
            window.showScreen('mainMenu');
        }
    }
    
    togglePause() {
        if (this.usePhaser && this.phaserGame) {
            if (this.isRunning) {
                this.phaserGame.pause();
                this.isRunning = false;
                console.log('Phaser game paused');
            } else {
                this.phaserGame.resume();
                this.isRunning = true;
                console.log('Phaser game resumed');
            }
        } else {
            // Matter.js fallback
            if (this.isRunning) {
                if (this.runner) {
                    Matter.Runner.stop(this.runner);
                }
                this.isRunning = false;
                console.log('Physics paused');
            } else {
                if (this.runner) {
                    Matter.Runner.start(this.runner, this.engine);
                }
                this.isRunning = true;
                console.log('Physics resumed');
            }
        }
    }
    
    destroy() {
        // Clean up everything
        if (this.proximityCheckInterval) {
            clearInterval(this.proximityCheckInterval);
        }
        
        // Clean up Phaser game
        if (this.usePhaser && this.phaserGame) {
            this.phaserGame.destroy();
            this.phaserGame = null;
        }
        
        // Clean up Matter.js
        if (this.runner) {
            Matter.Runner.stop(this.runner);
        }
        
        if (this.render) {
            Matter.Render.stop(this.render);
        }
        
        if (this.spriteManager) {
            this.spriteManager.destroy();
        }
        
        if (this.engine) {
            Matter.Engine.clear(this.engine);
        }
        
        this.isRunning = false;
        console.log('GameManager destroyed');
    }
}

// Initialize global game manager
window.gameManager = new GameManager();