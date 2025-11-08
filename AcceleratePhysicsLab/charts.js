/**
 * Physics Charts Module
 * Real-time visualization of pendulum physics data using ECharts
 */

class PhysicsCharts {
    constructor(physics) {
        this.physics = physics;
        this.maxDataPoints = 200; // Maximum points to display
        
        // Data storage
        this.timeData = [];
        this.kineticEnergyData = [];
        this.potentialEnergyData = [];
        this.totalEnergyData = [];
        this.theta1Data = [];
        this.theta2Data = [];
        this.omega1Data = [];
        this.omega2Data = [];
        this.trajectoryX = [];
        this.trajectoryY = [];
        
        // Chart instances
        this.energyChart = null;
        this.phaseSpaceChart = null;
        this.angularVelocityChart = null;
        this.trajectoryChart = null;
        
        // Visibility flags
        this.showEnergyChart = true;
        this.showPhaseSpace = false;
        this.showAngularVelocity = false;
        this.showTrajectory = false;
        
        this.initializeCharts();
        this.setupEventListeners();
    }
    
    initializeCharts() {
        // Energy vs Time Chart
        this.energyChart = echarts.init(document.getElementById('energy-chart-container'));
        this.energyChart.setOption({
            title: {
                text: 'Energy vs Time',
                textStyle: { color: '#f8f6f0', fontSize: 14 },
                left: 'center'
            },
            backgroundColor: 'transparent',
            grid: {
                left: '15%',
                right: '10%',
                top: '20%',
                bottom: '15%'
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(45, 55, 72, 0.95)',
                borderColor: '#c17817',
                textStyle: { color: '#f8f6f0' }
            },
            legend: {
                data: ['Kinetic', 'Potential', 'Total'],
                textStyle: { color: '#a0aec0' },
                top: '5%'
            },
            xAxis: {
                type: 'value',
                name: 'Time (s)',
                nameTextStyle: { color: '#a0aec0' },
                axisLine: { lineStyle: { color: '#a0aec0' } },
                splitLine: { lineStyle: { color: 'rgba(160, 174, 192, 0.1)' } }
            },
            yAxis: {
                type: 'value',
                name: 'Energy (J)',
                nameTextStyle: { color: '#a0aec0' },
                axisLine: { lineStyle: { color: '#a0aec0' } },
                splitLine: { lineStyle: { color: 'rgba(160, 174, 192, 0.1)' } }
            },
            series: [
                {
                    name: 'Kinetic',
                    type: 'line',
                    data: [],
                    smooth: true,
                    lineStyle: { color: '#10b981', width: 2 },
                    showSymbol: false
                },
                {
                    name: 'Potential',
                    type: 'line',
                    data: [],
                    smooth: true,
                    lineStyle: { color: '#3b82f6', width: 2 },
                    showSymbol: false
                },
                {
                    name: 'Total',
                    type: 'line',
                    data: [],
                    smooth: true,
                    lineStyle: { color: '#c17817', width: 2 },
                    showSymbol: false
                }
            ]
        });
        
        // Phase Space Chart (θ vs ω)
        this.phaseSpaceChart = echarts.init(document.getElementById('phase-space-container'));
        this.phaseSpaceChart.setOption({
            title: {
                text: 'Phase Space (θ₁ vs ω₁)',
                textStyle: { color: '#f8f6f0', fontSize: 14 },
                left: 'center'
            },
            backgroundColor: 'transparent',
            grid: {
                left: '15%',
                right: '10%',
                top: '20%',
                bottom: '15%'
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(45, 55, 72, 0.95)',
                borderColor: '#c17817',
                textStyle: { color: '#f8f6f0' }
            },
            xAxis: {
                type: 'value',
                name: 'θ₁ (rad)',
                nameTextStyle: { color: '#a0aec0' },
                axisLine: { lineStyle: { color: '#a0aec0' } },
                splitLine: { lineStyle: { color: 'rgba(160, 174, 192, 0.1)' } }
            },
            yAxis: {
                type: 'value',
                name: 'ω₁ (rad/s)',
                nameTextStyle: { color: '#a0aec0' },
                axisLine: { lineStyle: { color: '#a0aec0' } },
                splitLine: { lineStyle: { color: 'rgba(160, 174, 192, 0.1)' } }
            },
            series: [{
                type: 'scatter',
                data: [],
                symbolSize: 3,
                itemStyle: { color: '#c17817', opacity: 0.6 }
            }]
        });
        
        // Angular Velocity Chart
        this.angularVelocityChart = echarts.init(document.getElementById('angular-velocity-container'));
        this.angularVelocityChart.setOption({
            title: {
                text: 'Angular Velocities',
                textStyle: { color: '#f8f6f0', fontSize: 14 },
                left: 'center'
            },
            backgroundColor: 'transparent',
            grid: {
                left: '15%',
                right: '10%',
                top: '20%',
                bottom: '15%'
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(45, 55, 72, 0.95)',
                borderColor: '#c17817',
                textStyle: { color: '#f8f6f0' }
            },
            legend: {
                data: ['ω₁', 'ω₂'],
                textStyle: { color: '#a0aec0' },
                top: '5%'
            },
            xAxis: {
                type: 'value',
                name: 'Time (s)',
                nameTextStyle: { color: '#a0aec0' },
                axisLine: { lineStyle: { color: '#a0aec0' } },
                splitLine: { lineStyle: { color: 'rgba(160, 174, 192, 0.1)' } }
            },
            yAxis: {
                type: 'value',
                name: 'ω (rad/s)',
                nameTextStyle: { color: '#a0aec0' },
                axisLine: { lineStyle: { color: '#a0aec0' } },
                splitLine: { lineStyle: { color: 'rgba(160, 174, 192, 0.1)' } }
            },
            series: [
                {
                    name: 'ω₁',
                    type: 'line',
                    data: [],
                    smooth: true,
                    lineStyle: { color: '#10b981', width: 2 },
                    showSymbol: false
                },
                {
                    name: 'ω₂',
                    type: 'line',
                    data: [],
                    smooth: true,
                    lineStyle: { color: '#3b82f6', width: 2 },
                    showSymbol: false
                }
            ]
        });
        
        // Trajectory Plot
        this.trajectoryChart = echarts.init(document.getElementById('trajectory-chart-container'));
        this.trajectoryChart.setOption({
            title: {
                text: 'Bob 2 Trajectory (X-Y)',
                textStyle: { color: '#f8f6f0', fontSize: 14 },
                left: 'center'
            },
            backgroundColor: 'transparent',
            grid: {
                left: '15%',
                right: '10%',
                top: '20%',
                bottom: '15%'
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(45, 55, 72, 0.95)',
                borderColor: '#c17817',
                textStyle: { color: '#f8f6f0' }
            },
            xAxis: {
                type: 'value',
                name: 'X (m)',
                nameTextStyle: { color: '#a0aec0' },
                axisLine: { lineStyle: { color: '#a0aec0' } },
                splitLine: { lineStyle: { color: 'rgba(160, 174, 192, 0.1)' } }
            },
            yAxis: {
                type: 'value',
                name: 'Y (m)',
                nameTextStyle: { color: '#a0aec0' },
                axisLine: { lineStyle: { color: '#a0aec0' } },
                splitLine: { lineStyle: { color: 'rgba(160, 174, 192, 0.1)' } }
            },
            series: [{
                type: 'line',
                data: [],
                smooth: false,
                lineStyle: { color: '#c17817', width: 1 },
                showSymbol: false
            }]
        });
    }
    
    setupEventListeners() {
        // Energy chart toggle
        document.getElementById('show-energy-chart').addEventListener('change', (e) => {
            this.showEnergyChart = e.target.checked;
            document.getElementById('energy-chart-container').style.display = e.target.checked ? 'block' : 'none';
            if (e.target.checked) this.energyChart.resize();
        });
        
        // Phase space toggle
        document.getElementById('show-phase-space').addEventListener('change', (e) => {
            this.showPhaseSpace = e.target.checked;
            document.getElementById('phase-space-container').style.display = e.target.checked ? 'block' : 'none';
            if (e.target.checked) this.phaseSpaceChart.resize();
        });
        
        // Angular velocity toggle
        document.getElementById('show-angular-velocity').addEventListener('change', (e) => {
            this.showAngularVelocity = e.target.checked;
            document.getElementById('angular-velocity-container').style.display = e.target.checked ? 'block' : 'none';
            if (e.target.checked) this.angularVelocityChart.resize();
        });
        
        // Trajectory toggle
        document.getElementById('show-trajectory-plot').addEventListener('change', (e) => {
            this.showTrajectory = e.target.checked;
            document.getElementById('trajectory-chart-container').style.display = e.target.checked ? 'block' : 'none';
            if (e.target.checked) this.trajectoryChart.resize();
        });
        
        // Resize charts on window resize
        window.addEventListener('resize', () => {
            this.energyChart.resize();
            this.phaseSpaceChart.resize();
            this.angularVelocityChart.resize();
            this.trajectoryChart.resize();
        });
    }
    
    update() {
        const energy = this.physics.calculateEnergy();
        const positions = this.physics.getPositions();
        const time = this.physics.time;
        
        // Store data
        this.timeData.push(time);
        this.kineticEnergyData.push([time, energy.kinetic]);
        this.potentialEnergyData.push([time, energy.potential]);
        this.totalEnergyData.push([time, energy.total]);
        
        // Normalize angles for display
        const theta1Normalized = this.normalizeAngle(this.physics.theta1);
        const theta2Normalized = this.normalizeAngle(this.physics.theta2);
        
        this.theta1Data.push([theta1Normalized, this.physics.omega1]);
        this.theta2Data.push([theta2Normalized, this.physics.omega2]);
        this.omega1Data.push([time, this.physics.omega1]);
        this.omega2Data.push([time, this.physics.omega2]);
        this.trajectoryX.push(positions.bob2.x);
        this.trajectoryY.push(positions.bob2.y);
        
        // Limit data points
        if (this.timeData.length > this.maxDataPoints) {
            this.timeData.shift();
            this.kineticEnergyData.shift();
            this.potentialEnergyData.shift();
            this.totalEnergyData.shift();
            this.theta1Data.shift();
            this.theta2Data.shift();
            this.omega1Data.shift();
            this.omega2Data.shift();
            this.trajectoryX.shift();
            this.trajectoryY.shift();
        }
        
        // Update charts
        this.updateEnergyChart();
        this.updatePhaseSpaceChart();
        this.updateAngularVelocityChart();
        this.updateTrajectoryChart();
    }
    
    normalizeAngle(angle) {
        while (angle > Math.PI) angle -= 2 * Math.PI;
        while (angle < -Math.PI) angle += 2 * Math.PI;
        return angle;
    }
    
    updateEnergyChart() {
        if (!this.showEnergyChart) return;
        
        this.energyChart.setOption({
            series: [
                { data: this.kineticEnergyData },
                { data: this.potentialEnergyData },
                { data: this.totalEnergyData }
            ]
        });
    }
    
    updatePhaseSpaceChart() {
        if (!this.showPhaseSpace) return;
        
        this.phaseSpaceChart.setOption({
            series: [{
                data: this.theta1Data
            }]
        });
    }
    
    updateAngularVelocityChart() {
        if (!this.showAngularVelocity) return;
        
        this.angularVelocityChart.setOption({
            series: [
                { data: this.omega1Data },
                { data: this.omega2Data }
            ]
        });
    }
    
    updateTrajectoryChart() {
        if (!this.showTrajectory) return;
        
        const trajectoryData = this.trajectoryX.map((x, i) => [x, this.trajectoryY[i]]);
        
        this.trajectoryChart.setOption({
            series: [{
                data: trajectoryData
            }]
        });
    }
    
    clear() {
        this.timeData = [];
        this.kineticEnergyData = [];
        this.potentialEnergyData = [];
        this.totalEnergyData = [];
        this.theta1Data = [];
        this.theta2Data = [];
        this.omega1Data = [];
        this.omega2Data = [];
        this.trajectoryX = [];
        this.trajectoryY = [];
        
        this.updateEnergyChart();
        this.updatePhaseSpaceChart();
        this.updateAngularVelocityChart();
        this.updateTrajectoryChart();
    }
}
