# Fly.io Deployment Guide for WATC Backend

## Prerequisites

1. Install the Fly CLI:
   ```bash
   # Windows (PowerShell)
   iwr https://fly.io/install.ps1 -useb | iex
   
   # macOS/Linux
   curl -L https://fly.io/install.sh | sh
   ```

2. Sign up and log in to Fly.io:
   ```bash
   fly auth signup
   # or if you already have an account
   fly auth login
   ```

## Initial Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Launch your app (this will use the existing fly.toml):
   ```bash
   fly launch --no-deploy
   ```
   
   When prompted:
   - Choose your app name (or use the default: watc-backend)
   - Select a region (cdg for Paris is configured by default)
   - Don't add a PostgreSQL database (you're using Supabase)
   - Don't deploy yet

3. Set your secrets (environment variables):
   ```bash
   fly secrets set DATABASE_URL="jdbc:postgresql://db.gygbcbfykulofuihqjzk.supabase.co:5432/postgres"
   fly secrets set DATABASE_USERNAME="postgres"
   fly secrets set DATABASE_PASSWORD="95830078Ra@!"
   fly secrets set GEMINI_API_KEY="AIzaSyBgiK6rFTc-ZnUdeT0QA5aQmR8oxNG9mC0"
   fly secrets set JWT_SECRET="404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970"
   fly secrets set JWT_EXPIRATION="86400000"
   ```

4. Set CORS allowed origins (update with your frontend URL):
   ```bash
   fly secrets set CORS_ALLOWED_ORIGINS="https://your-frontend-domain.com,http://localhost:3000"
   ```

## Deploy

Deploy your application:
```bash
fly deploy
```

## Useful Commands

### View logs
```bash
fly logs
```

### Check app status
```bash
fly status
```

### Open your app in browser
```bash
fly open
```

### SSH into your app
```bash
fly ssh console
```

### Scale your app
```bash
# Scale to 2 machines
fly scale count 2

# Change machine size
fly scale vm shared-cpu-1x --memory 512
```

### View secrets
```bash
fly secrets list
```

### Update a secret
```bash
fly secrets set SECRET_NAME="new-value"
```

### Restart your app
```bash
fly apps restart watc-backend
```

## Health Check

Your app includes a health check endpoint at:
```
https://watc-backend.fly.dev/actuator/health
```

## Troubleshooting

### Check if the app is running
```bash
fly status
```

### View recent logs
```bash
fly logs --app watc-backend
```

### Check machine details
```bash
fly machine list
```

### If deployment fails
1. Check logs: `fly logs`
2. Verify secrets are set: `fly secrets list`
3. Ensure Dockerfile builds locally: `docker build -t watc-backend .`
4. Check Supabase database connectivity

## Cost Optimization

The current configuration uses:
- Auto-stop machines when idle
- Auto-start on requests
- Minimum 0 machines running (scales to zero)
- 1GB RAM, 1 shared CPU

This should keep costs minimal while maintaining good performance.

## Update CORS After Frontend Deployment

Once you deploy your frontend, update CORS:
```bash
fly secrets set CORS_ALLOWED_ORIGINS="https://your-actual-frontend-url.com"
```

## Custom Domain (Optional)

To add a custom domain:
```bash
fly certs add your-domain.com
```

Then add the DNS records shown in the output to your domain provider.
