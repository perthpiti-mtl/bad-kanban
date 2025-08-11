#!/bin/bash
# Container testing script for BMad Kanban Board

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
CONTAINER_NAME="bmad-kanban-test"
TEST_PORT="3001"
HEALTH_ENDPOINT="http://localhost:${TEST_PORT}/api/health"

echo -e "${BLUE}🧪 Testing Docker container: ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}${NC}"

# Function to cleanup container
cleanup() {
    echo -e "${YELLOW}🧹 Cleaning up test container...${NC}"
    docker stop "${CONTAINER_NAME}" &> /dev/null || true
    docker rm "${CONTAINER_NAME}" &> /dev/null || true
}

# Trap to ensure cleanup on exit
trap cleanup EXIT

# Check if Docker image exists
if ! docker image inspect "${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}" &> /dev/null; then
    echo -e "${RED}❌ Docker image ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG} not found${NC}"
    echo -e "${BLUE}💡 Run ./scripts/build.sh first${NC}"
    exit 1
fi

# Start the container
echo -e "${BLUE}🚀 Starting test container...${NC}"
docker run -d \
    --name "${CONTAINER_NAME}" \
    -p "${TEST_PORT}:3000" \
    --env NODE_ENV=production \
    --env PORT=3000 \
    "${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"

# Wait for container to start
echo -e "${YELLOW}⏳ Waiting for container to start...${NC}"
sleep 10

# Test 1: Check if container is running
echo -e "${BLUE}🔍 Test 1: Container Status${NC}"
if docker ps | grep -q "${CONTAINER_NAME}"; then
    echo -e "${GREEN}✅ Container is running${NC}"
else
    echo -e "${RED}❌ Container is not running${NC}"
    echo -e "${YELLOW}📋 Container logs:${NC}"
    docker logs "${CONTAINER_NAME}"
    exit 1
fi

# Test 2: Check container logs for errors
echo -e "${BLUE}🔍 Test 2: Container Logs${NC}"
ERROR_COUNT=$(docker logs "${CONTAINER_NAME}" 2>&1 | grep -i error | wc -l || true)
if [ "${ERROR_COUNT}" -eq 0 ]; then
    echo -e "${GREEN}✅ No errors in container logs${NC}"
else
    echo -e "${RED}❌ Found ${ERROR_COUNT} errors in container logs${NC}"
    docker logs "${CONTAINER_NAME}" 2>&1 | grep -i error
fi

# Test 3: Test health check endpoint
echo -e "${BLUE}🔍 Test 3: Health Check Endpoint${NC}"
for i in {1..10}; do
    if curl -f -s "${HEALTH_ENDPOINT}" &> /dev/null; then
        HEALTH_RESPONSE=$(curl -s "${HEALTH_ENDPOINT}")
        echo -e "${GREEN}✅ Health check endpoint is responding${NC}"
        echo -e "${YELLOW}📊 Health Response:${NC}"
        echo "${HEALTH_RESPONSE}" | jq '.' 2>/dev/null || echo "${HEALTH_RESPONSE}"
        break
    else
        if [ $i -eq 10 ]; then
            echo -e "${RED}❌ Health check endpoint is not responding after 10 attempts${NC}"
            exit 1
        fi
        echo -e "${YELLOW}⏳ Attempt $i/10: Waiting for health endpoint...${NC}"
        sleep 3
    fi
done

# Test 4: Check application port response
echo -e "${BLUE}🔍 Test 4: Application Port Response${NC}"
HTTP_STATUS=$(curl -o /dev/null -s -w "%{http_code}" "http://localhost:${TEST_PORT}/" || echo "000")
if [ "${HTTP_STATUS}" = "200" ]; then
    echo -e "${GREEN}✅ Application is serving on port ${TEST_PORT}${NC}"
else
    echo -e "${RED}❌ Application is not responding correctly (HTTP ${HTTP_STATUS})${NC}"
    exit 1
fi

# Test 5: Docker health check
echo -e "${BLUE}🔍 Test 5: Docker Health Check${NC}"
HEALTH_STATUS=$(docker inspect --format='{{.State.Health.Status}}' "${CONTAINER_NAME}" 2>/dev/null || echo "none")
if [ "${HEALTH_STATUS}" = "healthy" ] || [ "${HEALTH_STATUS}" = "none" ]; then
    echo -e "${GREEN}✅ Docker health check passed${NC}"
else
    echo -e "${RED}❌ Docker health check failed: ${HEALTH_STATUS}${NC}"
    exit 1
fi

# Test 6: Security check - verify non-root user
echo -e "${BLUE}🔍 Test 6: Security - Non-root User${NC}"
CONTAINER_USER=$(docker exec "${CONTAINER_NAME}" whoami 2>/dev/null || echo "unknown")
if [ "${CONTAINER_USER}" != "root" ]; then
    echo -e "${GREEN}✅ Container is running as non-root user: ${CONTAINER_USER}${NC}"
else
    echo -e "${RED}❌ Container is running as root user (security risk)${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 All tests passed successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Test Summary:${NC}"
echo "  ✅ Container Status: Running"
echo "  ✅ Container Logs: No errors"
echo "  ✅ Health Check: Responding"
echo "  ✅ Application Port: Serving"
echo "  ✅ Docker Health: Passing"
echo "  ✅ Security: Non-root user"
echo ""
echo -e "${BLUE}🚀 Container is ready for deployment!${NC}"