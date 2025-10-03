/**
 * Enhanced Phaser Game Manager - CoolMathGames Quality Graphics
 * Complete redesign with professional 2D character and level graphics
 */

class PhaserGameManager {
    constructor() {
        this.game = null;
        this.scene = null;
        this.player = null;
        this.level = null;
        this.cursors = null;
        this.wasd = null;
        this.physics = null;
        this.sounds = {};
        this.animations = {};
        this.isInitialized = false;
        
        // Game dimensions
        this.gameWidth = 1200;
        this.gameHeight = 700;
        
        // Player properties
        this.playerConfig = {
            speed: 180,
            jumpForce: 420,
            size: { width: 32, height: 48 },
            mass: 1,
            bounce: 0.1,
            friction: { ground: 0.8, air: 0.02 }
        };
        
        // Level 1 configuration
        this.level1Config = {
            gravity: 800,
            background: {
                layers: [
                    { color: '#0a0a0a', parallax: 0 }, // Deep cave background
                    { color: '#1a1a2e', parallax: 0.2 }, // Mid cave layer
                    { color: '#16213e', parallax: 0.4 }  // Foreground cave layer
                ]
            },
            platforms: [
                { x: 150, y: 600, width: 300, height: 32, texture: 'stone' },
                { x: 750, y: 600, width: 300, height: 32, texture: 'stone' },
                { x: 450, y: 450, width: 100, height: 16, texture: 'wood', moveable: true }
            ],
            decorations: [],
            lighting: {
                ambient: 0.3,
                torches: [
                    { x: 100, y: 550 },
                    { x: 900, y: 550 }
                ]
            }
        };
        
        console.log('🎮 PhaserGameManager initialized');
    }
    
    init(canvasId = 'gameCanvas') {
        try {
            console.log('🚀 Initializing Phaser game engine...');
            
            // Destroy existing game if present
            if (this.game) {
                this.game.destroy(true);
            }
            
            // Phaser game configuration
            const config = {
                type: Phaser.AUTO,
                width: this.gameWidth,
                height: this.gameHeight,
                canvas: document.getElementById(canvasId),
                physics: {
                    default: 'arcade',
                    arcade: {
                        gravity: { y: this.level1Config.gravity },
                        debug: false, // Set to true for physics debugging
                        enableBody: true
                    }
                },
                scene: {
                    preload: this.preload.bind(this),
                    create: this.create.bind(this),
                    update: this.update.bind(this)
                },
                render: {
                    antialias: true,
                    pixelArt: false,
                    roundPixels: false
                },
                scale: {
                    mode: Phaser.Scale.FIT,
                    autoCenter: Phaser.Scale.CENTER_BOTH
                }
            };
            
            // Create Phaser game
            this.game = new Phaser.Game(config);
            this.isInitialized = true;
            
            console.log('✅ Phaser game engine initialized successfully');
            return true;
            
        } catch (error) {
            console.error('❌ Failed to initialize Phaser game:', error);
            return false;
        }
    }
    
    preload() {
        console.log('📦 Loading enhanced game assets...');
        
        this.scene = this;
        
        // Create enhanced character assets using the professional asset system
        if (typeof CharacterAssets !== 'undefined') {
            this.characterAssets = new CharacterAssets(this);
            this.characterAssets.createAllCharacterAssets();
        } else {
            // Fallback to basic sprites
            this.createCharacterSprites();
        }
        
        // Create level assets
        this.createLevelAssets();
        
        // Create particle effects
        this.createParticleAssets();
        
        // Load UI assets
        this.createUIAssets();
        
        console.log('✅ All enhanced assets loaded');
    }
    
    createCharacterSprites() {
        // Create high-quality protagonist sprites using Phaser graphics
        const graphics = this.add.graphics();
        
        // Protagonist idle sprite - CoolMathGames style
        this.createProtagonistIdleSprite(graphics);
        
        // Protagonist walking animation frames
        for (let i = 0; i < 8; i++) {
            this.createProtagonistWalkFrame(graphics, i);
        }
        
        // Protagonist jumping sprite
        this.createProtagonistJumpSprite(graphics);
        
        // Protagonist climbing sprite  
        this.createProtagonistClimbSprite(graphics);
        
        console.log('🎨 Character sprites created');
    }
    
    createProtagonistIdleSprite(graphics) {
        const rt = this.add.renderTexture(0, 0, 48, 64);
        graphics.clear();
        
        // Character design - modern adventurer style
        const colors = {
            skin: 0xFFDBAC,
            hair: 0x8B4513,
            shirt: 0x4A90E2,
            pants: 0x2D3748,
            shoes: 0x654321,
            belt: 0x8B4513,
            outline: 0x2C3E50
        };
        
        // Draw character body (centered at 24, 32)
        graphics.lineStyle(2, colors.outline);
        
        // Head (circular with proper proportions)
        graphics.fillStyle(colors.skin);
        graphics.fillCircle(24, 16, 8);
        graphics.strokeCircle(24, 16, 8);
        
        // Hair (modern style)
        graphics.fillStyle(colors.hair);
        graphics.fillEllipse(24, 12, 14, 8);
        
        // Eyes (expressive and detailed)
        graphics.fillStyle(0x333333);
        graphics.fillCircle(21, 14, 1.5);
        graphics.fillCircle(27, 14, 1.5);
        
        // Eyebrows
        graphics.lineStyle(1, 0x654321);
        graphics.lineBetween(19, 12, 23, 11);
        graphics.lineBetween(25, 11, 29, 12);
        
        // Mouth (slight smile)
        graphics.arc(24, 17, 3, 0, Math.PI, false);
        graphics.strokePath();
        
        // Body/Torso (shirt with details)
        graphics.lineStyle(2, colors.outline);
        graphics.fillStyle(colors.shirt);
        graphics.fillRoundedRect(16, 24, 16, 20, 2);
        graphics.strokeRoundedRect(16, 24, 16, 20, 2);
        
        // Shirt collar and buttons
        graphics.fillStyle(colors.outline);
        graphics.fillCircle(24, 28, 1);
        graphics.fillCircle(24, 34, 1);
        graphics.fillCircle(24, 40, 1);
        
        // Arms (realistic proportions)
        graphics.fillStyle(colors.skin);
        graphics.fillRoundedRect(12, 26, 4, 16, 2); // Left arm
        graphics.fillRoundedRect(32, 26, 4, 16, 2); // Right arm
        graphics.strokeRoundedRect(12, 26, 4, 16, 2);
        graphics.strokeRoundedRect(32, 26, 4, 16, 2);
        
        // Hands
        graphics.fillCircle(14, 42, 2);
        graphics.fillCircle(34, 42, 2);
        graphics.strokeCircle(14, 42, 2);
        graphics.strokeCircle(34, 42, 2);
        
        // Legs (pants with belt)
        graphics.fillStyle(colors.belt);
        graphics.fillRoundedRect(17, 44, 14, 3, 1); // Belt
        graphics.strokeRoundedRect(17, 44, 14, 3, 1);
        
        graphics.fillStyle(colors.pants);
        graphics.fillRoundedRect(18, 44, 5, 16, 2); // Left leg
        graphics.fillRoundedRect(25, 44, 5, 16, 2); // Right leg
        graphics.strokeRoundedRect(18, 44, 5, 16, 2);
        graphics.strokeRoundedRect(25, 44, 5, 16, 2);
        
        // Shoes (detailed with laces)
        graphics.fillStyle(colors.shoes);
        graphics.fillRoundedRect(16, 60, 7, 4, 1); // Left shoe
        graphics.fillRoundedRect(25, 60, 7, 4, 1); // Right shoe
        graphics.strokeRoundedRect(16, 60, 7, 4, 1);
        graphics.strokeRoundedRect(25, 60, 7, 4, 1);
        
        // Shoe laces
        graphics.lineStyle(1, 0xFFFFFF);
        graphics.lineBetween(17, 61, 22, 61);
        graphics.lineBetween(26, 61, 31, 61);
        
        rt.draw(graphics, 0, 0);
        rt.saveTexture('protagonist_idle');
        
        graphics.clear();
        rt.destroy();
    }
    
    createProtagonistWalkFrame(graphics, frameIndex) {
        const rt = this.add.renderTexture(0, 0, 48, 64);
        graphics.clear();
        
        const colors = {
            skin: 0xFFDBAC,
            hair: 0x8B4513,
            shirt: 0x4A90E2,
            pants: 0x2D3748,
            shoes: 0x654321,
            belt: 0x8B4513,
            outline: 0x2C3E50
        };
        
        // Walking animation calculations
        const walkCycle = frameIndex / 8 * Math.PI * 2;
        const armSwing = Math.sin(walkCycle) * 8;
        const legSwing = Math.sin(walkCycle + Math.PI) * 6;
        const bodyBob = Math.sin(walkCycle * 2) * 1;
        
        const centerY = 32 + bodyBob;
        
        graphics.lineStyle(2, colors.outline);
        
        // Head (with slight bob)
        graphics.fillStyle(colors.skin);
        graphics.fillCircle(24, 16 + bodyBob, 8);
        graphics.strokeCircle(24, 16 + bodyBob, 8);
        
        // Hair
        graphics.fillStyle(colors.hair);
        graphics.fillEllipse(24, 12 + bodyBob, 14, 8);
        
        // Eyes
        graphics.fillStyle(0x333333);
        graphics.fillCircle(21, 14 + bodyBob, 1.5);
        graphics.fillCircle(27, 14 + bodyBob, 1.5);
        
        // Body
        graphics.fillStyle(colors.shirt);
        graphics.fillRoundedRect(16, 24 + bodyBob, 16, 20, 2);
        graphics.strokeRoundedRect(16, 24 + bodyBob, 16, 20, 2);
        
        // Animated arms
        const leftArmX = 12 + armSwing * 0.3;
        const rightArmX = 32 - armSwing * 0.3;
        
        graphics.fillStyle(colors.skin);
        graphics.fillRoundedRect(leftArmX, 26 + bodyBob, 4, 16, 2);
        graphics.fillRoundedRect(rightArmX, 26 + bodyBob, 4, 16, 2);
        graphics.strokeRoundedRect(leftArmX, 26 + bodyBob, 4, 16, 2);
        graphics.strokeRoundedRect(rightArmX, 26 + bodyBob, 4, 16, 2);
        
        // Animated legs
        const leftLegX = 18 + legSwing * 0.4;
        const rightLegX = 25 - legSwing * 0.4;
        
        graphics.fillStyle(colors.pants);
        graphics.fillRoundedRect(leftLegX, 44 + bodyBob, 5, 16, 2);
        graphics.fillRoundedRect(rightLegX, 44 + bodyBob, 5, 16, 2);
        graphics.strokeRoundedRect(leftLegX, 44 + bodyBob, 5, 16, 2);
        graphics.strokeRoundedRect(rightLegX, 44 + bodyBob, 5, 16, 2);
        
        // Animated shoes
        graphics.fillStyle(colors.shoes);
        graphics.fillRoundedRect(leftLegX - 2, 60 + bodyBob, 7, 4, 1);
        graphics.fillRoundedRect(rightLegX - 2, 60 + bodyBob, 7, 4, 1);
        graphics.strokeRoundedRect(leftLegX - 2, 60 + bodyBob, 7, 4, 1);
        graphics.strokeRoundedRect(rightLegX - 2, 60 + bodyBob, 7, 4, 1);
        
        rt.draw(graphics, 0, 0);
        rt.saveTexture(`protagonist_walk_${frameIndex}`);
        
        graphics.clear();
        rt.destroy();
    }
    
    createProtagonistJumpSprite(graphics) {
        const rt = this.add.renderTexture(0, 0, 48, 64);
        graphics.clear();
        
        const colors = {
            skin: 0xFFDBAC,
            hair: 0x8B4513,
            shirt: 0x4A90E2,
            pants: 0x2D3748,
            shoes: 0x654321,
            outline: 0x2C3E50
        };
        
        graphics.lineStyle(2, colors.outline);
        
        // Head
        graphics.fillStyle(colors.skin);
        graphics.fillCircle(24, 16, 8);
        graphics.strokeCircle(24, 16, 8);
        
        // Hair
        graphics.fillStyle(colors.hair);
        graphics.fillEllipse(24, 12, 14, 8);
        
        // Eyes (focused expression)
        graphics.fillStyle(0x333333);
        graphics.fillCircle(21, 14, 1.5);
        graphics.fillCircle(27, 14, 1.5);
        
        // Body
        graphics.fillStyle(colors.shirt);
        graphics.fillRoundedRect(16, 24, 16, 20, 2);
        graphics.strokeRoundedRect(16, 24, 16, 20, 2);
        
        // Arms raised for jumping
        graphics.fillStyle(colors.skin);
        graphics.fillRoundedRect(8, 22, 4, 16, 2); // Left arm up
        graphics.fillRoundedRect(36, 22, 4, 16, 2); // Right arm up
        graphics.strokeRoundedRect(8, 22, 4, 16, 2);
        graphics.strokeRoundedRect(36, 22, 4, 16, 2);
        
        // Legs tucked up
        graphics.fillStyle(colors.pants);
        graphics.fillRoundedRect(18, 40, 5, 12, 2); // Left leg
        graphics.fillRoundedRect(25, 40, 5, 12, 2); // Right leg
        graphics.strokeRoundedRect(18, 40, 5, 12, 2);
        graphics.strokeRoundedRect(25, 40, 5, 12, 2);
        
        // Shoes
        graphics.fillStyle(colors.shoes);
        graphics.fillRoundedRect(16, 52, 7, 4, 1);
        graphics.fillRoundedRect(25, 52, 7, 4, 1);
        graphics.strokeRoundedRect(16, 52, 7, 4, 1);
        graphics.strokeRoundedRect(25, 52, 7, 4, 1);
        
        rt.draw(graphics, 0, 0);
        rt.saveTexture('protagonist_jump');
        
        graphics.clear();
        rt.destroy();
    }
    
    createProtagonistClimbSprite(graphics) {
        const rt = this.add.renderTexture(0, 0, 48, 64);
        graphics.clear();
        
        const colors = {
            skin: 0xFFDBAC,
            hair: 0x8B4513,
            shirt: 0x4A90E2,
            pants: 0x2D3748,
            shoes: 0x654321,
            outline: 0x2C3E50
        };
        
        graphics.lineStyle(2, colors.outline);
        
        // Head (looking up)
        graphics.fillStyle(colors.skin);
        graphics.fillCircle(24, 18, 8);
        graphics.strokeCircle(24, 18, 8);
        
        // Hair
        graphics.fillStyle(colors.hair);
        graphics.fillEllipse(24, 14, 14, 8);
        
        // Eyes looking up
        graphics.fillStyle(0x333333);
        graphics.fillCircle(21, 16, 1.5);
        graphics.fillCircle(27, 16, 1.5);
        
        // Body (leaning forward)
        graphics.fillStyle(colors.shirt);
        graphics.fillRoundedRect(14, 26, 16, 18, 2);
        graphics.strokeRoundedRect(14, 26, 16, 18, 2);
        
        // Arms reaching up
        graphics.fillStyle(colors.skin);
        graphics.fillRoundedRect(10, 18, 4, 18, 2); // Left arm
        graphics.fillRoundedRect(34, 18, 4, 18, 2); // Right arm
        graphics.strokeRoundedRect(10, 18, 4, 18, 2);
        graphics.strokeRoundedRect(34, 18, 4, 18, 2);
        
        // Legs (climbing position)
        graphics.fillStyle(colors.pants);
        graphics.fillRoundedRect(16, 44, 5, 16, 2);
        graphics.fillRoundedRect(27, 44, 5, 16, 2);
        graphics.strokeRoundedRect(16, 44, 5, 16, 2);
        graphics.strokeRoundedRect(27, 44, 5, 16, 2);
        
        rt.draw(graphics, 0, 0);
        rt.saveTexture('protagonist_climb');
        
        graphics.clear();
        rt.destroy();
    }
    
    createLevelAssets() {
        const graphics = this.add.graphics();
        
        // Stone platform texture
        this.createStonePlatformTexture(graphics);
        
        // Wood platform texture  
        this.createWoodPlatformTexture(graphics);
        
        // Cave wall textures
        this.createCaveWallTexture(graphics);
        
        // Rope/Chain texture for zipline
        this.createRopeTexture(graphics);
        
        // Torch flame animation
        this.createTorchTexture(graphics);
        
        console.log('🏞️ Level assets created');
    }
    
    createStonePlatformTexture(graphics) {
        const rt = this.add.renderTexture(0, 0, 128, 32);
        graphics.clear();
        
        // Base stone color
        graphics.fillStyle(0x666666);
        graphics.fillRect(0, 0, 128, 32);
        
        // Stone texture details
        graphics.fillStyle(0x555555);
        for (let i = 0; i < 8; i++) {
            const x = i * 16;
            graphics.fillRect(x, 0, 14, 32);
            graphics.fillRect(x + 2, 2, 10, 28);
        }
        
        // Highlight edges
        graphics.lineStyle(2, 0x888888);
        graphics.lineBetween(0, 0, 128, 0); // Top edge
        graphics.lineBetween(0, 0, 0, 32);  // Left edge
        
        // Shadow edges
        graphics.lineStyle(2, 0x444444);
        graphics.lineBetween(0, 32, 128, 32); // Bottom edge
        graphics.lineBetween(128, 0, 128, 32); // Right edge
        
        // Moss details for cave atmosphere
        graphics.fillStyle(0x4CAF50);
        graphics.fillCircle(20, 4, 3);
        graphics.fillCircle(45, 6, 2);
        graphics.fillCircle(80, 3, 4);
        graphics.fillCircle(110, 5, 3);
        
        rt.draw(graphics, 0, 0);
        rt.saveTexture('stone_platform');
        graphics.clear();
        rt.destroy();
    }
    
    createWoodPlatformTexture(graphics) {
        const rt = this.add.renderTexture(0, 0, 128, 16);
        graphics.clear();
        
        // Wood base
        graphics.fillStyle(0x8B4513);
        graphics.fillRect(0, 0, 128, 16);
        
        // Wood grain
        graphics.lineStyle(1, 0x654321);
        for (let i = 0; i < 5; i++) {
            const y = 3 + i * 2;
            graphics.lineBetween(0, y, 128, y);
        }
        
        // Wood planks
        graphics.lineStyle(2, 0x5D4037);
        graphics.lineBetween(32, 0, 32, 16);
        graphics.lineBetween(64, 0, 64, 16);
        graphics.lineBetween(96, 0, 96, 16);
        
        // Metal reinforcements
        graphics.fillStyle(0x757575);
        graphics.fillRect(30, 2, 4, 12);
        graphics.fillRect(62, 2, 4, 12);
        graphics.fillRect(94, 2, 4, 12);
        
        rt.draw(graphics, 0, 0);
        rt.saveTexture('wood_platform');
        graphics.clear();
        rt.destroy();
    }
    
    createCaveWallTexture(graphics) {
        const rt = this.add.renderTexture(0, 0, 64, 64);
        graphics.clear();
        
        // Cave wall base
        graphics.fillStyle(0x2C2C2C);
        graphics.fillRect(0, 0, 64, 64);
        
        // Rock texture
        graphics.fillStyle(0x3E3E3E);
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (Math.random() > 0.6) {
                    graphics.fillCircle(i * 8 + 4, j * 8 + 4, 2 + Math.random() * 2);
                }
            }
        }
        
        // Darker crevices
        graphics.fillStyle(0x1A1A1A);
        for (let i = 0; i < 12; i++) {
            const x = Math.random() * 64;
            const y = Math.random() * 64;
            graphics.fillCircle(x, y, 1);
        }
        
        rt.draw(graphics, 0, 0);
        rt.saveTexture('cave_wall');
        graphics.clear();
        rt.destroy();
    }
    
    createRopeTexture(graphics) {
        const rt = this.add.renderTexture(0, 0, 8, 32);
        graphics.clear();
        
        // Rope strands
        graphics.fillStyle(0x8B4513);
        graphics.fillRect(2, 0, 4, 32);
        
        // Rope texture
        graphics.lineStyle(1, 0x654321);
        for (let i = 0; i < 16; i++) {
            const y = i * 2;
            graphics.lineBetween(1, y, 7, y + 1);
        }
        
        rt.draw(graphics, 0, 0);
        rt.saveTexture('rope');
        graphics.clear();
        rt.destroy();
    }
    
    createTorchTexture(graphics) {
        // Torch base
        const rt = this.add.renderTexture(0, 0, 16, 32);
        graphics.clear();
        
        // Torch handle
        graphics.fillStyle(0x8B4513);
        graphics.fillRect(6, 8, 4, 24);
        
        // Torch head
        graphics.fillStyle(0x654321);
        graphics.fillCircle(8, 8, 6);
        
        rt.draw(graphics, 0, 0);
        rt.saveTexture('torch');
        graphics.clear();
        rt.destroy();
        
        // Flame animation frames
        for (let i = 0; i < 4; i++) {
            const flameRt = this.add.renderTexture(0, 0, 16, 20);
            graphics.clear();
            
            const flameHeight = 12 + Math.sin(i * Math.PI / 2) * 3;
            const flameWidth = 8 + Math.cos(i * Math.PI / 2) * 2;
            
            // Flame colors
            graphics.fillStyle(0xFF4500); // Red-orange
            graphics.fillEllipse(8, 10, flameWidth, flameHeight);
            
            graphics.fillStyle(0xFFA500); // Orange
            graphics.fillEllipse(8, 8, flameWidth * 0.7, flameHeight * 0.7);
            
            graphics.fillStyle(0xFFFF00); // Yellow core
            graphics.fillEllipse(8, 6, flameWidth * 0.4, flameHeight * 0.4);
            
            flameRt.draw(graphics, 0, 0);
            flameRt.saveTexture(`flame_${i}`);
            graphics.clear();
            flameRt.destroy();
        }
    }
    
    createParticleAssets() {
        const graphics = this.add.graphics();
        
        // Dust particle
        const dustRt = this.add.renderTexture(0, 0, 4, 4);
        graphics.clear();
        graphics.fillStyle(0xDDDDDD);
        graphics.fillCircle(2, 2, 2);
        dustRt.draw(graphics, 0, 0);
        dustRt.saveTexture('dust_particle');
        graphics.clear();
        dustRt.destroy();
        
        // Spark particle
        const sparkRt = this.add.renderTexture(0, 0, 6, 6);
        graphics.clear();
        graphics.fillStyle(0xFFDD44);
        graphics.fillCircle(3, 3, 3);
        graphics.fillStyle(0xFFFFFF);
        graphics.fillCircle(3, 3, 1);
        sparkRt.draw(graphics, 0, 0);
        sparkRt.saveTexture('spark_particle');
        graphics.clear();
        sparkRt.destroy();
        
        console.log('✨ Particle assets created');
    }
    
    createUIAssets() {
        const graphics = this.add.graphics();
        
        // UI button
        const buttonRt = this.add.renderTexture(0, 0, 120, 40);
        graphics.clear();
        graphics.fillStyle(0x4A90E2);
        graphics.fillRoundedRect(0, 0, 120, 40, 8);
        graphics.lineStyle(2, 0x357ABD);
        graphics.strokeRoundedRect(0, 0, 120, 40, 8);
        buttonRt.draw(graphics, 0, 0);
        buttonRt.saveTexture('ui_button');
        graphics.clear();
        buttonRt.destroy();
        
        console.log('🎨 UI assets created');
    }
    
    create() {
        console.log('🎬 Creating game scene...');
        
        this.scene = this;
        this.physics = this.physics;
        
        // Set up camera
        this.cameras.main.setBounds(0, 0, this.gameWidth, this.gameHeight);
        this.cameras.main.setBackgroundColor('#0a0a0a');
        
        // Create level 1
        this.createLevel1();
        
        // Create player
        this.createPlayer();
        
        // Set up controls
        this.createControls();
        
        // Create animations
        this.createAnimations();
        
        // Set up camera to follow player
        this.cameras.main.startFollow(this.player, true);
        this.cameras.main.setFollowOffset(0, 100);
        
        // Create particle systems
        this.createParticleSystems();
        
        // Set up physics
        this.setupPhysics();
        
        // Create UI
        this.createGameUI();
        
        console.log('✅ Game scene created successfully');
    }
    
    createLevel1() {
        // Create parallax background layers
        const bg1 = this.add.rectangle(this.gameWidth/2, this.gameHeight/2, this.gameWidth, this.gameHeight, 0x0a0a0a);
        bg1.setScrollFactor(0);
        
        const bg2 = this.add.rectangle(this.gameWidth/2, this.gameHeight/2, this.gameWidth, this.gameHeight, 0x1a1a2e);
        bg2.setScrollFactor(0.2);
        bg2.setAlpha(0.7);
        
        const bg3 = this.add.rectangle(this.gameWidth/2, this.gameHeight/2, this.gameWidth, this.gameHeight, 0x16213e);
        bg3.setScrollFactor(0.4);
        bg3.setAlpha(0.5);
        
        // Create platforms group
        this.platforms = this.physics.add.staticGroup();
        
        // Create cave walls
        this.createCaveWalls();
        
        // Create main platforms
        this.createMainPlatforms();
        
        // Create moveable zipline platform
        this.createZiplinePlatform();
        
        // Create environmental details
        this.createEnvironmentalDetails();
        
        // Create lighting effects
        this.createLighting();
        
        console.log('🏞️ Level 1 created');
    }
    
    createCaveWalls() {
        // Cave walls using tiled textures
        for (let x = 0; x < this.gameWidth; x += 64) {
            for (let y = 0; y < 100; y += 64) {
                const wall = this.add.image(x, y, 'cave_wall');
                wall.setOrigin(0, 0);
            }
        }
        
        for (let x = 0; x < this.gameWidth; x += 64) {
            for (let y = this.gameHeight - 100; y < this.gameHeight; y += 64) {
                const wall = this.add.image(x, y, 'cave_wall');
                wall.setOrigin(0, 0);
            }
        }
    }
    
    createMainPlatforms() {
        // Left platform (starting area) - using enhanced professional texture
        const leftPlatform = this.platforms.create(150, 580, 'professional_stone_platform');
        leftPlatform.setScale(1.8, 1.2); // Adjusted for better proportions
        leftPlatform.refreshBody();
        leftPlatform.setDepth(3);
        
        // Right platform (destination) - using enhanced professional texture
        const rightPlatform = this.platforms.create(850, 580, 'professional_stone_platform');
        rightPlatform.setScale(1.8, 1.2); // Adjusted for better proportions
        rightPlatform.refreshBody();
        rightPlatform.setDepth(3);
        
        // Add enhanced platform details
        this.addEnhancedPlatformDetails(leftPlatform);
        this.addEnhancedPlatformDetails(rightPlatform);
        
        // Add platform edge effects
        this.createPlatformEdgeEffects(leftPlatform);
        this.createPlatformEdgeEffects(rightPlatform);
    }
    
    addEnhancedPlatformDetails(platform) {
        // Add realistic moss patches with varied sizes and colors
        const mossColors = [0x4CAF50, 0x66BB6A, 0x388E3C, 0x2E7D32];
        
        for (let i = 0; i < 6; i++) {
            const moss = this.add.circle(
                platform.x - 80 + Math.random() * 160,
                platform.y - 25 - Math.random() * 10,
                3 + Math.random() * 4,
                mossColors[Math.floor(Math.random() * mossColors.length)]
            );
    createZiplinePlatform() {
        // Create enhanced moveable platform for the zipline puzzle
        this.ziplinePlatform = this.physics.add.sprite(300, 400, 'professional_wood_platform');
        this.ziplinePlatform.setScale(0.7, 1.2); // Adjusted for better proportions
        this.ziplinePlatform.body.setGravityY(300);
        this.ziplinePlatform.setDepth(6);
        
        // Add rope attachment point visual
        this.ropeAttachment = this.add.sprite(this.ziplinePlatform.x, this.ziplinePlatform.y - 15, 'zipline_mechanism');
        this.ropeAttachment.setScale(0.6);
        this.ropeAttachment.setDepth(7);
        
        // Create zipline rope constraint
        this.createZiplineConstraint();
        
        // Add platform interaction with enhanced feedback
        this.setupEnhancedZiplinePlatformInteraction();
        
        // Add subtle platform sway animation
        this.tweens.add({
            targets: this.ziplinePlatform,
            rotation: 0.02,
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Make rope attachment follow platform
        this.physics.world.on('worldstep', () => {
            if (this.ropeAttachment && this.ziplinePlatform) {
                this.ropeAttachment.setPosition(this.ziplinePlatform.x, this.ziplinePlatform.y - 15);
            }
        });
    }       );
            stone.setAlpha(0.8);
            stone.setDepth(2);
        }
        
        // Add subtle cracks
        const graphics = this.add.graphics();
        graphics.lineStyle(1, 0x333333, 0.6);
        graphics.lineBetween(
            platform.x - 70, platform.y - 20,
            platform.x - 40, platform.y - 15
        );
        graphics.lineBetween(
            platform.x + 30, platform.y - 18,
            platform.x + 60, platform.y - 22
        );
        graphics.setDepth(4);
    }
    
    createPlatformEdgeEffects(platform) {
        // Add subtle shadow underneath platform
        const shadow = this.add.ellipse(platform.x, platform.y + 25, 200, 20, 0x000000);
        shadow.setAlpha(0.3);
        shadow.setDepth(1);
        
        // Add highlight on top edge
        const highlight = this.add.rectangle(platform.x, platform.y - 22, 180, 2, 0x888888);
        highlight.setAlpha(0.5);
        highlight.setDepth(4);
    }
    
    createZiplinePlatform() {
        // Create moveable platform for the zipline puzzle
        this.ziplinePlatform = this.physics.add.sprite(300, 400, 'wood_platform');
        this.ziplinePlatform.setScale(0.8, 1);
        this.ziplinePlatform.body.setGravityY(300);
        
        // Create zipline rope constraint
        this.createZiplineConstraint();
        
        // Add platform interaction
        this.setupZiplinePlatformInteraction();
    }
    
    createZiplineConstraint() {
        // Visual rope from anchor point to platform
        this.ziplineRope = this.add.graphics();
        this.ziplineRope.lineStyle(4, 0x8B4513);
        
        // Anchor points
        this.ziplineStart = { x: 100, y: 300 };
        this.ziplineEnd = { x: 950, y: 350 };
        
        // Draw anchor points
        this.add.circle(this.ziplineStart.x, this.ziplineStart.y, 8, 0x654321);
        this.add.circle(this.ziplineEnd.x, this.ziplineEnd.y, 8, 0x654321);
    }
    
    setupEnhancedZiplinePlatformInteraction() {
        // Make platform interactive for physics puzzle with enhanced feedback
        this.ziplinePlatform.setInteractive();
        
        // Hover effects
        this.ziplinePlatform.on('pointerover', () => {
            this.ziplinePlatform.setTint(0xFFFFAA); // Slight yellow tint
            this.tweens.add({
                targets: this.ziplinePlatform,
                scaleX: 0.75,
                scaleY: 1.25,
                duration: 200,
                ease: 'Back.easeOut'
            });
            
            // Show interaction hint
            if (!this.interactionHint) {
                this.interactionHint = this.add.text(
                    this.ziplinePlatform.x,
                    this.ziplinePlatform.y - 50,
                    'Click to apply force!',
                    {
                        fontSize: '14px',
                        color: '#FFD700',
                        backgroundColor: '#000000',
                        padding: { x: 8, y: 4 }
                    }
                );
                this.interactionHint.setOrigin(0.5);
                this.interactionHint.setDepth(20);
                
                this.tweens.add({
                    targets: this.interactionHint,
                    alpha: 0.8,
                    y: this.interactionHint.y - 10,
                    duration: 300,
                    ease: 'Back.easeOut'
                });
            }
        });
        
        this.ziplinePlatform.on('pointerout', () => {
            this.ziplinePlatform.clearTint();
            this.tweens.add({
                targets: this.ziplinePlatform,
                scaleX: 0.7,
                scaleY: 1.2,
                duration: 200,
                ease: 'Back.easeOut'
            });
            
            // Hide interaction hint
            if (this.interactionHint) {
                this.tweens.add({
                    targets: this.interactionHint,
                    alpha: 0,
                    duration: 200,
                    onComplete: () => {
                        this.interactionHint.destroy();
                        this.interactionHint = null;
                    }
                });
            }
        });
        
        this.ziplinePlatform.on('pointerdown', () => {
            // Visual click feedback
            this.tweens.add({
                targets: this.ziplinePlatform,
                scaleX: 0.65,
                scaleY: 1.1,
                duration: 100,
                yoyo: true,
                ease: 'Power2'
            });
            
            // Show enhanced force dialog
            this.showEnhancedForceDialog();
        });
    }
    
    createEnvironmentalDetails() {
        // Add atmospheric details
        this.createStalactites();
        this.createCaveFlora();
        this.createRocks();
    }
    
    createStalactites() {
        const stalactitePositions = [
            { x: 200, y: 100 },
            { x: 400, y: 120 },
            { x: 600, y: 110 },
            { x: 800, y: 130 },
            { x: 1000, y: 115 }
        ];
        
        stalactitePositions.forEach(pos => {
            const stalactite = this.add.polygon(pos.x, pos.y, [
                0, 0,
                -8, 25,
                -4, 35,
                0, 40,
                4, 35,
                8, 25
            ], 0x666666);
            stalactite.setStrokeStyle(2, 0x444444);
        });
    }
    
    createCaveFlora() {
        // Add glowing mushrooms and moss
        const floraPositions = [
            { x: 120, y: 560, type: 'mushroom' },
            { x: 180, y: 570, type: 'moss' },
            { x: 870, y: 565, type: 'mushroom' },
            { x: 920, y: 572, type: 'moss' }
        ];
        
        floraPositions.forEach(flora => {
            if (flora.type === 'mushroom') {
                const mushroom = this.add.circle(flora.x, flora.y, 6, 0x9C27B0);
                mushroom.setStrokeStyle(1, 0x7B1FA2);
                
                // Add glow effect
                this.tweens.add({
                    targets: mushroom,
                    alpha: 0.6,
                    duration: 2000,
                    yoyo: true,
                    repeat: -1
                });
            } else {
                const moss = this.add.circle(flora.x, flora.y, 8, 0x4CAF50);
                moss.setAlpha(0.7);
            }
        });
    }
    
    createRocks() {
        const rockPositions = [
            { x: 320, y: 570, size: 12 },
            { x: 500, y: 650, size: 18 },
            { x: 750, y: 575, size: 15 }
        ];
        
        rockPositions.forEach(rock => {
            const rockSprite = this.add.circle(rock.x, rock.y, rock.size, 0x555555);
            rockSprite.setStrokeStyle(2, 0x333333);
        });
    }
    
    createLighting() {
        // Create torch lights
        this.torches = [];
        const torchPositions = [
            { x: 80, y: 500 },
            { x: 920, y: 500 }
        ];
        
        torchPositions.forEach(pos => {
            const torch = this.add.sprite(pos.x, pos.y, 'torch');
            this.torches.push(torch);
            
            // Create flame animation
            const flame = this.add.sprite(pos.x, pos.y - 20, 'flame_0');
            this.createFlameAnimation(flame);
            
            // Create light circle
            const light = this.add.circle(pos.x, pos.y - 20, 60, 0xFFAA00);
            light.setAlpha(0.1);
            
            // Flickering light effect
            this.tweens.add({
                targets: light,
                alpha: 0.05,
                duration: 1000 + Math.random() * 1000,
                yoyo: true,
                repeat: -1
            });
        });
    }
    
    createFlameAnimation(flame) {
        this.anims.create({
            key: 'flame_flicker',
            frames: [
                { key: 'flame_0' },
                { key: 'flame_1' },
                { key: 'flame_2' },
                { key: 'flame_3' }
            ],
            frameRate: 8,
            repeat: -1
        });
        
        flame.play('flame_flicker');
    }
    
    createPlayer() {
        // Create enhanced player sprite with idle animation
        this.player = this.physics.add.sprite(150, 500, 'protagonist_idle_0');
        
        // Set enhanced player physics properties
        this.player.setBounce(this.playerConfig.bounce);
        this.player.setCollideWorldBounds(true);
        this.player.setDragX(120); // Slightly more realistic movement
        this.player.setMaxVelocity(this.playerConfig.speed, 1000);
        
        // Enhanced player state
        this.playerState = {
            isGrounded: false,
            facingDirection: 1, // 1 for right, -1 for left
            currentAnimation: 'idle',
            lastAnimation: '',
            isInteracting: false,
            isCelebrating: false,
            energy: 100, // Energy system for special abilities
            lastGroundTime: 0
        };
        
        // Add subtle idle breathing animation by default
        this.player.play('idle');
        
        // Player visual enhancements
        this.player.setTint(0xFFFFFF); // Pure white for best color representation
        this.player.setDepth(10); // Ensure player is always on top
        
        // Add a subtle glow effect around the player
        this.playerGlow = this.add.circle(this.player.x, this.player.y, 40, 0x4A90E2);
        this.playerGlow.setAlpha(0.1);
        this.playerGlow.setDepth(5);
        
        // Animate the glow effect
        this.tweens.add({
            targets: this.playerGlow,
            alpha: 0.2,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        console.log('👤 Enhanced player created with professional animations');
    }
    
    createControls() {
        // Keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,S,A,D');
        
        // Touch/mouse controls for mobile
        this.input.on('pointerdown', this.handlePointerDown, this);
        this.input.on('pointerup', this.handlePointerUp, this);
        
        console.log('🎮 Controls created');
    }
    
    createAnimations() {
        // Enhanced idle animation (breathing effect)
        this.anims.create({
            key: 'idle',
            frames: [
                { key: 'protagonist_idle_0' },
                { key: 'protagonist_idle_1' },
                { key: 'protagonist_idle_2' },
                { key: 'protagonist_idle_3' },
                { key: 'protagonist_idle_4' },
                { key: 'protagonist_idle_5' }
            ],
            frameRate: 2,
            repeat: -1
        });
        
        // Enhanced walking animation (more frames for smoother motion)
        this.anims.create({
            key: 'walk',
            frames: [
                { key: 'protagonist_walk_0' },
                { key: 'protagonist_walk_1' },
                { key: 'protagonist_walk_2' },
                { key: 'protagonist_walk_3' },
                { key: 'protagonist_walk_4' },
                { key: 'protagonist_walk_5' },
                { key: 'protagonist_walk_6' },
                { key: 'protagonist_walk_7' },
                { key: 'protagonist_walk_8' },
                { key: 'protagonist_walk_9' },
                { key: 'protagonist_walk_10' },
                { key: 'protagonist_walk_11' }
            ],
            frameRate: 15,
            repeat: -1
        });
        
        // Enhanced jumping animation (multiple phases)
        this.anims.create({
            key: 'jump',
            frames: [
                { key: 'protagonist_jump_0' },
                { key: 'protagonist_jump_1' },
                { key: 'protagonist_jump_2' },
                { key: 'protagonist_jump_3' }
            ],
            frameRate: 10,
            repeat: 0
        });
        
        // Running animation
        this.anims.create({
            key: 'run',
            frames: [
                { key: 'protagonist_run_0' },
                { key: 'protagonist_run_1' },
                { key: 'protagonist_run_2' },
                { key: 'protagonist_run_3' },
                { key: 'protagonist_run_4' },
                { key: 'protagonist_run_5' },
                { key: 'protagonist_run_6' },
                { key: 'protagonist_run_7' }
            ],
            frameRate: 18,
            repeat: -1
        });
        
        // Climbing animation
        this.anims.create({
            key: 'climb',
            frames: [
                { key: 'protagonist_climb_0' },
                { key: 'protagonist_climb_1' },
                { key: 'protagonist_climb_2' },
                { key: 'protagonist_climb_3' },
                { key: 'protagonist_climb_4' },
                { key: 'protagonist_climb_5' }
            ],
            frameRate: 8,
            repeat: -1
        });
        
        // Interaction animation
        this.anims.create({
            key: 'interact',
            frames: [
                { key: 'protagonist_interact_0' },
                { key: 'protagonist_interact_1' },
                { key: 'protagonist_interact_2' },
                { key: 'protagonist_interact_3' },
                { key: 'protagonist_interact_4' },
                { key: 'protagonist_interact_5' },
                { key: 'protagonist_interact_6' },
                { key: 'protagonist_interact_7' }
            ],
            frameRate: 10,
            repeat: 0
        });
        
        // Celebration animation
        this.anims.create({
            key: 'celebrate',
            frames: [
                { key: 'protagonist_celebrate_0' },
                { key: 'protagonist_celebrate_1' },
                { key: 'protagonist_celebrate_2' },
                { key: 'protagonist_celebrate_3' },
                { key: 'protagonist_celebrate_4' },
                { key: 'protagonist_celebrate_5' },
                { key: 'protagonist_celebrate_6' },
                { key: 'protagonist_celebrate_7' },
                { key: 'protagonist_celebrate_8' },
                { key: 'protagonist_celebrate_9' }
            ],
            frameRate: 12,
            repeat: 2
        });
        
        // Enhanced torch flame animation
        this.anims.create({
            key: 'torch_flame',
            frames: [
                { key: 'enhanced_torch_flame_0' },
                { key: 'enhanced_torch_flame_1' },
                { key: 'enhanced_torch_flame_2' },
                { key: 'enhanced_torch_flame_3' },
                { key: 'enhanced_torch_flame_4' },
                { key: 'enhanced_torch_flame_5' }
            ],
            frameRate: 12,
            repeat: -1
        });
        
        console.log('🎭 Enhanced animations created');
    }
    
    createParticleSystems() {
        // Dust particles when landing
        this.dustParticles = this.add.particles(0, 0, 'dust_particle', {
            speed: { min: 20, max: 60 },
            lifespan: 500,
            alpha: { start: 0.7, end: 0 },
            scale: { start: 0.3, end: 0.1 }
        });
        
        // Spark particles from torches
        this.sparkParticles = this.add.particles(0, 0, 'spark_particle', {
            speed: { min: 10, max: 30 },
            lifespan: 1000,
            alpha: { start: 1, end: 0 },
            scale: { start: 0.2, end: 0.05 },
            gravityY: -50
        });
        
        // Start torch spark effects
        this.torches.forEach(torch => {
            this.sparkParticles.createEmitter({
                x: torch.x,
                y: torch.y - 20,
                frequency: 200,
                quantity: 1
            });
        });
        
        console.log('✨ Particle systems created');
    }
    
    setupPhysics() {
        // Player collides with platforms
        this.physics.add.collider(this.player, this.platforms, this.handlePlayerLanding, null, this);
        
        // Zipline platform physics
        if (this.ziplinePlatform) {
            this.physics.add.collider(this.ziplinePlatform, this.platforms);
            this.physics.add.collider(this.player, this.ziplinePlatform, this.handleZiplinePlatformLanding, null, this);
        }
        
        // Victory zone detection (right platform area)
        this.victoryZone = this.add.zone(850, 550, 200, 100);
        this.physics.world.enable(this.victoryZone);
        this.victoryZone.body.setImmovable(true);
        
        this.physics.add.overlap(this.player, this.victoryZone, this.handleVictoryZone, null, this);
        
        console.log('⚖️ Enhanced physics setup complete');
    }
    
    handleZiplinePlatformLanding(player, platform) {
        // Handle landing on zipline platform
        this.handlePlayerLanding(player, platform);
        
        // Special feedback for zipline platform
        if (!this.playerState.onPlatform) {
            this.playerState.onPlatform = true;
            this.createPlatformLandingEffect();
            
            // Show encouragement
            this.showAchievementNotification('Great Jump!', 'You used the platform successfully!');
        }
    }
    
    handleVictoryZone(player, zone) {
        // Player reached the victory zone (right platform)
        if (!this.levelCompleted) {
            this.levelCompleted = true;
            console.log('🏆 Level 1 completed!');
            
            // Trigger level completion
            this.time.delayedCall(500, () => {
                this.triggerLevelComplete();
            });
        }
    }
    
    handlePlayerLanding(player, platform) {
        if (player.body.velocity.y > 100) {
            // Create dust particles on hard landing
            this.dustParticles.createEmitter({
                x: player.x,
                y: player.y + 24,
                quantity: 5,
                lifespan: 300
            });
        }
        
        this.playerState.isGrounded = true;
    }
    
    createGameUI() {
        // UI background
        this.uiBackground = this.add.rectangle(this.gameWidth - 150, 50, 280, 100, 0x000000);
        this.uiBackground.setAlpha(0.7);
        this.uiBackground.setScrollFactor(0);
        this.uiBackground.setStrokeStyle(2, 0x4A90E2);
        
        // Physics data display
        this.velocityText = this.add.text(this.gameWidth - 270, 20, 'Velocity: 0.0 m/s', {
            fontSize: '14px',
            color: '#4A90E2'
        });
        this.velocityText.setScrollFactor(0);
        
        this.forceText = this.add.text(this.gameWidth - 270, 40, 'Force: 0.0 N', {
            fontSize: '14px',
            color: '#4A90E2'
        });
        this.forceText.setScrollFactor(0);
        
        this.energyText = this.add.text(this.gameWidth - 270, 60, 'Energy: 0.0 J', {
            fontSize: '14px',
            color: '#4A90E2'
        });
        this.energyText.setScrollFactor(0);
        
        // Instructions
        this.instructionText = this.add.text(20, this.gameHeight - 60, 'Use WASD or Arrow Keys to move. Get to the other side!', {
            fontSize: '16px',
            color: '#FFFFFF',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        });
        this.instructionText.setScrollFactor(0);
        
        console.log('🎨 Game UI created');
    }
    
    update() {
        if (!this.player) return;
        
        // Update player movement
        this.handlePlayerInput();
        
        // Update player animation
        this.updatePlayerAnimation();
        
        // Update player glow position
        if (this.playerGlow) {
            this.playerGlow.setPosition(this.player.x, this.player.y);
        }
        
        // Update zipline rope visual
        this.updateZiplineRope();
        
        // Update UI
        this.updateUI();
        
        // Check ground state
        this.checkGroundState();
        
        // Update rope attachment position
        if (this.ropeAttachment && this.ziplinePlatform) {
            this.ropeAttachment.setPosition(this.ziplinePlatform.x, this.ziplinePlatform.y - 15);
        }
    }
    
    handlePlayerInput() {
        const player = this.player;
        const speed = this.playerConfig.speed;
        
        // Horizontal movement
        if (this.cursors.left.isDown || this.wasd.A.isDown) {
            player.setVelocityX(-speed);
            this.playerState.facingDirection = -1;
            player.setFlipX(true);
        } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
            player.setVelocityX(speed);
            this.playerState.facingDirection = 1;
            player.setFlipX(false);
        } else {
            player.setVelocityX(0);
        }
        
        // Jumping
        if ((this.cursors.up.isDown || this.wasd.W.isDown) && this.playerState.isGrounded) {
            player.setVelocityY(-this.playerConfig.jumpForce);
            this.playerState.isGrounded = false;
        }
    }
    
    updatePlayerAnimation() {
        const player = this.player;
        const velocity = player.body.velocity;
        const speed = Math.abs(velocity.x);
        
        // Don't override special animations
        if (this.playerState.isInteracting || this.playerState.isCelebrating) {
            return;
        }
        
        let newAnimation = '';
        
        // Enhanced animation logic
        if (!this.playerState.isGrounded) {
            newAnimation = 'jump';
        } else if (speed > 120) {
            newAnimation = 'run';
        } else if (speed > 10) {
            newAnimation = 'walk';
        } else {
            newAnimation = 'idle';
        }
        
        // Only change animation if it's different and not a special state
        if (newAnimation !== this.playerState.currentAnimation) {
            player.play(newAnimation);
            this.playerState.currentAnimation = newAnimation;
            
            // Update glow position
            if (this.playerGlow) {
                this.playerGlow.setPosition(player.x, player.y);
            }
        }
        
        // Update facing direction smoothly
        if (velocity.x > 5 && this.playerState.facingDirection !== 1) {
            this.playerState.facingDirection = 1;
            player.setFlipX(false);
        } else if (velocity.x < -5 && this.playerState.facingDirection !== -1) {
            this.playerState.facingDirection = -1;
            player.setFlipX(true);
        }
    }
    
    updateZiplineRope() {
        if (!this.ziplineRope || !this.ziplinePlatform) return;
        
        this.ziplineRope.clear();
        this.ziplineRope.lineStyle(4, 0x8B4513);
        
        // Draw rope from start point to platform
        this.ziplineRope.lineBetween(
            this.ziplineStart.x,
            this.ziplineStart.y,
            this.ziplinePlatform.x,
            this.ziplinePlatform.y - 8
        );
        
        // Draw rope from platform to end point
        this.ziplineRope.lineBetween(
            this.ziplinePlatform.x,
            this.ziplinePlatform.y - 8,
            this.ziplineEnd.x,
            this.ziplineEnd.y
        );
    }
    
    updateUI() {
        if (!this.player) return;
        
        const velocity = this.player.body.velocity;
        const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
        const speedMS = (speed / 100); // Convert to approximate m/s
        
        this.velocityText.setText(`Velocity: ${speedMS.toFixed(1)} m/s`);
        
        // Calculate approximate force (F = ma)
        const acceleration = Math.abs(velocity.x - (this.lastVelocityX || 0));
        const force = acceleration * 70; // 70kg player mass
        this.forceText.setText(`Force: ${force.toFixed(1)} N`);
        this.lastVelocityX = velocity.x;
        
        // Calculate kinetic energy (KE = 0.5mv²)
        const kineticEnergy = 0.5 * 70 * speedMS * speedMS;
        this.energyText.setText(`Energy: ${kineticEnergy.toFixed(1)} J`);
    }
    
    checkGroundState() {
        // Reset ground state (will be set true in collision handler)
        this.playerState.isGrounded = false;
    }
    
    handlePointerDown(pointer) {
        // Handle touch/mouse input for mobile controls
        const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
        
        // Simple touch controls: tap left side to move left, right side to move right
        if (worldPoint.x < this.player.x) {
            this.touchDirection = -1;
        } else {
            this.touchDirection = 1;
        }
    }
    
    handlePointerUp(pointer) {
        this.touchDirection = 0;
    }
    
    showEnhancedForceDialog() {
        // Create enhanced force input dialog using professional assets
        const dialogBg = this.add.image(this.gameWidth/2, this.gameHeight/2, 'professional_panel');
        dialogBg.setScale(1.8, 1.4);
        dialogBg.setScrollFactor(0);
        dialogBg.setDepth(50);
        
        // Add dialog shadow
        const shadow = this.add.rectangle(this.gameWidth/2 + 5, this.gameHeight/2 + 5, 400, 300, 0x000000);
        shadow.setAlpha(0.3);
        shadow.setScrollFactor(0);
        shadow.setDepth(49);
        
        const titleText = this.add.text(this.gameWidth/2, this.gameHeight/2 - 120, '⚖️ Zipline Platform Physics', {
            fontSize: '24px',
            color: '#4A90E2',
            align: 'center',
            fontStyle: 'bold'
        });
        titleText.setOrigin(0.5);
        titleText.setScrollFactor(0);
        titleText.setDepth(51);
        
        const instructionText = this.add.text(this.gameWidth/2, this.gameHeight/2 - 80, 
            'Apply force to move the 25kg wooden platform\n' +
            'to the center of the 4m gap (±30cm tolerance)\n' +
            '💡 Hint: F = ma, consider platform mass!', {
            fontSize: '14px',
            color: '#FFFFFF',
            align: 'center',
            lineSpacing: 5
        });
        instructionText.setOrigin(0.5);
        instructionText.setScrollFactor(0);
        instructionText.setDepth(51);
        
        // Enhanced force options with physics explanations
        const forceOptions = [
            { force: 40, label: '40N\n(Light)', desc: '~4kg push' },
            { force: 65, label: '65N\n(Medium)', desc: '~6.5kg push' },
            { force: 90, label: '90N\n(Strong)', desc: '~9kg push' },
            { force: 120, label: '120N\n(Very Strong)', desc: '~12kg push' }
        ];
        const buttons = [];
        
        forceOptions.forEach((option, index) => {
            // Use professional button texture
            const button = this.add.image(
                this.gameWidth/2 - 180 + index * 120,
                this.gameHeight/2 + 20,
                'professional_button'
            );
            button.setScale(0.8);
            button.setScrollFactor(0);
            button.setInteractive();
            button.setDepth(51);
            
            const buttonText = this.add.text(button.x, button.y, option.label, {
                fontSize: '14px',
                color: '#FFFFFF',
                fontStyle: 'bold',
                align: 'center'
            });
            buttonText.setOrigin(0.5);
            buttonText.setScrollFactor(0);
            buttonText.setDepth(52);
            
            const descText = this.add.text(button.x, button.y + 25, option.desc, {
                fontSize: '10px',
                color: '#AAAAAA',
                align: 'center'
            });
            descText.setOrigin(0.5);
            descText.setScrollFactor(0);
            descText.setDepth(52);
            
            // Enhanced button interactions
            button.on('pointerover', () => {
                button.setTint(0xAADDFF);
                this.tweens.add({
                    targets: button,
                    scaleX: 0.85,
                    scaleY: 0.85,
                    duration: 100
                });
            });
            
            button.on('pointerout', () => {
                button.clearTint();
                this.tweens.add({
                    targets: button,
                    scaleX: 0.8,
                    scaleY: 0.8,
                    duration: 100
                });
            });
            
            button.on('pointerdown', () => {
                // Visual feedback
                this.tweens.add({
                    targets: button,
                    scaleX: 0.75,
                    scaleY: 0.75,
                    duration: 100,
                    yoyo: true
                });
                
                this.applyEnhancedForceToPlatform(option.force);
                this.closeEnhancedForceDialog([dialogBg, shadow, titleText, instructionText, ...buttons, buttonText, descText]);
            });
            
            buttons.push(button, buttonText, descText);
        });
        
        // Enhanced close button
        const closeButton = this.add.rectangle(this.gameWidth/2, this.gameHeight/2 + 120, 120, 35, 0x666666);
        closeButton.setStrokeStyle(2, 0x888888);
        closeButton.setScrollFactor(0);
        closeButton.setInteractive();
        closeButton.setDepth(51);
        
        const closeText = this.add.text(closeButton.x, closeButton.y, '✖ Close', {
            fontSize: '14px',
            color: '#FFFFFF',
            fontStyle: 'bold'
        });
        closeText.setOrigin(0.5);
        closeText.setScrollFactor(0);
        closeText.setDepth(52);
        
        closeButton.on('pointerover', () => {
            closeButton.setFillStyle(0x888888);
        });
        
        closeButton.on('pointerout', () => {
            closeButton.setFillStyle(0x666666);
        });
        
        closeButton.on('pointerdown', () => {
            this.closeEnhancedForceDialog([dialogBg, shadow, titleText, instructionText, closeButton, closeText, ...buttons]);
        });
        
        // Add dialog entrance animation
        dialogBg.setScale(0);
        this.tweens.add({
            targets: dialogBg,
            scaleX: 1.8,
            scaleY: 1.4,
            duration: 300,
            ease: 'Back.easeOut'
        });
    }
    
    closeEnhancedForceDialog(elements) {
        // Animate dialog close
        const dialogBg = elements[0];
        if (dialogBg) {
            this.tweens.add({
                targets: dialogBg,
                scaleX: 0,
                scaleY: 0,
                alpha: 0,
                duration: 200,
                ease: 'Back.easeIn',
                onComplete: () => {
                    elements.forEach(element => {
                        if (element && element.destroy) {
                            element.destroy();
                        }
                    });
                }
            });
        } else {
            // Fallback
            elements.forEach(element => {
                if (element && element.destroy) {
                    element.destroy();
                }
            });
        }
    }
    
    applyEnhancedForceToPlatform(force) {
        if (!this.ziplinePlatform) return;
        
        // Play interaction animation on player if nearby
        const distance = Phaser.Math.Distance.Between(
            this.player.x, this.player.y,
            this.ziplinePlatform.x, this.ziplinePlatform.y
        );
        
        if (distance < 100) {
            this.player.play('interact');
            this.playerState.isInteracting = true;
            
            // Reset to idle after interaction
            this.time.delayedCall(1200, () => {
                this.playerState.isInteracting = false;
                if (this.playerState.currentAnimation !== 'interact') {
                    this.player.play('idle');
                }
            });
        }
        
        // Reset platform position with smooth animation
        this.tweens.add({
            targets: this.ziplinePlatform,
            x: 300,
            y: 400,
            duration: 500,
            ease: 'Power2.easeOut',
            onComplete: () => {
                this.ziplinePlatform.setVelocity(0, 0);
                
                // Apply force with realistic physics
                const forceX = force * 0.9; // Enhanced scaling for better gameplay
                this.ziplinePlatform.setVelocityX(forceX);
                
                // Enhanced visual feedback with particles
                this.createForceApplicationEffect(force);
            }
        });
        
        // Check result after physics settle
        this.time.delayedCall(2500, () => {
            this.checkEnhancedPlatformPosition(force);
        });
        
        console.log(`Applied ${force}N force to enhanced zipline platform`);
    }
    
    createForceApplicationEffect(force) {
        // Visual force impact effect
        this.tweens.add({
            targets: this.ziplinePlatform,
            scaleX: 0.8,
            scaleY: 1.1,
            duration: 150,
            yoyo: true,
            ease: 'Power2'
        });
        
        // Create force particles
        const particles = this.add.particles(this.ziplinePlatform.x - 20, this.ziplinePlatform.y, 'enhanced_dust_particle', {
            speed: { min: 50, max: 100 },
            scale: { start: 0.3, end: 0.1 },
            alpha: { start: 0.8, end: 0 },
            lifespan: 600,
            quantity: 5 + Math.floor(force / 20)
        });
        
        // Auto-destroy particles
        this.time.delayedCall(1000, () => {
            particles.destroy();
        });
        
        // Platform glow effect based on force applied
        const glowColor = force < 60 ? 0x4A90E2 : force < 100 ? 0xFFA500 : 0xFF4500;
        const glow = this.add.circle(this.ziplinePlatform.x, this.ziplinePlatform.y, 50, glowColor);
        glow.setAlpha(0.3);
        glow.setDepth(5);
        
        this.tweens.add({
            targets: glow,
            alpha: 0,
            scale: 2,
            duration: 800,
            ease: 'Power2.easeOut',
            onComplete: () => glow.destroy()
        });
        
        // Camera shake for dramatic effect
        this.cameras.main.shake(300, 0.01 * (force / 50));
    }
    
    checkEnhancedPlatformPosition(appliedForce) {
        const targetX = 600; // Center of gap
        const tolerance = 35;  // ±35 pixels tolerance (slightly more forgiving)
        const currentX = this.ziplinePlatform.x;
        const distance = Math.abs(currentX - targetX);
        
        let message = '';
        let success = false;
        let resultColor = '#FF5722';
        
        if (distance <= tolerance) {
            message = `🎯 Excellent! Platform positioned within ${Math.round(distance)}px of target!\nApplied force: ${appliedForce}N (≈${Math.round(appliedForce/9.8*10)/10}kg push)`;
            success = true;
            resultColor = '#4CAF50';
            this.enableEnhancedPlayerJump();
        } else if (currentX < targetX - tolerance) {
            const shortfall = Math.round(distance);
            message = `⚡ Need more force! Platform is ${shortfall}px short.\nTry ${appliedForce + 15}-${appliedForce + 25}N next time.`;
            resultColor = '#FF9800';
        } else {
            const overshoot = Math.round(distance);
            message = `💨 Too much force! Platform overshot by ${overshoot}px.\nTry ${appliedForce - 15}-${appliedForce - 10}N next time.`;
            resultColor = '#F44336';
        }
        
        this.showEnhancedResultMessage(message, success, resultColor);
        
        // Add educational physics information
        this.time.delayedCall(3000, () => {
            this.showPhysicsExplanation(appliedForce, distance, success);
        });
    }
    
    showPhysicsExplanation(force, distance, success) {
        const explanationText = success 
            ? `🔬 Physics Success!\n\nF = ma equation solved correctly!\nForce: ${force}N, Mass: 25kg\nAcceleration: ${(force/25).toFixed(1)}m/s²\n\nGreat understanding of motion physics!`
            : `📚 Physics Lesson:\n\nFor a 25kg platform:\n• Light force (40-50N) = ~2m/s² acceleration\n• Medium force (65-75N) = ~3m/s² acceleration\n• Strong force (90-100N) = ~4m/s² acceleration\n\nRemember: F = ma (Force = mass × acceleration)`;
        
        const explanation = this.add.text(this.gameWidth - 20, 100, explanationText, {
            fontSize: '12px',
            color: success ? '#4CAF50' : '#87CEEB',
            backgroundColor: '#000000',
            padding: { x: 12, y: 8 },
            align: 'left',
            wordWrap: { width: 300 }
        });
        explanation.setOrigin(1, 0);
        explanation.setScrollFactor(0);
        explanation.setDepth(30);
        explanation.setAlpha(0);
        
        // Animate in
        this.tweens.add({
            targets: explanation,
            alpha: 0.9,
            duration: 500,
            ease: 'Power2.easeOut'
        });
        
        // Auto-remove after reading time
        this.time.delayedCall(8000, () => {
            this.tweens.add({
                targets: explanation,
                alpha: 0,
                duration: 500,
                onComplete: () => explanation.destroy()
            });
        });
    }
    
    enableEnhancedPlayerJump() {
        // Enhanced jump enabling with visual feedback
        if (this.instructionText) {
            this.instructionText.setText('🏃‍♂️ Perfect! Now jump across the gap using the platform!');
            this.instructionText.setColor('#4CAF50');
        }
        
        // Increase jump force temporarily for the crossing
        this.playerConfig.jumpForce = 650; // Stronger jump for the puzzle
        
        // Add visual indicator that platform is ready
        this.platformReadyGlow = this.add.circle(this.ziplinePlatform.x, this.ziplinePlatform.y, 60, 0x4CAF50);
        this.platformReadyGlow.setAlpha(0.2);
        this.platformReadyGlow.setDepth(8);
        
        this.tweens.add({
            targets: this.platformReadyGlow,
            alpha: 0.4,
            scale: 1.2,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Enable special platform physics for successful crossing
        this.ziplinePlatform.body.setImmovable(true); // Make platform stable for jumping
        
        // Add collision detection for successful crossing
        this.physics.add.overlap(this.player, this.ziplinePlatform, () => {
            if (!this.playerState.onPlatform) {
                this.playerState.onPlatform = true;
                this.createPlatformLandingEffect();
            }
        });
        
        // Reset after successful crossing or timeout
        this.time.delayedCall(15000, () => {
            this.resetJumpState();
        });
    }
    
    createPlatformLandingEffect() {
        // Visual effect when player lands on platform
        const landingParticles = this.add.particles(this.player.x, this.player.y + 20, 'enhanced_dust_particle', {
            speed: { min: 30, max: 80 },
            scale: { start: 0.4, end: 0.1 },
            alpha: { start: 1, end: 0 },
            lifespan: 800,
            quantity: 8
        });
        
        this.time.delayedCall(1000, () => {
            landingParticles.destroy();
        });
        
        // Camera focus effect
        this.cameras.main.pan(this.ziplinePlatform.x, this.ziplinePlatform.y, 1000, 'Power2');
        
        // Achievement notification
        this.showAchievementNotification('Platform Master!', 'Successfully used physics to cross the gap!');
    }
    
    resetJumpState() {
        this.playerConfig.jumpForce = 420; // Reset to normal
        this.playerState.onPlatform = false;
        
        if (this.platformReadyGlow) {
            this.platformReadyGlow.destroy();
            this.platformReadyGlow = null;
        }
        
        if (this.instructionText) {
            this.instructionText.setText('Use WASD or Arrow Keys to move. Get to the other side!');
            this.instructionText.setColor('#FFFFFF');
        }
        
        if (this.ziplinePlatform) {
            this.ziplinePlatform.body.setImmovable(false);
        }
    }
    
    showEnhancedResultMessage(message, success, color) {
        // Enhanced result message with professional styling
        const messageBox = this.add.image(this.gameWidth/2, 180, 'professional_panel');
        messageBox.setScale(1.2, 0.8);
        messageBox.setScrollFactor(0);
        messageBox.setDepth(40);
        messageBox.setAlpha(0);
        
        const resultText = this.add.text(this.gameWidth/2, 180, message, {
            fontSize: '16px',
            color: color,
            align: 'center',
            fontStyle: 'bold',
            wordWrap: { width: 400 }
        });
        resultText.setOrigin(0.5);
        resultText.setScrollFactor(0);
        resultText.setDepth(41);
        resultText.setAlpha(0);
        
        // Icon based on result
        const icon = success ? '🎉' : '🔄';
        const iconText = this.add.text(this.gameWidth/2 - 150, 160, icon, {
            fontSize: '24px'
        });
        iconText.setScrollFactor(0);
        iconText.setDepth(41);
        iconText.setAlpha(0);
        
        // Animate in
        this.tweens.add({
            targets: [messageBox, resultText, iconText],
            alpha: 1,
            duration: 400,
            ease: 'Back.easeOut'
        });
        
        if (success) {
            // Success particles
            this.add.particles(this.gameWidth/2, 180, 'enhanced_spark_particle', {
                speed: { min: 50, max: 150 },
                scale: { start: 0.3, end: 0.1 },
                alpha: { start: 1, end: 0 },
                lifespan: 1000,
                quantity: 15,
                emitZone: { type: 'edge', source: new Phaser.Geom.Circle(0, 0, 100), quantity: 15 }
            });
        }
        
        // Fade out after reading time
        this.time.delayedCall(4000, () => {
            this.tweens.add({
                targets: [messageBox, resultText, iconText],
                alpha: 0,
                y: '+=20',
                duration: 500,
                ease: 'Power2.easeIn',
                onComplete: () => {
                    messageBox.destroy();
                    resultText.destroy();
                    iconText.destroy();
                }
            });
        });
    }
    
    showAchievementNotification(title, description) {
        const achievement = this.add.image(this.gameWidth - 20, 50, 'professional_panel');
        achievement.setScale(0.8, 0.6);
        achievement.setOrigin(1, 0);
        achievement.setScrollFactor(0);
        achievement.setDepth(45);
        achievement.setAlpha(0);
        
        const achievementTitle = this.add.text(this.gameWidth - 150, 40, `🏆 ${title}`, {
            fontSize: '14px',
            color: '#FFD700',
            fontStyle: 'bold'
        });
        achievementTitle.setOrigin(0, 0);
        achievementTitle.setScrollFactor(0);
        achievementTitle.setDepth(46);
        achievementTitle.setAlpha(0);
        
        const achievementDesc = this.add.text(this.gameWidth - 150, 58, description, {
            fontSize: '11px',
            color: '#FFFFFF',
            wordWrap: { width: 180 }
        });
        achievementDesc.setOrigin(0, 0);
        achievementDesc.setScrollFactor(0);
        achievementDesc.setDepth(46);
        achievementDesc.setAlpha(0);
        
        // Slide in from right
        achievement.setX(this.gameWidth + 200);
        achievementTitle.setX(this.gameWidth + 50);
        achievementDesc.setX(this.gameWidth + 50);
        
        this.tweens.add({
            targets: [achievement, achievementTitle, achievementDesc],
            x: '-=220',
            alpha: 1,
            duration: 600,
            ease: 'Back.easeOut'
        });
        
        // Auto-hide after 4 seconds
        this.time.delayedCall(4000, () => {
            this.tweens.add({
                targets: [achievement, achievementTitle, achievementDesc],
                x: '+=220',
                alpha: 0,
                duration: 400,
                ease: 'Power2.easeIn',
                onComplete: () => {
                    achievement.destroy();
                    achievementTitle.destroy();
                    achievementDesc.destroy();
                }
            });
        });
    }
    
    // Public methods for external control
    startLevel1() {
        console.log('🚀 Starting Level 1: The Zipline Challenge');
        
        // Reset player position
        if (this.player) {
            this.player.setPosition(150, 500);
            this.player.setVelocity(0, 0);
            this.player.play('idle');
            this.playerState.currentAnimation = 'idle';
            this.playerState.isInteracting = false;
            this.playerState.isCelebrating = false;
        }
        
        // Reset zipline platform
        if (this.ziplinePlatform) {
            this.ziplinePlatform.setPosition(300, 400);
            this.ziplinePlatform.setVelocity(0, 0);
            this.ziplinePlatform.clearTint();
            this.ziplinePlatform.setScale(0.7, 1.2);
        }
        
        // Reset rope attachment
        if (this.ropeAttachment) {
            this.ropeAttachment.setPosition(300, 385);
        }
        
        // Update instructions with enhanced styling
        if (this.instructionText) {
            this.instructionText.setText('🎯 Approach the wooden platform and click it to apply force!');
            this.instructionText.setColor('#FFFFFF');
        }
        
        // Add welcome animation
        this.showWelcomeMessage();
    }
    
    showWelcomeMessage() {
        const welcome = this.add.text(this.gameWidth/2, 100, 
            '🧪 Physics Adventure: Level 1\nZipline Platform Challenge', {
            fontSize: '20px',
            color: '#4A90E2',
            align: 'center',
            fontStyle: 'bold'
        });
        welcome.setOrigin(0.5);
        welcome.setScrollFactor(0);
        welcome.setDepth(30);
        welcome.setAlpha(0);
        
        // Animate in
        this.tweens.add({
            targets: welcome,
            alpha: 1,
            y: 80,
            duration: 1000,
            ease: 'Back.easeOut'
        });
        
        // Fade out after 4 seconds
        this.time.delayedCall(4000, () => {
            this.tweens.add({
                targets: welcome,
                alpha: 0,
                y: 60,
                duration: 800,
                onComplete: () => welcome.destroy()
            });
        });
    }
    
    triggerLevelComplete() {
        // Trigger celebration when player reaches the end
        this.playerState.isCelebrating = true;
        this.player.play('celebrate');
        
        // Victory effects
        this.createVictoryEffects();
        
        // Show completion dialog after celebration
        this.time.delayedCall(3000, () => {
            this.showLevelCompleteDialog();
        });
    }
    
    createVictoryEffects() {
        // Fireworks-style particles
        for (let i = 0; i < 5; i++) {
            this.time.delayedCall(i * 300, () => {
                const x = 200 + Math.random() * 800;
                const y = 150 + Math.random() * 200;
                
                this.add.particles(x, y, 'enhanced_spark_particle', {
                    speed: { min: 100, max: 300 },
                    scale: { start: 0.5, end: 0.1 },
                    alpha: { start: 1, end: 0 },
                    lifespan: 2000,
                    quantity: 20,
                    emitZone: { type: 'edge', source: new Phaser.Geom.Circle(0, 0, 20), quantity: 20 }
                });
            });
        }
        
        // Screen flash
        const flash = this.add.rectangle(this.gameWidth/2, this.gameHeight/2, this.gameWidth, this.gameHeight, 0xFFFFFF);
        flash.setAlpha(0);
        flash.setScrollFactor(0);
        flash.setDepth(100);
        
        this.tweens.add({
            targets: flash,
            alpha: 0.3,
            duration: 200,
            yoyo: true,
            onComplete: () => flash.destroy()
        });
        
        // Camera celebration shake
        this.cameras.main.shake(2000, 0.005);
    }
    
    showLevelCompleteDialog() {
        // Professional completion dialog
        const completionBg = this.add.image(this.gameWidth/2, this.gameHeight/2, 'professional_panel');
        completionBg.setScale(2, 1.8);
        completionBg.setScrollFactor(0);
        completionBg.setDepth(60);
        
        const title = this.add.text(this.gameWidth/2, this.gameHeight/2 - 80, 
            '🎉 Level Complete! 🎉', {
            fontSize: '28px',
            color: '#4CAF50',
            fontStyle: 'bold'
        });
        title.setOrigin(0.5);
        title.setScrollFactor(0);
        title.setDepth(61);
        
        const message = this.add.text(this.gameWidth/2, this.gameHeight/2 - 20,
            'Excellent work, scientist!\n\n' +
            'You successfully applied the principles of physics\n' +
            'to solve the zipline platform challenge.\n\n' +
            '📊 Physics concepts mastered:\n' +
            '• Force and Motion (F = ma)\n' +
            '• Mass and Acceleration\n' +
            '• Projectile Motion\n\n' +
            'Dr. Vector has fled deeper into the cave...\n' +
            'Your physics adventure continues!', {
            fontSize: '14px',
            color: '#FFFFFF',
            align: 'center',
            lineSpacing: 8
        });
        message.setOrigin(0.5);
        message.setScrollFactor(0);
        message.setDepth(61);
        
        // Continue button
        const continueBtn = this.add.image(this.gameWidth/2, this.gameHeight/2 + 120, 'professional_button');
        continueBtn.setScrollFactor(0);
        continueBtn.setInteractive();
        continueBtn.setDepth(61);
        
        const continueText = this.add.text(this.gameWidth/2, this.gameHeight/2 + 120, 
            'Continue Adventure →', {
            fontSize: '16px',
            color: '#FFFFFF',
            fontStyle: 'bold'
        });
        continueText.setOrigin(0.5);
        continueText.setScrollFactor(0);
        continueText.setDepth(62);
        
        continueBtn.on('pointerover', () => {
            continueBtn.setTint(0xAADDFF);
        });
        
        continueBtn.on('pointerout', () => {
            continueBtn.clearTint();
        });
        
        continueBtn.on('pointerdown', () => {
            // Return to menu or continue to next level
            alert('More levels coming soon! Thanks for playing Physics Adventure!');
            // Could integrate with the main game manager to return to menu
        });
        
        // Animate dialog entrance
        [completionBg, title, message, continueBtn, continueText].forEach((element, index) => {
            element.setAlpha(0);
            element.setScale(element.scaleX * 0.8, element.scaleY * 0.8);
            
            this.tweens.add({
                targets: element,
                alpha: 1,
                scaleX: element.scaleX / 0.8,
                scaleY: element.scaleY / 0.8,
                duration: 500,
                delay: index * 100,
                ease: 'Back.easeOut'
            });
        });
    }
    
    pause() {
        if (this.scene && this.scene.scene) {
            this.scene.scene.pause();
        }
    }
    
    resume() {
        if (this.scene && this.scene.scene) {
            this.scene.scene.resume();
        }
    }
    
    destroy() {
        if (this.game) {
            this.game.destroy(true);
            this.game = null;
        }
        console.log('🗑️ PhaserGameManager destroyed');
    }
}

// Export for use in other modules
window.PhaserGameManager = PhaserGameManager;