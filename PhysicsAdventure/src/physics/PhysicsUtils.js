/**
 * Physics Utilities - Helper functions for Matter.js physics engine
 * Provides educational physics calculations and visualizations
 */

class PhysicsUtils {
    constructor() {
        // Physics constants for different environments
        this.environments = {
            earth: { gravity: 9.8, name: 'Earth', color: '#22c55e' },
            moon: { gravity: 1.6, name: 'Moon', color: '#6b7280' },
            space: { gravity: 0, name: 'Space Station', color: '#8b5cf6' },
            jupiter: { gravity: 24.8, name: 'Jupiter', color: '#f59e0b' },
            asteroid: { gravity: 0.4, name: 'Asteroid', color: '#ef4444' }
        };
        
        this.currentEnvironment = 'earth';
    }
    
    /**
     * Get gravity value for current environment
     */
    getCurrentGravity() {
        return this.environments[this.currentEnvironment].gravity;
    }
    
    /**
     * Set physics environment
     */
    setEnvironment(envName) {
        if (this.environments[envName]) {
            this.currentEnvironment = envName;
            return this.environments[envName];
        }
        return this.environments.earth;
    }
    
    /**
     * Calculate kinetic energy of a body
     */
    calculateKineticEnergy(body) {
        if (!body || !body.velocity) return 0;
        
        const mass = body.mass || 1;
        const velocityMagnitude = Math.sqrt(
            body.velocity.x * body.velocity.x + 
            body.velocity.y * body.velocity.y
        );
        
        return 0.5 * mass * velocityMagnitude * velocityMagnitude;
    }
    
    /**
     * Calculate potential energy of a body
     */
    calculatePotentialEnergy(body, groundY = 600) {
        if (!body || !body.position) return 0;
        
        const mass = body.mass || 1;
        const height = Math.max(0, groundY - body.position.y);
        const gravity = this.getCurrentGravity();
        
        return mass * gravity * height;
    }
    
    /**
     * Calculate total mechanical energy
     */
    calculateTotalEnergy(body, groundY = 600) {
        return this.calculateKineticEnergy(body) + this.calculatePotentialEnergy(body, groundY);
    }
    
    /**
     * Calculate momentum of a body
     */
    calculateMomentum(body) {
        if (!body || !body.velocity) return { x: 0, y: 0, magnitude: 0 };
        
        const mass = body.mass || 1;
        const momentum = {
            x: mass * body.velocity.x,
            y: mass * body.velocity.y
        };
        
        momentum.magnitude = Math.sqrt(momentum.x * momentum.x + momentum.y * momentum.y);
        
        return momentum;
    }
    
    /**
     * Calculate distance between two bodies
     */
    calculateDistance(body1, body2) {
        if (!body1 || !body2 || !body1.position || !body2.position) return 0;
        
        const dx = body2.position.x - body1.position.x;
        const dy = body2.position.y - body1.position.y;
        
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    /**
     * Calculate gravitational force between two bodies
     */
    calculateGravitationalForce(body1, body2, G = 6.67e-11) {
        const distance = this.calculateDistance(body1, body2);
        if (distance === 0) return 0;
        
        const mass1 = body1.mass || 1;
        const mass2 = body2.mass || 1;
        
        return (G * mass1 * mass2) / (distance * distance);
    }
    
    /**
     * Apply realistic physics properties to a Matter.js body
     */
    applyRealisticProperties(body, material = 'default') {
        const materials = {
            default: { restitution: 0.3, friction: 0.4, density: 0.001 },
            bouncy: { restitution: 0.9, friction: 0.1, density: 0.0005 },
            heavy: { restitution: 0.1, friction: 0.8, density: 0.005 },
            slippery: { restitution: 0.4, friction: 0.05, density: 0.001 },
            magnetic: { restitution: 0.2, friction: 0.6, density: 0.002 }
        };
        
        const props = materials[material] || materials.default;
        
        Matter.Body.set(body, {
            restitution: props.restitution,
            friction: props.friction,
            density: props.density
        });
        
        return body;
    }
    
    /**
     * Create physics data visualization
     */
    createPhysicsDataDisplay(bodies, time) {
        let totalKinetic = 0;
        let totalPotential = 0;
        let totalMomentum = { x: 0, y: 0 };
        
        bodies.forEach(body => {
            if (body.label !== 'ground') {
                totalKinetic += this.calculateKineticEnergy(body);
                totalPotential += this.calculatePotentialEnergy(body);
                
                const momentum = this.calculateMomentum(body);
                totalMomentum.x += momentum.x;
                totalMomentum.y += momentum.y;
            }
        });
        
        const totalMomentumMagnitude = Math.sqrt(
            totalMomentum.x * totalMomentum.x + 
            totalMomentum.y * totalMomentum.y
        );
        
        return {
            gravity: this.getCurrentGravity(),
            objectCount: bodies.filter(b => b.label !== 'ground').length,
            kineticEnergy: totalKinetic,
            potentialEnergy: totalPotential,
            totalEnergy: totalKinetic + totalPotential,
            momentum: totalMomentumMagnitude,
            time: time,
            environment: this.environments[this.currentEnvironment].name
        };
    }
    
    /**
     * Generate random physics object with realistic properties
     */
    createRandomPhysicsObject(x, y) {
        const shapes = ['circle', 'rectangle', 'polygon'];
        const materials = ['default', 'bouncy', 'heavy', 'slippery'];
        const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];
        
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const material = materials[Math.floor(Math.random() * materials.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        let body;
        const size = 20 + Math.random() * 30;
        
        switch (shape) {
            case 'circle':
                body = Matter.Bodies.circle(x, y, size);
                break;
            case 'rectangle':
                body = Matter.Bodies.rectangle(x, y, size, size);
                break;
            case 'polygon':
                const sides = 3 + Math.floor(Math.random() * 5);
                body = Matter.Bodies.polygon(x, y, sides, size);
                break;
        }
        
        // Apply material properties
        this.applyRealisticProperties(body, material);
        
        // Add visual properties
        body.render.fillStyle = color;
        body.render.strokeStyle = '#ffffff';
        body.render.lineWidth = 2;
        
        // Add metadata
        body.physicsType = shape;
        body.material = material;
        body.createdAt = Date.now();
        
        return body;
    }
    
    /**
     * Check if two bodies are colliding with educational feedback
     */
    checkCollisionEducational(bodyA, bodyB) {
        const collision = Matter.SAT.collides(bodyA, bodyB);
        
        if (collision.collided) {
            // Calculate collision data for educational purposes
            const relativeVelocity = {
                x: bodyA.velocity.x - bodyB.velocity.x,
                y: bodyA.velocity.y - bodyB.velocity.y
            };
            
            const impactSpeed = Math.sqrt(
                relativeVelocity.x * relativeVelocity.x + 
                relativeVelocity.y * relativeVelocity.y
            );
            
            return {
                collided: true,
                impactSpeed: impactSpeed,
                bodyA: bodyA,
                bodyB: bodyB,
                momentumBefore: {
                    a: this.calculateMomentum(bodyA),
                    b: this.calculateMomentum(bodyB)
                }
            };
        }
        
        return { collided: false };
    }
    
    /**
     * Apply force with educational visualization
     */
    applyForceWithVisualization(body, force, point) {
        Matter.Body.applyForce(body, point || body.position, force);
        
        // Store force application for visualization
        if (!body.appliedForces) {
            body.appliedForces = [];
        }
        
        body.appliedForces.push({
            force: force,
            point: point || body.position,
            timestamp: Date.now(),
            magnitude: Math.sqrt(force.x * force.x + force.y * force.y)
        });
        
        // Keep only recent forces for visualization
        body.appliedForces = body.appliedForces.filter(
            f => Date.now() - f.timestamp < 1000
        );
    }
    
    /**
     * Get physics lesson for current interaction
     */
    getPhysicsLesson(interaction) {
        const lessons = {
            gravity: "Gravity pulls objects toward massive bodies with a force proportional to their masses and inversely proportional to the square of the distance between them.",
            collision: "During collisions, momentum is conserved. The total momentum before collision equals the total momentum after collision.",
            energy: "Energy cannot be created or destroyed, only converted between kinetic energy (motion) and potential energy (position).",
            friction: "Friction opposes motion and converts kinetic energy into heat. Different materials have different friction coefficients.",
            forces: "Forces cause acceleration according to Newton's second law: F = ma. The acceleration is proportional to the force and inversely proportional to the mass."
        };
        
        return lessons[interaction] || "Physics governs all motion and interactions in our universe!";
    }
}

// Export for use in other modules
window.PhysicsUtils = PhysicsUtils;