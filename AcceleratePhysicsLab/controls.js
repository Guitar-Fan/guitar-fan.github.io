/**
 * Interactive Control System
 * Handles real-time parameter adjustment and user interactions
 */

class PendulumControls {
    constructor(physics, visualization, chaosSystem = null) {
        this.physics = physics;
        this.visualization = visualization;
        this.chaosSystem = chaosSystem;
        
        // Animation control
        this.animationId = null;
        this.isRunning = false;
        this.simulationSpeed = 1.0;
        
        this.setupEventListeners();
    }
    
    /**
     * Update simulation speed
     */
    updateSimulationSpeed(speed) {
        this.simulationSpeed = parseFloat(speed);
        const speedValue = document.getElementById('speed-value');
        if (speedValue) {
            speedValue.textContent = `${parseFloat(speed).toFixed(2)}×`;
        }
        // Update the physics engine's time step based on base timestep of 0.005
        this.physics.timeStep = 0.005 * this.simulationSpeed;
    }

    setupEventListeners() {
        // Add speed slider listener
        const speedSlider = document.getElementById('speed-slider');
        if (speedSlider) {
            speedSlider.addEventListener('input', (e) => {
                this.updateSimulationSpeed(e.target.value);
            });
        }

        // Play/Pause button
        const playPauseBtn = document.getElementById('play-pause-btn');
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => {
                this.toggleSimulation();
            });
        }
        
        // Reset button
        const resetBtn = document.getElementById('reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetSimulation();
            });
        }
        
        // Parameter sliders
        this.setupSliderListeners();
        
        // Mode buttons
        this.setupModeListeners();
        
        // Visualization toggles
        this.setupVisualizationListeners();
        
        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
    }
    
    /**
     * Setup slider event listeners
     */
    setupSliderListeners() {
        // Physics parameters - these require reset to take effect properly
        const physicsSliders = ['m1', 'm2', 'l1', 'l2', 'g'];
        physicsSliders.forEach(param => {
            const slider = document.getElementById(`${param}-slider`);
            const value = document.getElementById(`${param}-value`);
            
            if (!slider || !value) return;
            
            slider.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                value.textContent = val.toFixed(2);
                
                // Update physics parameters
                this.physics.setParameters({ [param]: val });
                
                // Update chaos system if exists
                if (this.chaosSystem) {
                    this.chaosSystem.pendulums.forEach(p => p.setParameters({ [param]: val }));
                }
                
                // Re-render to show changes
                this.visualization.render(this.physics, this.chaosSystem);
            });
        });
        
        // Initial conditions - these update the state directly
        const angleSliders = ['theta1', 'theta2'];
        angleSliders.forEach(param => {
            const slider = document.getElementById(`${param}-slider`);
            const value = document.getElementById(`${param}-value`);
            
            if (!slider || !value) return;
            
            slider.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                value.textContent = val.toFixed(1);
                
                // Convert degrees to radians and update physics state
                this.physics[param] = val * Math.PI / 180;
                
                // Clear trajectory when changing initial conditions
                this.physics.trajectory = [];
                this.physics.energyHistory = [];
                
                // Re-render to show new position
                this.visualization.render(this.physics, this.chaosSystem);
            });
        });
        
        // Angular velocity sliders
        const velocitySliders = ['omega1', 'omega2'];
        velocitySliders.forEach(param => {
            const slider = document.getElementById(`${param}-slider`);
            const value = document.getElementById(`${param}-value`);
            
            if (!slider || !value) return;
            
            slider.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                value.textContent = val.toFixed(1);
                
                // Convert degrees/s to radians/s and update physics state
                this.physics[param] = val * Math.PI / 180;
                
                // Clear trajectory when changing initial conditions
                this.physics.trajectory = [];
                this.physics.energyHistory = [];
                
                // Re-render
                this.visualization.render(this.physics, this.chaosSystem);
            });
        });
        
        // Damping slider
        const dampingSlider = document.getElementById('damping-slider');
        const dampingValue = document.getElementById('damping-value');
        
        if (dampingSlider && dampingValue) {
            dampingSlider.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                dampingValue.textContent = val.toFixed(2);
                this.physics.internalDamping = val;
            });
        }
    }
    
    /**
     * Setup mode button listeners
     */
    setupModeListeners() {
        const modes = ['normal', 'trace', 'chaos', 'slow'];
        
        modes.forEach(mode => {
            const btn = document.getElementById(`${mode}-mode`);
            if (!btn) return;
            
            btn.addEventListener('click', () => {
                this.setMode(mode);
                
                // Update button states
                modes.forEach(m => {
                    const modeBtn = document.getElementById(`${m}-mode`);
                    if (modeBtn) {
                        modeBtn.classList.remove('active');
                    }
                });
                btn.classList.add('active');
            });
        });
    }
    
    /**
     * Setup visualization toggle listeners
     */
    setupVisualizationListeners() {
        const showTrajectory = document.getElementById('show-trajectory');
        if (showTrajectory) {
            showTrajectory.addEventListener('change', (e) => {
                this.visualization.showTrajectory = e.target.checked;
            });
        }
        
        const showEnergy = document.getElementById('show-energy');
        if (showEnergy) {
            showEnergy.addEventListener('change', (e) => {
                this.visualization.showEnergy = e.target.checked;
            });
        }
        
        const showVelocity = document.getElementById('show-velocity');
        if (showVelocity) {
            showVelocity.addEventListener('change', (e) => {
                this.visualization.showVelocity = e.target.checked;
            });
        }
        
        const showForces = document.getElementById('show-forces');
        if (showForces) {
            showForces.addEventListener('change', (e) => {
                this.visualization.showForces = e.target.checked;
            });
        }
    }
    
    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Space - play/pause
            if (e.code === 'Space' && !e.target.matches('input')) {
                e.preventDefault();
                this.toggleSimulation();
            }
            
            // R - reset
            if (e.code === 'KeyR' && !e.target.matches('input')) {
                e.preventDefault();
                this.resetSimulation();
            }
        });
    }
    
    /**
     * Toggle play/pause
     */
    toggleSimulation() {
        if (this.isRunning) {
            this.stopSimulation();
        } else {
            this.startSimulation();
        }
    }
    
    /**
     * Start simulation
     */
    startSimulation() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        const playPauseBtn = document.getElementById('play-pause-btn');
        if (playPauseBtn) {
            playPauseBtn.textContent = '⏸️';
        }
        
        const animate = () => {
            if (!this.isRunning) return;
            
            // Update physics
            if (this.visualization.mode === 'chaos' && this.chaosSystem) {
                this.chaosSystem.step();
            } else {
                const steps = this.visualization.mode === 'slow' ? 1 : 1;
                for (let i = 0; i < steps; i++) {
                    this.physics.rungeKuttaStep();
                }
            }
            
            // Render
            this.visualization.render(this.physics, this.chaosSystem);
            
            this.animationId = requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    /**
     * Stop simulation
     */
    stopSimulation() {
        this.isRunning = false;
        const playPauseBtn = document.getElementById('play-pause-btn');
        if (playPauseBtn) {
            playPauseBtn.textContent = '▶️';
        }
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    /**
     * Reset simulation
     */
    resetSimulation() {
        this.stopSimulation();
        
        // Reset physics
        this.physics.reset();
        
        // Reset chaos system if exists
        if (this.chaosSystem) {
            this.chaosSystem.reset();
        }
        
        // Update slider values to match reset state
        this.updateAllSliders();
        
        // Render
        this.visualization.render(this.physics, this.chaosSystem);
    }
    
    /**
     * Set simulation mode
     */
    setMode(mode) {
        this.visualization.mode = mode;
        
        // Create or destroy chaos system as needed
        if (mode === 'chaos' && !this.chaosSystem) {
            this.chaosSystem = new ChaosPendulumSystem(this.physics, 4, 0.001);
        }
        
        // Show/hide chaos section
        const chaosSection = document.getElementById('chaos-section');
        if (chaosSection) {
            if (mode === 'chaos') {
                chaosSection.style.display = 'block';
            } else {
                chaosSection.style.display = 'none';
            }
        }
        
        // Dispatch custom event
        document.dispatchEvent(new CustomEvent('modeChanged', { detail: { mode } }));
    }
    
    /**
     * Update slider to match a value
     */
    updateSlider(id, value) {
        const slider = document.getElementById(`${id}-slider`);
        const valueDisplay = document.getElementById(`${id}-value`);
        
        if (slider) slider.value = value;
        if (valueDisplay) valueDisplay.textContent = value.toFixed(1);
    }
    
    /**
     * Update all sliders to match current physics state
     */
    updateAllSliders() {
        // Update physics parameter displays
        document.getElementById('m1-value').textContent = this.physics.m1.toFixed(2);
        document.getElementById('m2-value').textContent = this.physics.m2.toFixed(2);
        document.getElementById('l1-value').textContent = this.physics.l1.toFixed(2);
        document.getElementById('l2-value').textContent = this.physics.l2.toFixed(2);
        document.getElementById('g-value').textContent = this.physics.g.toFixed(2);
        
        // Update sliders
        document.getElementById('m1-slider').value = this.physics.m1;
        document.getElementById('m2-slider').value = this.physics.m2;
        document.getElementById('l1-slider').value = this.physics.l1;
        document.getElementById('l2-slider').value = this.physics.l2;
        document.getElementById('g-slider').value = this.physics.g;
        
        // Update initial conditions
        const theta1Deg = this.physics.theta1 * 180 / Math.PI;
        const theta2Deg = this.physics.theta2 * 180 / Math.PI;
        const omega1Deg = this.physics.omega1 * 180 / Math.PI;
        const omega2Deg = this.physics.omega2 * 180 / Math.PI;
        
        document.getElementById('theta1-value').textContent = theta1Deg.toFixed(1);
        document.getElementById('theta2-value').textContent = theta2Deg.toFixed(1);
        document.getElementById('omega1-value').textContent = omega1Deg.toFixed(1);
        document.getElementById('omega2-value').textContent = omega2Deg.toFixed(1);
        
        document.getElementById('theta1-slider').value = theta1Deg;
        document.getElementById('theta2-slider').value = theta2Deg;
        document.getElementById('omega1-slider').value = omega1Deg;
        document.getElementById('omega2-slider').value = omega2Deg;
        
        // Update damping
        document.getElementById('damping-value').textContent = this.physics.internalDamping.toFixed(2);
        document.getElementById('damping-slider').value = this.physics.internalDamping;
    }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PendulumControls;
}
