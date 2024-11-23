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
            echo "Node.js installation was not successful. Please ensure the following:"
            echo "1. Verify the installation by reopening this script after confirming Node.js is installed."
            echo "2. If Node.js is installed but not detected, add Node.js to the PATH manually."
            echo "   - Open System Properties > Advanced > Environment Variables."
            echo "   - In 'System Variables', find the 'Path' variable, select it, and click Edit."
            echo "   - Add the Node.js installation path (usually C:\\Program Files\\nodejs\\) to PATH."
            echo "   - Restart this script or open a new command prompt and try again."
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
            echo "Java installation was not successful. Please ensure the following:"
            echo "1. Verify that Java is installed by reopening this script after confirmation."
            echo "2. If installed but not detected, add Java to the PATH manually."
            echo "   - Open System Properties > Advanced > Environment Variables."
            echo "   - In 'System Variables', find the 'Path' variable, select it, and click Edit."
            echo "   - Add the Java installation path (e.g., C:\\Program Files\\Java\\jdk-<version>\\bin) to PATH."
            echo "   - Restart this script or open a new command prompt and try again."
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
            echo "Maven installation was not successful. Please ensure the following:"
            echo "1. Verify that Maven is installed by reopening this script after confirmation."
            echo "2. If installed but not detected, add Maven to the PATH manually."
            echo "   - Open System Properties > Advanced > Environment Variables."
            echo "   - In 'System Variables', find the 'Path' variable, select it, and click Edit."
            echo "   - Add the Maven 'bin' path (e.g., C:\\apache-maven-<version>\\bin) to PATH."
            echo "   - Restart this script or open a new command prompt and try again."
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

# Navigate back to the root directory
cd ..

# Check if start_backend.sh exists and change permissions if it does
if [ -f "./start_backend.sh" ]; then
    chmod u+rwx "./start_backend.sh"
else
    echo "Could not find start_backend.sh file. Your repository may be corrupted or may need to be re-pulled."
fi

# Check if start_frontend.sh exists and change permissions if it does
if [ -f "./start_frontend.sh" ]; then
    chmod u+rwx "./start_frontend.sh"
else
    echo "Could not find start_frontend.sh file. Your repository may be corrupted or may need to be re-pulled."
fi

# Check if run_app.sh exists and change permissions if it does
if [ -f "./run_app.sh" ]; then
    chmod u+rwx "./run_app.sh"
else
    echo "Could not find run_app.sh file. Your repository may be corrupted or may need to be re-pulled."
fi

# Check if run_app.sh exists and change permissions if it does
if [ -f "./run_appH2.sh" ]; then
    chmod u+rwx "./run_appH2.sh"
else
    echo "Could not find run_appH2.sh file. Your repository may be corrupted or may need to be re-pulled."
fi

# Check if nuke.sh exists and change permissions if it does
if [ -f "./nuke.sh" ]; then
    chmod u+rwx "./nuke.sh"
else
    echo "Could not find nuke.sh file. Your repository may be corrupted or may need to be re-pulled."
fi

# Permission Change Confirmation
echo "Permissions have been updated for the following scripts: start_backend.sh, start_frontend.sh, run_app.sh, run_appH2.sh, nuke.sh"