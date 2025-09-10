# Local Cron Setup Guide

This guide explains how to set up and use the local cron service for development.

## Quick Start

### 1. **Automatic Setup (Default)**
The local cron service starts automatically when you run the development server:

```bash
npm run dev
```

You'll see:
- A status indicator in the top-right corner showing "Cron: local"
- A cron manager panel in the bottom-right corner
- Console logs showing cron service initialization

### 2. **Manual Control**
If you want to disable auto-start:

```bash
npm run dev:no-cron
```

Then use the cron manager panel to start/stop manually.

## Cron Manager Panel

When running locally, you'll see a cron manager panel in the bottom-right corner with:

### **Status Display**
- **Green dot**: Cron service is running
- **Red dot**: Cron service is stopped
- **Job status**: Shows which individual tasks are active

### **Controls**
- **Start/Stop**: Toggle the cron service
- **Restart**: Restart the cron service
- **Run Now**: Execute all tasks immediately (for testing)

### **Schedule Info**
- **Status Updates**: Every 5 minutes
- **Social Posts**: Every 10 minutes  
- **Engagement**: Every 5 minutes

## Available Scripts

### **Development**
```bash
# Start with cron (default)
npm run dev

# Start without auto-cron
npm run dev:no-cron
```

### **Testing**
```bash
# Test external cron endpoints
npm run test-cron

# Manually trigger cron tasks
npm run cron:run

# Check cron status
npm run cron:status
```

## Configuration

### **Environment Variables**

Create a `.env.local` file:

```bash
# Disable auto-start of local cron (default: true)
NEXT_PUBLIC_AUTO_START_CRON=false

# Base URL for external cron testing
BASE_URL=http://localhost:3000

# Optional: Auth token for external cron
CRON_AUTH_TOKEN=your-secret-token
```

### **Cron Schedules**

Schedules are defined in `lib/services/BaseCronService.ts`:

```typescript
SCHEDULES: {
  STATUS_UPDATE: '* */5 * * *',      // Every 5 minutes
  ONLINE_DISPLAY: '* */5 * * *',     // Every 5 minutes
  SOCIAL_MEDIA_POSTS: '*/10 * * * *', // Every 10 minutes
  CITIZEN_ENGAGEMENT: '*/5 * * * *',  // Every 5 minutes
  CITIZEN_COMMENTING: '*/10 * * * *'  // Every 10 minutes
}
```

## How It Works

### **Local Development**
1. **CronInitializer** detects development environment
2. **LocalCronService** starts automatically (unless disabled)
3. **node-cron** schedules tasks based on configuration
4. **LocalCronManager** provides UI controls

### **Production**
1. **CronInitializer** detects production environment
2. Assumes external cron service is handling scheduling
3. Runs initial tasks once on app startup
4. No local cron service runs

## Troubleshooting

### **Common Issues**

1. **Cron not starting automatically:**
   - Check if `NEXT_PUBLIC_AUTO_START_CRON=false` is set
   - Look for errors in the console
   - Try restarting the development server

2. **Tasks not running:**
   - Check the cron manager panel status
   - Look for error messages in the console
   - Try the "Run Now" button to test manually

3. **Cron manager not visible:**
   - Only shows in development mode
   - Check if you're running `npm run dev`
   - Look in the bottom-right corner

### **Debug Mode**

Enable detailed logging by setting:

```bash
NODE_ENV=development DEBUG=cron:* npm run dev
```

### **Manual Testing**

Test individual components:

```bash
# Test the cron service directly
node -e "
const { LocalCronService } = require('./lib/localCronService');
const service = LocalCronService.getInstance();
service.start();
setTimeout(() => service.stop(), 10000);
"

# Test API endpoints
curl http://localhost:3000/api/cron-trigger
curl -X POST http://localhost:3000/api/external-cron -H "Content-Type: application/json" -d '{"action":"runAll"}'
```

## Development Workflow

### **1. Start Development**
```bash
npm run dev
```

### **2. Monitor Cron Activity**
- Watch console logs for task execution
- Use cron manager panel for control
- Check status indicator in top-right

### **3. Test Changes**
- Use "Run Now" button to test immediately
- Modify schedules in `BaseCronService.ts`
- Restart cron service to apply changes

### **4. Debug Issues**
- Check console for error messages
- Use browser dev tools to inspect network requests
- Test API endpoints directly

## Production Deployment

When deploying to production:

1. **Remove local cron**: The local cron service only runs in development
2. **Set up external cron**: Use one of the external cron services
3. **Configure endpoints**: Point external cron to your production URLs
4. **Monitor logs**: Check Vercel function logs for cron execution

## Best Practices

1. **Use the cron manager**: Don't manually start/stop cron in code
2. **Test before deploying**: Always test cron functionality locally
3. **Monitor logs**: Keep an eye on console output for errors
4. **Use "Run Now"**: Test changes immediately without waiting for schedules
5. **Check status**: Use the status indicator to verify cron is running

Your local development environment now has full cron functionality with an intuitive UI for management!
