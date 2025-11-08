/**
 * Practical Double Pendulum Applications
 * Using Three.js for 3D rendering and Ammo.js for realistic physics
 * Demonstrates real-world applications of double pendulum systems
 */

class PracticalPendulumLab {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.world = null;
        this.rigidBodies = [];
        
        // Pendulum components
        this.pendulumSystem = {
            pivot: null,
            upperArm: null,
            lowerArm: null,
            upperMass: null,
            lowerMass: null,
            jointConstraint1: null,
            jointConstraint2: null
        };
        
        // Current application
        this.currentApp = 'golf';
        this.isPlaying = false;
        this.animationId = null;
        
        // Physics parameters
        this.params = {
            mass1: 2.0,
            mass2: 1.0,
            length1: 1.2,
            length2: 1.0,
            damping: 0.1,
            gravity: -9.81,
            
            // Application-specific parameters
            appParams: {
                swingForce: 50,
                timing: 1.0,
                efficiency: 0
            }
        };
        
        // Data tracking
        this.dataHistory = {
            time: [],
            energy: [],
            angle1: [],
            angle2: [],
            velocity1: [],
            velocity2: [],
            efficiency: []
        };
        
        this.initializePhysics();
        this.initializeThreeJS();
        this.setupApplications();
        this.setupControls();
        this.setupEventListeners();
    }
    
    /**
     * Initialize Ammo.js physics world
     */
    async initializePhysics() {
        // Wait for Ammo.js to load
        await Ammo();
        
        // Create collision configuration
        const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
        const dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
        const overlappingPairCache = new Ammo.btDbvtBroadphase();
        const solver = new Ammo.btSequentialImpulseConstraintSolver();
        
        // Create physics world
        this.world = new Ammo.btDiscreteDynamicsWorld(
            dispatcher, overlappingPairCache, solver, collisionConfiguration
        );
        this.world.setGravity(new Ammo.btVector3(0, this.params.gravity, 0));
        
        console.log('Physics world initialized');
    }
    
    /**
     * Initialize Three.js scene, camera, and renderer
     */
    initializeThreeJS() {
        const container = document.getElementById('threejs-container');
        
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0e1a);
        this.scene.fog = new THREE.Fog(0x0a0e1a, 10, 50);
        
        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            60, 
            container.offsetWidth / container.offsetHeight, 
            0.1, 
            1000
        );
        this.camera.position.set(5, 3, 5);
        
        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(container.offsetWidth, container.offsetHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.physicallyCorrectLights = true;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        
        // Clear loading message and add renderer
        container.innerHTML = '';
        container.appendChild(this.renderer.domElement);
        
        // Controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxDistance = 20;
        this.controls.minDistance = 2;
        
        // Lighting setup
        this.setupLighting();
        
        // Create pendulum system
        this.createPendulumSystem();
        
        // Start render loop
        this.animate();
        
        console.log('Three.js initialized');
    }
    
    /**
     * Setup realistic lighting for the scene
     */
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);
        
        // Main directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -10;
        directionalLight.shadow.camera.right = 10;
        directionalLight.shadow.camera.top = 10;
        directionalLight.shadow.camera.bottom = -10;
        this.scene.add(directionalLight);
        
        // Accent lighting
        const accentLight = new THREE.PointLight(0x00d4ff, 0.5);
        accentLight.position.set(-5, 5, 5);
        this.scene.add(accentLight);
        
        // Environment
        const geometry = new THREE.PlaneGeometry(20, 20);
        const material = new THREE.MeshLambertMaterial({ 
            color: 0x1a2332,
            transparent: true,
            opacity: 0.3
        });
        const ground = new THREE.Mesh(geometry, material);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -3;
        ground.receiveShadow = true;
        this.scene.add(ground);
    }
    
    /**
     * Create the double pendulum system with physics
     */
    createPendulumSystem() {
        // Materials
        const pivotMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x00d4ff,
            shininess: 100,
            specular: 0x222222
        });
        
        const armMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xff6b6b,
            shininess: 30
        });
        
        const massMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x4ecdc4,
            shininess: 50
        });
        
        // Pivot point
        const pivotGeometry = new THREE.SphereGeometry(0.1);
        this.pendulumSystem.pivot = new THREE.Mesh(pivotGeometry, pivotMaterial);
        this.pendulumSystem.pivot.position.set(0, 2, 0);
        this.pendulumSystem.pivot.castShadow = true;
        this.scene.add(this.pendulumSystem.pivot);
        
        // Upper arm
        const upperArmGeometry = new THREE.CylinderGeometry(0.02, 0.02, this.params.length1);
        this.pendulumSystem.upperArm = new THREE.Mesh(upperArmGeometry, armMaterial);
        this.pendulumSystem.upperArm.position.set(0, 2 - this.params.length1/2, 0);
        this.pendulumSystem.upperArm.castShadow = true;
        this.scene.add(this.pendulumSystem.upperArm);
        
        // Upper mass
        const upperMassGeometry = new THREE.SphereGeometry(Math.pow(this.params.mass1/4, 1/3) * 0.2);
        this.pendulumSystem.upperMass = new THREE.Mesh(upperMassGeometry, massMaterial);
        this.pendulumSystem.upperMass.position.set(0, 2 - this.params.length1, 0);
        this.pendulumSystem.upperMass.castShadow = true;
        this.scene.add(this.pendulumSystem.upperMass);
        
        // Lower arm
        const lowerArmGeometry = new THREE.CylinderGeometry(0.015, 0.015, this.params.length2);
        this.pendulumSystem.lowerArm = new THREE.Mesh(lowerArmGeometry, armMaterial);
        this.pendulumSystem.lowerArm.position.set(0, 2 - this.params.length1 - this.params.length2/2, 0);
        this.pendulumSystem.lowerArm.castShadow = true;
        this.scene.add(this.pendulumSystem.lowerArm);
        
        // Lower mass
        const lowerMassGeometry = new THREE.SphereGeometry(Math.pow(this.params.mass2/4, 1/3) * 0.2);
        this.pendulumSystem.lowerMass = new THREE.Mesh(lowerMassGeometry, massMaterial);
        this.pendulumSystem.lowerMass.position.set(0, 2 - this.params.length1 - this.params.length2, 0);
        this.pendulumSystem.lowerMass.castShadow = true;
        this.scene.add(this.pendulumSystem.lowerMass);
        
        // Create physics bodies
        this.createPhysicsBodies();
        
        // Add application-specific visual elements
        this.updateApplicationVisuals();
    }
    
    /**
     * Create Ammo.js physics bodies for the pendulum
     */
    createPhysicsBodies() {
        // Clear existing bodies
        this.rigidBodies.forEach(body => {
            this.world.removeRigidBody(body);
        });
        this.rigidBodies = [];
        
        const transform = new Ammo.btTransform();
        
        // Upper arm physics body
        const upperArmShape = new Ammo.btCylinderShape(
            new Ammo.btVector3(0.02, this.params.length1/2, 0.02)
        );
        const upperArmMass = this.params.mass1;
        const upperArmInertia = new Ammo.btVector3(0, 0, 0);
        upperArmShape.calculateLocalInertia(upperArmMass, upperArmInertia);
        
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(0, 2 - this.params.length1/2, 0));
        const upperArmMotionState = new Ammo.btDefaultMotionState(transform);
        
        const upperArmBodyInfo = new Ammo.btRigidBodyConstructionInfo(
            upperArmMass, upperArmMotionState, upperArmShape, upperArmInertia
        );
        const upperArmBody = new Ammo.btRigidBody(upperArmBodyInfo);
        upperArmBody.setDamping(this.params.damping, this.params.damping);
        this.world.addRigidBody(upperArmBody);
        this.rigidBodies.push(upperArmBody);
        
        // Store reference for updates
        this.pendulumSystem.upperArm.userData.physicsBody = upperArmBody;
        
        // Lower arm physics body
        const lowerArmShape = new Ammo.btCylinderShape(
            new Ammo.btVector3(0.015, this.params.length2/2, 0.015)
        );
        const lowerArmMass = this.params.mass2;
        const lowerArmInertia = new Ammo.btVector3(0, 0, 0);
        lowerArmShape.calculateLocalInertia(lowerArmMass, lowerArmInertia);
        
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(0, 2 - this.params.length1 - this.params.length2/2, 0));
        const lowerArmMotionState = new Ammo.btDefaultMotionState(transform);
        
        const lowerArmBodyInfo = new Ammo.btRigidBodyConstructionInfo(
            lowerArmMass, lowerArmMotionState, lowerArmShape, lowerArmInertia
        );
        const lowerArmBody = new Ammo.btRigidBody(lowerArmBodyInfo);
        lowerArmBody.setDamping(this.params.damping, this.params.damping);
        this.world.addRigidBody(lowerArmBody);
        this.rigidBodies.push(lowerArmBody);
        
        // Store reference for updates
        this.pendulumSystem.lowerArm.userData.physicsBody = lowerArmBody;
        
        // Create joint constraints
        this.createJointConstraints(upperArmBody, lowerArmBody);
    }
    
    /**
     * Create joint constraints for the pendulum
     */
    createJointConstraints(upperBody, lowerBody) {
        // Upper joint (pivot to upper arm)
        const pivotInUpper = new Ammo.btVector3(0, this.params.length1/2, 0);
        const pivotInWorld = new Ammo.btVector3(0, 2, 0);
        
        // Point-to-point constraint for upper joint
        this.pendulumSystem.jointConstraint1 = new Ammo.btPoint2PointConstraint(
            upperBody, pivotInUpper
        );
        this.world.addConstraint(this.pendulumSystem.jointConstraint1, true);
        
        // Lower joint (upper arm to lower arm)
        const pivotInUpper2 = new Ammo.btVector3(0, -this.params.length1/2, 0);
        const pivotInLower = new Ammo.btVector3(0, this.params.length2/2, 0);
        
        this.pendulumSystem.jointConstraint2 = new Ammo.btPoint2PointConstraint(
            upperBody, lowerBody, pivotInUpper2, pivotInLower
        );
        this.world.addConstraint(this.pendulumSystem.jointConstraint2, true);
    }
    
    /**
     * Setup different application configurations
     */
    setupApplications() {
        this.applications = {
            golf: {
                title: "Golf Swing Dynamics",
                description: "This simulation models the golf swing as a double pendulum system, where the golfer's body and arms form the first pendulum, and the club forms the second. The chaotic nature helps explain timing sensitivity and power generation.",
                params: {
                    mass1: 70, // Golfer's effective mass
                    mass2: 0.45, // Golf club mass
                    length1: 0.8, // Arm length
                    length2: 1.1, // Club length
                    damping: 0.05
                },
                visualElements: this.createGolfVisuals.bind(this),
                analysis: this.analyzeGolfSwing.bind(this)
            },
            
            tennis: {
                title: "Tennis Racket Physics",
                description: "Study the arm-racket system as a double pendulum for optimal power and accuracy in tennis strokes. The model helps understand timing, power transfer, and sweet spot mechanics.",
                params: {
                    mass1: 4, // Arm effective mass
                    mass2: 0.35, // Racket mass
                    length1: 0.6, // Arm length
                    length2: 0.7, // Racket length
                    damping: 0.08
                },
                visualElements: this.createTennisVisuals.bind(this),
                analysis: this.analyzeTennisSwing.bind(this)
            },
            
            robotics: {
                title: "Robot Arm Control",
                description: "Simulate a 2-DOF robotic manipulator with joint dynamics and trajectory planning. Demonstrates control challenges and optimization in robotics applications.",
                params: {
                    mass1: 5, // Upper link mass
                    mass2: 3, // Lower link mass
                    length1: 1.0, // Upper link length
                    length2: 0.8, // Lower link length
                    damping: 0.2
                },
                visualElements: this.createRobotVisuals.bind(this),
                analysis: this.analyzeRobotMotion.bind(this)
            },
            
            walking: {
                title: "Human Gait Analysis",
                description: "Model leg motion during walking as a double pendulum for biomechanical studies. Helps understand energy efficiency and pathological gait patterns.",
                params: {
                    mass1: 15, // Thigh mass
                    mass2: 8, // Shank+foot mass
                    length1: 0.45, // Thigh length
                    length2: 0.4, // Shank length
                    damping: 0.15
                },
                visualElements: this.createWalkingVisuals.bind(this),
                analysis: this.analyzeGait.bind(this)
            },
            
            energy: {
                title: "Energy Harvesting",
                description: "Demonstrate energy capture from chaotic pendulum motion for renewable systems. Shows how unpredictable motion can be converted to useful electrical energy.",
                params: {
                    mass1: 2, // Primary mass
                    mass2: 1.5, // Secondary mass with generator
                    length1: 1.2, // Primary arm
                    length2: 0.8, // Secondary arm
                    damping: 0.05
                },
                visualElements: this.createEnergyVisuals.bind(this),
                analysis: this.analyzeEnergyHarvest.bind(this)
            },
            
            seismic: {
                title: "Seismic Damping",
                description: "Building vibration analysis and earthquake resistance design principles using double pendulum dampers for structural protection.",
                params: {
                    mass1: 1000, // Building effective mass
                    mass2: 100, // Damper mass
                    length1: 2.0, // Building height scale
                    length2: 1.0, // Damper length
                    damping: 0.3
                },
                visualElements: this.createSeismicVisuals.bind(this),
                analysis: this.analyzeSeismicResponse.bind(this)
            },
            
            chaos: {
                title: "Chaos Theory Demo",
                description: "Educational demonstration of sensitive dependence on initial conditions. Shows how tiny changes lead to dramatically different outcomes in chaotic systems.",
                params: {
                    mass1: 1, // Equal masses for classic chaos
                    mass2: 1,
                    length1: 1, // Equal lengths
                    length2: 1,
                    damping: 0.01 // Minimal damping for chaos
                },
                visualElements: this.createChaosVisuals.bind(this),
                analysis: this.analyzeChaos.bind(this)
            }
        };
    }
    
    /**
     * Setup UI controls and event listeners
     */
    setupControls() {
        // Parameter sliders
        ['mass1', 'mass2', 'length1', 'length2', 'damping'].forEach(param => {
            const slider = document.getElementById(`${param}-slider`);
            const valueDisplay = document.getElementById(`${param}-value`);
            
            if (slider && valueDisplay) {
                slider.addEventListener('input', (e) => {
                    this.params[param] = parseFloat(e.target.value);
                    valueDisplay.textContent = e.target.value;
                    this.updatePendulumSystem();
                });
            }
        });
        
        // Control buttons
        document.getElementById('play-pause-btn').addEventListener('click', () => {
            this.toggleSimulation();
        });
        
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetSimulation();
        });
        
        document.getElementById('record-btn').addEventListener('click', () => {
            this.toggleRecording();
        });
        
        document.getElementById('optimize-btn').addEventListener('click', () => {
            this.optimizeParameters();
        });
        
        document.getElementById('analyze-btn').addEventListener('click', () => {
            this.analyzeCurrentApplication();
        });
    }
    
    /**
     * Setup event listeners for application switching
     */
    setupEventListeners() {
        // Application cards
        document.querySelectorAll('.application-card').forEach(card => {
            card.addEventListener('click', () => {
                this.switchApplication(card.dataset.app);
                
                // Update active state
                document.querySelectorAll('.application-card').forEach(c => 
                    c.classList.remove('active')
                );
                card.classList.add('active');
            });
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            const container = document.getElementById('threejs-container');
            this.camera.aspect = container.offsetWidth / container.offsetHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(container.offsetWidth, container.offsetHeight);
        });
    }
    
    /**
     * Switch to different application
     */
    switchApplication(appName) {
        if (this.applications[appName]) {
            this.currentApp = appName;
            const app = this.applications[appName];
            
            // Update UI
            document.getElementById('overlay-title').textContent = app.title;
            document.getElementById('overlay-description').textContent = app.description;
            
            // Update parameters
            Object.assign(this.params, app.params);
            this.updateParameterUI();
            this.updatePendulumSystem();
            
            // Update visuals
            if (app.visualElements) {
                app.visualElements();
            }
            
            // Reset simulation
            this.resetSimulation();
        }
    }
    
    /**
     * Update parameter UI to match current values
     */
    updateParameterUI() {
        ['mass1', 'mass2', 'length1', 'length2', 'damping'].forEach(param => {
            const slider = document.getElementById(`${param}-slider`);
            const valueDisplay = document.getElementById(`${param}-value`);
            
            if (slider && valueDisplay) {
                slider.value = this.params[param];
                valueDisplay.textContent = this.params[param].toFixed(1);
            }
        });
    }
    
    /**
     * Update the pendulum system with new parameters
     */
    updatePendulumSystem() {
        // Remove existing physics bodies
        if (this.rigidBodies.length > 0) {
            this.rigidBodies.forEach(body => {
                this.world.removeRigidBody(body);
            });
            this.rigidBodies = [];
        }
        
        // Remove constraints
        if (this.pendulumSystem.jointConstraint1) {
            this.world.removeConstraint(this.pendulumSystem.jointConstraint1);
        }
        if (this.pendulumSystem.jointConstraint2) {
            this.world.removeConstraint(this.pendulumSystem.jointConstraint2);
        }
        
        // Update visual geometry
        this.updateVisualGeometry();
        
        // Recreate physics bodies
        this.createPhysicsBodies();
    }
    
    /**
     * Update visual geometry based on parameters
     */
    updateVisualGeometry() {
        // Update arm lengths
        this.pendulumSystem.upperArm.geometry.dispose();
        this.pendulumSystem.upperArm.geometry = new THREE.CylinderGeometry(0.02, 0.02, this.params.length1);
        this.pendulumSystem.upperArm.position.set(0, 2 - this.params.length1/2, 0);
        
        this.pendulumSystem.lowerArm.geometry.dispose();
        this.pendulumSystem.lowerArm.geometry = new THREE.CylinderGeometry(0.015, 0.015, this.params.length2);
        this.pendulumSystem.lowerArm.position.set(0, 2 - this.params.length1 - this.params.length2/2, 0);
        
        // Update mass sizes based on mass values
        const upperRadius = Math.pow(this.params.mass1/4, 1/3) * 0.2;
        const lowerRadius = Math.pow(this.params.mass2/4, 1/3) * 0.2;
        
        this.pendulumSystem.upperMass.geometry.dispose();
        this.pendulumSystem.upperMass.geometry = new THREE.SphereGeometry(upperRadius);
        this.pendulumSystem.upperMass.position.set(0, 2 - this.params.length1, 0);
        
        this.pendulumSystem.lowerMass.geometry.dispose();
        this.pendulumSystem.lowerMass.geometry = new THREE.SphereGeometry(lowerRadius);
        this.pendulumSystem.lowerMass.position.set(0, 2 - this.params.length1 - this.params.length2, 0);
    }
    
    /**
     * Toggle simulation play/pause
     */
    toggleSimulation() {
        this.isPlaying = !this.isPlaying;
        const btn = document.getElementById('play-pause-btn');
        btn.textContent = this.isPlaying ? '⏸️ Pause' : '▶️ Play';
        
        if (this.isPlaying) {
            // Apply initial force based on application
            this.applyInitialForce();
        }
    }
    
    /**
     * Reset simulation to initial state
     */
    resetSimulation() {
        this.isPlaying = false;
        document.getElementById('play-pause-btn').textContent = '▶️ Play';
        
        // Reset physics bodies to initial positions
        if (this.rigidBodies.length > 0) {
            const transform = new Ammo.btTransform();
            
            // Reset upper arm
            const upperBody = this.rigidBodies[0];
            transform.setIdentity();
            transform.setOrigin(new Ammo.btVector3(0, 2 - this.params.length1/2, 0));
            upperBody.setWorldTransform(transform);
            upperBody.setLinearVelocity(new Ammo.btVector3(0, 0, 0));
            upperBody.setAngularVelocity(new Ammo.btVector3(0, 0, 0));
            
            // Reset lower arm
            const lowerBody = this.rigidBodies[1];
            transform.setIdentity();
            transform.setOrigin(new Ammo.btVector3(0, 2 - this.params.length1 - this.params.length2/2, 0));
            lowerBody.setWorldTransform(transform);
            lowerBody.setLinearVelocity(new Ammo.btVector3(0, 0, 0));
            lowerBody.setAngularVelocity(new Ammo.btVector3(0, 0, 0));
        }
        
        // Clear data history
        this.dataHistory = {
            time: [],
            energy: [],
            angle1: [],
            angle2: [],
            velocity1: [],
            velocity2: [],
            efficiency: []
        };
        
        this.updateDataDisplays();
    }
    
    /**
     * Apply initial force based on current application
     */
    applyInitialForce() {
        if (this.rigidBodies.length === 0) return;
        
        const app = this.applications[this.currentApp];
        let force = new Ammo.btVector3();
        
        switch (this.currentApp) {
            case 'golf':
                // Rotational impulse for golf swing
                force = new Ammo.btVector3(0, 0, 20);
                this.rigidBodies[0].applyTorqueImpulse(force);
                break;
                
            case 'tennis':
                // Forward and rotational impulse
                force = new Ammo.btVector3(5, 0, 15);
                this.rigidBodies[0].applyCentralImpulse(new Ammo.btVector3(5, 0, 0));
                this.rigidBodies[0].applyTorqueImpulse(force);
                break;
                
            case 'robotics':
                // Controlled movement to target
                force = new Ammo.btVector3(0, 0, 5);
                this.rigidBodies[0].applyTorqueImpulse(force);
                setTimeout(() => {
                    if (this.rigidBodies[1]) {
                        force = new Ammo.btVector3(0, 0, -8);
                        this.rigidBodies[1].applyTorqueImpulse(force);
                    }
                }, 500);
                break;
                
            case 'walking':
                // Periodic walking motion
                this.startWalkingCycle();
                break;
                
            case 'energy':
                // Random chaotic motion
                force = new Ammo.btVector3(
                    (Math.random() - 0.5) * 10,
                    (Math.random() - 0.5) * 10,
                    (Math.random() - 0.5) * 20
                );
                this.rigidBodies[0].applyTorqueImpulse(force);
                break;
                
            case 'seismic':
                // Ground motion simulation
                this.simulateEarthquake();
                break;
                
            case 'chaos':
                // Small initial displacement
                force = new Ammo.btVector3(0, 0, 1);
                this.rigidBodies[0].applyTorqueImpulse(force);
                break;
        }
    }
    
    /**
     * Start walking cycle simulation
     */
    startWalkingCycle() {
        let phase = 0;
        const walkingInterval = setInterval(() => {
            if (!this.isPlaying) {
                clearInterval(walkingInterval);
                return;
            }
            
            phase += 0.1;
            const hipTorque = Math.sin(phase) * 5;
            const kneeTorque = Math.sin(phase + Math.PI/4) * 3;
            
            if (this.rigidBodies[0]) {
                this.rigidBodies[0].applyTorque(new Ammo.btVector3(0, 0, hipTorque));
            }
            if (this.rigidBodies[1]) {
                this.rigidBodies[1].applyTorque(new Ammo.btVector3(0, 0, kneeTorque));
            }
        }, 50);
    }
    
    /**
     * Simulate earthquake ground motion
     */
    simulateEarthquake() {
        let time = 0;
        const earthquakeInterval = setInterval(() => {
            if (!this.isPlaying) {
                clearInterval(earthquakeInterval);
                return;
            }
            
            time += 0.05;
            const amplitude = Math.exp(-time * 0.1); // Decaying amplitude
            const frequency1 = 2 + Math.sin(time * 0.5);
            const frequency2 = 5 + Math.cos(time * 0.3);
            
            const groundAccel = amplitude * (
                Math.sin(frequency1 * time) + 
                0.5 * Math.sin(frequency2 * time)
            );
            
            // Apply ground motion to the system
            if (this.rigidBodies[0]) {
                const force = new Ammo.btVector3(groundAccel * 100, 0, 0);
                this.rigidBodies[0].applyCentralForce(force);
            }
        }, 20);
    }
    
    /**
     * Main animation loop
     */
    animate() {
        this.animationId = requestAnimationFrame(this.animate.bind(this));
        
        // Update physics
        if (this.world && this.isPlaying) {
            this.world.stepSimulation(1/60, 10);
            this.updateVisualFromPhysics();
            this.collectData();
            this.updateDataDisplays();
        }
        
        // Update controls
        this.controls.update();
        
        // Render
        this.renderer.render(this.scene, this.camera);
    }
    
    /**
     * Update visual objects from physics simulation
     */
    updateVisualFromPhysics() {
        this.rigidBodies.forEach((body, index) => {
            const transform = body.getWorldTransform();
            const origin = transform.getOrigin();
            const rotation = transform.getRotation();
            
            let mesh;
            if (index === 0) { // Upper arm
                mesh = this.pendulumSystem.upperArm;
                // Update connected mass position
                this.pendulumSystem.upperMass.position.set(
                    origin.x(),
                    origin.y() - this.params.length1/2,
                    origin.z()
                );
            } else if (index === 1) { // Lower arm
                mesh = this.pendulumSystem.lowerArm;
                // Update connected mass position
                this.pendulumSystem.lowerMass.position.set(
                    origin.x(),
                    origin.y() - this.params.length2/2,
                    origin.z()
                );
            }
            
            if (mesh) {
                mesh.position.set(origin.x(), origin.y(), origin.z());
                mesh.quaternion.set(rotation.x(), rotation.y(), rotation.z(), rotation.w());
            }
        });
    }
    
    /**
     * Collect data for analysis
     */
    collectData() {
        if (this.rigidBodies.length < 2) return;
        
        const currentTime = this.dataHistory.time.length * (1/60);
        this.dataHistory.time.push(currentTime);
        
        // Calculate energy
        let totalEnergy = 0;
        this.rigidBodies.forEach((body, index) => {
            const mass = index === 0 ? this.params.mass1 : this.params.mass2;
            const velocity = body.getLinearVelocity();
            const angVelocity = body.getAngularVelocity();
            const position = body.getWorldTransform().getOrigin();
            
            // Kinetic energy
            const linearKE = 0.5 * mass * (
                velocity.x() * velocity.x() + 
                velocity.y() * velocity.y() + 
                velocity.z() * velocity.z()
            );
            
            const rotationalKE = 0.5 * mass * 0.1 * ( // Simplified moment of inertia
                angVelocity.x() * angVelocity.x() + 
                angVelocity.y() * angVelocity.y() + 
                angVelocity.z() * angVelocity.z()
            );
            
            // Potential energy
            const potentialE = mass * Math.abs(this.params.gravity) * (position.y() + 3); // Offset by ground level
            
            totalEnergy += linearKE + rotationalKE + potentialE;
        });
        
        this.dataHistory.energy.push(totalEnergy);
        
        // Calculate efficiency for current application
        const efficiency = this.calculateEfficiency();
        this.dataHistory.efficiency.push(efficiency);
        
        // Limit data history length
        const maxLength = 1000;
        if (this.dataHistory.time.length > maxLength) {
            Object.keys(this.dataHistory).forEach(key => {
                this.dataHistory[key] = this.dataHistory[key].slice(-maxLength);
            });
        }
    }
    
    /**
     * Calculate efficiency based on current application
     */
    calculateEfficiency() {
        switch (this.currentApp) {
            case 'golf':
                return this.calculateGolfEfficiency();
            case 'tennis':
                return this.calculateTennisEfficiency();
            case 'energy':
                return this.calculateEnergyHarvestEfficiency();
            default:
                return 0;
        }
    }
    
    /**
     * Calculate golf swing efficiency
     */
    calculateGolfEfficiency() {
        if (this.rigidBodies.length < 2) return 0;
        
        const clubVelocity = this.rigidBodies[1].getLinearVelocity();
        const clubSpeed = Math.sqrt(
            clubVelocity.x() * clubVelocity.x() + 
            clubVelocity.y() * clubVelocity.y() + 
            clubVelocity.z() * clubVelocity.z()
        );
        
        // Efficiency based on club head speed (simplified)
        const maxSpeed = 50; // m/s
        return Math.min(100, (clubSpeed / maxSpeed) * 100);
    }
    
    /**
     * Calculate tennis efficiency
     */
    calculateTennisEfficiency() {
        if (this.rigidBodies.length < 2) return 0;
        
        const racketAngVel = this.rigidBodies[1].getAngularVelocity();
        const angSpeed = Math.sqrt(
            racketAngVel.x() * racketAngVel.x() + 
            racketAngVel.y() * racketAngVel.y() + 
            racketAngVel.z() * racketAngVel.z()
        );
        
        const maxAngSpeed = 20; // rad/s
        return Math.min(100, (angSpeed / maxAngSpeed) * 100);
    }
    
    /**
     * Calculate energy harvesting efficiency
     */
    calculateEnergyHarvestEfficiency() {
        if (this.dataHistory.energy.length < 10) return 0;
        
        const recentEnergies = this.dataHistory.energy.slice(-10);
        const energyVariation = Math.max(...recentEnergies) - Math.min(...recentEnergies);
        
        // More variation = better for energy harvesting
        const maxVariation = 100;
        return Math.min(100, (energyVariation / maxVariation) * 100);
    }
    
    /**
     * Update real-time data displays
     */
    updateDataDisplays() {
        const energyDisplay = document.getElementById('energy-display');
        const velocityDisplay = document.getElementById('velocity-display');
        const efficiencyDisplay = document.getElementById('efficiency-display');
        
        if (this.dataHistory.energy.length > 0) {
            const latestEnergy = this.dataHistory.energy[this.dataHistory.energy.length - 1];
            energyDisplay.textContent = latestEnergy.toFixed(2);
        }
        
        if (this.rigidBodies.length > 0) {
            const angVel = this.rigidBodies[0].getAngularVelocity();
            const angSpeed = Math.sqrt(angVel.x() * angVel.x() + angVel.y() * angVel.y() + angVel.z() * angVel.z());
            velocityDisplay.textContent = angSpeed.toFixed(2);
        }
        
        if (this.dataHistory.efficiency.length > 0) {
            const latestEff = this.dataHistory.efficiency[this.dataHistory.efficiency.length - 1];
            efficiencyDisplay.textContent = latestEff.toFixed(1);
        }
    }
    
    /**
     * Application-specific visual elements
     */
    createGolfVisuals() {
        // Add golf ball and target
        const ballGeometry = new THREE.SphereGeometry(0.02);
        const ballMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
        const golfBall = new THREE.Mesh(ballGeometry, ballMaterial);
        golfBall.position.set(0, -2.5, 0);
        this.scene.add(golfBall);
        
        // Target flag
        const flagGeometry = new THREE.CylinderGeometry(0.01, 0.01, 1);
        const flagMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        const flag = new THREE.Mesh(flagGeometry, flagMaterial);
        flag.position.set(5, -2, 0);
        this.scene.add(flag);
    }
    
    createTennisVisuals() {
        // Tennis court lines
        const lineGeometry = new THREE.PlaneGeometry(0.1, 10);
        const lineMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
        const courtLine = new THREE.Mesh(lineGeometry, lineMaterial);
        courtLine.rotation.x = -Math.PI / 2;
        courtLine.position.set(3, -2.99, 0);
        this.scene.add(courtLine);
    }
    
    createRobotVisuals() {
        // Robot base
        const baseGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2);
        const baseMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
        const robotBase = new THREE.Mesh(baseGeometry, baseMaterial);
        robotBase.position.set(0, 1.9, 0);
        this.scene.add(robotBase);
        
        // Target sphere
        const targetGeometry = new THREE.SphereGeometry(0.1);
        const targetMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x00ff00,
            transparent: true,
            opacity: 0.5
        });
        const target = new THREE.Mesh(targetGeometry, targetMaterial);
        target.position.set(2, 0, 1);
        this.scene.add(target);
    }
    
    createWalkingVisuals() {
        // Ground path
        const pathGeometry = new THREE.PlaneGeometry(10, 1);
        const pathMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const walkPath = new THREE.Mesh(pathGeometry, pathMaterial);
        walkPath.rotation.x = -Math.PI / 2;
        walkPath.position.set(0, -2.99, 0);
        this.scene.add(walkPath);
    }
    
    createEnergyVisuals() {
        // Generator coils (simplified)
        const coilGeometry = new THREE.TorusGeometry(0.2, 0.05, 8, 16);
        const coilMaterial = new THREE.MeshPhongMaterial({ color: 0xffa500 });
        const coil = new THREE.Mesh(coilGeometry, coilMaterial);
        coil.position.set(0, 0, 0);
        this.scene.add(coil);
        
        // Energy indicators
        for (let i = 0; i < 5; i++) {
            const indicatorGeometry = new THREE.SphereGeometry(0.02);
            const indicatorMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x00ff00,
                emissive: 0x004400
            });
            const indicator = new THREE.Mesh(indicatorGeometry, indicatorMaterial);
            indicator.position.set(Math.random() * 2 - 1, Math.random() * 2, Math.random() * 2 - 1);
            this.scene.add(indicator);
        }
    }
    
    createSeismicVisuals() {
        // Building structure
        const buildingGeometry = new THREE.BoxGeometry(0.5, 3, 0.5);
        const buildingMaterial = new THREE.MeshPhongMaterial({ color: 0x606060 });
        const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
        building.position.set(0, 0.5, 0);
        this.scene.add(building);
        
        // Ground fault line
        const faultGeometry = new THREE.PlaneGeometry(10, 0.1);
        const faultMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
        const fault = new THREE.Mesh(faultGeometry, faultMaterial);
        fault.rotation.x = -Math.PI / 2;
        fault.position.set(0, -2.95, 0);
        this.scene.add(fault);
    }
    
    createChaosVisuals() {
        // Phase space visualization (simplified)
        const trailGeometry = new THREE.BufferGeometry();
        const trailMaterial = new THREE.LineBasicMaterial({ 
            color: 0x00d4ff,
            transparent: true,
            opacity: 0.6
        });
        const trail = new THREE.Line(trailGeometry, trailMaterial);
        this.scene.add(trail);
    }
    
    /**
     * Update application visuals based on current app
     */
    updateApplicationVisuals() {
        // Clear previous application-specific objects
        const objectsToRemove = [];
        this.scene.traverse((child) => {
            if (child.userData.applicationSpecific) {
                objectsToRemove.push(child);
            }
        });
        objectsToRemove.forEach(obj => this.scene.remove(obj));
        
        // Add new application visuals
        const app = this.applications[this.currentApp];
        if (app && app.visualElements) {
            app.visualElements();
        }
    }
    
    /**
     * Analyze current application
     */
    analyzeCurrentApplication() {
        const app = this.applications[this.currentApp];
        if (app && app.analysis) {
            app.analysis();
        }
    }
    
    /**
     * Application-specific analysis functions
     */
    analyzeGolfSwing() {
        console.log('Analyzing golf swing dynamics...');
        // Implement golf-specific analysis
    }
    
    analyzeTennisSwing() {
        console.log('Analyzing tennis swing mechanics...');
        // Implement tennis-specific analysis
    }
    
    analyzeRobotMotion() {
        console.log('Analyzing robot trajectory...');
        // Implement robotics analysis
    }
    
    analyzeGait() {
        console.log('Analyzing gait pattern...');
        // Implement gait analysis
    }
    
    analyzeEnergyHarvest() {
        console.log('Analyzing energy harvesting efficiency...');
        // Implement energy analysis
    }
    
    analyzeSeismicResponse() {
        console.log('Analyzing seismic response...');
        // Implement seismic analysis
    }
    
    analyzeChaos() {
        console.log('Analyzing chaotic behavior...');
        // Implement chaos analysis
    }
    
    /**
     * Optimize parameters for current application
     */
    optimizeParameters() {
        console.log(`Optimizing parameters for ${this.currentApp}...`);
        
        // Simple optimization based on application
        switch (this.currentApp) {
            case 'golf':
                // Optimize for maximum club head speed
                this.params.length2 = 1.2; // Longer club
                this.params.mass2 = 0.4;   // Lighter club
                break;
                
            case 'energy':
                // Optimize for chaos
                this.params.mass1 = this.params.mass2; // Equal masses
                this.params.length1 = this.params.length2; // Equal lengths
                this.params.damping = 0.01; // Low damping
                break;
                
            case 'seismic':
                // Optimize damping
                this.params.damping = 0.4;
                this.params.mass2 = this.params.mass1 * 0.1; // 10% mass ratio
                break;
        }
        
        this.updateParameterUI();
        this.updatePendulumSystem();
    }
    
    /**
     * Toggle recording functionality
     */
    toggleRecording() {
        // Placeholder for recording functionality
        const btn = document.getElementById('record-btn');
        if (btn.textContent.includes('Record')) {
            btn.textContent = '⏹️ Stop';
            console.log('Recording started...');
        } else {
            btn.textContent = '📹 Record';
            console.log('Recording stopped.');
        }
    }
}

// Initialize the application when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for Ammo.js to load
    setTimeout(() => {
        window.practicalPendulumLab = new PracticalPendulumLab();
    }, 1000);
});