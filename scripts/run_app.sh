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

# Create the logs folder if it doesn't exist
LOGS_DIR="Logs"
cd ..
if [ ! -d "$LOGS_DIR" ]; then
    mkdir "$LOGS_DIR"
    echo "Created logs directory: $LOGS_DIR"
fi

# Navigate to the backend directory and start the Spring Boot application
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

# Start the backend with Maven, using the default profile (application.properties)
echo "Starting the Spring Boot backend with default configuration..."
mvn spring-boot:run > "../$LOGS_DIR/backend.log" 2>&1 &
BACKEND_PID=$!
echo "Backend is running with PID: $BACKEND_PID. Logs are available in $LOGS_DIR/backend.log."

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
npm start > "../$LOGS_DIR/frontend.log" 2>&1 &
FRONTEND_PID=$!
echo "Frontend is running with PID: $FRONTEND_PID. Logs are available in $LOGS_DIR/frontend.log."

# Wait for both processes to exit
wait "$BACKEND_PID" "$FRONTEND_PID"