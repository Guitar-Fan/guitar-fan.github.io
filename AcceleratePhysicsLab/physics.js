/**
 * Double Pendulum Physics Engine
 * Implements 4th-order Runge-Kutta numerical integration for accurate physics simulation
 */

class DoublePendulumPhysics {
    constructor() {
        // Physical parameters
        this.g = 9.81;           // Gravity (m/s²)
        this.m1 = 1.0;           // Mass of first bob (kg)
        this.m2 = 1.0;           // Mass of second bob (kg)
        this.l1 = 1.0;           // Length of first rod (m)
        this.l2 = 1.0;           // Length of second rod (m)
        
        // Material properties
        this.radius1 = 0.05;     // Radius of first bob (m)
        this.radius2 = 0.05;     // Radius of second bob (m)
        this.rodRadius = 0.005;  // Radius of connecting rods (m)
        this.density = 7850;     // Density of steel (kg/m³)
        this.elasticModulus = 200e9; // Young's modulus for steel (Pa)
        this.internalDamping = 0.001; // Internal material damping coefficient
        
        // Rotational properties
        this.I1 = this.calculateMomentOfInertia(this.m1, this.radius1); // Moment of inertia of first bob
        this.I2 = this.calculateMomentOfInertia(this.m2, this.radius2); // Moment of inertia of second bob
        this.rodI1 = this.calculateRodMomentOfInertia(this.l1); // Moment of inertia of first rod
        this.rodI2 = this.calculateRodMomentOfInertia(this.l2); // Moment of inertia of second rod
        
        // State variables
        this.theta1 = Math.PI / 2;  // Angle of first pendulum (rad)
        this.theta2 = Math.PI / 2;  // Angle of second pendulum (rad)
        this.omega1 = 0.0;          // Angular velocity of first pendulum (rad/s)
        this.omega2 = 0.0;          // Angular velocity of second pendulum (rad/s)
        
        // Environmental factors
        this.temperature = 293.15;   // Temperature in Kelvin (20°C)
        this.airDensity = 1.225;    // Air density at 20°C (kg/m³)
        this.airViscosity = 1.81e-5; // Air dynamic viscosity at 20°C (Pa·s)
        this.externalForce = { x: 0, y: 0 }; // External force vector
        
        // Joint properties
        this.maxJointAngle = Math.PI * 0.95; // Maximum joint angle (rad)
        this.jointStiffness = 1000;  // Joint stiffness (N·m/rad)
        
        // Simulation control
        this.timeStep = 0.005;      // Integration time step (s) - reduced for more realistic speed
        this.time = 0.0;            // Current simulation time (s)
        
        // Data collection
        this.trajectory = [];       // Position history for tracing
        this.energyHistory = [];    // Energy conservation tracking
        this.maxTrajectoryLength = 1000;
        
        // Pendulum type and connection properties
        this.pendulumType = 'rod';  // 'rod', 'string', 'spring', 'noodle'
        this.stringTension = 100.0; // String tension force (N)
        this.elasticity = 0.1;      // String elasticity coefficient
        this.stringSag = 0.02;      // String sag amount (m)
        this.springConstant = 50.0; // For spring connections
        this.stringWobble = 0.0;    // String wobble amplitude
        
        // Fun mode properties
        this.funMode = 'normal';    // 'normal', 'jello', 'balloon', 'disco', 'rainbow'
        this.jelloFactor = 0.8;     // Jello mode elasticity
        this.balloonBuoyancy = 0.5; // Balloon mode upward force
        this.discoSpeed = 2.0;      // Disco mode rotation speed
        this.rainbowPhase = 0;      // Rainbow color cycling
        
        // Interactive properties
        this.mouseInteraction = true;
        this.clickForce = false;
        this.bouncyWalls = false;
        this.tickleMode = false;
        this.shakeIntensity = 0.0;
    }
    
    /**
     * Calculate derivatives for the system of differential equations
     * Uses the full nonlinear equations of motion derived from Lagrangian mechanics
     */
    calculateMomentOfInertia(mass, radius) {
        // I = 2/5 * m * r² for solid sphere
        return (2/5) * mass * radius * radius;
    }
    
    calculateRodMomentOfInertia(length) {
        // I = 1/12 * m * L² for thin rod
        const rodMass = Math.PI * this.rodRadius * this.rodRadius * length * this.density;
        return (1/12) * rodMass * length * length;
    }
    
    calculateReynoldsNumber(velocity, radius) {
        return (this.airDensity * velocity * 2 * radius) / this.airViscosity;
    }
    
    calculateDragCoefficient(reynolds) {
        // Approximate drag coefficient for a sphere based on Reynolds number
        if (reynolds < 1) {
            return 24 / reynolds;
        } else if (reynolds < 1000) {
            return 24 / reynolds * (1 + 0.15 * Math.pow(reynolds, 0.687));
        } else {
            return 0.44;
        }
    }
    
    calculateAirResistance(velocity, radius) {
        const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
        const reynolds = this.calculateReynoldsNumber(speed, radius);
        const cd = this.calculateDragCoefficient(reynolds);
        const area = Math.PI * radius * radius;
        const dragMagnitude = 0.5 * this.airDensity * cd * area * speed * speed;
        
        if (speed < 1e-10) return { x: 0, y: 0 };
        
        return {
            x: -dragMagnitude * velocity.x / speed,
            y: -dragMagnitude * velocity.y / speed
        };
    }
    
    calculateElasticForce(theta1, theta2) {
        // Calculate elastic forces in the rods due to bending
        // IMPORTANT: Normalize angles first to avoid huge forces during full rotations
        const normalizedTheta1 = this.normalizeAngle(theta1);
        const normalizedTheta2 = this.normalizeAngle(theta2);
        const relativeBendingAngle = this.normalizeAngle(theta2 - theta1);
        
        const bendingAngle1 = Math.abs(normalizedTheta1) - this.maxJointAngle;
        const bendingAngle2 = Math.abs(relativeBendingAngle) - this.maxJointAngle;
        
        const elasticTorque1 = bendingAngle1 > 0 ? -this.jointStiffness * bendingAngle1 * Math.sign(normalizedTheta1) : 0;
        const elasticTorque2 = bendingAngle2 > 0 ? -this.jointStiffness * bendingAngle2 * Math.sign(relativeBendingAngle) : 0;
        
        return { torque1: elasticTorque1, torque2: elasticTorque2 };
    }
    
    calculateDerivatives(theta1, theta2, omega1, omega2) {
        const cosDiff = Math.cos(theta1 - theta2);
        const sinDiff = Math.sin(theta1 - theta2);
        
        // Get positions and velocities for air resistance calculation
        // IMPORTANT: Use the omega1/omega2 parameters, not this.omega1/this.omega2
        // This ensures correct calculations during RK4 intermediate steps
        const v1x = omega1 * this.l1 * Math.cos(theta1);
        const v1y = -omega1 * this.l1 * Math.sin(theta1);
        const v2x = v1x + omega2 * this.l2 * Math.cos(theta2);
        const v2y = v1y - omega2 * this.l2 * Math.sin(theta2);
        
        // Calculate air resistance
        const drag1 = this.calculateAirResistance({ x: v1x, y: v1y }, this.radius1);
        const drag2 = this.calculateAirResistance({ x: v2x, y: v2y }, this.radius2);
        
        // Calculate connection forces based on pendulum type
        let connectionForces = { torque1: 0, torque2: 0 };
        
        if (this.pendulumType === 'string') {
            connectionForces = this.calculateStringForces(theta1, theta2, omega1, omega2);
        } else if (this.pendulumType === 'spring') {
            connectionForces = this.calculateSpringForces(theta1, theta2, omega1, omega2);
        } else if (this.pendulumType === 'noodle') {
            connectionForces = this.calculateNoodleForces(theta1, theta2, omega1, omega2);
        }
        
        // Calculate elastic forces for rigid rod mode
        const elasticForces = this.calculateElasticForce(theta1, theta2);
        
        // Apply fun mode effects
        const funForces = this.calculateFunModeForces(theta1, theta2, omega1, omega2);
        
        // Total moment of inertia including rods (modified by connection type)
        let momentMultiplier = 1.0;
        if (this.pendulumType === 'string') momentMultiplier = 0.8; // Strings have less rotational inertia
        if (this.pendulumType === 'noodle') momentMultiplier = 0.6; // Noodles are very flexible
        
        const I1_total = (this.I1 + this.rodI1) * momentMultiplier;
        const I2_total = (this.I2 + this.rodI2) * momentMultiplier;
        
        // Standard double pendulum equations from Lagrangian mechanics
        // Denominator for angular acceleration calculations
        const denom = this.l1 * this.l2 * (this.m1 + this.m2 * sinDiff * sinDiff);
        
        // Numerators for alpha1 and alpha2
        // These are the exact equations derived from the Lagrangian
        const num1 = -this.g * (2 * this.m1 + this.m2) * Math.sin(theta1)
                    - this.m2 * this.g * Math.sin(theta1 - 2 * theta2)
                    - 2 * sinDiff * this.m2 * (
                        omega2 * omega2 * this.l2
                        + omega1 * omega1 * this.l1 * cosDiff
                    );
        
        const num2 = 2 * sinDiff * (
            omega1 * omega1 * this.l1 * (this.m1 + this.m2)
            + this.g * (this.m1 + this.m2) * Math.cos(theta1)
            + omega2 * omega2 * this.l2 * this.m2 * cosDiff
        );
        
        // Calculate angular accelerations using corrected equations
        let alpha1 = num1 / (this.l1 * (2 * this.m1 + this.m2 - this.m2 * Math.cos(2 * (theta1 - theta2))));
        let alpha2 = num2 / (this.l2 * (2 * this.m1 + this.m2 - this.m2 * Math.cos(2 * (theta1 - theta2))));
        
        // Add additional forces/torques
        alpha1 += (elasticForces.torque1 + connectionForces.torque1 + funForces.torque1) / (this.m1 * this.l1 * this.l1);
        alpha2 += (elasticForces.torque2 + connectionForces.torque2 + funForces.torque2) / (this.m2 * this.l2 * this.l2);
        
        // Add drag torques
        alpha1 += (drag1.x * Math.cos(theta1) + drag1.y * Math.sin(theta1)) * this.l1 / (this.m1 * this.l1 * this.l1);
        alpha2 += (drag2.x * Math.cos(theta2) + drag2.y * Math.sin(theta2)) * this.l2 / (this.m2 * this.l2 * this.l2);
        
        // Apply internal damping
        const internalDamping1 = -this.internalDamping * omega1;
        const internalDamping2 = -this.internalDamping * omega2;
        
        // Apply external forces if present
        const externalAlpha1 = this.externalForce.x * Math.cos(theta1) / (this.m1 * this.l1);
        const externalAlpha2 = this.externalForce.x * Math.cos(theta2) / (this.m2 * this.l2);
        
        return {
            dTheta1: omega1,
            dTheta2: omega2,
            dOmega1: alpha1 + internalDamping1 + externalAlpha1,
            dOmega2: alpha2 + internalDamping2 + externalAlpha2
        };
    }
    
    /**
     * 4th-order Runge-Kutta numerical integration
     * Provides high accuracy for chaotic systems
     */
    rungeKuttaStep() {
        const h = this.timeStep;
        
        // Current state
        const theta1 = this.theta1;
        const theta2 = this.theta2;
        const omega1 = this.omega1;
        const omega2 = this.omega2;
        
        // Calculate k1
        const k1 = this.calculateDerivatives(theta1, theta2, omega1, omega2);
        
        // Calculate k2
        const k2 = this.calculateDerivatives(
            theta1 + 0.5 * h * k1.dTheta1,
            theta2 + 0.5 * h * k1.dTheta2,
            omega1 + 0.5 * h * k1.dOmega1,
            omega2 + 0.5 * h * k1.dOmega2
        );
        
        // Calculate k3
        const k3 = this.calculateDerivatives(
            theta1 + 0.5 * h * k2.dTheta1,
            theta2 + 0.5 * h * k2.dTheta2,
            omega1 + 0.5 * h * k2.dOmega1,
            omega2 + 0.5 * h * k2.dOmega2
        );
        
        // Calculate k4
        const k4 = this.calculateDerivatives(
            theta1 + h * k3.dTheta1,
            theta2 + h * k3.dTheta2,
            omega1 + h * k3.dOmega1,
            omega2 + h * k3.dOmega2
        );
        
        // Update state using weighted average
        this.theta1 += h * (k1.dTheta1 + 2 * k2.dTheta1 + 2 * k3.dTheta1 + k4.dTheta1) / 6;
        this.theta2 += h * (k1.dTheta2 + 2 * k2.dTheta2 + 2 * k3.dTheta2 + k4.dTheta2) / 6;
        this.omega1 += h * (k1.dOmega1 + 2 * k2.dOmega1 + 2 * k3.dOmega1 + k4.dOmega1) / 6;
        this.omega2 += h * (k1.dOmega2 + 2 * k2.dOmega2 + 2 * k3.dOmega2 + k4.dOmega2) / 6;
        
        // Normalize angles to prevent floating-point drift
        // Use a smooth modulo operation to avoid discontinuities
        // This keeps angles in a reasonable range without causing sudden jumps
        this.theta1 = this.normalizeAngle(this.theta1);
        this.theta2 = this.normalizeAngle(this.theta2);
        
        // Update time
        this.time += h;
        
        // Collect data
        this.collectData();
    }
    
    /**
     * Normalize angle to [-π, π] range
     */
    normalizeAngle(angle) {
        while (angle > Math.PI) angle -= 2 * Math.PI;
        while (angle < -Math.PI) angle += 2 * Math.PI;
        return angle;
    }
    
    /**
     * Calculate Cartesian coordinates of pendulum bobs
     */
    getPositions() {
        const x1 = this.l1 * Math.sin(this.theta1);
        const y1 = this.l1 * Math.cos(this.theta1);
        const x2 = x1 + this.l2 * Math.sin(this.theta2);
        const y2 = y1 + this.l2 * Math.cos(this.theta2);
        
        return {
            pivot: { x: 0, y: 0 },
            bob1: { x: x1, y: y1 },
            bob2: { x: x2, y: y2 }
        };
    }
    
    /**
     * Calculate total energy of the system
     */
    calculateEnergy() {
        const positions = this.getPositions();
        
        // Translational kinetic energy
        const v1x = this.omega1 * this.l1 * Math.cos(this.theta1);
        const v1y = -this.omega1 * this.l1 * Math.sin(this.theta1);
        const v2x = v1x + this.omega2 * this.l2 * Math.cos(this.theta2);
        const v2y = v1y - this.omega2 * this.l2 * Math.sin(this.theta2);
        
        const ke1_trans = 0.5 * this.m1 * (v1x * v1x + v1y * v1y);
        const ke2_trans = 0.5 * this.m2 * (v2x * v2x + v2y * v2y);
        
        // Rotational kinetic energy
        const ke1_rot = 0.5 * (this.I1 + this.rodI1) * this.omega1 * this.omega1;
        const ke2_rot = 0.5 * (this.I2 + this.rodI2) * this.omega2 * this.omega2;
        
        const kineticEnergy = ke1_trans + ke2_trans + ke1_rot + ke2_rot;
        
        // Potential energy (relative to pivot point at y=0)
        const pe1 = this.m1 * this.g * positions.bob1.y;
        const pe2 = this.m2 * this.g * positions.bob2.y;
        const potentialEnergy = pe1 + pe2;
        
        // The total mechanical energy should be constant
        // We'll subtract the initial potential energy to set the baseline
        const initialPE = (this.m1 + this.m2) * this.g * (-this.l1 - this.l2);
        
        return {
            kinetic: kineticEnergy,
            potential: potentialEnergy - initialPE,
            total: kineticEnergy + (potentialEnergy - initialPE)
        };
    }
    
    /**
     * Collect simulation data for analysis and visualization
     */
    collectData() {
        const positions = this.getPositions();
        const energy = this.calculateEnergy();
        
        // Add to trajectory
        this.trajectory.push({
            x: positions.bob2.x,
            y: positions.bob2.y,
            time: this.time,
            velocity: Math.sqrt(
                this.omega1 * this.omega1 * this.l1 * this.l1 +
                this.omega2 * this.omega2 * this.l2 * this.l2
            )
        });
        
        // Limit trajectory length
        if (this.trajectory.length > this.maxTrajectoryLength) {
            this.trajectory.shift();
        }
        
        // Add to energy history
        this.energyHistory.push({
            time: this.time,
            kinetic: energy.kinetic,
            potential: energy.potential,
            total: energy.total
        });
        
        // Limit energy history length
        if (this.energyHistory.length > this.maxTrajectoryLength) {
            this.energyHistory.shift();
        }
    }
    
    /**
     * Reset simulation to initial conditions
     */
    reset(theta1 = Math.PI / 2, theta2 = Math.PI / 2, omega1 = 0, omega2 = 0) {
        this.theta1 = theta1;
        this.theta2 = theta2;
        this.omega1 = omega1;
        this.omega2 = omega2;
        this.time = 0.0;
        this.trajectory = [];
        this.energyHistory = [];
    }
    
    /**
     * Set physical parameters
     */
    setParameters(params) {
        if (params.m1 !== undefined) this.m1 = params.m1;
        if (params.m2 !== undefined) this.m2 = params.m2;
        if (params.l1 !== undefined) this.l1 = params.l1;
        if (params.l2 !== undefined) this.l2 = params.l2;
        if (params.g !== undefined) this.g = params.g;
        if (params.damping !== undefined) this.damping = params.damping;
        if (params.springConstant !== undefined) this.springConstant = params.springConstant;
    }
    
    /**
     * Apply external force for one time step
     */
    applyForce(force) {
        this.externalForce = force;
    }
    
    /**
     * Clear external forces
     */
    clearForces() {
        this.externalForce = { x: 0, y: 0 };
    }
    
    /**
     * Get current state for analysis
     */
    getState() {
        return {
            theta1: this.theta1,
            theta2: this.theta2,
            omega1: this.omega1,
            omega2: this.omega2,
            time: this.time,
            energy: this.calculateEnergy(),
            positions: this.getPositions()
        };
    }
}

/**
 * Multiple pendulum system for chaos demonstration
 */
class ChaosPendulumSystem {
    constructor(basePendulum, numPendulums = 4, perturbation = 0.001) {
        this.pendulums = [];
        this.numPendulums = numPendulums;
        this.perturbation = perturbation;
        
        // Create pendulums with slightly different initial conditions
        for (let i = 0; i < numPendulums; i++) {
            const pendulum = new DoublePendulumPhysics();
            
            // Copy parameters from base
            pendulum.setParameters({
                m1: basePendulum.m1,
                m2: basePendulum.m2,
                l1: basePendulum.l1,
                l2: basePendulum.l2,
                g: basePendulum.g,
                damping: basePendulum.damping
            });
            
            // Apply small perturbations
            const pert = perturbation * (i + 1);
            pendulum.reset(
                basePendulum.theta1 + pert * (Math.random() - 0.5),
                basePendulum.theta2 + pert * (Math.random() - 0.5),
                basePendulum.omega1 + pert * (Math.random() - 0.5) * 0.1,
                basePendulum.omega2 + pert * (Math.random() - 0.5) * 0.1
            );
            
            this.pendulums.push(pendulum);
        }
    }
    
    /**
     * Advance all pendulums by one time step
     */
    step() {
        this.pendulums.forEach(pendulum => pendulum.rungeKuttaStep());
    }
    
    /**
     * Calculate divergence between pendulum trajectories
     */
    calculateDivergence() {
        const positions = this.pendulums.map(p => p.getPositions().bob2);
        const divergence = [];
        
        for (let i = 1; i < positions.length; i++) {
            const dx = positions[i].x - positions[0].x;
            const dy = positions[i].y - positions[0].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            divergence.push(distance);
        }
        
        return divergence;
    }
    
    /**
     * Reset all pendulums
     */
    reset() {
        this.pendulums.forEach((pendulum, i) => {
            const pert = this.perturbation * (i + 1);
            pendulum.reset(
                this.pendulums[0].theta1 + pert * (Math.random() - 0.5),
                this.pendulums[0].theta2 + pert * (Math.random() - 0.5),
                this.pendulums[0].omega1 + pert * (Math.random() - 0.5) * 0.1,
                this.pendulums[0].omega2 + pert * (Math.random() - 0.5) * 0.1
            );
        });
    }
}

// Add the new physics methods to the DoublePendulumPhysics class prototype
DoublePendulumPhysics.prototype.calculateStringForces = function(theta1, theta2, omega1, omega2) {
    // String physics with tension and sag
    const stringLength1 = this.l1;
    const stringLength2 = this.l2;
    
    // Calculate actual string length vs desired length
    const pos1 = { x: stringLength1 * Math.sin(theta1), y: -stringLength1 * Math.cos(theta1) };
    const pos2 = { 
        x: pos1.x + stringLength2 * Math.sin(theta2), 
        y: pos1.y - stringLength2 * Math.cos(theta2) 
    };
    
    // String sag effect - creates a natural curve
    const sagForce1 = this.stringSag * Math.sin(theta1) * this.stringTension;
    const sagForce2 = this.stringSag * Math.sin(theta2) * this.stringTension;
    
    // String elasticity - allows for stretching
    const stretch1 = Math.abs(theta1) - Math.PI/2;
    const stretch2 = Math.abs(theta2) - Math.PI/2;
    const elasticTorque1 = -this.elasticity * stretch1 * 10;
    const elasticTorque2 = -this.elasticity * stretch2 * 10;
    
    // String wobble effect
    const wobbleTorque1 = this.stringWobble * Math.sin(this.time * 5) * 0.1;
    const wobbleTorque2 = this.stringWobble * Math.cos(this.time * 7) * 0.1;
    
    return {
        torque1: sagForce1 + elasticTorque1 + wobbleTorque1,
        torque2: sagForce2 + elasticTorque2 + wobbleTorque2
    };
};

DoublePendulumPhysics.prototype.calculateSpringForces = function(theta1, theta2, omega1, omega2) {
    // Spring connection physics
    const restAngle1 = Math.PI / 2;
    const restAngle2 = Math.PI / 2;
    
    const springForce1 = -this.springConstant * (theta1 - restAngle1);
    const springForce2 = -this.springConstant * (theta2 - restAngle2);
    
    // Spring damping
    const dampingForce1 = -omega1 * 0.5;
    const dampingForce2 = -omega2 * 0.5;
    
    return {
        torque1: springForce1 + dampingForce1,
        torque2: springForce2 + dampingForce2
    };
};

DoublePendulumPhysics.prototype.calculateNoodleForces = function(theta1, theta2, omega1, omega2) {
    // Noodle physics - very flexible and wobbly
    const noodleFlex = 0.1;
    const noodleBend = Math.sin(this.time * 3) * 0.05;
    
    // Noodles bend and flex unpredictably
    const flexTorque1 = noodleFlex * Math.sin(theta1 * 3) * Math.cos(this.time * 2);
    const flexTorque2 = noodleFlex * Math.cos(theta2 * 2) * Math.sin(this.time * 1.5);
    
    // Add random wobbles
    const randomWobble1 = (Math.random() - 0.5) * 0.02;
    const randomWobble2 = (Math.random() - 0.5) * 0.02;
    
    return {
        torque1: flexTorque1 + noodleBend + randomWobble1,
        torque2: flexTorque2 - noodleBend + randomWobble2
    };
};

DoublePendulumPhysics.prototype.calculateFunModeForces = function(theta1, theta2, omega1, omega2) {
    let torque1 = 0;
    let torque2 = 0;
    
    switch(this.funMode) {
        case 'jello':
            // Jello physics - everything is bouncy and wobbly
            const jelloWobble1 = this.jelloFactor * Math.sin(this.time * 8) * 0.1;
            const jelloWobble2 = this.jelloFactor * Math.cos(this.time * 6) * 0.1;
            torque1 += jelloWobble1;
            torque2 += jelloWobble2;
            break;
            
        case 'balloon':
            // Balloon physics - upward buoyancy force
            const buoyancyForce1 = this.balloonBuoyancy * Math.cos(theta1) * 0.2;
            const buoyancyForce2 = this.balloonBuoyancy * Math.cos(theta2) * 0.2;
            torque1 += buoyancyForce1;
            torque2 += buoyancyForce2;
            break;
            
        case 'disco':
            // Disco mode - everything spins faster and grooves
            const discoSpin1 = this.discoSpeed * Math.sin(this.time * 10) * 0.05;
            const discoSpin2 = this.discoSpeed * Math.cos(this.time * 12) * 0.05;
            torque1 += discoSpin1;
            torque2 += discoSpin2;
            break;
            
        case 'rainbow':
            // Rainbow mode - colorful oscillations
            this.rainbowPhase += 0.1;
            const rainbowForce1 = Math.sin(this.rainbowPhase) * 0.03;
            const rainbowForce2 = Math.cos(this.rainbowPhase * 1.3) * 0.03;
            torque1 += rainbowForce1;
            torque2 += rainbowForce2;
            break;
    }
    
    // Apply shake effect
    if (this.shakeIntensity > 0) {
        torque1 += (Math.random() - 0.5) * this.shakeIntensity;
        torque2 += (Math.random() - 0.5) * this.shakeIntensity;
        this.shakeIntensity *= 0.95; // Decay shake over time
    }
    
    // Tickle mode - random gentle nudges
    if (this.tickleMode) {
        if (Math.random() < 0.1) { // 10% chance each frame
            torque1 += (Math.random() - 0.5) * 0.1;
        }
        if (Math.random() < 0.1) {
            torque2 += (Math.random() - 0.5) * 0.1;
        }
    }
    
    return { torque1, torque2 };
};

// Add mouse interaction methods
DoublePendulumPhysics.prototype.applyMouseForce = function(mouseX, mouseY, canvasWidth, canvasHeight) {
    if (!this.mouseInteraction) return;
    
    // Convert mouse coordinates to physics coordinates
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 4;
    const scale = 150; // Same as visualization scale
    
    const mousePhysX = (mouseX - centerX) / scale;
    const mousePhysY = (mouseY - centerY) / scale;
    
    // Get bob positions
    const positions = this.getPositions();
    
    // Check if mouse is near either bob
    const dist1 = Math.sqrt((mousePhysX - positions.bob1.x) ** 2 + (mousePhysY - positions.bob1.y) ** 2);
    const dist2 = Math.sqrt((mousePhysX - positions.bob2.x) ** 2 + (mousePhysY - positions.bob2.y) ** 2);
    
    const threshold = 0.2; // meters
    
    if (dist1 < threshold) {
        // Apply force to first bob
        const forceX = (mousePhysX - positions.bob1.x) * 5;
        const forceY = (mousePhysY - positions.bob1.y) * 5;
        this.externalForce.x = forceX;
        this.externalForce.y = forceY;
    } else if (dist2 < threshold) {
        // Apply force to second bob
        const forceX = (mousePhysX - positions.bob2.x) * 3;
        const forceY = (mousePhysY - positions.bob2.y) * 3;
        this.externalForce.x = forceX;
        this.externalForce.y = forceY;
    } else {
        // Decay external force when not interacting
        this.externalForce.x *= 0.9;
        this.externalForce.y *= 0.9;
    }
};

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DoublePendulumPhysics, ChaosPendulumSystem };
}