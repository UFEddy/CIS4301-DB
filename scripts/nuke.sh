#!/bin/bash

# Navigate to the frontend directory and delete node_modules
cd ..
cd frontend || { echo "Frontend directory not found. Exiting."; exit 1; }
echo "Deleting frontend packages (node_modules). This may take a minute..."
rm -rf node_modules
echo "node_modules deleted successfully."

# Navigate to the backend directory and delete Maven dependencies
cd ../backend || { echo "Backend directory not found. Exiting."; exit 1; }
echo "Deleting Maven dependencies in the backend (target directory). This may take a minute..."
rm -rf target
echo "Maven dependencies deleted successfully."

# Navigate back to the main directory and run setup.sh
cd .. || exit
if [ -f "./setup.sh" ]; then
    echo "Running setup.sh..."
    chmod +x setup.sh
    ./setup.sh
else
    echo "setup.sh not found in the main directory. Please ensure it exists."
    exit 1
fi