/**
 * SpriteManager - Handles realistic human protagonist sprites and animations
 */
class SpriteManager {
    constructor(canvas, world, physicsConfig) {
        this.canvas = canvas;
        this.world = world;
        this.ctx = canvas.getContext('2d');
        this.physics = physicsConfig; // Physics unit system from GameManager
        
        // Animation system
        this.currentAnimation = 'idle';
        this.animationFrame = 0;
        this.animationSpeed = 10; // frames per animation update
        this.frameCounter = 0;
        
        // Human protagonist properties (in real-world units)
        this.protagonist = {
            // Physical dimensions (meters)
            height: this.physics.human.height, // 1.75m
            width: this.physics.human.width,   // 0.45m
            mass: this.physics.human.mass,     // 70kg
            
            // Position and physics
            x: this.physics.metersToPixels(1.0), // Start 1m from left
            y: 500,
            facing: 'right',
            isGrounded: true,
            velocity: { x: 0, y: 0 },
            
            // Visual proportions (relative to height)
            proportions: {
                headRatio: 0.14,    // Head is 14% of height
                torsoRatio: 0.40,   // Torso is 40% of height  
                legRatio: 0.46,     // Legs are 46% of height
                armRatio: 0.35,     // Arms are 35% of height
                shoulderWidth: 0.25 // Shoulders are 25% of height
            }
        };
        
        // Initialize realistic human sprites
        this.initializeHumanSprites();
        this.createProtagonistBody();
    }
    
    initializeHumanSprites() {
        // Human character appearance
        this.humanDesign = {
            // Skin tone
            skinColor: '#FFDBAC',
            skinShadow: '#E6C2A6',
            
            // Clothing
            shirtColor: '#4A90E2',
            shirtShadow: '#357ABD', 
            pantsColor: '#2D3748',
            pantsShadow: '#1A1F2E',
            shoeColor: '#8B4513',
            
            // Hair
            hairColor: '#654321',
            
            // Animation states with frame data
            animations: {
                idle: {
                    frames: 4,
                    armSwing: [0, 2, 0, -2], // subtle arm movement
                    legPosition: [0, 0, 0, 0],
                    torsoOffset: [0, 1, 0, -1]
                },
                walking: {
                    frames: 8,
                    armSwing: [15, 10, 0, -10, -15, -10, 0, 10], // arm swing cycle
                    legPosition: [10, 5, 0, -5, -10, -5, 0, 5], // leg movement
                    torsoOffset: [0, 1, 2, 1, 0, 1, 2, 1] // walking bounce
                },
                jumping: {
                    frames: 3,
                    armSwing: [-20, -15, -10], // arms up for balance
                    legPosition: [0, -10, -15], // legs pull up
                    torsoOffset: [0, -2, -4] // body compression
                },
                running: {
                    frames: 6,
                    armSwing: [25, 15, 0, -15, -25, -15], // strong arm swing
                    legPosition: [20, 10, 0, -10, -20, -10], // long strides
                    torsoOffset: [2, 3, 2, 1, 2, 3] // forward lean
                },
                crouch: {
                    frames: 2,
                    armSwing: [5, -5], // arms for balance
                    legPosition: [15, 20], // bent legs
                    torsoOffset: [10, 12] // lower body position
                }
            }
        };
    }
    
    createProtagonistBody() {
        // Convert human dimensions to pixels
        const pixelHeight = this.physics.metersToPixels(this.protagonist.height);
        const pixelWidth = this.physics.metersToPixels(this.protagonist.width);
        
        // Create realistic physics body for human character
        this.protagonistBody = Matter.Bodies.rectangle(
            this.protagonist.x,
            this.protagonist.y,
            pixelWidth,
            pixelHeight,
            {
                render: { visible: false }, // We'll draw our own sprite
                mass: this.protagonist.mass, // 70kg realistic human mass
                friction: 0.7, // Good grip for walking
                frictionAir: 0.02, // Realistic air resistance
                restitution: 0.1, // Slight bounce (humans aren't very bouncy!)
                label: 'protagonist',
                
                // Prevent excessive rotation (humans don't spin around easily)
                inertia: Infinity
            }
        );
        
        Matter.World.add(this.world, this.protagonistBody);
    }
    
    update() {
        // Update sprite position based on physics body
        if (this.protagonistBody) {
            this.protagonist.x = this.protagonistBody.position.x;
            this.protagonist.y = this.protagonistBody.position.y;
            this.protagonist.velocity = this.protagonistBody.velocity;
            
            // Update animation based on movement
            this.updateAnimation();
        }
        
        // Update animation frame
        this.frameCounter++;
        if (this.frameCounter >= this.animationSpeed) {
            this.frameCounter = 0;
            const animation = this.humanDesign.animations[this.currentAnimation];
            this.animationFrame = (this.animationFrame + 1) % animation.frames;
        }
    }
    
    updateAnimation() {
        const velocity = this.protagonist.velocity;
        const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
        
        // Check if grounded (improved ground detection)
        this.protagonist.isGrounded = Math.abs(velocity.y) < 0.8;
        
        // Don't override crouch animation if actively crouching
        if (this.currentAnimation === 'crouch') {
            return; // Let manual crouch animation continue
        }
        
        // Determine animation state based on physics
        if (!this.protagonist.isGrounded) {
            this.setAnimation('jumping');
        } else if (speed > this.physics.pixelsToMeters(120)) { // Running threshold
            this.setAnimation('running');
        } else if (Math.abs(velocity.x) > 0.5) { // Walking threshold
            this.setAnimation('walking');
            // Update facing direction
            this.protagonist.facing = velocity.x > 0 ? 'right' : 'left';
        } else {
            this.setAnimation('idle');
        }
    }
    
    setAnimation(animationName) {
        if (this.currentAnimation !== animationName) {
            this.currentAnimation = animationName;
            this.animationFrame = 0;
        }
    }
    
    draw() {
        if (!this.protagonistBody) return;
        
        const pixelHeight = this.physics.metersToPixels(this.protagonist.height);
        const pixelWidth = this.physics.metersToPixels(this.protagonist.width);
        const proportions = this.protagonist.proportions;
        const design = this.humanDesign;
        const animation = design.animations[this.currentAnimation];
        
        // Get current frame animation data
        const armSwing = animation.armSwing[this.animationFrame];
        const legPos = animation.legPosition[this.animationFrame];
        const torsoOffset = animation.torsoOffset[this.animationFrame];
        
        this.ctx.save();
        
        // Translate to protagonist position
        this.ctx.translate(this.protagonist.x, this.protagonist.y);
        
        // Flip sprite if facing left
        if (this.protagonist.facing === 'left') {
            this.ctx.scale(-1, 1);
        }
        
        // Calculate body part dimensions
        const headSize = pixelHeight * proportions.headRatio;
        const torsoHeight = pixelHeight * proportions.torsoRatio;
        const legHeight = pixelHeight * proportions.legRatio;
        const armLength = pixelHeight * proportions.armRatio;
        const shoulderWidth = pixelHeight * proportions.shoulderWidth;
        
        // Draw human character parts
        this.drawHumanBody(pixelHeight, pixelWidth, {
            headSize, torsoHeight, legHeight, armLength, shoulderWidth,
            armSwing, legPos, torsoOffset
        });
        
        this.ctx.restore();
    }
    
    drawHumanBody(height, width, parts) {
        const { headSize, torsoHeight, legHeight, armLength, shoulderWidth,
                armSwing, legPos, torsoOffset } = parts;
        const design = this.humanDesign;
        
        // Body center calculations
        const centerX = 0;
        const topY = -height / 2;
        const bottomY = height / 2;
        
        // Draw legs first (behind torso)
        this.drawLegs(centerX, bottomY - legHeight, legHeight, shoulderWidth/3, legPos, design);
        
        // Draw torso
        this.drawTorso(centerX, topY + headSize + torsoOffset, torsoHeight, shoulderWidth, design);
        
        // Draw arms
        this.drawArms(centerX, topY + headSize + 15, armLength, shoulderWidth, armSwing, design);
        
        // Draw head (on top)
        this.drawHead(centerX, topY + headSize/2, headSize, design);
    }
    
    drawHead(x, y, size, design) {
        // Face (circle)
        this.ctx.fillStyle = design.skinColor;
        this.ctx.beginPath();
        this.ctx.arc(x, y, size/2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Hair
        this.ctx.fillStyle = design.hairColor;
        this.ctx.beginPath();
        this.ctx.arc(x, y - size/4, size/2, Math.PI, 0);
        this.ctx.fill();
        
        // Eyes
        this.ctx.fillStyle = '#333';
        this.ctx.beginPath();
        this.ctx.arc(x - size/4, y - size/8, size/12, 0, Math.PI * 2);
        this.ctx.arc(x + size/4, y - size/8, size/12, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Smile
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(x, y + size/8, size/4, 0, Math.PI);
        this.ctx.stroke();
    }
    
    drawTorso(x, y, height, width, design) {
        // Shirt (rectangle)
        this.ctx.fillStyle = design.shirtColor;
        this.ctx.fillRect(x - width/2, y, width, height);
        
        // Shirt shading
        this.ctx.fillStyle = design.shirtShadow;
        this.ctx.fillRect(x + width/4, y, width/4, height);
    }
    
    drawArms(x, y, length, shoulderWidth, swing, design) {
        const armThickness = 8;
        const leftArmX = x - shoulderWidth/2;
        const rightArmX = x + shoulderWidth/2;
        
        // Apply arm swing animation
        const leftSwing = -swing;
        const rightSwing = swing;
        
        // Left arm
        this.ctx.save();
        this.ctx.translate(leftArmX, y);
        this.ctx.rotate(leftSwing * Math.PI / 180);
        this.ctx.fillStyle = design.skinColor;
        this.ctx.fillRect(-armThickness/2, 0, armThickness, length);
        this.ctx.restore();
        
        // Right arm  
        this.ctx.save();
        this.ctx.translate(rightArmX, y);
        this.ctx.rotate(rightSwing * Math.PI / 180);
        this.ctx.fillStyle = design.skinColor;
        this.ctx.fillRect(-armThickness/2, 0, armThickness, length);
        this.ctx.restore();
    }
    
    drawLegs(x, y, height, width, legPos, design) {
        const legThickness = 12;
        const leftLegX = x - width;
        const rightLegX = x + width;
        
        // Apply leg position animation
        const leftLegOffset = -legPos;
        const rightLegOffset = legPos;
        
        // Left leg
        this.ctx.fillStyle = design.pantsColor;
        this.ctx.fillRect(leftLegX - legThickness/2 + leftLegOffset, y, legThickness, height);
        
        // Right leg
        this.ctx.fillRect(rightLegX - legThickness/2 + rightLegOffset, y, legThickness, height);
        
        // Shoes
        this.ctx.fillStyle = design.shoeColor;
        this.ctx.fillRect(leftLegX - legThickness/2 + leftLegOffset - 5, y + height - 8, legThickness + 10, 8);
        this.ctx.fillRect(rightLegX - legThickness/2 + rightLegOffset - 5, y + height - 8, legThickness + 10, 8);
    }
    
    // Enhanced movement methods with GSAP integration and realistic physics
    moveLeft(forceNewtons = null) {
        if (this.protagonistBody) {
            // Convert Newtons to Matter.js force
            const force = forceNewtons || 50; // Default 50N walking force
            const matterForce = force / (this.physics.pixelsPerMeter * this.protagonist.mass);
            
            Matter.Body.applyForce(this.protagonistBody, this.protagonistBody.position, { x: -matterForce, y: 0 });
            
            // Update facing direction
            this.protagonist.facing = 'left';
            
            // GSAP movement effect for smooth visual feedback
            if (typeof gsap !== 'undefined') {
                gsap.to(this.protagonist, {
                    duration: 0.1,
                    x: this.protagonist.x - 2,
                    ease: "power1.out"
                });
            }
        }
    }
    
    moveRight(forceNewtons = null) {
        if (this.protagonistBody) {
            // Convert Newtons to Matter.js force
            const force = forceNewtons || 50; // Default 50N walking force
            const matterForce = force / (this.physics.pixelsPerMeter * this.protagonist.mass);
            
            Matter.Body.applyForce(this.protagonistBody, this.protagonistBody.position, { x: matterForce, y: 0 });
            
            // Update facing direction
            this.protagonist.facing = 'right';
            
            // GSAP movement effect for smooth visual feedback
            if (typeof gsap !== 'undefined') {
                gsap.to(this.protagonist, {
                    duration: 0.1,
                    x: this.protagonist.x + 2,
                    ease: "power1.out"
                });
            }
        }
    }
    
    jump(forceNewtons = null) {
        if (this.protagonistBody && this.protagonist.isGrounded) {
            // Convert Newtons to Matter.js force
            const force = forceNewtons || 350; // Default 350N jump force
            const matterForce = force / (this.physics.pixelsPerMeter * this.protagonist.mass);
            
            Matter.Body.applyForce(this.protagonistBody, this.protagonistBody.position, { x: 0, y: -matterForce });
            
            // Trigger jump animation
            this.setAnimation('jumping');
            
            // GSAP jump effect with anticipation and follow-through
            if (typeof gsap !== 'undefined') {
                const tl = gsap.timeline();
                tl.to(this.protagonist, {
                    duration: 0.1,
                    scaleY: 0.8,
                    ease: "power2.in"
                })
                .to(this.protagonist, {
                    duration: 0.4,
                    scaleY: 1,
                    ease: "power2.out"
                });
            }
        }
    }
    
    // New crouch method for enhanced movement
    crouch() {
        this.setAnimation('crouch');
        
        // GSAP crouch animation
        if (typeof gsap !== 'undefined') {
            gsap.to(this.protagonist, {
                duration: 0.2,
                scaleY: 0.6,
                ease: "power2.out"
            });
        }
    }
    
    // GSAP animations for special effects
    celebrate() {
        // Bounce animation using GSAP
        if (typeof gsap !== 'undefined') {
            gsap.to(this.protagonist, {
                duration: 0.5,
                y: this.protagonist.y - 50,
                ease: "bounce.out",
                yoyo: true,
                repeat: 1
            });
        }
    }
    
    highlight() {
        // Glow effect using GSAP
        if (typeof gsap !== 'undefined') {
            const tl = gsap.timeline({ repeat: 2, yoyo: true });
            tl.to(this.protagonist, {
                duration: 0.3,
                scale: 1.2,
                ease: "power2.inOut"
            });
        }
    }
    
    getPosition() {
        return {
            x: this.protagonist.x,
            y: this.protagonist.y
        };
    }
    
    getBody() {
        return this.protagonistBody;
    }
    
    setPosition(x, y) {
        if (this.protagonistBody) {
            Matter.Body.setPosition(this.protagonistBody, { x, y });
        }
    }
    
    destroy() {
        if (this.protagonistBody) {
            Matter.World.remove(this.world, this.protagonistBody);
        }
    }
}
