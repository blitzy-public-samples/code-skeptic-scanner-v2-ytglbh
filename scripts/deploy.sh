#!/bin/bash

# Code Skeptic Scanner Deployment Script

# Function to check if the deployment environment is properly set up
check_environment() {
    echo "Checking deployment environment..."

    # Check if required environment variables are set
    if [ -z "$DEPLOY_SERVER" ] || [ -z "$DOCKER_REGISTRY" ]; then
        echo "Error: DEPLOY_SERVER or DOCKER_REGISTRY environment variables are not set."
        exit 1
    fi

    # Verify access to deployment server
    if ! ssh -q "$DEPLOY_SERVER" exit; then
        echo "Error: Cannot access deployment server."
        exit 1
    fi

    # Check if Docker is installed on the deployment server
    if ! ssh "$DEPLOY_SERVER" "command -v docker >/dev/null 2>&1"; then
        echo "Error: Docker is not installed on the deployment server."
        exit 1
    fi

    # Verify access to Docker registry
    if ! docker login "$DOCKER_REGISTRY"; then
        echo "Error: Cannot access Docker registry."
        exit 1
    fi

    echo "Environment check passed."
}

# Function to build Docker images and push them to the registry
build_and_push() {
    echo "Building and pushing Docker images..."

    # Build Docker images for each service
    docker build -t "$DOCKER_REGISTRY/code-skeptic-scanner:$VERSION" .
    docker build -t "$DOCKER_REGISTRY/code-skeptic-scanner:latest" .

    # Push Docker images to the registry
    docker push "$DOCKER_REGISTRY/code-skeptic-scanner:$VERSION"
    docker push "$DOCKER_REGISTRY/code-skeptic-scanner:latest"

    # Verify successful push for each image
    if ! docker pull "$DOCKER_REGISTRY/code-skeptic-scanner:$VERSION" >/dev/null; then
        echo "Error: Failed to push image to registry."
        exit 1
    fi

    echo "Docker images built and pushed successfully."
}

# Function to update the deployment server with the new version
update_server() {
    echo "Updating deployment server..."

    # SSH into the deployment server and perform updates
    ssh "$DEPLOY_SERVER" << EOF
        # Pull the latest Docker images
        docker pull "$DOCKER_REGISTRY/code-skeptic-scanner:$VERSION"

        # Update docker-compose.yml file with new image versions
        sed -i 's|image: $DOCKER_REGISTRY/code-skeptic-scanner:.*|image: $DOCKER_REGISTRY/code-skeptic-scanner:$VERSION|' docker-compose.yml

        # Stop the currently running services
        docker-compose down

        # Start the updated services using docker-compose up
        docker-compose up -d

        # Verify all services are running correctly
        if ! docker-compose ps | grep -q "Up"; then
            echo "Error: Services failed to start."
            exit 1
        fi
EOF

    echo "Deployment server updated successfully."
}

# Function to run any necessary database migrations
run_migrations() {
    echo "Running database migrations..."

    # Connect to the database container and run migration scripts
    ssh "$DEPLOY_SERVER" << EOF
        docker-compose exec db /app/run_migrations.sh

        # Verify migrations completed successfully
        if [ $? -ne 0 ]; then
            echo "Error: Database migrations failed."
            exit 1
        fi
EOF

    echo "Database migrations completed successfully."
}

# Function to perform a health check on the deployed system
perform_health_check() {
    echo "Performing health check..."

    # Wait for all services to fully start
    sleep 30

    # Send requests to health check endpoints and verify responses
    ssh "$DEPLOY_SERVER" << EOF
        if ! curl -sSf http://localhost/health >/dev/null; then
            echo "Error: Health check failed."
            exit 1
        fi

        # Check logs for any error messages
        if docker-compose logs | grep -i error; then
            echo "Error: Found error messages in logs."
            exit 1
        fi
EOF

    echo "Health check passed successfully."
}

# Function to roll back to the previous version if deployment fails
rollback() {
    echo "Rolling back to previous version..."

    ssh "$DEPLOY_SERVER" << EOF
        # Stop the current services
        docker-compose down

        # Revert docker-compose.yml to previous version
        git checkout HEAD^ docker-compose.yml

        # Start services with previous version
        docker-compose up -d

        # Verify all services are running correctly
        if ! docker-compose ps | grep -q "Up"; then
            echo "Error: Rollback failed. Services not running."
            exit 1
        fi
EOF

    echo "Rollback completed. Sending notification..."
    # TODO: Implement notification mechanism
}

# Main function to run the deployment script
main() {
    echo "Starting deployment process..."

    check_environment
    build_and_push
    update_server
    run_migrations
    perform_health_check

    if [ $? -ne 0 ]; then
        echo "Deployment failed. Initiating rollback..."
        rollback
        exit 1
    fi

    echo "Deployment completed successfully."
}

# Run the main function
main

# Human Tasks:
# TODO: Implement a mechanism to notify team members about deployment status
# TODO: Add support for blue-green deployment strategy
# TODO: Implement a way to easily rollback to any previous version, not just the immediate previous one
# TODO: Add more comprehensive logging throughout the deployment process
# TODO: Implement a dry-run option to simulate deployment without making actual changes
# TODO: Add support for deploying to multiple environments (staging, production)
# TODO: Implement automated testing as part of the deployment process