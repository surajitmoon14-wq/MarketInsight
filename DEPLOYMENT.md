# MarketInsight Platform Deployment Guide

## Prerequisites
- Render.com account
- Vercel account
- TheSys API credentials (provided)

## Backend Deployment (Render.com)

### Step 1: Create New Web Service on Render
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" → "Web Service"
3. Connect your GitHub repository or upload the code

### Step 2: Configure Build Settings
- **Name**: `market-insight-backend`
- **Environment**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Step 3: Environment Variables
Add these environment variables in Render dashboard:
```
THESYS_API_KEY=surajitmoon14-9547
LANGFUSE_PUBLIC_KEY=dummy_public_key
LANGFUSE_SECRET_KEY=dummy_secret_key
LANGFUSE_HOST=https://cloud.langfuse.com
PYTHON_VERSION=3.11.0
```

### Step 4: Deploy
1. Click "Create Web Service"
2. Wait for deployment to complete
3. Note the deployed URL (e.g., `https://market-insight-backend.onrender.com`)

### Step 5: Test Backend
Test the health endpoint:
```bash
curl https://your-backend-url.onrender.com/health
```

Expected response:
```json
{"status": "ok", "message": "Service is running"}
```

## Frontend Deployment (Vercel)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Configure Environment
Set up Vercel authentication:
```bash
vercel login
```

### Step 3: Deploy Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Set the production API URL:
   ```bash
   # Replace with your actual Render backend URL
   echo "VITE_API_URL=https://your-backend-url.onrender.com/api/chat" > .env.production
   ```

3. Deploy:
   ```bash
   vercel --token xTOEwAZhFFi3QrVRX2TWbztT --prod
   ```

### Step 4: Alternative: Deploy via Vercel Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your repository
4. Set framework preset: `Vite`
5. Configure environment variables:
   - `VITE_API_URL`: `https://your-backend-url.onrender.com/api/chat`
6. Click "Deploy"

## Testing & Validation

### Backend Health Check
```bash
curl https://your-backend-url.onrender.com/health
```

### Chat API Test
```bash
curl -X POST https://your-backend-url.onrender.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": {
      "content": "Analyze the Indian stock market with today'\''s key signals",
      "id": "test-123",
      "role": "user"
    },
    "threadId": "test-thread-456",
    "responseId": "test-response-789"
  }'
```

### Frontend Testing
1. Access the Vercel-deployed frontend URL
2. Test with sample queries:
   - "Analyze the Indian stock market with today's key signals"
   - "Get current price of AAPL"
   - "Show me historical data for TSLA"
3. Verify streaming responses work
4. Check that financial data is retrieved correctly

## Troubleshooting

### Backend Issues
- Check Render logs for build errors
- Verify environment variables are set correctly
- Test TheSys API key is valid
- Ensure all dependencies are in requirements.txt

### Frontend Issues
- Check build logs in Vercel dashboard
- Verify VITE_API_URL points to correct backend
- Check browser console for CORS errors
- Ensure frontend builds successfully locally

### CORS Issues
If you encounter CORS errors:
1. Update `main.py` to include your Vercel domain:
   ```python
   allow_origins=["https://your-frontend.vercel.app"]
   ```
2. Redeploy the backend

## End-to-End Testing

### Complete Flow Test
1. **Backend**: Test health endpoint
2. **Backend**: Test chat endpoint with streaming
3. **Frontend**: Load the application
4. **Frontend**: Send test query
5. **Frontend**: Verify streaming response
6. **Frontend**: Test multiple stock queries

### Sample Test Queries
```
"Analyze the Indian stock market with today's key signals"
"Get current price of AAPL"
"Show me Tesla's stock performance this month"
"What are the top gainers today?"
"Analyze NSE:RELIANCE financials"
```

## Security Considerations
- Never commit API keys to version control
- Use environment variables for all secrets
- Consider rate limiting for production use
- Monitor API usage and costs
- Set up proper CORS policies for production

## Monitoring
- Monitor Render service status and logs
- Check Vercel deployment status
- Monitor TheSys API usage
- Set up alerts for service downtime

## Post-Deployment
- Bookmark both URLs
- Share frontend URL for testing
- Monitor initial usage patterns
- Collect user feedback
- Plan for scaling based on usage