#!/usr/bin/env bash

# Flask Physics Simulation Launcher
# This script helps you start and manage the physics simulation application

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     Flask Physics Simulation - Double Pendulum            ║${NC}"
echo -e "${BLUE}║     Lagrangian Mechanics with Accurate Math               ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if dependencies are installed
echo -e "${YELLOW}[1/4]${NC} Checking dependencies..."
if ! python3 -c "import flask" 2>/dev/null; then
    echo -e "${RED}✗${NC} Flask not found. Installing dependencies..."
    pip install -r requirements.txt
else
    echo -e "${GREEN}✓${NC} Dependencies OK"
fi

# Check if port 5000 is available
echo -e "${YELLOW}[2/4]${NC} Checking port 5000..."
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo -e "${YELLOW}⚠${NC}  Port 5000 is already in use"
    echo -e "    Trying to stop existing Flask server..."
    pkill -f "python.*app.py" || true
    sleep 2
fi

# Show available URLs
echo -e "${YELLOW}[3/4]${NC} Starting Flask server..."
echo ""

# Get the IP address
IP_ADDR=$(hostname -I | awk '{print $1}')

# Start the server
export FLASK_APP=app.py
export FLASK_ENV=development

echo -e "${GREEN}✓${NC} Server starting on:"
echo -e "  ${GREEN}➜${NC}  Local:   ${BLUE}http://localhost:5000${NC}"
echo -e "  ${GREEN}➜${NC}  Network: ${BLUE}http://$IP_ADDR:5000${NC}"
echo ""
echo -e "${YELLOW}[4/4]${NC} Launching application..."
echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo -e "  ${GREEN}READY!${NC} Open the URL above in your browser"
echo -e ""
echo -e "  Features:"
echo -e "  • Adjust masses, lengths, and angles in real-time"
echo -e "  • Watch chaotic double pendulum animation"
echo -e "  • View phase space and energy plots"
echo -e "  • Demonstrate chaos theory with small perturbations"
echo -e ""
echo -e "  Press ${RED}Ctrl+C${NC} to stop the server"
echo -e "${GREEN}════════════════════════════════════════════════════════════${NC}"
echo ""

# Run the Flask app
python3 app.py
