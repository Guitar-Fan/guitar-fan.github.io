/**
 * Double Pendulum Visualization Engine
 * Handles rendering, animation, and visual effects
 */

class PendulumVisualization {
    constructor(canvasId, width = 800, height = 600) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.width = width;
        this.height = height;
        this.canvas.width = width;
        this.canvas.height = height;
        
        // Visual settings
        this.scale = 150; // Pixels per meter
        // Shift center to left to account for charts panel on right
        this.centerX = width * 0.4; // Moved from 0.5 to 0.4 to shift left
        this.centerY = height / 4;
        
        // Animation settings
        this.animationId = null;
        this.isRunning = false;
        this.mode = 'normal'; // 'normal', 'trace', 'chaos', 'slow'
        this.slowMotionFactor = 0.1;
        
        // Visual effects
        this.showTrajectory = true;
        this.showEnergy = true;
        this.showVelocity = true;
        this.showForces = false;
        
        // Colors
        this.colors = {
            pivot: '#c17817',
            rod1: '#4a6b6b',
            rod2: '#a67c7c',
            bob1: '#3b82f6',
            bob2: '#f59e0b',
            trajectory: '#8b5cf6',
            velocity: '#10b981',
            force: '#ef4444',
            energy: '#f8f6f0'
        };
        
        // Background effects
        this.gridOpacity = 0.1;
        this.particles = [];
        this.particleTrails = [];
        this.initParticles();
    }
    
    /**
     * Initialize background particles for environmental effects
     */
    initParticles() {
        this.particles = [];
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.3 + 0.1
            });
        }
    }
    
    /**
     * Draw background with grid and particles
     */
    drawBackground() {
        // Clear canvas
        this.ctx.fillStyle = '#1a1d29';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw grid
        this.drawGrid();
        
        // Draw particles
        this.updateParticles();
        this.drawParticles();
        
        // Draw coordinate system
        this.drawCoordinateSystem();
    }
    
    /**
     * Draw coordinate grid
     */
    drawGrid() {
        this.ctx.strokeStyle = `rgba(248, 246, 240, ${this.gridOpacity})`;
        this.ctx.lineWidth = 0.5;
        
        const gridSize = this.scale / 2;
        
        // Vertical lines
        for (let x = this.centerX % gridSize; x < this.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = this.centerY % gridSize; y < this.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.stroke();
        }
    }
    
    /**
     * Update and draw floating particles
     */
    updateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = this.width;
            if (particle.x > this.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.height;
            if (particle.y > this.height) particle.y = 0;
        });
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.fillStyle = `rgba(248, 246, 240, ${particle.opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, 1, 0, 2 * Math.PI);
            this.ctx.fill();
        });
    }
    
    /**
     * Draw coordinate system and labels
     */
    drawCoordinateSystem() {
        // Origin
        this.ctx.fillStyle = this.colors.pivot;
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, 4, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Labels
        this.ctx.fillStyle = '#f8f6f0';
        this.ctx.font = '12px Inter';
        this.ctx.fillText('O', this.centerX + 5, this.centerY - 5);
        this.ctx.fillText('x', this.width - 15, this.centerY - 5);
        this.ctx.fillText('y', this.centerX + 5, 15);
    }
    
    /**
     * Draw pendulum based on physics state
     */
    drawPendulum(physics, opacity = 1.0) {
        const positions = physics.getPositions();
        
        // Transform physics coordinates to canvas coordinates
        const pivotX = this.centerX;
        const pivotY = this.centerY;
        const bob1X = this.centerX + positions.bob1.x * this.scale;
        const bob1Y = this.centerY + positions.bob1.y * this.scale;
        const bob2X = this.centerX + positions.bob2.x * this.scale;
        const bob2Y = this.centerY + positions.bob2.y * this.scale;
        
        // Draw connections (rods, strings, etc.)
        this.drawConnection(physics, pivotX, pivotY, bob1X, bob1Y, this.colors.rod1, opacity);
        this.drawConnection(physics, bob1X, bob1Y, bob2X, bob2Y, this.colors.rod2, opacity);
        
        // Draw bobs
        this.drawBob(bob1X, bob1Y, this.colors.bob1, opacity, physics.m1, physics);
        this.drawBob(bob2X, bob2Y, this.colors.bob2, opacity, physics.m2, physics);
        
        // Draw velocity vectors
        if (this.showVelocity) {
            this.drawVelocityVectors(physics, bob1X, bob1Y, bob2X, bob2Y, opacity);
        }
        
        // Draw force vectors
        if (this.showForces) {
            this.drawForceVectors(physics, bob1X, bob1Y, bob2X, bob2Y, opacity);
        }
    }
    
    /**
     * Draw connection between points based on pendulum type
     */
    drawConnection(physics, x1, y1, x2, y2, color, opacity = 1.0) {
        const connectionType = physics.pendulumType || 'rod';
        
        switch(connectionType) {
            case 'string':
                this.drawString(physics, x1, y1, x2, y2, color, opacity);
                break;
            case 'spring':
                this.drawSpring(x1, y1, x2, y2, color, opacity);
                break;
            case 'noodle':
                this.drawNoodle(physics, x1, y1, x2, y2, color, opacity);
                break;
            default:
                this.drawRod(x1, y1, x2, y2, color, opacity);
        }
    }
    
    /**
     * Draw rod/connection between points
     */
    drawRod(x1, y1, x2, y2, color, opacity = 1.0) {
        this.ctx.strokeStyle = color + Math.floor(opacity * 255).toString(16).padStart(2, '0');
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';
        
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }
    
    /**
     * Draw realistic string with sag and wobble
     */
    drawString(physics, x1, y1, x2, y2, color, opacity = 1.0) {
        const sag = physics.stringSag || 0.02;
        const wobble = physics.stringWobble || 0.0;
        
        this.ctx.strokeStyle = color + Math.floor(opacity * 255).toString(16).padStart(2, '0');
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'round';
        
        // Calculate string curve with sag
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        const sagAmount = sag * this.scale * (distance / this.scale);
        
        // Add wobble effect
        const wobbleOffset = wobble * Math.sin(physics.time * 5) * 10;
        
        const controlX = midX + wobbleOffset;
        const controlY = midY + sagAmount;
        
        // Draw curved string
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.quadraticCurveTo(controlX, controlY, x2, y2);
        this.ctx.stroke();
        
        // Draw string tension indicator
        if (physics.showStringTension) {
            this.drawStringTension(physics, x1, y1, x2, y2);
        }
    }
    
    /**
     * Draw spring connection
     */
    drawSpring(x1, y1, x2, y2, color, opacity = 1.0) {
        this.ctx.strokeStyle = color + Math.floor(opacity * 255).toString(16).padStart(2, '0');
        this.ctx.lineWidth = 2;
        
        const coils = 8;
        const amplitude = 5;
        
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        
        for (let i = 0; i <= coils; i++) {
            const t = i / coils;
            const x = x1 + (x2 - x1) * t;
            const y = y1 + (y2 - y1) * t;
            const offset = Math.sin(t * Math.PI * coils * 2) * amplitude;
            
            // Perpendicular offset
            const dx = x2 - x1;
            const dy = y2 - y1;
            const length = Math.sqrt(dx * dx + dy * dy);
            const perpX = -dy / length * offset;
            const perpY = dx / length * offset;
            
            this.ctx.lineTo(x + perpX, y + perpY);
        }
        
        this.ctx.stroke();
    }
    
    /**
     * Draw wobbly noodle connection
     */
    drawNoodle(physics, x1, y1, x2, y2, color, opacity = 1.0) {
        this.ctx.strokeStyle = color + Math.floor(opacity * 255).toString(16).padStart(2, '0');
        this.ctx.lineWidth = 4;
        this.ctx.lineCap = 'round';
        
        const segments = 10;
        const wobbliness = 15;
        
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        
        for (let i = 1; i <= segments; i++) {
            const t = i / segments;
            let x = x1 + (x2 - x1) * t;
            let y = y1 + (y2 - y1) * t;
            
            // Add random wobbles
            const wobbleX = Math.sin(physics.time * 3 + i) * wobbliness * (Math.random() - 0.5);
            const wobbleY = Math.cos(physics.time * 2 + i) * wobbliness * (Math.random() - 0.5);
            
            x += wobbleX;
            y += wobbleY;
            
            this.ctx.lineTo(x, y);
        }
        
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }
    
    /**
     * Draw string tension visualization
     */
    drawStringTension(physics, x1, y1, x2, y2) {
        const tension = physics.stringTension || 100;
        const maxTension = 500;
        const tensionRatio = Math.min(tension / maxTension, 1);
        
        // Color from green (low tension) to red (high tension)
        const red = Math.floor(255 * tensionRatio);
        const green = Math.floor(255 * (1 - tensionRatio));
        const color = `rgb(${red}, ${green}, 0)`;
        
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([5, 5]);
        
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
        
        this.ctx.setLineDash([]); // Reset dash
    }
    
    /**
     * Draw pendulum bob with fun mode effects
     */
    drawBob(x, y, color, opacity = 1.0, mass = 1.0, physics = null) {
        let radius = Math.max(8, Math.min(20, mass * 8));
        let bobColor = color;
        
        // Apply fun mode effects
        if (physics && physics.funMode) {
            switch(physics.funMode) {
                case 'jello':
                    // Jello bobs are wobbly and semi-transparent
                    radius *= (1 + Math.sin(physics.time * 8) * 0.2);
                    bobColor = '#00ff88';
                    opacity *= 0.8;
                    break;
                    
                case 'balloon':
                    // Balloon bobs are bigger and colorful
                    radius *= 1.5;
                    bobColor = `hsl(${(physics.time * 50) % 360}, 80%, 60%)`;
                    break;
                    
                case 'disco':
                    // Disco bobs sparkle and change colors
                    bobColor = `hsl(${(physics.time * 100) % 360}, 100%, 50%)`;
                    radius *= (1 + Math.sin(physics.time * 20) * 0.1);
                    break;
                    
                case 'rainbow':
                    // Rainbow bobs cycle through colors smoothly
                    const hue = (physics.rainbowPhase * 2 + x * 0.1) % 360;
                    bobColor = `hsl(${hue}, 80%, 60%)`;
                    break;
            }
        }
        
        // Tickle mode - bobs giggle and shake
        if (physics && physics.tickleMode) {
            x += (Math.random() - 0.5) * 2;
            y += (Math.random() - 0.5) * 2;
            
            // Draw giggle emoji occasionally
            if (Math.random() < 0.05) {
                this.ctx.font = '16px Arial';
                this.ctx.fillStyle = '#ffff00';
                this.ctx.fillText('😂', x + 15, y - 15);
            }
        }
        
        // Bob shadow
        this.ctx.fillStyle = `rgba(0, 0, 0, ${opacity * 0.3})`;
        this.ctx.beginPath();
        this.ctx.arc(x + 2, y + 2, radius, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Bob
        this.ctx.fillStyle = bobColor + Math.floor(opacity * 255).toString(16).padStart(2, '0');
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Fun mode extra effects
        if (physics && physics.funMode === 'disco') {
            // Disco sparkles
            for (let i = 0; i < 3; i++) {
                const sparkleX = x + (Math.random() - 0.5) * radius * 2;
                const sparkleY = y + (Math.random() - 0.5) * radius * 2;
                this.ctx.fillStyle = '#ffffff';
                this.ctx.beginPath();
                this.ctx.arc(sparkleX, sparkleY, 1, 0, 2 * Math.PI);
                this.ctx.fill();
            }
        }
        
        // Bob outline
        this.ctx.strokeStyle = `rgba(0, 0, 0, ${opacity * 0.5})`;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        
        // Bob highlight
        this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.3})`;
        this.ctx.beginPath();
        this.ctx.arc(x - radius * 0.3, y - radius * 0.3, radius * 0.3, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Particle trails for fun modes
        if (physics && physics.particleTrails) {
            this.addParticleTrail(x, y, bobColor);
        }
    }
    
    /**
     * Draw trajectory trace
     */
    drawTrajectory(trajectory, opacity = 1.0) {
        if (!this.showTrajectory || trajectory.length < 2) return;
        
        // Create gradient for trajectory
        const gradient = this.ctx.createLinearGradient(
            this.centerX + trajectory[0].x * this.scale,
            this.centerY + trajectory[0].y * this.scale,
            this.centerX + trajectory[trajectory.length - 1].x * this.scale,
            this.centerY + trajectory[trajectory.length - 1].y * this.scale
        );
        
        gradient.addColorStop(0, this.colors.trajectory + '00');
        gradient.addColorStop(0.5, this.colors.trajectory + Math.floor(opacity * 128).toString(16).padStart(2, '0'));
        gradient.addColorStop(1, this.colors.trajectory + Math.floor(opacity * 255).toString(16).padStart(2, '0'));
        
        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'round';
        
        this.ctx.beginPath();
        const start = trajectory[0];
        this.ctx.moveTo(this.centerX + start.x * this.scale, this.centerY + start.y * this.scale);
        
        for (let i = 1; i < trajectory.length; i++) {
            const point = trajectory[i];
            this.ctx.lineTo(this.centerX + point.x * this.scale, this.centerY + point.y * this.scale);
        }
        
        this.ctx.stroke();
        
        // Draw velocity-based coloring
        this.drawVelocityTrajectory(trajectory, opacity);
    }
    
    /**
     * Draw trajectory with velocity-based colors
     */
    drawVelocityTrajectory(trajectory, opacity = 1.0) {
        if (trajectory.length < 2) return;
        
        // Find max velocity for normalization
        const maxVelocity = Math.max(...trajectory.map(p => p.velocity));
        
        for (let i = 1; i < trajectory.length; i++) {
            const prev = trajectory[i - 1];
            const curr = trajectory[i];
            
            const velocityRatio = curr.velocity / maxVelocity;
            const hue = velocityRatio * 240; // Blue to red
            
            this.ctx.strokeStyle = `hsla(${hue}, 70%, 50%, ${opacity * 0.6})`;
            this.ctx.lineWidth = 1;
            
            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX + prev.x * this.scale, this.centerY + prev.y * this.scale);
            this.ctx.lineTo(this.centerX + curr.x * this.scale, this.centerY + curr.y * this.scale);
            this.ctx.stroke();
        }
    }
    
    /**
     * Draw velocity vectors
     */
    drawVelocityVectors(physics, bob1X, bob1Y, bob2X, bob2Y, opacity = 1.0) {
        const scale = 20; // Vector scaling factor
        
        // Calculate velocities
        const v1x = physics.omega1 * physics.l1 * Math.cos(physics.theta1) * scale;
        const v1y = -physics.omega1 * physics.l1 * Math.sin(physics.theta1) * scale;
        const v2x = v1x + physics.omega2 * physics.l2 * Math.cos(physics.theta2) * scale;
        const v2y = v1y - physics.omega2 * physics.l2 * Math.sin(physics.theta2) * scale;
        
        // Draw velocity vectors
        this.drawVector(bob1X, bob1Y, bob1X + v1x, bob1Y + v1y, this.colors.velocity, opacity);
        this.drawVector(bob2X, bob2Y, bob2X + v2x, bob2Y + v2y, this.colors.velocity, opacity);
    }
    
    /**
     * Draw force vectors
     */
    drawForceVectors(physics, bob1X, bob1Y, bob2X, bob2Y, opacity = 1.0) {
        const scale = 10; // Force vector scaling
        
        // Gravity forces
        const fg1x = 0;
        const fg1y = physics.m1 * physics.g * scale;
        const fg2x = 0;
        const fg2y = physics.m2 * physics.g * scale;
        
        // External forces
        const fext1x = physics.externalForce.x * scale;
        const fext1y = physics.externalForce.y * scale;
        const fext2x = physics.externalForce.x * scale;
        const fext2y = physics.externalForce.y * scale;
        
        // Draw force vectors
        this.drawVector(bob1X, bob1Y, bob1X + fg1x, bob1Y + fg1y, '#ef4444', opacity);
        this.drawVector(bob2X, bob2Y, bob2X + fg2x, bob2Y + fg2y, '#ef4444', opacity);
        this.drawVector(bob1X, bob1Y, bob1X + fext1x, bob1Y + fext1y, '#f59e0b', opacity);
        this.drawVector(bob2X, bob2Y, bob2X + fext2x, bob2Y + fext2y, '#f59e0b', opacity);
    }
    
    /**
     * Draw vector arrow
     */
    drawVector(x1, y1, x2, y2, color, opacity = 1.0) {
        this.ctx.strokeStyle = color + Math.floor(opacity * 255).toString(16).padStart(2, '0');
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'round';
        
        // Line
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
        
        // Arrow head
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const arrowLength = 8;
        const arrowAngle = Math.PI / 6;
        
        this.ctx.beginPath();
        this.ctx.moveTo(x2, y2);
        this.ctx.lineTo(
            x2 - arrowLength * Math.cos(angle - arrowAngle),
            y2 - arrowLength * Math.sin(angle - arrowAngle)
        );
        this.ctx.moveTo(x2, y2);
        this.ctx.lineTo(
            x2 - arrowLength * Math.cos(angle + arrowAngle),
            y2 - arrowLength * Math.sin(angle + arrowAngle)
        );
        this.ctx.stroke();
    }
    
    /**
     * Draw energy visualization
     */
    drawEnergyVisualization(energyHistory, x, y, width, height) {
        if (!this.showEnergy || energyHistory.length < 2) return;
        
        // Background
        this.ctx.fillStyle = 'rgba(45, 55, 72, 0.8)';
        this.ctx.fillRect(x, y, width, height);
        
        // Border
        this.ctx.strokeStyle = 'rgba(248, 246, 240, 0.3)';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x, y, width, height);
        
        // Find max values for scaling
        const maxEnergy = Math.max(...energyHistory.map(e => e.total));
        
        // Draw energy bars
        const barWidth = width / energyHistory.length;
        
        energyHistory.forEach((energy, i) => {
            const barX = x + i * barWidth;
            
            // Kinetic energy
            const keHeight = (energy.kinetic / maxEnergy) * height * 0.8;
            this.ctx.fillStyle = '#3b82f6';
            this.ctx.fillRect(barX, y + height - keHeight, barWidth, keHeight);
            
            // Potential energy
            const peHeight = (energy.potential / maxEnergy) * height * 0.8;
            this.ctx.fillStyle = '#10b981';
            this.ctx.fillRect(barX, y + height - keHeight - peHeight, barWidth, peHeight);
        });
        
        // Labels
        this.ctx.fillStyle = '#f8f6f0';
        this.ctx.font = '10px Inter';
        this.ctx.fillText('Energy', x + 5, y + 15);
        this.ctx.fillText('KE', x + 5, y + 30);
        this.ctx.fillText('PE', x + 5, y + 45);
    }
    
    /**
     * Main render function
     */
    render(physics, chaosSystem = null) {
        this.drawBackground();
        
        if (this.mode === 'chaos' && chaosSystem) {
            // Draw multiple pendulums for chaos demonstration
            const colors = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444'];
            chaosSystem.pendulums.forEach((pendulum, i) => {
                const opacity = 0.8 - i * 0.15;
                this.drawPendulum(pendulum, opacity);
                this.drawTrajectory(pendulum.trajectory, opacity);
            });
        } else {
            // Draw single pendulum
            this.drawPendulum(physics);
            
            if (this.showTrajectory) {
                this.drawTrajectory(physics.trajectory);
            }
            
            // Draw energy visualization
            if (this.showEnergy && physics.energyHistory.length > 0) {
                this.drawEnergyVisualization(
                    physics.energyHistory.slice(-50),
                    this.width - 210,
                    10,
                    200,
                    100
                );
            }
        }
        
        // Update and draw particle trails
        if (physics.particleTrails) {
            this.updateParticleTrails();
        }
    }
    
    /**
     * Start animation loop
     */
    startAnimation() {
        if (this.isRunning) return;
        this.isRunning = true;
        
        const animate = () => {
            if (!this.isRunning) return;
            
            this.animationId = requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    /**
     * Stop animation loop
     */
    stopAnimation() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    /**
     * Set visualization mode
     */
    setMode(mode) {
        this.mode = mode;
    }
    
    /**
     * Toggle visualization options
     */
    toggleOption(option) {
        this[option] = !this[option];
    }
    
    /**
     * Add particle trail for fun effects
     */
    addParticleTrail(x, y, color) {
        this.particleTrails.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            color: color,
            life: 1.0,
            size: Math.random() * 3 + 1
        });
        
        // Limit particle count
        if (this.particleTrails.length > 100) {
            this.particleTrails.splice(0, 10);
        }
    }
    
    /**
     * Update and draw particle trails
     */
    updateParticleTrails() {
        for (let i = this.particleTrails.length - 1; i >= 0; i--) {
            const particle = this.particleTrails[i];
            
            // Update particle
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= 0.02;
            particle.vy += 0.1; // gravity
            
            // Draw particle
            if (particle.life > 0) {
                this.ctx.globalAlpha = particle.life;
                this.ctx.fillStyle = particle.color;
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size * particle.life, 0, 2 * Math.PI);
                this.ctx.fill();
                this.ctx.globalAlpha = 1.0;
            } else {
                // Remove dead particles
                this.particleTrails.splice(i, 1);
            }
        }
    }
    
    /**
     * Add sound effect (visual representation)
     */
    addSoundEffect(x, y, type = 'pop') {
        switch(type) {
            case 'pop':
                // Draw expanding circle for pop sound
                const popRadius = 20;
                this.ctx.strokeStyle = '#ffffff';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.arc(x, y, popRadius, 0, 2 * Math.PI);
                this.ctx.stroke();
                break;
                
            case 'bounce':
                // Draw bounce effect
                this.ctx.fillStyle = '#ffff00';
                this.ctx.font = '16px Arial';
                this.ctx.fillText('BOING!', x - 20, y - 20);
                break;
                
            case 'wobble':
                // Draw wobble effect
                this.ctx.strokeStyle = '#00ffff';
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
                    const r = 15 + Math.sin(angle * 5) * 5;
                    const wobbleX = x + Math.cos(angle) * r;
                    const wobbleY = y + Math.sin(angle) * r;
                    if (angle === 0) {
                        this.ctx.moveTo(wobbleX, wobbleY);
                    } else {
                        this.ctx.lineTo(wobbleX, wobbleY);
                    }
                }
                this.ctx.stroke();
                break;
        }
    }
    
    /**
     * Clear canvas
     */
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PendulumVisualization;
}