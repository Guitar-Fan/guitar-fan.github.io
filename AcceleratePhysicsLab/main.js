/**
 * Double Pendulum Simulation - Main Application
 * Integrates physics, visualization, and controls
 */

class DoublePendulumApp {
    constructor() {
        // Core components
        this.physics = new DoublePendulumPhysics();
        this.visualization = new PendulumVisualization('pendulum-canvas');
        this.charts = null;
        this.chaosSystem = null;
        this.controls = null;
        
        // Application state
        this.isInitialized = false;
        this.currentMode = 'normal';
        
        // Preset configurations
        this.presets = {
            'chaotic': {
                name: 'Chaotic Motion',
                params: { m1: 1.0, m2: 1.0, l1: 1.0, l2: 1.0, g: 9.81, damping: 0.0 },
                initial: { theta1: Math.PI / 2, theta2: Math.PI / 2, omega1: 0, omega2: 0 }
            },
            'energy-conservation': {
                name: 'Energy Conservation',
                params: { m1: 2.0, m2: 1.0, l1: 1.5, l2: 1.0, g: 9.81, damping: 0.0 },
                initial: { theta1: Math.PI / 3, theta2: Math.PI / 4, omega1: 0, omega2: 0 }
            },
            'damped': {
                name: 'Damped Motion',
                params: { m1: 1.0, m2: 1.0, l1: 1.0, l2: 1.0, g: 9.81, damping: 0.05 },
                initial: { theta1: Math.PI / 2, theta2: Math.PI / 3, omega1: 0, omega2: 0 }
            },
            'double-mass': {
                name: 'Double Mass',
                params: { m1: 1.0, m2: 2.0, l1: 1.0, l2: 1.0, g: 9.81, damping: 0.0 },
                initial: { theta1: Math.PI / 4, theta2: Math.PI / 2, omega1: 0, omega2: 0 }
            },
            'high-energy': {
                name: 'High Energy',
                params: { m1: 1.0, m2: 1.0, l1: 1.0, l2: 1.0, g: 9.81, damping: 0.0 },
                initial: { theta1: Math.PI * 0.8, theta2: Math.PI * 0.6, omega1: 2.0, omega2: -1.5 }
            }
        };
        
        this.init();
    }
    
    /**
     * Initialize the application
     */
    init() {
        try {
            this.setupCanvas();
            this.setupPresets();
            this.setupDataExport();
            this.setupHelpSystem();
            this.initializeComponents();
            this.setupNavigation();
            
            // Mark as initialized
            this.isInitialized = true;
            
            // Start with default preset
            this.loadPreset('chaotic');
            
            console.log('Double Pendulum Simulation initialized successfully');
        } catch (error) {
            console.error('Failed to initialize application:', error);
            this.showError('Failed to initialize simulation. Please refresh the page.');
        }
    }
    
    /**
     * Setup main canvas
     */
    setupCanvas() {
        const canvas = document.getElementById('pendulum-canvas');
        if (!canvas) {
            throw new Error('Canvas element not found');
        }
        
        // Set canvas size
        const container = canvas.parentElement;
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        
        // Add canvas styling
        canvas.style.border = '1px solid rgba(248, 246, 240, 0.2)';
        canvas.style.borderRadius = '8px';
        canvas.style.background = '#1a1d29';
    }
    
    /**
     * Initialize core components
     */
    initializeComponents() {
        // Create charts
        this.charts = new PhysicsCharts(this.physics);
        
        // Create controls
        this.controls = new PendulumControls(this.physics, this.visualization, this.chaosSystem);
        
        // Initial render
        this.visualization.render(this.physics);
        
        // Setup data collection
        this.setupDataCollection();
    }
    
    /**
     * Setup preset system
     */
    setupPresets() {
        const presetContainer = document.getElementById('preset-container');
        if (!presetContainer) return;
        
        Object.keys(this.presets).forEach(key => {
            const preset = this.presets[key];
            const button = document.createElement('button');
            button.className = 'preset-btn';
            button.textContent = preset.name;
            button.addEventListener('click', () => this.loadPreset(key));
            presetContainer.appendChild(button);
        });
    }
    
    /**
     * Load a preset configuration
     */
    loadPreset(presetKey) {
        const preset = this.presets[presetKey];
        if (!preset) return;
        
        // Stop simulation
        if (this.controls) {
            this.controls.stopSimulation();
        }
        
        // Apply parameters
        this.physics.setParameters(preset.params);
        this.physics.reset(
            preset.initial.theta1,
            preset.initial.theta2,
            preset.initial.omega1,
            preset.initial.omega2
        );
        
        // Reset chaos system if exists
        if (this.chaosSystem) {
            this.chaosSystem.reset();
        }
        
        // Clear charts
        if (this.charts) {
            this.charts.clear();
        }
        
        // Update controls
        if (this.controls) {
            this.controls.updateAllSliders();
        }
        
        // Update preset button states
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = Array.from(document.querySelectorAll('.preset-btn'))
            .find(btn => btn.textContent === preset.name);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
        // Render
        this.visualization.render(this.physics, this.chaosSystem);
        
        // Show notification
        this.showNotification(`Loaded preset: ${preset.name}`);
    }
    
    /**
     * Setup data export functionality
     */
    setupDataExport() {
        const exportBtn = document.getElementById('export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportData());
        }
        
        const clearBtn = document.getElementById('clear-data-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearData());
        }
    }
    
    /**
     * Export simulation data
     */
    exportData() {
        const data = {
            metadata: {
                timestamp: new Date().toISOString(),
                parameters: {
                    m1: this.physics.m1,
                    m2: this.physics.m2,
                    l1: this.physics.l1,
                    l2: this.physics.l2,
                    g: this.physics.g,
                    damping: this.physics.damping
                },
                initialConditions: {
                    theta1: this.physics.theta1,
                    theta2: this.physics.theta2,
                    omega1: this.physics.omega1,
                    omega2: this.physics.omega2
                }
            },
            trajectory: this.physics.trajectory,
            energyHistory: this.physics.energyHistory
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `pendulum-data-${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        this.showNotification('Data exported successfully');
    }
    
    /**
     * Clear collected data
     */
    clearData() {
        this.physics.trajectory = [];
        this.physics.energyHistory = [];
        if (this.charts) {
            this.charts.clear();
        }
        this.showNotification('Data cleared');
    }
    
    /**
     * Setup data collection and analysis
     */
    setupDataCollection() {
        // Update data display and charts periodically
        setInterval(() => {
            this.updateDataDisplay();
            if (this.charts && this.controls && this.controls.isRunning) {
                this.charts.update();
            }
        }, 100);
    }
    
    /**
     * Update real-time data display
     */
    updateDataDisplay() {
        const state = this.physics.getState();
        
        // Update energy display
        const energyDisplay = document.getElementById('energy-display');
        if (energyDisplay) {
            energyDisplay.innerHTML = `
                <div class="energy-item">
                    <span class="energy-label">Kinetic:</span>
                    <span class="energy-value">${state.energy.kinetic.toFixed(3)} J</span>
                </div>
                <div class="energy-item">
                    <span class="energy-label">Potential:</span>
                    <span class="energy-value">${state.energy.potential.toFixed(3)} J</span>
                </div>
                <div class="energy-item">
                    <span class="energy-label">Total:</span>
                    <span class="energy-value">${state.energy.total.toFixed(3)} J</span>
                </div>
            `;
        }
        
        // Update state display
        const stateDisplay = document.getElementById('state-display');
        if (stateDisplay) {
            stateDisplay.innerHTML = `
                <div class="state-item">
                    <span class="state-label">θ₁:</span>
                    <span class="state-value">${(state.theta1 * 180 / Math.PI).toFixed(1)}°</span>
                </div>
                <div class="state-item">
                    <span class="state-label">θ₂:</span>
                    <span class="state-value">${(state.theta2 * 180 / Math.PI).toFixed(1)}°</span>
                </div>
                <div class="state-item">
                    <span class="state-label">ω₁:</span>
                    <span class="state-value">${(state.omega1 * 180 / Math.PI).toFixed(1)}°/s</span>
                </div>
                <div class="state-item">
                    <span class="state-label">ω₂:</span>
                    <span class="state-value">${(state.omega2 * 180 / Math.PI).toFixed(1)}°/s</span>
                </div>
            `;
        }
        
        // Update chaos divergence if in chaos mode
        if (this.currentMode === 'chaos' && this.chaosSystem) {
            const divergence = this.chaosSystem.calculateDivergence();
            const chaosDisplay = document.getElementById('chaos-display');
            if (chaosDisplay && divergence.length > 0) {
                const avgDivergence = divergence.reduce((a, b) => a + b, 0) / divergence.length;
                chaosDisplay.innerHTML = `
                    <div class="chaos-item">
                        <span class="chaos-label">Avg Divergence:</span>
                        <span class="chaos-value">${avgDivergence.toFixed(3)} m</span>
                    </div>
                    <div class="chaos-item">
                        <span class="chaos-label">Max Divergence:</span>
                        <span class="chaos-value">${Math.max(...divergence).toFixed(3)} m</span>
                    </div>
                `;
            }
        }
    }
    
    /**
     * Setup help system
     */
    setupHelpSystem() {
        const helpBtn = document.getElementById('help-btn');
        if (helpBtn) {
            helpBtn.addEventListener('click', () => this.showHelp());
        }
        
        // Add help tooltips to controls
        this.addTooltips();
    }
    
    /**
     * Add tooltips to control elements
     */
    addTooltips() {
        const tooltipData = {
            'm1-slider': 'Mass of the first pendulum bob (kg)',
            'm2-slider': 'Mass of the second pendulum bob (kg)',
            'l1-slider': 'Length of the first pendulum rod (m)',
            'l2-slider': 'Length of the second pendulum rod (m)',
            'g-slider': 'Gravitational acceleration (m/s²)',
            'theta1-slider': 'Initial angle of first pendulum (degrees)',
            'theta2-slider': 'Initial angle of second pendulum (degrees)',
            'omega1-slider': 'Initial angular velocity of first pendulum (degrees/s)',
            'omega2-slider': 'Initial angular velocity of second pendulum (degrees/s)',
            'damping-slider': 'Air resistance coefficient',
            'force-x-slider': 'External force in horizontal direction (N)',
            'force-y-slider': 'External force in vertical direction (N)'
        };
        
        Object.keys(tooltipData).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.title = tooltipData[id];
            }
        });
    }
    
    /**
     * Show help dialog
     */
    showHelp() {
        const helpDialog = document.createElement('div');
        helpDialog.className = 'help-dialog';
        helpDialog.innerHTML = `
            <div class="help-content">
                <h2>Double Pendulum Simulation Help</h2>
                <div class="help-section">
                    <h3>Keyboard Shortcuts</h3>
                    <ul>
                        <li><strong>Space:</strong> Play/Pause simulation</li>
                        <li><strong>R:</strong> Reset simulation</li>
                        <li><strong>C:</strong> Chaos mode</li>
                        <li><strong>T:</strong> Trace mode</li>
                        <li><strong>N:</strong> Normal mode</li>
                        <li><strong>S:</strong> Slow motion mode</li>
                    </ul>
                </div>
                <div class="help-section">
                    <h3>Mouse Interactions</h3>
                    <ul>
                        <li><strong>Drag bobs:</strong> Set initial positions</li>
                        <li><strong>Click canvas:</strong> Apply impulse force</li>
                    </ul>
                </div>
                <div class="help-section">
                    <h3>Physics Concepts</h3>
                    <ul>
                        <li><strong>Chaos:</strong> Sensitive dependence on initial conditions</li>
                        <li><strong>Energy Conservation:</strong> Total energy should remain constant</li>
                        <li><strong>Damping:</strong> Air resistance that dissipates energy</li>
                    </ul>
                </div>
                <button class="close-btn" onclick="this.parentElement.parentElement.remove()">Close</button>
            </div>
        `;
        
        document.body.appendChild(helpDialog);
    }
    
    /**
     * Setup navigation
     */
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                
                if (href && href !== '#') {
                    window.location.href = href;
                }
            });
        });
    }
    
    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    /**
     * Show error message
     */
    showError(message) {
        this.showNotification(message, 'error');
    }
    
    /**
     * Get application state for debugging
     */
    getDebugInfo() {
        return {
            initialized: this.isInitialized,
            mode: this.currentMode,
            physics: this.physics.getState(),
            controls: this.controls ? {
                running: this.controls.isRunning,
                dragging: this.controls.isDragging
            } : null,
            trajectoryLength: this.physics.trajectory.length,
            energyHistoryLength: this.physics.energyHistory.length
        };
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.pendulumApp = new DoublePendulumApp();
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.pendulumApp && window.pendulumApp.visualization) {
        const canvas = document.getElementById('pendulum-canvas');
        const container = canvas.parentElement;
        const rect = container.getBoundingClientRect();
        
        canvas.width = rect.width;
        canvas.height = rect.height;
        
        window.pendulumApp.visualization.width = rect.width;
        window.pendulumApp.visualization.height = rect.height;
        window.pendulumApp.visualization.centerX = rect.width / 2;
        window.pendulumApp.visualization.centerY = rect.height / 4;
    }
});

// Global functions for debugging
window.getPendulumState = () => {
    if (window.pendulumApp) {
        return window.pendulumApp.physics.getState();
    }
};

window.resetPendulum = () => {
    if (window.pendulumApp && window.pendulumApp.controls) {
        window.pendulumApp.controls.resetSimulation();
    }
};

window.toggleSimulation = () => {
    if (window.pendulumApp && window.pendulumApp.controls) {
        window.pendulumApp.controls.toggleSimulation();
    }
};

window.setMode = (mode) => {
    if (window.pendulumApp && window.pendulumApp.controls) {
        window.pendulumApp.controls.setMode(mode);
    }
};

window.loadPreset = (preset) => {
    if (window.pendulumApp) {
        window.pendulumApp.loadPreset(preset);
    }
};

window.exportData = () => {
    if (window.pendulumApp) {
        window.pendulumApp.exportData();
    }
};

window.getDebugInfo = () => {
    if (window.pendulumApp) {
        return window.pendulumApp.getDebugInfo();
    }
};