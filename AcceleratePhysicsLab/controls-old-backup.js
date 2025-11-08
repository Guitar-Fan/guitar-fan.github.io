/**
 * Interactive Control System
 * Handles real-time parameter adjustment and user interactions
 */

class PendulumControls {
    constructor(physics, visualization, chaosSystem = null) {
        this.physics = physics;
        this.visualization = visualization;
        this.chaosSystem = chaosSystem;
        
        // Control elements
        this.elements = {};
        this.isDragging = false;
        this.dragTarget = null;
        
        // Animation control
        this.animationId = null;
        this.isRunning = false;
        this.simulationSpeed = 1.0;
        
        this.initializeControls();
        this.setupEventListeners();
    }
    
    /**
     * Initialize control elements
     */
    initializeControls() {
        // Control panel is now built into the HTML, no need to create it
        // Just verify it exists
        const panel = document.querySelector('.control-panel');
        if (!panel) {
            console.error('Control panel not found in HTML');
        }
    }
    
    /**
     * Removed - control panel now in HTML
     */
    createControlPanel() {
        // No longer needed - controls are in HTML
    }
    
    createParameterControls() {
        // No longer needed - controls are in HTML
    }
    
    createModeControls() {
                // No longer needed - controls are in HTML
    }
    
    createVisualizationControls() {
        // No longer needed - controls are in HTML
    }
    
    updateSimulationSpeed(speed) {
    
    /**
     * Create parameter controls
     */
    createParameterControls() {
        const physicsControls = document.getElementById('physics-controls');
        physicsControls.innerHTML = `
            <div class="control-group">
                <label>Mass 1 (kg): <span id="m1-value">${this.physics.m1}</span></label>
                <input type="range" id="m1-slider" min="0.1" max="5.0" step="0.1" value="${this.physics.m1}">
            </div>
            <div class="control-group">
                <label>Mass 2 (kg): <span id="m2-value">${this.physics.m2}</span></label>
                <input type="range" id="m2-slider" min="0.1" max="5.0" step="0.1" value="${this.physics.m2}">
            </div>
            <div class="control-group">
                <label>Length 1 (m): <span id="l1-value">${this.physics.l1}</span></label>
                <input type="range" id="l1-slider" min="0.1" max="2.0" step="0.1" value="${this.physics.l1}">
            </div>
            <div class="control-group">
                <label>Length 2 (m): <span id="l2-value">${this.physics.l2}</span></label>
                <input type="range" id="l2-slider" min="0.1" max="2.0" step="0.1" value="${this.physics.l2}">
            </div>
            <div class="control-group">
                <label>Gravity (m/s²): <span id="g-value">${this.physics.g}</span></label>
                <input type="range" id="g-slider" min="1.0" max="20.0" step="0.1" value="${this.physics.g}">
            </div>
        `;
        
        const initialControls = document.getElementById('initial-controls');
        initialControls.innerHTML = `
            <div class="control-group">
                <label>Angle 1 (°): <span id="theta1-value">${(this.physics.theta1 * 180 / Math.PI).toFixed(1)}</span></label>
                <input type="range" id="theta1-slider" min="-180" max="180" step="1" value="${this.physics.theta1 * 180 / Math.PI}">
            </div>
            <div class="control-group">
                <label>Angle 2 (°): <span id="theta2-value">${(this.physics.theta2 * 180 / Math.PI).toFixed(1)}</span></label>
                <input type="range" id="theta2-slider" min="-180" max="180" step="1" value="${this.physics.theta2 * 180 / Math.PI}">
            </div>
            <div class="control-group">
                <label>Velocity 1 (°/s): <span id="omega1-value">${(this.physics.omega1 * 180 / Math.PI).toFixed(1)}</span></label>
                <input type="range" id="omega1-slider" min="-360" max="360" step="1" value="${this.physics.omega1 * 180 / Math.PI}">
            </div>
            <div class="control-group">
                <label>Velocity 2 (°/s): <span id="omega2-value">${(this.physics.omega2 * 180 / Math.PI).toFixed(1)}</span></label>
                <input type="range" id="omega2-slider" min="-360" max="360" step="1" value="${this.physics.omega2 * 180 / Math.PI}">
            </div>
        `;
        
        const environmentControls = document.getElementById('environment-controls');
        environmentControls.innerHTML = `
            <div class="control-group">
                <label>Air Resistance: <span id="damping-value">${this.physics.damping}</span></label>
                <input type="range" id="damping-slider" min="0.0" max="0.1" step="0.01" value="${this.physics.damping}">
            </div>
            <div class="control-group">
                <label>External Force X: <span id="force-x-value">${this.physics.externalForce.x}</span></label>
                <input type="range" id="force-x-slider" min="-10" max="10" step="0.5" value="${this.physics.externalForce.x}">
            </div>
            <div class="control-group">
                <label>External Force Y: <span id="force-y-value">${this.physics.externalForce.y}</span></label>
                <input type="range" id="force-y-slider" min="-10" max="10" step="0.5" value="${this.physics.externalForce.y}">
            </div>
        `;
    }
    
    /**
     * Create mode control buttons
     */
    createModeControls() {
        const modeControls = document.createElement('div');
        modeControls.className = 'mode-controls';
        modeControls.innerHTML = `
            <h4>Simulation Mode</h4>
            <div class="mode-buttons">
                <button id="normal-mode" class="mode-btn active">Normal</button>
                <button id="trace-mode" class="mode-btn">Trace</button>
                <button id="chaos-mode" class="mode-btn">Chaos</button>
                <button id="slow-mode" class="mode-btn">Slow Motion</button>
            </div>
        `;
        
        document.querySelector('.panel-content').appendChild(modeControls);
    }
    
    /**
     * Create visualization control toggles
     */
    createVisualizationControls() {
        const visualControls = document.getElementById('visual-controls');
        visualControls.innerHTML = `
            <div class="control-group">
                <label>
                    <input type="checkbox" id="show-trajectory" checked>
                    Show Trajectory
                </label>
            </div>
            <div class="control-group">
                <label>
                    <input type="checkbox" id="show-energy" checked>
                    Show Energy
                </label>
            </div>
            <div class="control-group">
                <label>
                    <input type="checkbox" id="show-velocity">
                    Show Velocity Vectors
                </label>
            </div>
            <div class="control-group">
                <label>
                    <input type="checkbox" id="show-forces">
                    Show Force Vectors
                </label>
            </div>
        `;
    }
    
    /**
     * Setup event listeners
     */
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
        document.getElementById('play-pause-btn').addEventListener('click', () => {
            this.toggleSimulation();
        });
        
        // Reset button
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetSimulation();
        });
        
        // Parameter sliders
        this.setupSliderListeners();
        
        // Mode buttons
        this.setupModeListeners();
        
        // Visualization toggles
        this.setupVisualizationListeners();
        
        // Canvas interaction (simplified - no dragging, just visual)
        this.setupCanvasInteraction();
        
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
            btn.addEventListener('click', () => {
                this.setMode(mode);
                
                // Update button states
                modes.forEach(m => {
                    document.getElementById(`${m}-mode`).classList.remove('active');
                });
                btn.classList.add('active');
            });
        });
    }
    
    /**
     * Setup visualization toggle listeners
     */
    setupVisualizationListeners() {
        document.getElementById('show-trajectory').addEventListener('change', (e) => {
            this.visualization.showTrajectory = e.target.checked;
        });
        
        document.getElementById('show-energy').addEventListener('change', (e) => {
            this.visualization.showEnergy = e.target.checked;
        });
        
        document.getElementById('show-velocity').addEventListener('change', (e) => {
            this.visualization.showVelocity = e.target.checked;
        });
        
        document.getElementById('show-forces').addEventListener('change', (e) => {
            this.visualization.showForces = e.target.checked;
        });
    }
    
    
    /**
     * Setup canvas interaction (simplified for better physics accuracy)
     */
    setupCanvasInteraction() {
        const canvas = this.visualization.canvas;
        
        // Simple hover effect only
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            // Change cursor when hovering over pendulum bobs
            const positions = this.physics.getPositions();
            const bob1X = this.visualization.centerX + positions.bob1.x * this.visualization.scale;
            const bob1Y = this.visualization.centerY + positions.bob1.y * this.visualization.scale;
            const bob2X = this.visualization.centerX + positions.bob2.x * this.visualization.scale;
            const bob2Y = this.visualization.centerY + positions.bob2.y * this.visualization.scale;
            
            const dist1 = Math.sqrt((mouseX - bob1X) ** 2 + (mouseY - bob1Y) ** 2);
            const dist2 = Math.sqrt((mouseX - bob2X) ** 2 + (mouseY - bob2Y) ** 2);
            
            if (dist1 < 25 || dist2 < 25) {
                canvas.style.cursor = 'pointer';
            } else {
                canvas.style.cursor = 'default';
            }
        });
    }
    
    /**
     * Stub functions for removed features (to prevent errors)
     */
    setupConnectionTypeListeners() {
        // Feature removed for cleaner physics
    }
    
    setupStringControlListeners() {
        // Feature removed for cleaner physics
    }
    
    setupFunModeListeners() {
        // Feature removed for cleaner physics
    }
    
    setupInteractiveListeners() {
        // Feature removed for cleaner physics
    }
    
    applyClickForce(x, y) {
        // Feature removed for cleaner physics
    }
    
    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
    
    /**
     * Apply click force at mouse position
     */
    applyClickForce(x, y) {
        // Convert screen coordinates to physics coordinates
        const physX = (x - this.visualization.centerX) / this.visualization.scale;
        const physY = (y - this.visualization.centerY) / this.visualization.scale;
        
        // Find closest bob and apply force
        const positions = this.physics.getPositions();
        const dist1 = Math.sqrt((physX - positions.bob1.x) ** 2 + (physY - positions.bob1.y) ** 2);
        const dist2 = Math.sqrt((physX - positions.bob2.x) ** 2 + (physY - positions.bob2.y) ** 2);
        
        const forceStrength = 2.0;
        
        if (dist1 < dist2) {
            // Apply force to bob1
            const fx = (physX - positions.bob1.x) * forceStrength;
            const fy = (physY - positions.bob1.y) * forceStrength;
            this.physics.externalForce.x += fx;
            this.physics.externalForce.y += fy;
        } else {
            // Apply force to bob2
            const fx = (physX - positions.bob2.x) * forceStrength;
            const fy = (physY - positions.bob2.y) * forceStrength;
            this.physics.externalForce.x += fx;
            this.physics.externalForce.y += fy;
        }
        
        // Visual feedback
        if (this.physics.soundEffects) {
            this.visualization.addSoundEffect(x, y, 'bounce');
        }
        
        // Decay the applied force
        setTimeout(() => {
            this.physics.externalForce.x *= 0.5;
            this.physics.externalForce.y *= 0.5;
        }, 100);
    }
    
    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case ' ':
                    e.preventDefault();
                    this.toggleSimulation();
                    break;
                case 'r':
                    this.resetSimulation();
                    break;
                case 'c':
                    this.setMode('chaos');
                    break;
                case 't':
                    this.setMode('trace');
                    break;
                case 'n':
                    this.setMode('normal');
                    break;
                case 's':
                    this.setMode('slow');
                    break;
            }
        });
    }
    
    /**
     * Start/stop simulation
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
        document.getElementById('play-pause-btn').textContent = '⏸️';
        
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
        document.getElementById('play-pause-btn').textContent = '▶️';
        
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
        
        // Reset chaos system
        if (this.chaosSystem) {
            this.chaosSystem.reset();
        }
        
        // Update sliders
        this.updateAllSliders();
        
        // Clear visualization
        this.visualization.clear();
        this.visualization.render(this.physics, this.chaosSystem);
    }
    
    /**
     * Set simulation mode
     */
    setMode(mode) {
        this.visualization.setMode(mode);
        
        if (mode === 'chaos' && !this.chaosSystem) {
            this.chaosSystem = new ChaosPendulumSystem(this.physics);
        }
        
        // Update button states
        const modes = ['normal', 'trace', 'chaos', 'slow'];
        modes.forEach(m => {
            const btn = document.getElementById(`${m}-mode`);
            if (btn) btn.classList.remove('active');
        });
        
        const activeBtn = document.getElementById(`${mode}-mode`);
        if (activeBtn) activeBtn.classList.add('active');
    }
    
    /**
     * Update slider value
     */
    updateSlider(id, value) {
        const slider = document.getElementById(`${id}-slider`);
        const valueDisplay = document.getElementById(`${id}-value`);
        
        if (slider) slider.value = value;
        if (valueDisplay) valueDisplay.textContent = typeof value === 'number' ? value.toFixed(1) : value;
    }
    
    /**
     * Update all sliders to match current physics state
     */
    updateAllSliders() {
        // Physics parameters
        this.updateSlider('m1', this.physics.m1);
        this.updateSlider('m2', this.physics.m2);
        this.updateSlider('l1', this.physics.l1);
        this.updateSlider('l2', this.physics.l2);
        this.updateSlider('g', this.physics.g);
        
        // Initial conditions
        this.updateSlider('theta1', this.physics.theta1 * 180 / Math.PI);
        this.updateSlider('theta2', this.physics.theta2 * 180 / Math.PI);
        this.updateSlider('omega1', this.physics.omega1 * 180 / Math.PI);
        this.updateSlider('omega2', this.physics.omega2 * 180 / Math.PI);
        
        // Environment
        this.updateSlider('damping', this.physics.damping);
        this.updateSlider('force-x', this.physics.externalForce.x);
        this.updateSlider('force-y', this.physics.externalForce.y);
    }
    
    /**
     * Setup connection type listeners
     */
    setupConnectionTypeListeners() {
        const connectionModes = ['rod', 'string', 'spring', 'noodle'];
        
        connectionModes.forEach(mode => {
            const btn = document.getElementById(`${mode}-mode`);
            if (btn) {
                btn.addEventListener('click', () => {
                    this.physics.pendulumType = mode;
                    
                    // Update button states
                    connectionModes.forEach(m => {
                        const modeBtn = document.getElementById(`${m}-mode`);
                        if (modeBtn) modeBtn.classList.remove('active');
                    });
                    btn.classList.add('active');
                    
                    // Show/hide string controls
                    const stringControls = document.getElementById('string-controls');
                    if (stringControls) {
                        stringControls.style.display = (mode === 'string') ? 'block' : 'none';
                    }
                });
            }
        });
    }
    
    /**
     * Setup string control listeners
     */
    setupStringControlListeners() {
        // String tension
        const tensionSlider = document.getElementById('tension-slider');
        const tensionValue = document.getElementById('tension-value');
        if (tensionSlider) {
            tensionSlider.addEventListener('input', (e) => {
                this.physics.stringTension = parseFloat(e.target.value);
                if (tensionValue) tensionValue.textContent = e.target.value;
            });
        }
        
        // Elasticity
        const elasticitySlider = document.getElementById('elasticity-slider');
        const elasticityValue = document.getElementById('elasticity-value');
        if (elasticitySlider) {
            elasticitySlider.addEventListener('input', (e) => {
                this.physics.elasticity = parseFloat(e.target.value);
                if (elasticityValue) elasticityValue.textContent = e.target.value;
            });
        }
        
        // String sag
        const sagSlider = document.getElementById('sag-slider');
        const sagValue = document.getElementById('sag-value');
        if (sagSlider) {
            sagSlider.addEventListener('input', (e) => {
                this.physics.stringSag = parseFloat(e.target.value);
                if (sagValue) sagValue.textContent = e.target.value;
            });
        }
    }
    
    /**
     * Setup fun mode listeners
     */
    setupFunModeListeners() {
        const funModes = ['jello', 'balloon', 'disco', 'rainbow'];
        
        funModes.forEach(mode => {
            const btn = document.getElementById(`${mode}-mode`);
            if (btn) {
                btn.addEventListener('click', () => {
                    this.physics.funMode = (this.physics.funMode === mode) ? 'normal' : mode;
                    
                    // Update button state
                    btn.classList.toggle('active');
                    
                    // Deactivate other fun modes
                    funModes.forEach(m => {
                        if (m !== mode) {
                            const otherBtn = document.getElementById(`${m}-mode`);
                            if (otherBtn) otherBtn.classList.remove('active');
                        }
                    });
                });
            }
        });
        
        // Sound effects toggle
        const soundCheckbox = document.getElementById('sound-effects');
        if (soundCheckbox) {
            soundCheckbox.addEventListener('change', (e) => {
                this.physics.soundEffects = e.target.checked;
            });
        }
        
        // Particle trails toggle
        const particleCheckbox = document.getElementById('particle-trails');
        if (particleCheckbox) {
            particleCheckbox.addEventListener('change', (e) => {
                this.physics.particleTrails = e.target.checked;
            });
        }
        
        // Bouncy walls toggle
        const bouncyCheckbox = document.getElementById('bouncy-walls');
        if (bouncyCheckbox) {
            bouncyCheckbox.addEventListener('change', (e) => {
                this.physics.bouncyWalls = e.target.checked;
            });
        }
    }
    
    /**
     * Setup interactive control listeners
     */
    setupInteractiveListeners() {
        // Mouse interaction toggle
        const mouseCheckbox = document.getElementById('mouse-interaction');
        if (mouseCheckbox) {
            mouseCheckbox.addEventListener('change', (e) => {
                this.physics.mouseInteraction = e.target.checked;
            });
        }
        
        // Click force toggle
        const clickCheckbox = document.getElementById('click-force');
        if (clickCheckbox) {
            clickCheckbox.addEventListener('change', (e) => {
                this.physics.clickForce = e.target.checked;
            });
        }
        
        // String wobble toggle
        const wobbleCheckbox = document.getElementById('string-wobble');
        if (wobbleCheckbox) {
            wobbleCheckbox.addEventListener('change', (e) => {
                this.physics.stringWobble = e.target.checked ? 1.0 : 0.0;
            });
        }
        
        // String tension display toggle
        const tensionDisplayCheckbox = document.getElementById('show-string-tension');
        if (tensionDisplayCheckbox) {
            tensionDisplayCheckbox.addEventListener('change', (e) => {
                this.physics.showStringTension = e.target.checked;
            });
        }
        
        // Shake pendulum button
        const shakeBtn = document.getElementById('shake-pendulum');
        if (shakeBtn) {
            shakeBtn.addEventListener('click', () => {
                this.physics.shakeIntensity = 0.5; // Start strong shake
                
                // Visual feedback
                shakeBtn.style.background = '#ff4444';
                setTimeout(() => {
                    shakeBtn.style.background = '';
                }, 500);
            });
        }
        
        // Tickle mode button
        const tickleBtn = document.getElementById('tickle-mode');
        if (tickleBtn) {
            tickleBtn.addEventListener('click', () => {
                this.physics.tickleMode = !this.physics.tickleMode;
                tickleBtn.classList.toggle('active');
            });
        }
    }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PendulumControls;
}