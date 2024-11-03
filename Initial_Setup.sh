#!/bin/bash

# For Windows users:
# Run this script using Git Bash or Windows Subsystem for Linux (WSL)
# Ensure your PATH includes node, npm, and java if not found

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js to continue."
    exit 1
fi
echo "Node.js is installed."

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install npm to continue."
    exit 1
fi
echo "npm is installed."

# Check if Java (JRE or JDK) is installed for IntelliJ
if ! command -v java &> /dev/null; then
    echo "Java is not installed. IntelliJ requires Java to run properly."
    exit 1
fi
echo "Java is installed."

# Check if npx is available
if ! command -v npx &> /dev/null; then
    echo "npx is not available. It should come with npm. Please update npm."
    exit 1
fi
echo "npx is available."

# Navigate to the frontend folder
cd frontend || { echo "The 'frontend' folder does not exist. Please check the folder structure."; exit 1; }

# Run npm install
echo "Installing dependencies in the frontend folder..."
npm install

# Start the application
echo "Starting the React application..."
npm start