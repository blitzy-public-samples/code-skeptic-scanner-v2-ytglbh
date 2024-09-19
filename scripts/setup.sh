#!/bin/bash

# Function to check if required dependencies are installed
check_dependencies() {
    echo "Checking dependencies..."

    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        echo "Node.js is not installed. Please install Node.js and try again."
        exit 1
    fi

    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        echo "npm is not installed. Please install npm and try again."
        exit 1
    fi

    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        echo "Docker is not installed. Please install Docker and try again."
        exit 1
    fi

    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        echo "Docker Compose is not installed. Please install Docker Compose and try again."
        exit 1
    fi

    echo "All dependencies are installed."
}

# Function to set up the development environment
setup_environment() {
    echo "Setting up the development environment..."

    # Create .env file from .env.example if it doesn't exist
    if [ ! -f .env ]; then
        echo "Creating .env file from .env.example..."
        cp .env.example .env
    fi

    # Install Node.js dependencies using npm
    echo "Installing Node.js dependencies..."
    npm install

    # Build Docker containers using docker-compose
    echo "Building Docker containers..."
    docker-compose build

    # Initialize the database with seed data
    echo "Initializing database with seed data..."
    docker-compose run --rm app npm run db:seed

    echo "Environment setup complete."
}

# Main function to run the setup script
main() {
    echo "Welcome to the Code Skeptic Scanner setup script!"

    # Call check_dependencies function
    check_dependencies

    # Call setup_environment function
    setup_environment

    echo "Setup complete. You can now start developing the Code Skeptic Scanner system."
}

# Run the main function
main

# Human tasks (for future improvements):
# - Regularly update the list of dependencies in the check_dependencies function
# - Add error handling for each step in the setup process
# - Implement a cleanup function to revert changes if setup fails
# - Add options for custom configuration (e.g., different database, custom ports)
# - Implement a verbose mode for detailed logging during setup
# - Add a function to verify the setup was successful
# - Create a separate script for tearing down the development environment