# External Cron Setup Guide

This guide explains how to set up external cron services to handle your business simulator's scheduled tasks instead of using Vercel's built-in cron.

## Available Endpoints

### 1. Simple GET Endpoint (Recommended)
**URL:** `https://your-domain.vercel.app/api/cron-trigger`  
**Method:** GET  
**Description:** Simple endpoint for basic cron services

### 2. Advanced POST Endpoint
**URL:** `https://your-domain.vercel.app/api/external-cron`  
**Method:** POST  
**Description:** Advanced endpoint with authentication and task selection

## Recommended External Cron Services

### 1. Uptime Robot (Free)
- **URL:** `https://your-domain.vercel.app/api/cron-trigger`
- **Interval:** Every 5 minutes
- **Method:** GET
- **Setup:** 
  1. Go to [Uptime Robot](https://uptimerobot.com/)
  2. Add a new monitor
  3. Choose "HTTP(s)" type
  4. Enter your endpoint URL
  5. Set interval to 5 minutes

### 2. Cron-job.org (Free)
- **URL:** `https://your-domain.vercel.app/api/cron-trigger`
- **Interval:** Every 5 minutes
- **Method:** GET
- **Setup:**
  1. Go to [Cron-job.org](https://cron-job.org/)
  2. Create a new cron job
  3. Enter your endpoint URL
  4. Set schedule to `*/5 * * * *` (every 5 minutes)

### 3. EasyCron (Free tier available)
- **URL:** `https://your-domain.vercel.app/api/cron-trigger`
- **Interval:** Every 5 minutes
- **Method:** GET
- **Setup:**
  1. Go to [EasyCron](https://www.easycron.com/)
  2. Create a new cron job
  3. Enter your endpoint URL
  4. Set schedule to `*/5 * * * *`

### 4. GitHub Actions (Free for public repos)
Create `.github/workflows/cron.yml`:
```yaml
name: Business Simulator Cron
on:
  schedule:
    - cron: '*/5 * * * *'  # Every 5 minutes
  workflow_dispatch:  # Allow manual trigger

jobs:
  cron:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Cron Tasks
        run: |
          curl -X GET "https://your-domain.vercel.app/api/cron-trigger"
```

### 5. Your Own Server
If you have a server, add to crontab:
```bash
# Edit crontab
crontab -e

# Add this line (every 5 minutes)
*/5 * * * * curl -X GET "https://your-domain.vercel.app/api/cron-trigger"
```

## Task Scheduling

The system intelligently manages task intervals:

- **Citizen Status Updates:** Every 5 minutes
- **Unread Messages Check:** Every 5 minutes
- **Social Media Posts:** Every 10 minutes
- **Citizen Engagement:** Every 5 minutes
- **Citizen Commenting:** Every 10 minutes

## Security (Optional)

For the advanced endpoint, you can set an authentication token:

1. Add to your environment variables:
   ```
   CRON_AUTH_TOKEN=your-secret-token-here
   ```

2. Use in your cron service:
   ```bash
   curl -X POST "https://your-domain.vercel.app/api/external-cron" \
        -H "Content-Type: application/json" \
        -d '{"auth": "your-secret-token-here"}'
   ```

## Monitoring

### Check Cron Status
```bash
curl "https://your-domain.vercel.app/api/cron-trigger"
```

### View Logs
Check your Vercel function logs in the Vercel dashboard to see cron execution details.

## Troubleshooting

### Common Issues

1. **Tasks not running regularly:**
   - Check if your external cron service is actually calling the endpoint
   - Verify the URL is correct
   - Check Vercel function logs

2. **Tasks running too frequently:**
   - The system has built-in interval management
   - Tasks will only run when their interval has passed
   - Check the logs to see which tasks are being skipped

3. **Authentication errors:**
   - Make sure `CRON_AUTH_TOKEN` is set correctly
   - Verify the token matches in your cron service

### Testing

Test your cron setup manually:
```bash
# Test simple endpoint
curl "https://your-domain.vercel.app/api/cron-trigger"

# Test advanced endpoint
curl -X POST "https://your-domain.vercel.app/api/external-cron" \
     -H "Content-Type: application/json" \
     -d '{"action": "runAll"}'
```

## Migration from Vercel Cron

1. ✅ Vercel cron configuration has been removed
2. ✅ External cron endpoints are ready
3. ✅ Set up your preferred external cron service
4. ✅ Test the setup with manual requests
5. ✅ Monitor the logs to ensure everything works

Your cron jobs will now run independently of Vercel's infrastructure!
