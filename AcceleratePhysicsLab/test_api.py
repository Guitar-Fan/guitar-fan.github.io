#!/usr/bin/env python3
"""
Test script for the Flask Physics Simulation API
"""

import requests
import json

BASE_URL = "http://127.0.0.1:5000"

def test_simulate():
    """Test the /api/simulate endpoint"""
    print("Testing /api/simulate endpoint...")
    
    payload = {
        "theta1": 90,
        "theta2": 90,
        "m1": 1.0,
        "m2": 1.0,
        "L1": 1.0,
        "L2": 1.0,
        "duration": 2.0,
        "dt": 0.01
    }
    
    response = requests.post(f"{BASE_URL}/api/simulate", json=payload)
    
    if response.status_code == 200:
        result = response.json()
        if result['success']:
            data = result['data']
            print(f"✓ Simulation successful!")
            print(f"  - Time points: {len(data['time'])}")
            print(f"  - Duration: {data['time'][-1]:.2f} seconds")
            print(f"  - Initial energy: {data['energy'][0]:.4f} J")
            print(f"  - Final energy: {data['energy'][-1]:.4f} J")
            print(f"  - Energy conservation: {abs(data['energy'][-1] - data['energy'][0]) / abs(data['energy'][0]) * 100:.6f}%")
            return True
        else:
            print(f"✗ Simulation failed: {result.get('error')}")
            return False
    else:
        print(f"✗ HTTP Error: {response.status_code}")
        return False

def test_compare():
    """Test the /api/compare endpoint"""
    print("\nTesting /api/compare endpoint...")
    
    payload = {
        "theta1": 90,
        "theta2": 90,
        "m1": 1.0,
        "m2": 1.0,
        "L1": 1.0,
        "L2": 1.0,
        "duration": 2.0,
        "perturbation": 0.01
    }
    
    response = requests.post(f"{BASE_URL}/api/compare", json=payload)
    
    if response.status_code == 200:
        result = response.json()
        if result['success']:
            sims = result['simulations']
            print(f"✓ Chaos comparison successful!")
            print(f"  - Number of simulations: {len(sims)}")
            for sim in sims:
                print(f"  - Simulation {sim['id']}: Δθ = {sim['delta']:.4f}°")
            return True
        else:
            print(f"✗ Comparison failed: {result.get('error')}")
            return False
    else:
        print(f"✗ HTTP Error: {response.status_code}")
        return False

def test_physics_accuracy():
    """Test the physics accuracy with known scenarios"""
    print("\nTesting physics accuracy...")
    
    # Test 1: Small angle approximation (should behave like simple pendulum)
    payload = {
        "theta1": 5,  # Small angle in degrees
        "theta2": 5,
        "m1": 1.0,
        "m2": 1.0,
        "L1": 1.0,
        "L2": 1.0,
        "duration": 5.0,
        "dt": 0.001  # Very small time step for accuracy
    }
    
    response = requests.post(f"{BASE_URL}/api/simulate", json=payload)
    
    if response.status_code == 200:
        result = response.json()
        if result['success']:
            data = result['data']
            energy_drift = abs(data['energy'][-1] - data['energy'][0]) / abs(data['energy'][0]) * 100
            print(f"✓ Small angle test:")
            print(f"  - Energy drift: {energy_drift:.8f}%")
            if energy_drift < 0.01:
                print(f"  - ✓ Excellent energy conservation!")
            elif energy_drift < 0.1:
                print(f"  - ✓ Good energy conservation")
            else:
                print(f"  - ⚠ Energy drift may be too high")
            return True
    return False

if __name__ == "__main__":
    print("=" * 60)
    print("Flask Physics Simulation - API Test Suite")
    print("=" * 60)
    
    # Give the server a moment to fully start
    import time
    time.sleep(1)
    
    try:
        test_simulate()
        test_compare()
        test_physics_accuracy()
        
        print("\n" + "=" * 60)
        print("All tests completed!")
        print("=" * 60)
        print("\nOpen http://127.0.0.1:5000 in your browser to see the interactive simulation!")
        
    except requests.exceptions.ConnectionError:
        print("\n✗ Error: Could not connect to Flask server.")
        print("  Make sure the Flask app is running on http://127.0.0.1:5000")
    except Exception as e:
        print(f"\n✗ Unexpected error: {e}")
