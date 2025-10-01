# Physics Adventure 🚀

An interactive educational physics game where players help "The Escapist" understand fundamental physics laws through hands-on experimentation across different planetary environments.

## 🎮 Game Overview

**Story**: The Escapist has broken free from the laws of physics! As the player, you must help them understand fundamental physics concepts by creating interactive demonstrations across various planets and environments.

**Gameplay**: Click to create physics objects, drag to apply forces, and observe realistic physics simulations while learning about gravity, momentum, energy conservation, and more.

## ✨ Features

### 🔬 Physics Education
- **Real Physics Simulation**: Powered by Matter.js for accurate physics
- **5 Different Environments**: Earth, Moon, Space Station, Jupiter, and Asteroid
- **Interactive Objects**: Create circles, rectangles, and polygons with realistic properties
- **Force Visualization**: See force vectors when applying forces to objects
- **Real-time Data**: Display kinetic energy, potential energy, momentum, and more

### 🎨 Modern UI/UX
- **Glass-morphism Design**: Modern translucent UI elements
- **Smooth Animations**: GSAP-powered transitions and effects
- **Particle Background**: Dynamic particle system with Particles.js
- **Responsive Design**: Tailwind CSS for mobile-friendly interface
- **Interactive Feedback**: Audio and visual feedback for all interactions

### 🌟 Educational Content
- **Progressive Learning**: 5 levels of increasing complexity
- **Physics Concepts**: Gravity, momentum, energy, forces, and collisions
- **Real-time Calculations**: See physics formulas in action
- **Interactive Demonstrations**: Learn by doing, not just reading

## 🛠️ Technology Stack

### External Libraries (CDN-hosted)
- **[Matter.js](https://brm.io/matter-js/)** (v0.19.0) - 2D physics engine
- **[GSAP](https://greensock.com/gsap/)** (v3.12.2) - Animation library
- **[Particles.js](https://particles.js.org/)** (v2.0.0) - Particle effects
- **[SweetAlert2](https://sweetalert2.github.io/)** (v11.7.32) - Beautiful modals
- **[Tailwind CSS](https://tailwindcss.com/)** (v3.x) - Utility-first CSS
- **[Three.js](https://threejs.org/)** (r128) - 3D graphics (future use)
- **[Howler.js](https://howlerjs.com/)** (v2.2.4) - Audio management
- **[Lodash](https://lodash.com/)** (v4.17.21) - Utility functions

### Custom Components
- **PhysicsUtils**: Educational physics calculations and utilities
- **UIComponent**: User interface management with external library integration
- **GameManager**: Simplified game logic using Matter.js
- **App Controller**: Coordinates all external libraries

## 🚀 Getting Started

### Prerequisites
- Modern web browser with ES6+ support
- Python 3 (for local development server)
- Internet connection (for CDN-hosted libraries)

### Installation & Setup

1. **Clone or Download the Repository**
   ```bash
   git clone <repository-url>
   cd PhysicsAdventure
   ```

2. **Start Local Development Server**
   ```bash
   python3 -m http.server 8080
   ```

3. **Open in Browser**
   - Main Game: `http://localhost:8080/main.html`
   - Test Page: `http://localhost:8080/test.html`

### Alternative Servers
```bash
# Node.js (if you have it)
npx http-server -p 8080

# PHP (if available)
php -S localhost:8080
```

## 🎯 How to Play

### Basic Controls
- **Click**: Create physics objects at cursor position
- **Drag**: Apply forces to existing objects
- **Space**: Pause/Resume physics simulation
- **R**: Reset current level
- **C**: Clear all objects
- **1-5**: Switch to level 1-5

### Game Progression

#### Level 1: Earth Gravity (9.8 m/s²)
- Learn basic gravity concepts
- Create objects and watch them fall
- Observe energy conservation

#### Level 2: Moon Gravity (1.6 m/s²)
- Experience reduced gravity
- Notice slower falling speeds
- Compare with Earth gravity

#### Level 3: Space Station (0 m/s²)
- Zero gravity environment
- Objects float unless pushed
- Understand inertia and momentum

#### Level 4: Jupiter (24.8 m/s²)
- Intense gravitational field
- Objects fall much faster
- Observe increased potential energy

#### Level 5: Asteroid (0.4 m/s²)
- Minimal gravity environment
- Precise control required
- Master momentum conservation

## 📁 Project Structure

```
PhysicsAdventure/
├── main.html          # Main game interface (modern)
├── test.html              # Testing page for external libraries
├── package.json           # Project metadata and dependencies
├── README.md             # This documentation
├── LICENSE               # MIT License
├── src/                  # Source code
│   ├── app.js           # Main application controller
│   ├── components/      # Reusable UI components
│   │   └── UIComponent.js
│   ├── managers/        # Game management
│   │   ├── GameManager.js      # Legacy complex manager
│   │   └── GameManagerSimple.js # Simplified external lib manager
│   └── physics/         # Physics utilities
│       └── PhysicsUtils.js
└── package.json        # Project dependencies
```

## 🔧 Development

### Adding New Features

1. **New Physics Concepts**: Extend `PhysicsUtils.js`
2. **UI Components**: Add to `src/components/`
3. **Game Mechanics**: Modify `GameManagerSimple.js`
4. **Visual Effects**: Use GSAP animations in components

### Customization

#### Modify Physics Environments
```javascript
// In PhysicsUtils.js
this.environments = {
    custom: { gravity: 5.0, name: 'Custom Planet', color: '#ff6b6b' }
};
```

#### Add New Animations
```javascript
// Using GSAP
gsap.to(element, {
    duration: 1,
    scale: 1.2,
    rotation: 360,
    ease: "elastic.out(1, 0.3)"
});
```

#### Customize Particles
```javascript
// In app.js particle configuration
particles: {
    color: { value: ["#custom1", "#custom2"] },
    number: { value: 200 }
}
```

## 🎓 Educational Concepts

### Physics Laws Demonstrated
1. **Newton's Laws of Motion**
   - Objects at rest stay at rest
   - F = ma (Force equals mass times acceleration)
   - Every action has an equal and opposite reaction

2. **Conservation Laws**
   - Energy conservation (kinetic ↔ potential)
   - Momentum conservation in collisions

3. **Gravitational Forces**
   - Universal gravitation
   - Acceleration due to gravity
   - Orbital mechanics concepts

4. **Material Properties**
   - Friction and restitution
   - Density and mass
   - Elastic vs inelastic collisions

## 🐛 Troubleshooting

### Common Issues

**Loading Stuck at 0%**
- Check internet connection (CDN libraries required)
- Verify server is running on correct port
- Check browser console for error messages

**Physics Not Working**
- Ensure Matter.js loaded properly
- Check canvas element exists
- Verify click event listeners attached

**Animations Stuttering**
- Update browser to latest version
- Close other resource-intensive tabs
- Check hardware acceleration enabled

**Audio Not Working**
- Click on page first (browser audio policy)
- Check if audio is muted
- Verify Web Audio API support

### Debug Mode
Add `?debug=true` to URL for debug information:
```
http://localhost:8080/main.html?debug=true
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Use external libraries when possible (avoid reinventing the wheel)
- Keep custom code minimal and focused
- Document new features and physics concepts
- Test across different browsers
- Maintain educational value

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Matter.js** - Excellent 2D physics engine
- **GSAP** - Professional animation library
- **Tailwind CSS** - Utility-first CSS framework
- **SweetAlert2** - Beautiful modal dialogs
- **Particles.js** - Lightweight particle effects
- Educational physics resources and inspiration

## 📞 Support

For questions, issues, or contributions:
- Open an issue on GitHub
- Check the troubleshooting section
- Review the test page for library verification

---

**Made with ❤️ for physics education and interactive learning**
Physics game that is fun and educational. somebody has broken physics, and Bob must go and prove that physics is cool. ALso the maiin character's name is Bob.
