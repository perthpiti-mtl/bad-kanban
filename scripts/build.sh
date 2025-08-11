#!/bin/bash
# Production build automation script for BMad Kanban Board

set -e  # Exit immediately if a command exits with a non-zero status

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOCKER_IMAGE_NAME="bmad-kanban"
DOCKER_IMAGE_TAG="${1:-latest}"
BUILD_CONTEXT="."
DOCKERFILE_PATH="docker/Dockerfile"

echo -e "${BLUE}🐳 Building Docker image: ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}${NC}"

# Check if Docker is installed and running
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed or not in PATH${NC}"
    exit 1
fi

if ! docker info &> /dev/null; then
    echo -e "${RED}❌ Docker daemon is not running${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Build Information:${NC}"
echo "  Image Name: ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"
echo "  Build Context: ${BUILD_CONTEXT}"
echo "  Dockerfile: ${DOCKERFILE_PATH}"
echo "  Build Args: BUILDKIT_INLINE_CACHE=1"

# Enable Docker BuildKit for better performance
export DOCKER_BUILDKIT=1

# Build the Docker image
echo -e "${BLUE}🔨 Starting Docker build...${NC}"

docker build \
    --file "${DOCKERFILE_PATH}" \
    --tag "${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}" \
    --build-arg BUILDKIT_INLINE_CACHE=1 \
    --cache-from "${DOCKER_IMAGE_NAME}:latest" \
    "${BUILD_CONTEXT}"

# Check if build was successful
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Docker image built successfully!${NC}"
    
    # Show image information
    echo -e "${YELLOW}📊 Image Information:${NC}"
    docker image ls "${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"
    
    # Show image size
    IMAGE_SIZE_BYTES=$(docker image inspect "${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}" --format='{{.Size}}')
    if command -v numfmt &> /dev/null; then
        IMAGE_SIZE=$(echo "${IMAGE_SIZE_BYTES}" | numfmt --to=iec --suffix=B)
    else
        IMAGE_SIZE="${IMAGE_SIZE_BYTES} bytes"
    fi
    echo -e "${BLUE}📦 Image Size: ${IMAGE_SIZE}${NC}"
    
else
    echo -e "${RED}❌ Docker build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 Build completed successfully!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "  • Test the image: ./scripts/test.sh"
echo "  • Run the container: docker run -p 3000:3000 ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"
echo "  • Deploy: ./scripts/deploy.sh"