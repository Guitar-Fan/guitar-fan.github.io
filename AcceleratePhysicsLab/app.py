"""
Flask Physics Simulation Application
Demonstrates a chaotic double pendulum with accurate Runge-Kutta integration
"""

from flask import Flask, render_template, jsonify, request
import numpy as np
from scipy.integrate import odeint
import math

app = Flask(__name__)

class DoublePendulumSimulator:
    """
    Double pendulum physics simulator with accurate equations of motion.
    Uses the Lagrangian formulation of mechanics.
    """
    
    def __init__(self, m1=1.0, m2=1.0, L1=1.0, L2=1.0, g=9.81):
        """
        Initialize the double pendulum simulator.
        
        Args:
            m1: Mass of first pendulum bob (kg)
            m2: Mass of second pendulum bob (kg)
            L1: Length of first pendulum rod (m)
            L2: Length of second pendulum rod (m)
            g: Gravitational acceleration (m/s^2)
        """
        self.m1 = m1
        self.m2 = m2
        self.L1 = L1
        self.L2 = L2
        self.g = g
        
    def derivatives(self, state, t):
        """
        Calculate the derivatives for the double pendulum system.
        
        Uses the equations of motion derived from the Lagrangian:
        L = T - V (Kinetic energy - Potential energy)
        
        State vector: [theta1, omega1, theta2, omega2]
        where theta is angle, omega is angular velocity
        """
        theta1, omega1, theta2, omega2 = state
        
        # Calculate the difference in angles
        delta = theta2 - theta1
        
        # Denominators (with numerical stability check)
        # den1 = (m1 + m2) * L1 - m2 * L1 * cos(delta)^2
        den1 = (self.m1 + self.m2) * self.L1 - self.m2 * self.L1 * np.cos(delta)**2
        
        # den2 = (L2 / L1) * den1
        den2 = (self.L2 / self.L1) * den1
        
        # Add small epsilon to prevent division by zero
        epsilon = 1e-10
        den1 = den1 if abs(den1) > epsilon else epsilon * np.sign(den1) if den1 != 0 else epsilon
        den2 = den2 if abs(den2) > epsilon else epsilon * np.sign(den2) if den2 != 0 else epsilon
        
        # Calculate angular accelerations using Lagrangian mechanics
        # These are the exact equations of motion for a double pendulum
        
        # Numerator terms for alpha1 (angular acceleration of first pendulum)
        num1a = -self.m2 * self.L1 * omega1**2 * np.sin(delta) * np.cos(delta)
        num1b = -self.m2 * self.g * np.sin(theta2) * np.cos(delta)
        num1c = -self.m2 * self.L2 * omega2**2 * np.sin(delta)
        num1d = -(self.m1 + self.m2) * self.g * np.sin(theta1)
        
        alpha1 = (num1a + num1b + num1c + num1d) / den1
        
        # Numerator terms for alpha2 (angular acceleration of second pendulum)
        num2a = self.m2 * self.L2 * omega2**2 * np.sin(delta) * np.cos(delta)
        num2b = (self.m1 + self.m2) * self.g * np.sin(theta1) * np.cos(delta)
        num2c = (self.m1 + self.m2) * self.L1 * omega1**2 * np.sin(delta)
        num2d = -(self.m1 + self.m2) * self.g * np.sin(theta2)
        
        alpha2 = (num2a + num2b + num2c + num2d) / den2
        
        return [omega1, alpha1, omega2, alpha2]
    
    def simulate(self, initial_state, duration, dt=0.01):
        """
        Simulate the double pendulum motion.
        
        Args:
            initial_state: [theta1, omega1, theta2, omega2] in radians and rad/s
            duration: Total simulation time (seconds)
            dt: Time step (seconds)
            
        Returns:
            Dictionary with time series and position data
        """
        t = np.arange(0, duration, dt)
        
        # Use odeint for accurate numerical integration
        solution = odeint(self.derivatives, initial_state, t)
        
        theta1 = solution[:, 0]
        theta2 = solution[:, 2]
        
        # Convert to Cartesian coordinates for visualization
        x1 = self.L1 * np.sin(theta1)
        y1 = -self.L1 * np.cos(theta1)
        
        x2 = x1 + self.L2 * np.sin(theta2)
        y2 = y1 - self.L2 * np.cos(theta2)
        
        # Calculate energy for verification
        energy = self.calculate_energy(solution)
        
        return {
            'time': t.tolist(),
            'theta1': theta1.tolist(),
            'theta2': theta2.tolist(),
            'x1': x1.tolist(),
            'y1': y1.tolist(),
            'x2': x2.tolist(),
            'y2': y2.tolist(),
            'energy': energy.tolist(),
            'dt': dt,
            'L1': self.L1,
            'L2': self.L2
        }
    
    def calculate_energy(self, solution):
        """
        Calculate the total energy of the system.
        
        Energy should be conserved (constant) for an accurate simulation.
        """
        theta1 = solution[:, 0]
        omega1 = solution[:, 1]
        theta2 = solution[:, 2]
        omega2 = solution[:, 3]
        
        # Kinetic energy
        v1_sq = (self.L1 * omega1)**2
        v2_sq = (self.L1 * omega1)**2 + (self.L2 * omega2)**2 + \
                2 * self.L1 * self.L2 * omega1 * omega2 * np.cos(theta1 - theta2)
        
        T = 0.5 * self.m1 * v1_sq + 0.5 * self.m2 * v2_sq
        
        # Potential energy (taking y=0 at pivot, negative y downward)
        # Height of bob 1: -L1*cos(theta1)
        # Height of bob 2: -L1*cos(theta1) - L2*cos(theta2)
        y1 = -self.L1 * np.cos(theta1)
        y2 = -self.L1 * np.cos(theta1) - self.L2 * np.cos(theta2)
        
        V = self.m1 * self.g * y1 + self.m2 * self.g * y2
        
        return T + V


# Flask routes
@app.route('/')
def index():
    """Render the main simulation page."""
    return render_template('index.html')

@app.route('/api/simulate', methods=['POST'])
def simulate():
    """
    API endpoint to run a physics simulation.
    
    Expected JSON payload:
    {
        "theta1": initial angle of first pendulum (degrees),
        "theta2": initial angle of second pendulum (degrees),
        "omega1": initial angular velocity of first pendulum (rad/s),
        "omega2": initial angular velocity of second pendulum (rad/s),
        "m1": mass of first bob (kg),
        "m2": mass of second bob (kg),
        "L1": length of first rod (m),
        "L2": length of second rod (m),
        "duration": simulation duration (seconds),
        "dt": time step (seconds, optional)
    }
    """
    try:
        data = request.get_json()
        
        # Parse parameters
        theta1 = math.radians(float(data.get('theta1', 90)))
        theta2 = math.radians(float(data.get('theta2', 90)))
        omega1 = float(data.get('omega1', 0))
        omega2 = float(data.get('omega2', 0))
        
        m1 = float(data.get('m1', 1.0))
        m2 = float(data.get('m2', 1.0))
        L1 = float(data.get('L1', 1.0))
        L2 = float(data.get('L2', 1.0))
        
        duration = float(data.get('duration', 10))
        dt = float(data.get('dt', 0.01))
        
        # Create simulator and run
        simulator = DoublePendulumSimulator(m1=m1, m2=m2, L1=L1, L2=L2)
        initial_state = [theta1, omega1, theta2, omega2]
        
        results = simulator.simulate(initial_state, duration, dt)
        
        return jsonify({
            'success': True,
            'data': results
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/compare', methods=['POST'])
def compare_simulations():
    """
    Run multiple simulations with slightly different initial conditions.
    Demonstrates sensitivity to initial conditions (chaos theory).
    """
    try:
        data = request.get_json()
        
        base_theta1 = math.radians(float(data.get('theta1', 90)))
        base_theta2 = math.radians(float(data.get('theta2', 90)))
        perturbation = math.radians(float(data.get('perturbation', 0.01)))
        
        m1 = float(data.get('m1', 1.0))
        m2 = float(data.get('m2', 1.0))
        L1 = float(data.get('L1', 1.0))
        L2 = float(data.get('L2', 1.0))
        
        duration = float(data.get('duration', 10))
        dt = float(data.get('dt', 0.01))
        
        simulator = DoublePendulumSimulator(m1=m1, m2=m2, L1=L1, L2=L2)
        
        # Run three simulations with slightly different initial conditions
        simulations = []
        for i, delta in enumerate([0, perturbation, -perturbation]):
            initial_state = [base_theta1 + delta, 0, base_theta2, 0]
            results = simulator.simulate(initial_state, duration, dt)
            simulations.append({
                'id': i,
                'delta': math.degrees(delta),
                'data': results
            })
        
        return jsonify({
            'success': True,
            'simulations': simulations
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
