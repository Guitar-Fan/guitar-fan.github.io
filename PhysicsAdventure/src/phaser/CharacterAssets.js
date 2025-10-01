/**
 * Enhanced Character Assets - CoolMathGames Style
 * Creates professional-quality 2D character sprites and animations
 */

class CharacterAssets {
    constructor(scene) {
        this.scene = scene;
        this.graphics = scene.add.graphics();
        
        console.log('🎨 NEW PIXEL ART CharacterAssets system initialized!');
        
        // Enhanced character design palette
        this.palette = {
            // Main character - Adventure scientist
            protagonist: {
                skin: { primary: 0xFFDBB8, shadow: 0xE8C4A0, highlight: 0xFFF2E6 },
                hair: { primary: 0x8B4513, shadow: 0x654321, highlight: 0xA0522D },
                eyes: { iris: 0x4A90E2, pupil: 0x1A1A1A, white: 0xFFFFFF },
                clothing: {
                    labCoat: { primary: 0xF8F8FF, shadow: 0xE6E6FA, accent: 0x4A90E2 },
                    shirt: { primary: 0x2E86AB, shadow: 0x236B87, highlight: 0x48A3C7 },
                    pants: { primary: 0x2F4F4F, shadow: 0x1C1C1C, highlight: 0x696969 },
                    shoes: { primary: 0x8B4513, shadow: 0x654321, laces: 0xFFFFFF },
                    belt: { leather: 0x8B4513, buckle: 0xC0C0C0 },
                    gloves: { primary: 0x4169E1, shadow: 0x1E3A8A }
                },
                accessories: {
                    glasses: { frame: 0x2F4F4F, lens: 0xE6F3FF },
                    badge: { background: 0xFFD700, text: 0x000000 },
                    tool: { handle: 0x8B4513, metal: 0xC0C0C0 }
                }
            },
            
            // Environmental elements
            environment: {
                cave: {
                    wall: [0x2C2C2C, 0x3E3E3E, 0x1A1A1A],
                    stone: [0x666666, 0x555555, 0x888888, 0x444444],
                    moss: [0x4CAF50, 0x66BB6A, 0x388E3C],
                    crystals: [0x9C27B0, 0xE91E63, 0x673AB7]
                },
                lighting: {
                    torch: [0xFF4500, 0xFFA500, 0xFFFF00],
                    ambient: 0x404040,
                    highlight: 0xFFFFFF
                }
            }
        };
        
        // Animation configurations
        this.animationConfigs = {
            idle: { frames: 6, duration: 4000 },
            walk: { frames: 12, duration: 800 },
            run: { frames: 8, duration: 600 },
            jump: { frames: 4, duration: 400 },
            climb: { frames: 6, duration: 1000 },
            interact: { frames: 8, duration: 1200 },
            celebrate: { frames: 10, duration: 1500 }
        };
    }
    
    createAllCharacterAssets() {
        console.log('🎨 Creating enhanced character assets...');
        
        // Create protagonist sprites
        this.createProtagonistSprites();
        
        // Create environmental assets
        this.createEnvironmentalAssets();
        
        // Create particle textures
        this.createParticleTextures();
        
        // Create UI elements
        this.createUIElements();
        
        console.log('✅ All enhanced character assets created');
    }
    
    createProtagonistSprites() {
        // Create idle animation frames
        this.createIdleAnimation();
        
        // Create walking animation frames
        this.createWalkingAnimation();
        
        // Create jumping animation frames
        this.createJumpingAnimation();
        
        // Create running animation frames
        this.createRunningAnimation();
        
        // Create climbing animation frames
        this.createClimbingAnimation();
        
        // Create interaction animation frames
        this.createInteractionAnimation();
        
        // Create celebration animation frames
        this.createCelebrationAnimation();
    }
    
    createIdleAnimation() {
        const config = this.animationConfigs.idle;
        
        for (let frame = 0; frame < config.frames; frame++) {
            const rt = this.scene.add.renderTexture(0, 0, 64, 80);
            this.graphics.clear();
            
            // Calculate subtle breathing animation
            const breathOffset = Math.sin((frame / config.frames) * Math.PI * 2) * 1;
            const blinkFrame = frame === 4 ? true : false;
            
            this.drawProtagonistBase(32, 40, breathOffset, blinkFrame);
            this.addIdleDetails(32, 40, frame);
            
            rt.draw(this.graphics, 0, 0);
            rt.saveTexture(`protagonist_idle_${frame}`);
            rt.destroy();
        }
    }
    
    createWalkingAnimation() {
        const config = this.animationConfigs.walk;
        
        for (let frame = 0; frame < config.frames; frame++) {
            const rt = this.scene.add.renderTexture(0, 0, 64, 80);
            this.graphics.clear();
            
            // Calculate walking cycle
            const walkCycle = (frame / config.frames) * Math.PI * 2;
            const armSwing = Math.sin(walkCycle) * 15;
            const legSwing = Math.sin(walkCycle + Math.PI) * 12;
            const bodyBob = Math.sin(walkCycle * 2) * 2;
            const headBob = Math.sin(walkCycle * 2) * 1;
            
            this.drawProtagonistBase(32, 40 + bodyBob, 0, false);
            this.addWalkingDetails(32, 40 + bodyBob, armSwing, legSwing, headBob);
            
            rt.draw(this.graphics, 0, 0);
            rt.saveTexture(`protagonist_walk_${frame}`);
            rt.destroy();
        }
    }
    
    createJumpingAnimation() {
        const config = this.animationConfigs.jump;
        const phases = ['prepare', 'launch', 'peak', 'descend'];
        
        for (let frame = 0; frame < config.frames; frame++) {
            const rt = this.scene.add.renderTexture(0, 0, 64, 80);
            this.graphics.clear();
            
            const phase = phases[frame];
            this.drawProtagonistBase(32, 40, 0, false);
            this.addJumpingDetails(32, 40, phase);
            
            rt.draw(this.graphics, 0, 0);
            rt.saveTexture(`protagonist_jump_${frame}`);
            rt.destroy();
        }
    }
    
    createRunningAnimation() {
        const config = this.animationConfigs.run;
        
        for (let frame = 0; frame < config.frames; frame++) {
            const rt = this.scene.add.renderTexture(0, 0, 64, 80);
            this.graphics.clear();
            
            // More dramatic running motion
            const runCycle = (frame / config.frames) * Math.PI * 2;
            const armSwing = Math.sin(runCycle) * 25;
            const legSwing = Math.sin(runCycle + Math.PI) * 20;
            const bodyLean = Math.sin(runCycle) * 3;
            const bodyBob = Math.sin(runCycle * 2) * 3;
            
            this.drawProtagonistBase(32 + bodyLean, 40 + bodyBob, 0, false);
            this.addRunningDetails(32 + bodyLean, 40 + bodyBob, armSwing, legSwing);
            
            rt.draw(this.graphics, 0, 0);
            rt.saveTexture(`protagonist_run_${frame}`);
            rt.destroy();
        }
    }
    
    createClimbingAnimation() {
        const config = this.animationConfigs.climb;
        
        for (let frame = 0; frame < config.frames; frame++) {
            const rt = this.scene.add.renderTexture(0, 0, 64, 80);
            this.graphics.clear();
            
            const climbCycle = (frame / config.frames) * Math.PI * 2;
            const armReach = Math.sin(climbCycle) * 10;
            const bodyStretch = Math.sin(climbCycle) * 2;
            
            this.drawProtagonistBase(32, 40 + bodyStretch, 0, false);
            this.addClimbingDetails(32, 40 + bodyStretch, armReach);
            
            rt.draw(this.graphics, 0, 0);
            rt.saveTexture(`protagonist_climb_${frame}`);
            rt.destroy();
        }
    }
    
    createInteractionAnimation() {
        const config = this.animationConfigs.interact;
        
        for (let frame = 0; frame < config.frames; frame++) {
            const rt = this.scene.add.renderTexture(0, 0, 64, 80);
            this.graphics.clear();
            
            const interactCycle = (frame / config.frames) * Math.PI * 2;
            const handMotion = Math.sin(interactCycle) * 8;
            const focusLean = Math.sin(interactCycle * 0.5) * 2;
            
            this.drawProtagonistBase(32 + focusLean, 40, 0, false);
            this.addInteractionDetails(32 + focusLean, 40, handMotion);
            
            rt.draw(this.graphics, 0, 0);
            rt.saveTexture(`protagonist_interact_${frame}`);
            rt.destroy();
        }
    }
    
    createCelebrationAnimation() {
        const config = this.animationConfigs.celebrate;
        
        for (let frame = 0; frame < config.frames; frame++) {
            const rt = this.scene.add.renderTexture(0, 0, 64, 80);
            this.graphics.clear();
            
            const celebrateCycle = (frame / config.frames) * Math.PI * 4; // Double speed
            const armRaise = Math.sin(celebrateCycle) * 20 + 20;
            const jumpHeight = Math.abs(Math.sin(celebrateCycle)) * 8;
            const smile = true; // Always smiling during celebration
            
            this.drawProtagonistBase(32, 40 - jumpHeight, 0, false, smile);
            this.addCelebrationDetails(32, 40 - jumpHeight, armRaise);
            
            rt.draw(this.graphics, 0, 0);
            rt.saveTexture(`protagonist_celebrate_${frame}`);
            rt.destroy();
        }
    }
    
    drawProtagonistBase(x, y, breathOffset = 0, blink = false, smile = false) {
        console.log('🎨 Drawing PIXEL ART character at:', x, y);
        const colors = this.palette.protagonist;
        
        // Create pixel-perfect scientist character matching the reference image
        
        // Head (pixel-perfect rectangle for pixel art style)
        this.graphics.fillStyle(colors.skin.primary);
        this.graphics.fillRect(x - 6, y - 32, 12, 12); // Square head for pixel art
        
        // Hair (brown/reddish, messy scientist hair)
        this.graphics.fillStyle(0x8B4513); // Brown hair
        this.graphics.fillRect(x - 7, y - 35, 14, 8); // Hair base
        this.graphics.fillRect(x - 5, y - 37, 4, 2); // Left hair tuft
        this.graphics.fillRect(x + 1, y - 37, 4, 2); // Right hair tuft
        this.graphics.fillRect(x - 2, y - 38, 4, 2); // Center hair tuft
        
        // Eyes (pixel art style - rectangular)
        if (!blink) {
            this.graphics.fillStyle(0x000000); // Black eyes
            this.graphics.fillRect(x - 4, y - 28, 2, 2); // Left eye
            this.graphics.fillRect(x + 2, y - 28, 2, 2); // Right eye
            
            // Eye highlights
            this.graphics.fillStyle(0xFFFFFF);
            this.graphics.fillRect(x - 3, y - 28, 1, 1); // Left eye highlight
            this.graphics.fillRect(x + 3, y - 28, 1, 1); // Right eye highlight
        } else {
            // Blinking - horizontal lines
            this.graphics.fillStyle(0x000000);
            this.graphics.fillRect(x - 4, y - 27, 2, 1);
            this.graphics.fillRect(x + 2, y - 27, 2, 1);
        }
        
        // Mouth (small pixel)
        this.graphics.fillStyle(0x000000);
        if (smile) {
            this.graphics.fillRect(x - 1, y - 23, 3, 1); // Smile
            this.graphics.fillRect(x - 2, y - 22, 1, 1); // Left smile
            this.graphics.fillRect(x + 1, y - 22, 1, 1); // Right smile
        } else {
            this.graphics.fillRect(x - 1, y - 23, 2, 1); // Neutral mouth
        }
        
        // White lab coat (matching reference image)
        this.graphics.fillStyle(0xF8F8FF); // Off-white lab coat
        this.graphics.fillRect(x - 10, y - 20 + breathOffset, 20, 26); // Main coat body
        
        // Lab coat details
        this.graphics.fillStyle(0xE0E0E0); // Slightly darker for shading
        this.graphics.fillRect(x + 6, y - 18 + breathOffset, 4, 22); // Right side shading
        this.graphics.fillRect(x - 8, y + 4 + breathOffset, 16, 2); // Bottom edge
        
        // Blue shirt/tie visible underneath
        this.graphics.fillStyle(0x4169E1); // Royal blue
        this.graphics.fillRect(x - 4, y - 18 + breathOffset, 8, 12); // Shirt V-neck area
        this.graphics.fillRect(x - 2, y - 16 + breathOffset, 4, 16); // Tie
        
        // Coat collar
        this.graphics.fillStyle(0xF8F8FF);
        this.graphics.fillRect(x - 6, y - 20 + breathOffset, 3, 4); // Left collar
        this.graphics.fillRect(x + 3, y - 20 + breathOffset, 3, 4); // Right collar
        
        // Coat buttons
        this.graphics.fillStyle(0xC0C0C0); // Silver buttons
        this.graphics.fillRect(x - 7, y - 12 + breathOffset, 2, 2); // Top button
        this.graphics.fillRect(x - 7, y - 6 + breathOffset, 2, 2); // Middle button
        this.graphics.fillRect(x - 7, y + 0 + breathOffset, 2, 2); // Bottom button
        
        // Dark pants
        this.graphics.fillStyle(0x2F4F4F); // Dark slate gray pants
        this.graphics.fillRect(x - 8, y + 6, 16, 2); // Waist/belt area
        
        // Brown belt
        this.graphics.fillStyle(0x8B4513);
        this.graphics.fillRect(x - 8, y + 6, 16, 2);
        
        // Belt buckle
        this.graphics.fillStyle(0xC0C0C0);
        this.graphics.fillRect(x - 2, y + 6, 4, 2);
    }
    
    addIdleDetails(x, y, frame) {
        // Pixel-perfect arms and legs for idle animation
        const armOffset = Math.floor(Math.sin((frame / 6) * Math.PI * 2) * 1); // Subtle pixel movement
        
        // Arms (white lab coat sleeves)
        this.graphics.fillStyle(0xF8F8FF); // Lab coat white
        this.graphics.fillRect(x - 16, y - 16 + armOffset, 6, 18); // Left arm
        this.graphics.fillRect(x + 10, y - 16 - armOffset, 6, 18); // Right arm
        
        // Arm shading
        this.graphics.fillStyle(0xE0E0E0);
        this.graphics.fillRect(x - 12, y - 14 + armOffset, 2, 14); // Left arm shade
        this.graphics.fillRect(x + 14, y - 14 - armOffset, 2, 14); // Right arm shade
        
        // Hands (skin color)
        this.graphics.fillStyle(0xFFDBB8); // Skin tone
        this.graphics.fillRect(x - 16, y + 2 + armOffset, 6, 4); // Left hand
        this.graphics.fillRect(x + 10, y + 2 - armOffset, 6, 4); // Right hand
        
        // Legs (dark pants)
        this.graphics.fillStyle(0x2F4F4F); // Dark pants
        this.graphics.fillRect(x - 6, y + 8, 5, 18); // Left leg
        this.graphics.fillRect(x + 1, y + 8, 5, 18); // Right leg
        
        // Leg shading
        this.graphics.fillStyle(0x1C1C1C); // Darker shade
        this.graphics.fillRect(x - 2, y + 10, 1, 14); // Left leg shade
        this.graphics.fillRect(x + 5, y + 10, 1, 14); // Right leg shade
        
        // Shoes (brown/dark)
        this.graphics.fillStyle(0x654321); // Brown shoes
        this.graphics.fillRect(x - 8, y + 26, 8, 4); // Left shoe
        this.graphics.fillRect(x + 0, y + 26, 8, 4); // Right shoe
        
        // Shoe details
        this.graphics.fillStyle(0x4A4A4A); // Dark gray for shoe soles
        this.graphics.fillRect(x - 8, y + 29, 8, 1); // Left sole
        this.graphics.fillRect(x + 0, y + 29, 8, 1); // Right sole
        
        // Shoe laces (white pixels)
        this.graphics.fillStyle(0xFFFFFF);
        this.graphics.fillRect(x - 6, y + 27, 1, 1); // Left lace
        this.graphics.fillRect(x - 4, y + 27, 1, 1); // Left lace
        this.graphics.fillRect(x + 2, y + 27, 1, 1); // Right lace
        this.graphics.fillRect(x + 4, y + 27, 1, 1); // Right lace
    }
    
    addWalkingDetails(x, y, armSwing, legSwing, headBob) {
        // Pixel-perfect walking animation with simplified movements
        const pixelArmSwing = Math.floor(armSwing * 0.2); // Convert to pixel movement
        const pixelLegSwing = Math.floor(legSwing * 0.3); // Convert to pixel movement
        
        // Arms (lab coat sleeves) - simple horizontal movement
        this.graphics.fillStyle(0xF8F8FF); // Lab coat white
        this.graphics.fillRect(x - 16 + pixelArmSwing, y - 16, 6, 18); // Left arm
        this.graphics.fillRect(x + 10 - pixelArmSwing, y - 16, 6, 18); // Right arm
        
        // Arm shading
        this.graphics.fillStyle(0xE0E0E0);
        this.graphics.fillRect(x - 12 + pixelArmSwing, y - 14, 2, 14); // Left arm shade
        this.graphics.fillRect(x + 14 - pixelArmSwing, y - 14, 2, 14); // Right arm shade
        
        // Hands
        this.graphics.fillStyle(0xFFDBB8); // Skin tone
        this.graphics.fillRect(x - 16 + pixelArmSwing, y + 2, 6, 4); // Left hand
        this.graphics.fillRect(x + 10 - pixelArmSwing, y + 2, 6, 4); // Right hand
        
        // Walking legs - alternating positions
        this.graphics.fillStyle(0x2F4F4F); // Dark pants
        this.graphics.fillRect(x - 6 + pixelLegSwing, y + 8, 5, 18); // Left leg
        this.graphics.fillRect(x + 1 - pixelLegSwing, y + 8, 5, 18); // Right leg
        
        // Leg shading
        this.graphics.fillStyle(0x1C1C1C); // Darker shade
        this.graphics.fillRect(x - 2 + pixelLegSwing, y + 10, 1, 14); // Left leg shade
        this.graphics.fillRect(x + 5 - pixelLegSwing, y + 10, 1, 14); // Right leg shade
        
        // Shoes - following leg positions
        this.graphics.fillStyle(0x654321); // Brown shoes
        this.graphics.fillRect(x - 8 + pixelLegSwing, y + 26, 8, 4); // Left shoe
        this.graphics.fillRect(x + 0 - pixelLegSwing, y + 26, 8, 4); // Right shoe
        
        // Shoe soles
        this.graphics.fillStyle(0x4A4A4A); // Dark gray
        this.graphics.fillRect(x - 8 + pixelLegSwing, y + 29, 8, 1); // Left sole
        this.graphics.fillRect(x + 0 - pixelLegSwing, y + 29, 8, 1); // Right sole
        
        // Shoe laces
        this.graphics.fillStyle(0xFFFFFF);
        this.graphics.fillRect(x - 6 + pixelLegSwing, y + 27, 1, 1); // Left lace
        this.graphics.fillRect(x - 4 + pixelLegSwing, y + 27, 1, 1); // Left lace  
        this.graphics.fillRect(x + 2 - pixelLegSwing, y + 27, 1, 1); // Right lace
        this.graphics.fillRect(x + 4 - pixelLegSwing, y + 27, 1, 1); // Right lace
    }
    
    addJumpingDetails(x, y, phase) {
        // Pixel-perfect jumping positions based on phase
        let armOffset = 0;
        let legOffset = 0;
        let armHeight = 18;
        let legHeight = 18;
        
        switch (phase) {
            case 'prepare':
                armOffset = -2; // Arms slightly back
                legOffset = 2; // Legs slightly bent
                legHeight = 16; // Shorter legs when crouched
                break;
            case 'launch':
                armOffset = 3; // Arms forward
                legOffset = -4; // Legs extending
                break;
            case 'peak':
                armOffset = 4; // Arms fully extended
                legOffset = -6; // Legs tucked up
                legHeight = 14; // Legs bent up
                break;
            case 'descend':
                armOffset = 2; // Arms slightly forward
                legOffset = -2; // Legs preparing to land
                break;
        }
        
        // Arms in jumping position (lab coat sleeves)
        this.graphics.fillStyle(0xF8F8FF); // Lab coat white
        this.graphics.fillRect(x - 16 + armOffset, y - 16, 6, armHeight); // Left arm
        this.graphics.fillRect(x + 10 + armOffset, y - 16, 6, armHeight); // Right arm
        
        // Arm shading
        this.graphics.fillStyle(0xE0E0E0);
        this.graphics.fillRect(x - 12 + armOffset, y - 14, 2, armHeight - 2); // Left arm shade
        this.graphics.fillRect(x + 14 + armOffset, y - 14, 2, armHeight - 2); // Right arm shade
        
        // Hands
        this.graphics.fillStyle(0xFFDBB8); // Skin tone
        this.graphics.fillRect(x - 16 + armOffset, y + 2, 6, 4); // Left hand
        this.graphics.fillRect(x + 10 + armOffset, y + 2, 6, 4); // Right hand
        
        // Legs in jumping position (dark pants)
        this.graphics.fillStyle(0x2F4F4F); // Dark pants
        this.graphics.fillRect(x - 6, y + 8 + legOffset, 5, legHeight); // Left leg
        this.graphics.fillRect(x + 1, y + 8 + legOffset, 5, legHeight); // Right leg
        
        // Leg shading
        this.graphics.fillStyle(0x1C1C1C); // Darker shade
        this.graphics.fillRect(x - 2, y + 10 + legOffset, 1, legHeight - 2); // Left leg shade
        this.graphics.fillRect(x + 5, y + 10 + legOffset, 1, legHeight - 2); // Right leg shade
        
        // Shoes
        this.graphics.fillStyle(0x654321); // Brown shoes
        this.graphics.fillRect(x - 8, y + 26 + legOffset, 8, 4); // Left shoe
        this.graphics.fillRect(x + 0, y + 26 + legOffset, 8, 4); // Right shoe
        
        // Shoe soles
        this.graphics.fillStyle(0x4A4A4A); // Dark gray
        this.graphics.fillRect(x - 8, y + 29 + legOffset, 8, 1); // Left sole
        this.graphics.fillRect(x + 0, y + 29 + legOffset, 8, 1); // Right sole
        
        // Shoe laces
        this.graphics.fillStyle(0xFFFFFF);
        this.graphics.fillRect(x - 6, y + 27 + legOffset, 1, 1); // Left lace
        this.graphics.fillRect(x - 4, y + 27 + legOffset, 1, 1); // Left lace
        this.graphics.fillRect(x + 2, y + 27 + legOffset, 1, 1); // Right lace
        this.graphics.fillRect(x + 4, y + 27 + legOffset, 1, 1); // Right lace
    }
    
    addRunningDetails(x, y, armSwing, legSwing) {
        // Similar to walking but more exaggerated
        this.addWalkingDetails(x, y, armSwing * 1.5, legSwing * 1.5, 0);
    }
    
    addClimbingDetails(x, y, armReach) {
        // Pixel-perfect climbing pose with arms reaching up
        const reachOffset = Math.floor(armReach * 0.1); // Convert to pixel movement
        
        // Arms reaching upward (lab coat sleeves)
        this.graphics.fillStyle(0xF8F8FF); // Lab coat white
        this.graphics.fillRect(x - 18 + reachOffset, y - 20, 6, 16); // Left arm reaching up
        this.graphics.fillRect(x + 12 - reachOffset, y - 20, 6, 16); // Right arm reaching up
        
        // Arm shading
        this.graphics.fillStyle(0xE0E0E0);
        this.graphics.fillRect(x - 14 + reachOffset, y - 18, 2, 12); // Left arm shade
        this.graphics.fillRect(x + 16 - reachOffset, y - 18, 2, 12); // Right arm shade
        
        // Hands reaching
        this.graphics.fillStyle(0xFFDBB8); // Skin tone
        this.graphics.fillRect(x - 18 + reachOffset, y - 4, 6, 4); // Left hand
        this.graphics.fillRect(x + 12 - reachOffset, y - 4, 6, 4); // Right hand
        
        // Legs in climbing position (one higher than other)
        this.graphics.fillStyle(0x2F4F4F); // Dark pants
        this.graphics.fillRect(x - 8, y + 8, 5, 16); // Left leg (higher)
        this.graphics.fillRect(x + 3, y + 12, 5, 14); // Right leg (lower)
        
        // Leg shading
        this.graphics.fillStyle(0x1C1C1C); // Darker shade
        this.graphics.fillRect(x - 4, y + 10, 1, 12); // Left leg shade
        this.graphics.fillRect(x + 7, y + 14, 1, 10); // Right leg shade
        
        // Climbing shoes
        this.graphics.fillStyle(0x654321); // Brown shoes
        this.graphics.fillRect(x - 10, y + 24, 8, 4); // Left shoe
        this.graphics.fillRect(x + 1, y + 26, 8, 4); // Right shoe
        
        // Shoe soles
        this.graphics.fillStyle(0x4A4A4A); // Dark gray
        this.graphics.fillRect(x - 10, y + 27, 8, 1); // Left sole
        this.graphics.fillRect(x + 1, y + 29, 8, 1); // Right sole
        
        // Shoe laces
        this.graphics.fillStyle(0xFFFFFF);
        this.graphics.fillRect(x - 8, y + 25, 1, 1); // Left lace
        this.graphics.fillRect(x - 6, y + 25, 1, 1); // Left lace
        this.graphics.fillRect(x + 3, y + 27, 1, 1); // Right lace
        this.graphics.fillRect(x + 5, y + 27, 1, 1); // Right lace
    }
    
    addInteractionDetails(x, y, handMotion) {
        // Pixel-perfect interaction pose with one arm extended
        const motionOffset = Math.floor(handMotion * 0.1); // Convert to pixel movement
        
        // Extended arm for interaction (lab coat sleeve)
        this.graphics.fillStyle(0xF8F8FF); // Lab coat white
        this.graphics.fillRect(x + 10 + motionOffset, y - 12, 8, 6); // Extended right arm (horizontal)
        this.graphics.fillRect(x + 18 + motionOffset, y - 12, 6, 14); // Extended forearm
        
        // Other arm at side
        this.graphics.fillRect(x - 16, y - 16, 6, 18); // Left arm at side
        
        // Arm shading
        this.graphics.fillStyle(0xE0E0E0);
        this.graphics.fillRect(x + 14 + motionOffset, y - 10, 2, 4); // Extended arm shade
        this.graphics.fillRect(x + 22 + motionOffset, y - 10, 2, 10); // Extended forearm shade
        this.graphics.fillRect(x - 12, y - 14, 2, 14); // Left arm shade
        
        // Hands
        this.graphics.fillStyle(0xFFDBB8); // Skin tone
        this.graphics.fillRect(x + 24 + motionOffset, y + 2, 6, 4); // Extended hand
        this.graphics.fillRect(x - 16, y + 2, 6, 4); // Left hand
        
        // Normal leg stance (dark pants)
        this.graphics.fillStyle(0x2F4F4F); // Dark pants
        this.graphics.fillRect(x - 6, y + 8, 5, 18); // Left leg
        this.graphics.fillRect(x + 1, y + 8, 5, 18); // Right leg
        
        // Leg shading
        this.graphics.fillStyle(0x1C1C1C); // Darker shade
        this.graphics.fillRect(x - 2, y + 10, 1, 14); // Left leg shade
        this.graphics.fillRect(x + 5, y + 10, 1, 14); // Right leg shade
        
        // Shoes
        this.graphics.fillStyle(0x654321); // Brown shoes
        this.graphics.fillRect(x - 8, y + 26, 8, 4); // Left shoe
        this.graphics.fillRect(x + 0, y + 26, 8, 4); // Right shoe
        
        // Shoe soles
        this.graphics.fillStyle(0x4A4A4A); // Dark gray
        this.graphics.fillRect(x - 8, y + 29, 8, 1); // Left sole
        this.graphics.fillRect(x + 0, y + 29, 8, 1); // Right sole
        
        // Shoe laces
        this.graphics.fillStyle(0xFFFFFF);
        this.graphics.fillRect(x - 6, y + 27, 1, 1); // Left lace
        this.graphics.fillRect(x - 4, y + 27, 1, 1); // Left lace
        this.graphics.fillRect(x + 2, y + 27, 1, 1); // Right lace
        this.graphics.fillRect(x + 4, y + 27, 1, 1); // Right lace
    }
    
    addCelebrationDetails(x, y, armRaise) {
        // Pixel-perfect celebration pose with arms raised high
        const raiseOffset = Math.floor(armRaise * 0.1); // Convert to pixel movement
        
        // Arms raised in celebration (lab coat sleeves)
        this.graphics.fillStyle(0xF8F8FF); // Lab coat white
        this.graphics.fillRect(x - 18 + raiseOffset, y - 22, 6, 18); // Left arm raised
        this.graphics.fillRect(x + 12 - raiseOffset, y - 22, 6, 18); // Right arm raised
        
        // Arm shading
        this.graphics.fillStyle(0xE0E0E0);
        this.graphics.fillRect(x - 14 + raiseOffset, y - 20, 2, 14); // Left arm shade
        this.graphics.fillRect(x + 16 - raiseOffset, y - 20, 2, 14); // Right arm shade
        
        // Hands raised up
        this.graphics.fillStyle(0xFFDBB8); // Skin tone
        this.graphics.fillRect(x - 18 + raiseOffset, y - 4, 6, 4); // Left hand
        this.graphics.fillRect(x + 12 - raiseOffset, y - 4, 6, 4); // Right hand
        
        // Legs in celebration stance (dark pants)
        this.graphics.fillStyle(0x2F4F4F); // Dark pants
        this.graphics.fillRect(x - 6, y + 8, 5, 18); // Left leg
        this.graphics.fillRect(x + 1, y + 8, 5, 18); // Right leg
        
        // Leg shading
        this.graphics.fillStyle(0x1C1C1C); // Darker shade
        this.graphics.fillRect(x - 2, y + 10, 1, 14); // Left leg shade
        this.graphics.fillRect(x + 5, y + 10, 1, 14); // Right leg shade
        
        // Celebration shoes
        this.graphics.fillStyle(0x654321); // Brown shoes
        this.graphics.fillRect(x - 8, y + 26, 8, 4); // Left shoe
        this.graphics.fillRect(x + 0, y + 26, 8, 4); // Right shoe
        
        // Shoe soles
        this.graphics.fillStyle(0x4A4A4A); // Dark gray
        this.graphics.fillRect(x - 8, y + 29, 8, 1); // Left sole
        this.graphics.fillRect(x + 0, y + 29, 8, 1); // Right sole
        
        // Shoe laces
        this.graphics.fillStyle(0xFFFFFF);
        this.graphics.fillRect(x - 6, y + 27, 1, 1); // Left lace
        this.graphics.fillRect(x - 4, y + 27, 1, 1); // Left lace
        this.graphics.fillRect(x + 2, y + 27, 1, 1); // Right lace
        this.graphics.fillRect(x + 4, y + 27, 1, 1); // Right lace
    }
    
    createEnvironmentalAssets() {
        // Enhanced cave walls
        this.createEnhancedCaveWalls();
        
        // Professional platform textures
        this.createProfessionalPlatforms();
        
        // Atmospheric lighting elements
        this.createLightingElements();
        
        // Interactive objects
        this.createInteractiveObjects();
    }
    
    createEnhancedCaveWalls() {
        const rt = this.scene.add.renderTexture(0, 0, 128, 128);
        this.graphics.clear();
        
        const colors = this.palette.environment.cave;
        
        // Base cave wall
        this.graphics.fillStyle(colors.wall[0]);
        this.graphics.fillRect(0, 0, 128, 128);
        
        // Rock texture layers
        for (let i = 0; i < 20; i++) {
            this.graphics.fillStyle(colors.wall[i % 3]);
            const size = 8 + Math.random() * 12;
            const x = Math.random() * 128;
            const y = Math.random() * 128;
            this.graphics.fillCircle(x, y, size);
        }
        
        // Moss patches
        for (let i = 0; i < 8; i++) {
            this.graphics.fillStyle(colors.moss[i % 3]);
            const x = Math.random() * 128;
            const y = Math.random() * 128;
            this.graphics.fillCircle(x, y, 3 + Math.random() * 4);
        }
        
        // Crystal formations
        for (let i = 0; i < 5; i++) {
            this.graphics.fillStyle(colors.crystals[i % 3]);
            const x = Math.random() * 128;
            const y = Math.random() * 128;
            this.graphics.fillPolygon([
                x, y - 6,
                x - 3, y + 2,
                x + 3, y + 2
            ]);
        }
        
        rt.draw(this.graphics, 0, 0);
        rt.saveTexture('enhanced_cave_wall');
        this.graphics.clear();
        rt.destroy();
    }
    
    createProfessionalPlatforms() {
        // Stone platform with detailed texture
        const stoneRt = this.scene.add.renderTexture(0, 0, 200, 40);
        this.graphics.clear();
        
        // Base stone
        this.graphics.fillStyle(0x666666);
        this.graphics.fillRoundedRect(0, 0, 200, 40, 4);
        
        // Stone blocks
        for (let i = 0; i < 8; i++) {
            const x = i * 25;
            this.graphics.fillStyle(0x555555 + Math.random() * 0x222222);
            this.graphics.fillRoundedRect(x, 0, 24, 40, 2);
            
            // Block highlights
            this.graphics.fillStyle(0x888888);
            this.graphics.fillRect(x, 0, 24, 2);
            this.graphics.fillRect(x, 0, 2, 40);
            
            // Block shadows
            this.graphics.fillStyle(0x444444);
            this.graphics.fillRect(x, 38, 24, 2);
            this.graphics.fillRect(x + 22, 0, 2, 40);
        }
        
        stoneRt.draw(this.graphics, 0, 0);
        stoneRt.saveTexture('professional_stone_platform');
        this.graphics.clear();
        stoneRt.destroy();
        
        // Wood platform with metal reinforcements
        const woodRt = this.scene.add.renderTexture(0, 0, 160, 24);
        this.graphics.clear();
        
        // Wood base
        this.graphics.fillStyle(0x8B4513);
        this.graphics.fillRoundedRect(0, 0, 160, 24, 3);
        
        // Wood grain
        for (let i = 0; i < 12; i++) {
            this.graphics.lineStyle(1, 0x654321);
            this.graphics.lineBetween(0, 4 + i * 2, 160, 4 + i * 2);
        }
        
        // Metal reinforcements
        this.graphics.fillStyle(0x708090);
        this.graphics.fillRect(0, 0, 160, 3);
        this.graphics.fillRect(0, 21, 160, 3);
        this.graphics.fillRect(15, 0, 3, 24);
        this.graphics.fillRect(75, 0, 3, 24);
        this.graphics.fillRect(140, 0, 3, 24);
        
        // Metal rivets
        this.graphics.fillStyle(0x2F4F4F);
        for (let i = 0; i < 8; i++) {
            const x = 20 + i * 20;
            this.graphics.fillCircle(x, 6, 2);
            this.graphics.fillCircle(x, 18, 2);
        }
        
        woodRt.draw(this.graphics, 0, 0);
        woodRt.saveTexture('professional_wood_platform');
        this.graphics.clear();
        woodRt.destroy();
    }
    
    createLightingElements() {
        // Enhanced torch with realistic flame
        for (let frame = 0; frame < 6; frame++) {
            const torchRt = this.scene.add.renderTexture(0, 0, 32, 64);
            this.graphics.clear();
            
            // Torch base
            this.graphics.fillStyle(0x8B4513);
            this.graphics.fillRoundedRect(12, 32, 8, 32, 2);
            
            // Torch head
            this.graphics.fillStyle(0x654321);
            this.graphics.fillCircle(16, 28, 8);
            
            // Flame (animated)
            const flameHeight = 16 + Math.sin((frame / 6) * Math.PI * 2) * 4;
            const flameWidth = 12 + Math.cos((frame / 6) * Math.PI * 2) * 2;
            const flameSway = Math.sin((frame / 6) * Math.PI * 2) * 2;
            
            // Flame outer (red)
            this.graphics.fillStyle(0xFF4500);
            this.graphics.fillEllipse(16 + flameSway, 20, flameWidth, flameHeight);
            
            // Flame middle (orange)
            this.graphics.fillStyle(0xFFA500);
            this.graphics.fillEllipse(16 + flameSway * 0.7, 22, flameWidth * 0.7, flameHeight * 0.8);
            
            // Flame core (yellow)
            this.graphics.fillStyle(0xFFFF00);
            this.graphics.fillEllipse(16 + flameSway * 0.5, 24, flameWidth * 0.4, flameHeight * 0.6);
            
            // Flame highlight (white)
            this.graphics.fillStyle(0xFFFFFF);
            this.graphics.fillEllipse(16 + flameSway * 0.3, 26, flameWidth * 0.2, flameHeight * 0.3);
            
            torchRt.draw(this.graphics, 0, 0);
            torchRt.saveTexture(`enhanced_torch_flame_${frame}`);
            this.graphics.clear();
            torchRt.destroy();
        }
    }
    
    createInteractiveObjects() {
        // Zipline mechanism
        const ziplineRt = this.scene.add.renderTexture(0, 0, 48, 32);
        this.graphics.clear();
        
        // Pulley wheel
        this.graphics.fillStyle(0x708090);
        this.graphics.fillCircle(24, 16, 12);
        this.graphics.fillStyle(0x2F4F4F);
        this.graphics.fillCircle(24, 16, 8);
        
        // Rope attachment
        this.graphics.fillStyle(0x8B4513);
        this.graphics.fillRect(20, 28, 8, 4);
        
        ziplineRt.draw(this.graphics, 0, 0);
        ziplineRt.saveTexture('zipline_mechanism');
        this.graphics.clear();
        ziplineRt.destroy();
        
        // Physics measurement device
        const deviceRt = this.scene.add.renderTexture(0, 0, 32, 48);
        this.graphics.clear();
        
        // Device body
        this.graphics.fillStyle(0x2F4F4F);
        this.graphics.fillRoundedRect(4, 8, 24, 36, 4);
        
        // Screen
        this.graphics.fillStyle(0x00FF41);
        this.graphics.fillRoundedRect(8, 12, 16, 12, 2);
        
        // Display lines
        this.graphics.lineStyle(1, 0x008F11);
        this.graphics.lineBetween(10, 16, 22, 16);
        this.graphics.lineBetween(10, 18, 18, 18);
        this.graphics.lineBetween(10, 20, 20, 20);
        
        // Buttons
        this.graphics.fillStyle(0x4169E1);
        this.graphics.fillCircle(12, 30, 3);
        this.graphics.fillCircle(20, 30, 3);
        
        // Antenna
        this.graphics.lineStyle(2, 0x708090);
        this.graphics.lineBetween(16, 8, 16, 4);
        this.graphics.fillCircle(16, 4, 2);
        
        deviceRt.draw(this.graphics, 0, 0);
        deviceRt.saveTexture('physics_device');
        this.graphics.clear();
        deviceRt.destroy();
    }
    
    createParticleTextures() {
        // Dust particles
        const dustRt = this.scene.add.renderTexture(0, 0, 8, 8);
        this.graphics.clear();
        this.graphics.fillStyle(0xD4C4A8);
        this.graphics.fillCircle(4, 4, 3);
        this.graphics.fillStyle(0xF5F5DC);
        this.graphics.fillCircle(4, 4, 1);
        dustRt.draw(this.graphics, 0, 0);
        dustRt.saveTexture('enhanced_dust_particle');
        this.graphics.clear();
        dustRt.destroy();
        
        // Spark particles
        const sparkRt = this.scene.add.renderTexture(0, 0, 12, 12);
        this.graphics.clear();
        this.graphics.fillStyle(0xFFD700);
        this.graphics.fillStar(6, 6, 4, 4, 2, 0);
        this.graphics.fillStyle(0xFFFFFF);
        this.graphics.fillCircle(6, 6, 2);
        sparkRt.draw(this.graphics, 0, 0);
        sparkRt.saveTexture('enhanced_spark_particle');
        this.graphics.clear();
        sparkRt.destroy();
        
        // Magic/energy particles
        const energyRt = this.scene.add.renderTexture(0, 0, 10, 10);
        this.graphics.clear();
        this.graphics.fillStyle(0x4A90E2);
        this.graphics.fillCircle(5, 5, 4);
        this.graphics.fillStyle(0x87CEEB);
        this.graphics.fillCircle(5, 5, 2);
        this.graphics.fillStyle(0xFFFFFF);
        this.graphics.fillCircle(5, 5, 1);
        energyRt.draw(this.graphics, 0, 0);
        energyRt.saveTexture('energy_particle');
        this.graphics.clear();
        energyRt.destroy();
    }
    
    createUIElements() {
        // Professional button
        const buttonRt = this.scene.add.renderTexture(0, 0, 160, 48);
        this.graphics.clear();
        
        // Button gradient
        this.graphics.fillGradientStyle(0x4A90E2, 0x357ABD, 0x2E6AB4, 0x1E5A96);
        this.graphics.fillRoundedRect(0, 0, 160, 48, 8);
        
        // Button highlight
        this.graphics.fillStyle(0x87CEEB);
        this.graphics.fillRoundedRect(4, 4, 152, 8, 6);
        
        // Button border
        this.graphics.lineStyle(2, 0x1E3A8A);
        this.graphics.strokeRoundedRect(0, 0, 160, 48, 8);
        
        buttonRt.draw(this.graphics, 0, 0);
        buttonRt.saveTexture('professional_button');
        this.graphics.clear();
        buttonRt.destroy();
        
        // Panel background
        const panelRt = this.scene.add.renderTexture(0, 0, 240, 120);
        this.graphics.clear();
        
        // Panel gradient
        this.graphics.fillGradientStyle(0x1A1A2E, 0x16213E, 0x0F172A, 0x0A0A0A);
        this.graphics.fillRoundedRect(0, 0, 240, 120, 12);
        
        // Panel border
        this.graphics.lineStyle(2, 0x4A90E2);
        this.graphics.strokeRoundedRect(0, 0, 240, 120, 12);
        
        // Panel inner glow
        this.graphics.lineStyle(1, 0x87CEEB);
        this.graphics.strokeRoundedRect(4, 4, 232, 112, 10);
        
        panelRt.draw(this.graphics, 0, 0);
        panelRt.saveTexture('professional_panel');
        this.graphics.clear();
        panelRt.destroy();
    }
    
    destroy() {
        if (this.graphics) {
            this.graphics.destroy();
        }
    }
}

// Export for use in other modules
window.CharacterAssets = CharacterAssets;