#!/bin/bash
# Deployment automation script for BMad Kanban Board

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
CONTAINER_NAME="bmad-kanban-prod"
PROD_PORT="3000"
BACKUP_CONTAINER=""

echo -e "${BLUE}🚀 Deploying BMad Kanban Board${NC}"

# Function to rollback deployment
rollback() {
    if [ -n "${BACKUP_CONTAINER}" ]; then
        echo -e "${YELLOW}⏪ Rolling back to previous version...${NC}"
        docker stop "${CONTAINER_NAME}" &> /dev/null || true
        docker rm "${CONTAINER_NAME}" &> /dev/null || true
        docker rename "${BACKUP_CONTAINER}" "${CONTAINER_NAME}"
        echo -e "${GREEN}✅ Rollback completed${NC}"
    fi
}

# Trap to handle rollback on failure
trap rollback ERR

# Check if Docker image exists
if ! docker image inspect "${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}" &> /dev/null; then
    echo -e "${RED}❌ Docker image ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG} not found${NC}"
    echo -e "${BLUE}💡 Run ./scripts/build.sh first${NC}"
    exit 1
fi

# Check if there's an existing container
if docker ps -a --format "table {{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
    echo -e "${YELLOW}🔄 Found existing container, creating backup...${NC}"
    
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_CONTAINER="${CONTAINER_NAME}_backup_${TIMESTAMP}"
    
    # Stop the existing container
    docker stop "${CONTAINER_NAME}" &> /dev/null || true
    
    # Rename existing container as backup
    docker rename "${CONTAINER_NAME}" "${BACKUP_CONTAINER}"
    
    echo -e "${GREEN}✅ Backup created: ${BACKUP_CONTAINER}${NC}"
fi

# Deploy new container
echo -e "${BLUE}📦 Deploying new container...${NC}"
docker run -d \
    --name "${CONTAINER_NAME}" \
    --port "${PROD_PORT}:3000" \
    --env NODE_ENV=production \
    --env PORT=3000 \
    --env HOST=0.0.0.0 \
    --restart unless-stopped \
    "${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"

# Wait for container to start
echo -e "${YELLOW}⏳ Waiting for container to start...${NC}"
sleep 10

# Health check
echo -e "${BLUE}🏥 Performing health check...${NC}"
HEALTH_ENDPOINT="http://localhost:${PROD_PORT}/api/health"

for i in {1..20}; do
    if curl -f -s "${HEALTH_ENDPOINT}" &> /dev/null; then
        echo -e "${GREEN}✅ Health check passed${NC}"
        break
    else
        if [ $i -eq 20 ]; then
            echo -e "${RED}❌ Health check failed after 20 attempts${NC}"
            exit 1
        fi
        echo -e "${YELLOW}⏳ Health check attempt $i/20...${NC}"
        sleep 3
    fi
done

# Verify application is responding
echo -e "${BLUE}🔍 Verifying application response...${NC}"
HTTP_STATUS=$(curl -o /dev/null -s -w "%{http_code}" "http://localhost:${PROD_PORT}/" || echo "000")
if [ "${HTTP_STATUS}" = "200" ]; then
    echo -e "${GREEN}✅ Application is responding correctly${NC}"
else
    echo -e "${RED}❌ Application is not responding correctly (HTTP ${HTTP_STATUS})${NC}"
    exit 1
fi

# Deployment successful - cleanup backup
if [ -n "${BACKUP_CONTAINER}" ]; then
    echo -e "${BLUE}🧹 Cleaning up backup container...${NC}"
    docker rm "${BACKUP_CONTAINER}" &> /dev/null || true
    echo -e "${GREEN}✅ Backup container removed${NC}"
fi

# Clear the trap since deployment was successful
trap - ERR

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Deployment Summary:${NC}"
echo "  🎯 Image: ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"
echo "  📦 Container: ${CONTAINER_NAME}"
echo "  🌐 Port: ${PROD_PORT}"
echo "  🏥 Health: http://localhost:${PROD_PORT}/api/health"
echo "  🖥️  Application: http://localhost:${PROD_PORT}"
echo ""
echo -e "${BLUE}🔧 Management Commands:${NC}"
echo "  • View logs: docker logs ${CONTAINER_NAME}"
echo "  • Stop: docker stop ${CONTAINER_NAME}"
echo "  • Restart: docker restart ${CONTAINER_NAME}"
echo "  • Shell access: docker exec -it ${CONTAINER_NAME} sh"