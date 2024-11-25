#!/bin/bash

# Global variable to store summary report
SUMMARY_REPORT=()

# Function to add a message to the summary report
add_to_summary() {
    local message=$1
    SUMMARY_REPORT+=("$message")
}

# Function to display the summary report at the end
summary_report() {
    echo ""
    echo ""
    echo ""
    echo "========================================================================================"
    echo "Setup Summary Report:"
    echo "========================================================================================"
    for message in "${SUMMARY_REPORT[@]}"; do
        echo "- $message"
    done
    echo "========================================================================================"
}

# Function to detect the operating system and set a global variable
detect_os() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        OS="mac"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        OS="linux"
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
        OS="windows"
    else
        echo "Unsupported operating system detected: $OSTYPE"
        exit 1
    fi
}

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
            add_to_summary "$dependency was installed successfully."
        fi
    else
        echo "$dependency is required to continue. Exiting script."
        exit 1
    fi
}

# Function to secure the .env file so that only the file’s owner can read and write
secure_env_file() {
    if [[ "$OS" == "mac" || "$OS" == "linux" ]]; then
        echo "Securing .env file for macOS/Linux using chmod..."
        chmod 600 .env
        add_to_summary ".env file was secured so only the file’s owner can read and write"
    elif [[ "$OS" == "windows" ]]; then
        echo "Securing .env file for Windows using icacls..."
        icacls .env /inheritance:r /grant "%USERNAME%:RW"
        if [ $? -ne 0 ]; then
            echo "Failed to secure .env file on Windows. Please check your permissions manually."
            exit 1
        fi
    fi
}

# Function to create the .env file if it does not exist
create_env_file() {
    if [ ! -f ".env" ]; then
        echo ".env file does not exist. Creating a new one..."

        # Generate a secure, random JWT secret key
                JWT_SECRET=$(openssl rand -hex 32)

        cat > .env <<EOF
            USERNAME=CISE-username
            PASSWORD=CISE-password
            JWT_SECRET=${JWT_SECRET}
EOF
        echo ".env file created."
        add_to_summary ".env file was created."
    else
        echo ".env file already exists. Skipping creation."
        add_to_summary ".env file was confirmed to already exist."
    fi
}

# Function to check and set permissions for scripts
set_script_permissions() {
    SCRIPTS=("start_backend.sh" "start_frontend.sh" "run_app.sh" "run_appH2.sh" "nuke.sh")
    for script in "${SCRIPTS[@]}"; do
        if [ -f "scripts/$script" ]; then
            chmod u+rwx "scripts/$script"
            echo "Permissions updated for $script"
            add_to_summary "Permissions updated for $script"
        else
            echo "Could not find $script. Your repository may be corrupted or may need to be re-pulled."
            add_to_summary "Could not find $script. Your repository may be corrupted or may need to be re-pulled."
        fi
    done
}

# Detect the operating system
detect_os
add_to_summary "Operating System detected: $OS"

# macOS setup using Homebrew if needed
if [[ "$OS" == "mac" || "$OS" == "linux" ]]; then

    add_to_summary "Key Software checks were made"
    # Check if Node.js (with npm and npx) is installed
    if ! command -v node &> /dev/null; then
        ask_to_install "Node.js (which includes npm and npx)" "brew install node" "node"
        add_to_summary "Node.js was installed via Homebrew."
    else
        echo "Node.js (with npm and npx) is already installed."
        add_to_summary "Node.js (with npm and npx) was already installed."
    fi

    # Check if Java (JRE or JDK) is installed
    if ! command -v java &> /dev/null; then
        ask_to_install "Java (JRE or JDK)" "brew install openjdk" "java"
        add_to_summary "Java was installed via Homebrew."
    else
        echo "Java is already installed."
        add_to_summary "Java was already installed."
    fi

    # Check if Maven is installed
    if ! command -v mvn &> /dev/null; then
        ask_to_install "Maven" "brew install maven" "mvn"
        add_to_summary "Maven was installed via Homebrew."
    else
        echo "Maven is already installed."
        add_to_summary "Maven was already installed."
    fi

# Windows setup with manual download instructions
elif [[ "$OS" == "windows" ]]; then
    echo "For Windows, this script will guide you to download and install missing dependencies manually."
    add_to_summary "Manual installation instructions were provided for Windows dependencies."
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
        add_to_summary "Node.js (with npm and npx) was already installed."
    fi

    # Check for Java
    if ! command -v java &> /dev/null; then
        echo "Java (JRE or JDK) is not installed. Please download and install Java from one of the following sources:"
        echo "1. Oracle Java SE: https://www.oracle.com/java/technologies/javase-downloads.html"
        echo "2. OpenJDK (recommended): https://adoptopenjdk.net/"
        read -p "Press Enter after you have installed Java to continue..."
        if command -v java &> /dev/null; then
            echo "Java was installed successfully."
            add_to_summary "Java was installed successfully."
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
        add_to_summary "Java was already installed."
    fi

    # Check for Maven
    if ! command -v mvn &> /dev/null; then
        echo "Maven is not installed. Please download and install Maven from https://maven.apache.org/download.cgi."
        echo "After downloading, follow the instructions to add Maven to your PATH."
        read -p "Press Enter after you have installed Maven to continue..."
        if command -v mvn &> /dev/null; then
            echo "Maven was installed successfully."
            add_to_summary "Maven was installed successfully."
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
        add_to_summary "Maven was already installed."
    fi
fi

# Create the logs folder if it doesn't exist
LOGS_DIR="Logs"
cd ..
if [ ! -d "$LOGS_DIR" ]; then
    mkdir "$LOGS_DIR"
    echo "Created logs directory: $LOGS_DIR"
fi

# Navigate to the backend folder
cd backend || { echo "The 'backend' folder does not exist. Please check the folder structure."; exit 1; }
add_to_summary "Navigated to the backend directory."

# Manually resolve dependencies in the backend using Maven
echo "Resolving Maven dependencies in the backend folder..."
mvn dependency:resolve 2>&1 | tee "../$LOGS_DIR/maven_resolve.log"
if [ $? -eq 0 ]; then
    add_to_summary "Maven dependencies resolved successfully."
else
    add_to_summary "Failed to resolve Maven dependencies."
fi

# Ensure that Maven installs all dependencies and builds the project
echo "Building the backend project to ensure dependencies are installed..."
mvn clean install 2>&1 | tee "../$LOGS_DIR/maven_build.log"
if [ $? -eq 0 ]; then
    add_to_summary "Maven build succeeded, and dependencies were installed."
else
    add_to_summary "Maven build failed. Check the logs for more details."
fi

if [ $? -ne 0 ]; then
    echo "Maven build failed. Please check for errors in the backend project."
    echo "Check the log file at ../maven_build.log for more details."
    exit 1
fi
echo "Maven build succeeded, and dependencies are installed."
echo "Logs for resolving dependencies and building can be found in maven_resolve.log and maven_build.log respectively."
add_to_summary "Logs for resolving dependencies and building can be found in maven_resolve.log and maven_build.log respectively."

# Navigate back to the root directory
cd ..
add_to_summary "Returned to the root directory after backend setup."

# Navigate to the frontend folder
cd frontend || { echo "The 'frontend' folder does not exist. Please check the folder structure."; exit 1; }
add_to_summary "Navigated to the frontend directory."

# Run npm install
echo "Installing dependencies in the frontend folder..."
npm install
if [ $? -eq 0 ]; then
    add_to_summary "Frontend dependencies installed successfully."
else
    add_to_summary "Failed to install frontend dependencies."
fi

# Navigate back to the root directory
cd ..
add_to_summary "Returned to the root directory after frontend setup."

# Create the .env file if it does not exist
create_env_file

# Secure the .env file
secure_env_file

# Set permissions for scripts (Mac only)
if [[ "$OS" == "mac" || "$OS" == "linux" ]]; then
  set_script_permissions
fi

# Display the summary report
add_to_summary "Setup Complete."
summary_report