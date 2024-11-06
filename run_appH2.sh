#!/bin/bash

# Function to handle cleanup when stopping the script
cleanup() {
    echo "Stopping the applications..."
    kill "$BACKEND_PID" "$FRONTEND_PID"
    wait "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null
    echo "Applications stopped."
}

# Trap SIGINT and SIGTERM to call cleanup function on script exit
trap cleanup SIGINT SIGTERM

# Navigate to the backend directory and start the Spring Boot application in the testing environment
cd backend || {
    echo "Backend directory not found. Exiting."
    exit 1
}

# Check if Maven is installed
if ! command -v mvn &> /dev/null
then
    echo "Maven is not installed. Please install Maven and try again."
    exit 1
fi

# Start the backend with Maven, using the 'test' profile
echo "Starting the Spring Boot backend in the testing environment..."
mvn spring-boot:run -Dspring-boot.run.profiles=test &
BACKEND_PID=$!

# Navigate back to the main directory, then to the frontend directory
cd ../frontend || {
    echo "Frontend directory not found. Exiting."
    kill "$BACKEND_PID"
    exit 1
}

# Check if Node.js is installed
if ! command -v npm &> /dev/null
then
    echo "Node.js (npm) is not installed. Please install Node.js and try again."
    kill "$BACKEND_PID"
    exit 1
fi

# Start the frontend with npm
echo "Starting the React frontend..."
npm start &
FRONTEND_PID=$!

# Wait for both processes to exit
wait "$BACKEND_PID" "$FRONTEND_PID"