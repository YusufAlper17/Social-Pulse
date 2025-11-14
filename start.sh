#!/bin/bash

# Kill any existing processes
pkill -f "python app.py"
pkill -f "node"

# Start backend
cd backend
source venv/bin/activate
python app.py &

# Wait for backend to start
sleep 2

# Start frontend
cd ../frontend
npm start &

# Keep script running
wait 