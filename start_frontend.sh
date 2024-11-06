#!/bin/bash

# For Windows users:
# Run this script using Git Bash or Windows Subsystem for Linux (WSL)

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js to continue."
    exit 1
fi
echo "Node.js is installed."

# Navigate to the frontend folder
cd frontend || { echo "The 'frontend' folder does not exist. Please check the folder structure."; exit 1; }

# Run npm install
echo "Installing dependencies in the frontend folder..."
npm install

# Start the application
echo "Starting the React application..."
npm start