# Vercel Deployment Guide

This guide will help you deploy the Business Simulator app to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. A MongoDB Atlas account and cluster
3. An OpenAI API key

## Environment Variables

Create the following environment variables in your Vercel project:

### Required Variables

```bash
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DATABASE=business-simulator

# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here

# Next.js Configuration
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-random-secret-key-here
```

### Optional Variables

```bash
NODE_ENV=production
```

## Deployment Steps

### 1. Prepare Your Repository

1. Ensure all changes are committed to your Git repository
2. Push your changes to GitHub, GitLab, or Bitbucket

### 2. Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your Git repository
4. Vercel will automatically detect it's a Next.js project
5. Add your environment variables in the "Environment Variables" section
6. Click "Deploy"

#### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy from your project directory:
   ```bash
   vercel
   ```

4. Follow the prompts to configure your project
5. Add environment variables:
   ```bash
   vercel env add MONGODB_URI
   vercel env add MONGODB_DATABASE
   vercel env add OPENAI_API_KEY
   vercel env add NEXTAUTH_URL
   vercel env add NEXTAUTH_SECRET
   ```

### 3. Configure Cron Jobs

The app uses Vercel's built-in cron functionality. The cron job is configured in `vercel.json` to run every 5 minutes and execute all scheduled tasks.

You can also manually trigger cron tasks by making POST requests to `/api/cron`:

```bash
# Run all tasks
curl -X POST https://your-app.vercel.app/api/cron \
  -H "Content-Type: application/json" \
  -d '{"action": "runAll"}'

# Run specific task
curl -X POST https://your-app.vercel.app/api/cron \
  -H "Content-Type: application/json" \
  -d '{"action": "runTask", "taskName": "citizenStatus"}'
```

### 4. Verify Deployment

1. Check that your app is accessible at the Vercel URL
2. Test the API endpoints:
   - `GET /api/cron` - Check cron service status
   - `GET /api/citizens` - Verify citizens data
   - `GET /api/analytics` - Check analytics data

3. Monitor the Vercel dashboard for any deployment issues

## Important Notes

### Serverless Limitations

- **Cold Starts**: The first request to each API route may be slower due to cold starts
- **Execution Time**: Each function has a maximum execution time of 30 seconds (configurable up to 5 minutes for Pro plans)
- **Memory**: Default memory limit is 1024MB
- **Concurrent Executions**: Free tier has limits on concurrent executions

### Cron Jobs

- Cron jobs run on Vercel's infrastructure, not your local machine
- The cron job is configured to run every 5 minutes
- All tasks run in a single execution to optimize performance
- Monitor cron job execution in the Vercel dashboard

### Database Connections

- MongoDB connections are optimized for serverless environments
- Connection pooling is configured to handle serverless scaling
- Connections are reused when possible to improve performance

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check that all dependencies are in `package.json`
   - Ensure TypeScript compilation passes locally
   - Check the build logs in Vercel dashboard

2. **Environment Variables**
   - Verify all required environment variables are set
   - Check that variable names match exactly (case-sensitive)
   - Ensure no extra spaces or quotes in variable values

3. **API Timeouts**
   - Check if any API routes are taking too long
   - Consider breaking down large operations into smaller chunks
   - Monitor function execution time in Vercel dashboard

4. **Database Connection Issues**
   - Verify MongoDB URI is correct
   - Check if your IP is whitelisted in MongoDB Atlas
   - Ensure database name matches the environment variable

### Getting Help

- Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
- Monitor your deployment in the Vercel dashboard
- Check function logs for detailed error messages

## Post-Deployment

After successful deployment:

1. Test all major features of your application
2. Monitor performance and error rates
3. Set up monitoring and alerts if needed
4. Consider setting up a custom domain
5. Configure any additional Vercel features (Analytics, Speed Insights, etc.)

## Scaling Considerations

- **Free Tier**: 100GB bandwidth, 100GB-hours of serverless function execution
- **Pro Tier**: Higher limits, better performance, priority support
- **Enterprise**: Custom limits and dedicated support

Monitor your usage in the Vercel dashboard to understand when you might need to upgrade.
