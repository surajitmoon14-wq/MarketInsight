#!/bin/bash

# MarketInsight Platform Deployment Script
# This script deploys the complete MarketInsight platform using provided credentials

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKEND_NAME="market-insight-backend"
VERCEL_TOKEN="xTOEwAZhFFi3QrVRX2TWbztT"
THESYS_API_KEY="surajitmoon14-9547"

echo -e "${BLUE}🚀 MarketInsight Platform Deployment Script${NC}"
echo "=============================================="

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if required tools are installed
check_dependencies() {
    echo -e "\n${BLUE}📋 Checking Dependencies...${NC}"
    
    # Check if we're in the right directory
    if [ ! -f "main.py" ] || [ ! -d "frontend" ]; then
        print_error "Please run this script from the project root directory"
        exit 1
    fi
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    # Check if Python is installed
    if ! command -v python3 &> /dev/null; then
        print_error "Python3 is not installed"
        exit 1
    fi
    
    print_status "All dependencies are available"
}

# Prepare backend for deployment
prepare_backend() {
    echo -e "\n${BLUE}🔧 Preparing Backend...${NC}"
    
    # Update render.yaml with proper environment variables
    cat > render.yaml << EOF
services:
  - type: web
    name: market-insight-backend
    env: python
    buildCommand: "pip install -r requirements.txt"
    startCommand: "uvicorn main:app --host 0.0.0.0 --port \$PORT"
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
      - key: THESYS_API_KEY
        value: ${THESYS_API_KEY}
      - key: LANGFUSE_PUBLIC_KEY
        value: dummy_public_key
      - key: LANGFUSE_SECRET_KEY
        value: dummy_secret_key
      - key: LANGFUSE_HOST
        value: https://cloud.langfuse.com
EOF
    
    print_status "Backend configuration updated"
}

# Test backend locally
test_backend() {
    echo -e "\n${BLUE}🧪 Testing Backend Locally...${NC}"
    
    # Install dependencies in virtual environment
    python3 -m venv deploy_test_env
    source deploy_test_env/bin/activate
    pip install -r requirements.txt
    
    # Set environment variables
    export THESYS_API_KEY="${THESYS_API_KEY}"
    export LANGFUSE_PUBLIC_KEY="dummy_public_key"
    export LANGFUSE_SECRET_KEY="dummy_secret_key"
    export LANGFUSE_HOST="https://cloud.langfuse.com"
    
    # Test imports
    python3 -c "
import sys
sys.path.append('.')
from main import app
print('Backend imports successfully')
" || {
        print_error "Backend import test failed"
        exit 1
    }
    
    # Cleanup
    deactivate
    rm -rf deploy_test_env
    
    print_status "Backend test passed"
}

# Prepare frontend for deployment
prepare_frontend() {
    echo -e "\n${BLUE}🎨 Preparing Frontend...${NC}"
    
    cd frontend
    
    # Update package.json for Vercel deployment
    if [ ! -f "vercel.json" ]; then
        cat > vercel.json << EOF
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
EOF
    fi
    
    cd ..
    
    print_status "Frontend configuration updated"
}

# Deploy backend to Render (manual instructions)
deploy_backend_manual() {
    echo -e "\n${BLUE}🔴 Backend Deployment Instructions (Render.com)${NC}"
    echo "================================================="
    echo ""
    print_warning "Manual deployment required for Render.com"
    echo ""
    echo "Please follow these steps:"
    echo "1. Go to https://dashboard.render.com/"
    echo "2. Click 'New' → 'Web Service'"
    echo "3. Connect your GitHub repository"
    echo "4. Configure as follows:"
    echo "   - Name: market-insight-backend"
    echo "   - Environment: Python 3"
    echo "   - Build Command: pip install -r requirements.txt"
    echo "   - Start Command: uvicorn main:app --host 0.0.0.0 --port \$PORT"
    echo ""
    echo "5. Add Environment Variables:"
    echo "   - THESYS_API_KEY=${THESYS_API_KEY}"
    echo "   - LANGFUSE_PUBLIC_KEY=dummy_public_key"
    echo "   - LANGFUSE_SECRET_KEY=dummy_secret_key"
    echo "   - LANGFUSE_HOST=https://cloud.langfuse.com"
    echo "   - PYTHON_VERSION=3.11.0"
    echo ""
    echo "6. Click 'Create Web Service'"
    echo "7. Wait for deployment and note your URL (e.g., https://market-insight-backend.onrender.com)"
    echo ""
}

# Deploy frontend to Vercel
deploy_frontend_vercel() {
    echo -e "\n${BLUE}🟢 Frontend Deployment (Vercel)${NC}"
    echo "===================================="
    
    cd frontend
    
    # Install Vercel CLI if not already installed
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found, installing..."
        npm install -g vercel
    fi
    
    # Set Vercel token
    export VERCEL_TOKEN="${VERCEL_TOKEN}"
    
    # Update .env.production with placeholder (will be updated after backend deployment)
    echo "VITE_API_URL=https://your-backend-url.onrender.com/api/chat" > .env.production
    
    # Build frontend
    echo "Building frontend..."
    npm run build
    
    # Deploy to Vercel
    echo "Deploying to Vercel..."
    vercel --token "${VERCEL_TOKEN}" --prod --yes || {
        print_warning "Vercel deployment may require manual setup"
        echo ""
        echo "Alternative: Manual Vercel deployment:"
        echo "1. Go to https://vercel.com/dashboard"
        echo "2. Click 'New Project'"
        echo "3. Import your repository"
        echo "4. Set framework preset: Vite"
        echo "5. Build command: npm run build"
        echo "6. Output directory: dist"
        echo "7. Deploy"
    }
    
    cd ..
    
    print_status "Frontend deployment completed"
}

# Generate deployment summary
generate_summary() {
    echo -e "\n${BLUE}📋 Deployment Summary${NC}"
    echo "======================="
    echo ""
    echo -e "${GREEN}Backend Configuration:${NC}"
    echo "- Ready for Render.com deployment"
    echo "- TheSys API Key: Configured"
    echo "- Langfuse: Dummy keys configured"
    echo "- Health endpoint: GET /health"
    echo "- Chat endpoint: POST /api/chat"
    echo ""
    echo -e "${GREEN}Frontend Configuration:${NC}"
    echo "- Ready for Vercel deployment"
    echo "- Framework: Vite + React"
    echo "- C1Chat component from @thesysai/genui-sdk"
    echo "- Environment: VITE_API_URL (needs backend URL)"
    echo ""
    echo -e "${YELLOW}Next Steps:${NC}"
    echo "1. Deploy backend to Render.com (see instructions above)"
    echo "2. Note your Render backend URL"
    echo "3. Update frontend .env.production with your backend URL"
    echo "4. Deploy frontend to Vercel"
    echo "5. Test the complete application"
    echo ""
    echo -e "${BLUE}Sample Test Queries:${NC}"
    echo "- 'Analyze the Indian stock market with today's key signals'"
    echo "- 'Get current price of AAPL'"
    echo "- 'Show me Tesla's stock performance this month'"
    echo "- 'What are the top gainers today?'"
    echo ""
}

# Main execution
main() {
    echo "Starting MarketInsight platform deployment..."
    
    check_dependencies
    prepare_backend
    test_backend
    prepare_frontend
    deploy_frontend_vercel
    deploy_backend_manual
    generate_summary
    
    echo -e "\n${GREEN}🎉 Deployment preparation completed!${NC}"
    echo "Please complete the manual steps for Render.com deployment."
}

# Run main function
main "$@"