#!/bin/bash

# Function to ask the user if they want to install a missing dependency
ask_to_install() {
    local dependency=$1
    local install_command=$2
    local check_command=$3

    read -p "$dependency is not installed. Do you want to install it using Homebrew? (y/n): " choice
    if [[ "$choice" == "y" || "$choice" == "Y" ]]; then
        # Check if Homebrew is installed, since it's needed for installation
        if ! command -v brew &> /dev/null; then
            echo "Homebrew is not installed, which is required for installing $dependency. Please install Homebrew from https://brew.sh and rerun the script."
            exit 1
        fi

        echo "Attempting to install $dependency with Homebrew..."
        eval "$install_command"

        # Confirm the installation
        if ! command -v $check_command &> /dev/null; then
            echo "$dependency installation failed or is not accessible. Please install it manually and rerun the script."
            exit 1
        else
            echo "$dependency was installed successfully."
        fi
    else
        echo "$dependency is required to continue. Exiting script."
        exit 1
    fi
}

# Prompt the user to specify their operating system (macOS or Windows)
echo "Are you using macOS or Windows?"
read -p "Enter 'mac' for macOS or 'win' for Windows: " os_choice

# macOS setup using Homebrew if needed
if [[ "$os_choice" == "mac" ]]; then
    # Check if Node.js (with npm and npx) is installed
    if ! command -v node &> /dev/null; then
        ask_to_install "Node.js (which includes npm and npx)" "brew install node" "node"
    else
        echo "Node.js (with npm and npx) is already installed."
    fi

    # Check if Java (JRE or JDK) is installed
    if ! command -v java &> /dev/null; then
        ask_to_install "Java (JRE or JDK)" "brew install openjdk" "java"
    else
        echo "Java is already installed."
    fi

    # Check if Maven is installed
    if ! command -v mvn &> /dev/null; then
        ask_to_install "Maven" "brew install maven" "mvn"
    else
        echo "Maven is already installed."
    fi

# Windows setup with manual download instructions
elif [[ "$os_choice" == "win" ]]; then
    echo "For Windows, this script will guide you to download and install missing dependencies manually."

    # Check for Node.js
    if ! command -v node &> /dev/null; then
        echo "Node.js is not installed. Please download and install Node.js from https://nodejs.org."
        read -p "Press Enter after you have installed Node.js to continue..."
        if command -v node &> /dev/null; then
            echo "Node.js (with npm and npx) was installed successfully."
        else
            echo "Node.js installation was not successful. Please install it manually and rerun the script."
            exit 1
        fi
    else
        echo "Node.js (with npm and npx) is already installed."
    fi

    # Check for Java
    if ! command -v java &> /dev/null; then
        echo "Java (JRE or JDK) is not installed. Please download and install Java from one of the following sources:"
        echo "1. Oracle Java SE: https://www.oracle.com/java/technologies/javase-downloads.html"
        echo "2. OpenJDK (recommended): https://adoptopenjdk.net/"
        read -p "Press Enter after you have installed Java to continue..."
        if command -v java &> /dev/null; then
            echo "Java was installed successfully."
        else
            echo "Java installation was not successful. Please install it manually and rerun the script."
            exit 1
        fi
    else
        echo "Java is already installed."
    fi

    # Check for Maven
    if ! command -v mvn &> /dev/null; then
        echo "Maven is not installed. Please download and install Maven from https://maven.apache.org/download.cgi."
        echo "After downloading, follow the instructions to add Maven to your PATH."
        read -p "Press Enter after you have installed Maven to continue..."
        if command -v mvn &> /dev/null; then
            echo "Maven was installed successfully."
        else
            echo "Maven installation was not successful. Please install it manually and rerun the script."
            exit 1
        fi
    else
        echo "Maven is already installed."
    fi

# Unsupported OS choice
else
    echo "Unsupported OS choice. Please enter 'mac' for macOS or 'win' for Windows."
    exit 1
fi

# Navigate to the backend folder
cd backend || { echo "The 'backend' folder does not exist. Please check the folder structure."; exit 1; }

# Manually resolve dependencies in the backend using Maven
echo "Resolving Maven dependencies in the backend folder..."
mvn dependency:resolve

# Ensure that Maven installs all dependencies and builds the project
echo "Building the backend project to ensure dependencies are installed..."
mvn clean install

if [ $? -ne 0 ]; then
    echo "Maven build failed. Please check for errors in the backend project."
    exit 1
fi
echo "Maven build succeeded, and dependencies are installed."

# Navigate back to the root directory
cd ..

# Navigate to the frontend folder
cd frontend || { echo "The 'frontend' folder does not exist. Please check the folder structure."; exit 1; }

# Run npm install
echo "Installing dependencies in the frontend folder..."
npm install

# Start the application
echo "Starting the React application..."
npm start