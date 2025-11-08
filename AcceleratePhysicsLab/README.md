#Double Pendulum Physics Laboratory

An interactive web-based physics simulation featuring accurate 2D and 3D double pendulum dynamics with real-time visualization and analysis tools.

![Double Pendulum](https://img.shields.io/badge/Physics-Simulation-c17817)
![License](https://img.shields.io/badge/License-MIT-green)

 🎯 Overview

The Double Pendulum Physics Laboratory is a comprehensive web application that simulates the chaotic motion of double pendulums using accurate Lagrangian mechanics. The project features both 2D and 3D visualizations with real-time physics charts, parametric analysis, and interactive controls.

 ✨ Features

 2D Simulation (`DoublePend.html`)
- Accurate Physics Engine
  - Lagrangian mechanics-based equations of motion
  - 4th-order Runge-Kutta (RK4) numerical integration
  - Energy conservation tracking
  - Configurable air resistance and elastic forces

- Interactive Controls
  - Real-time parameter adjustment (masses, lengths, gravity)
  - Initial condition controls (angles, angular velocities)
  - Multiple preset configurations (Equal Mass, Heavy Bottom, Chaotic)
  - Simulation speed control (0.1× to 2.0×)

- Real-Time Visualization
  - P5.js-based canvas rendering
  - Trajectory trails
  - Velocity and force vector displays
  - Multiple visualization modes (Normal, Trace, Chaos, Slow Motion)

- Physics Charts (Collapsible Panel)
  - Energy vs Time (Total, Kinetic, Potential)
  - Phase Space diagrams (θ vs ω)
  - Angular Velocity tracking
  - 2D Trajectory plots
  - Powered by ECharts library

- Data Export
  - CSV export for analysis
  - JSON data export
  - Real-time state monitoring

 3D Simulation (`pendulum3d.html`)
- Accurate 3D Physics
  - Spherical coordinate system (θ, φ angles)
  - Proper coupling between pendulums in 3D space
  - RK4 integration for stability
  - Energy conservation

- 3D Visualization
  - Three.js WebGL rendering
  - Real-time 3D trail effects
  - Interactive camera controls (mouse drag, zoom)
  - Shadows and lighting effects

- 3D Controls
  - Polar and azimuthal angle controls
  - Independent control for both pendulums
  - Damping and gravity adjustment
  - Randomize initial conditions

 Mathematical Documentation (`equations.html`)
- Complete Physics Derivation
  - Lagrangian mechanics equations
  - Equations of motion
  - Energy formulas (kinetic, potential, total)
  - Angular momentum
  - Phase space analysis
  - Poincaré sections
  - Lyapunov exponents
  - Conservation laws
  - Numerical methods (RK4)

- LaTeX Rendering
  - KaTeX for beautiful mathematical notation
  - Step-by-step derivations
  - Clear explanations of each concept

 Analysis Page (`analysis.html`)
- Parametric Studies
  - Mass ratio analysis
  - Length ratio analysis
  - Duration-based studies

- Statistics Dashboard
  - Energy conservation error tracking
  - Average velocity calculations
  - Maximum angle tracking
  - Period estimation

- Analysis Charts
  - Energy conservation plots
  - Phase space diagrams
  - Angular position tracking
  - Poincaré sections

- Quick Presets
  - Equal Mass configuration
  - Heavy Bottom configuration
  - Chaotic configuration

- Data Export
  - CSV format
  - JSON format

 🚀 Getting Started

 Installation

1. Clone the repository:
```bash
git clone https://github.com/Guitar-Fan/AcceleratePhysicsLab.git
cd AcceleratePhysicsLab
```

2. Open in a web browser:
```bash
 Simply open DoublePend.html in your browser
 Or use a local server (recommended):
python -m http.server 8000
 Then navigate to http://localhost:8000/DoublePend.html
```

 Quick Start

1. 2D Simulation: Open `DoublePend.html` in your browser
   - Press Space to play/pause
   - Press R to reset
   - Adjust sliders to change parameters
   - Click preset buttons for interesting configurations

2. 3D Simulation: Navigate to the "3D Simulation" tab
   - Drag with mouse to rotate camera
   - Scroll to zoom
   - Adjust θ (polar) and φ (azimuthal) angles
   - Watch the 3D trajectory trails

3. View Equations: Click "Equations" tab for mathematical documentation

4. Run Analysis: Click "Analysis" tab for parametric studies

 🎮 Controls

 Keyboard Shortcuts (2D Simulation)
- `Space` - Play/Pause simulation
- `R` - Reset to initial conditions

 Mouse Controls (3D Simulation)
- `Left Click + Drag` - Rotate camera
- `Scroll Wheel` - Zoom in/out

 📊 Physics Implementation

 2D Double Pendulum
The 2D simulation uses Lagrangian mechanics to derive equations of motion:

State Variables:
- θ₁, θ₂: Angular positions
- ω₁, ω₂: Angular velocities

Key Features:
- Accurate coupling terms between pendulums
- Energy conservation (when damping = 0)
- Singularity handling for extreme angles
- Elastic force correction for full rotations

 3D Double Pendulum
The 3D simulation extends to spherical coordinates:

State Variables:
- θ₁, θ₂: Polar angles (from vertical)
- φ₁, φ₂: Azimuthal angles
- ω_θ₁, ω_θ₂, ω_φ₁, ω_φ₂: Angular velocities

Key Features:
- Proper 3D coupling (second pendulum's pivot moves)
- Minimal singularity protection
- Full 3D motion representation

 🛠️ Technology Stack

- Frontend: Pure HTML5, CSS3, JavaScript (ES6+)
- Physics Engine: Custom JavaScript implementation
- 2D Graphics: P5.js
- 3D Graphics: Three.js (WebGL)
- Charts: ECharts
- Math Rendering: KaTeX
- Animations: Anime.js

 📁 Project Structure

```
AcceleratePhysicsLab/
├── DoublePend.html        Main 2D simulation page
├── pendulum3d.html        3D simulation page
├── equations.html         Mathematical documentation
├── analysis.html          Analysis and parametric studies
├── physics.js             Core physics engine (2D)
├── visualization.js       P5.js rendering (2D)
├── charts.js              ECharts integration
├── controls.js            UI controls and interactions
├── main.js                Application initialization
└── README.md              This file
```

 🎨 Customization

 Changing Colors
Edit CSS variables in any HTML file:
```css
:root {
    --primary-bg: 1a1d29;
    --accent-color: c17817;
    --text-primary: f8f6f0;
}
```

 Adding Presets
Edit the presets in `controls.js`:
```javascript
presets: [
    { name: 'Your Preset', theta1: 90, theta2: 45, ... }
]
```

 🐛 Known Issues

- None currently! The physics has been thoroughly debugged and tested.

 🔬 Physics Accuracy

This simulation implements:
- ✅ Correct Lagrangian-derived equations
- ✅ Energy conservation (verified with charts)
- ✅ Proper coupling between pendulums
- ✅ Accurate numerical integration (RK4)
- ✅ Singularity handling
- ✅ 3D spherical pendulum dynamics

 📖 Educational Use

This simulation is perfect for:
- Physics education (classical mechanics)
- Chaos theory demonstrations
- Numerical methods teaching
- Web development examples
- Interactive learning

 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

 👨‍💻 Author

Created by Guitar-Fan

 🙏 Acknowledgments

- Inspired by classic double pendulum demonstrations
- Physics equations from classical mechanics texts
- Visualization techniques from modern web standards

---

Enjoy exploring the fascinating world of chaotic dynamics! 🎭
