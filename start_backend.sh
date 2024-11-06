#!/bin/bash

# Navigate to the backend directory from the main directory
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

# Ensure dependencies are up-to-date
echo "Ensuring dependencies are up-to-date..."
mvn dependency:resolve

# Start the Spring Boot application
echo "Starting the Spring Boot application..."
mvn spring-boot:run