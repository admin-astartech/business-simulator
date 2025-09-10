# Vercel Deployment Checklist

## Pre-Deployment Checklist

### ✅ Environment Variables
- [ ] `MONGODB_URI` - Your MongoDB Atlas connection string
- [ ] `MONGODB_DATABASE` - Database name (default: business-simulator)
- [ ] `OPENAI_API_KEY` - Your OpenAI API key
- [ ] `NEXTAUTH_URL` - Your Vercel app URL (e.g., https://your-app.vercel.app)
- [ ] `NEXTAUTH_SECRET` - Random secret key for NextAuth

### ✅ Code Preparation
- [x] Vercel configuration file (`vercel.json`) created
- [x] Environment example file (`env.example`) created
- [x] Next.js config optimized for production
- [x] MongoDB connection optimized for serverless
- [x] Cron service updated for Vercel
- [x] API timeout configuration added
- [x] `.vercelignore` file created

### ✅ Dependencies
- [ ] All dependencies are in `package.json`
- [ ] No missing peer dependencies
- [ ] TypeScript compilation passes
- [ ] No linting errors

### ✅ Database Setup
- [ ] MongoDB Atlas cluster created
- [ ] Database user created with appropriate permissions
- [ ] IP whitelist configured (0.0.0.0/0 for Vercel)
- [ ] Connection string tested locally

## Deployment Steps

### 1. Deploy to Vercel
```bash
# Option 1: Via Vercel CLI
npm i -g vercel
vercel login
vercel

# Option 2: Via GitHub integration
# Connect your GitHub repo to Vercel dashboard
```

### 2. Configure Environment Variables
In Vercel dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add all required variables from the checklist above

### 3. Test Deployment
- [ ] App loads at the Vercel URL
- [ ] All pages are accessible
- [ ] API endpoints respond correctly
- [ ] Database connections work
- [ ] Cron jobs are scheduled

### 4. Monitor Performance
- [ ] Check Vercel dashboard for function execution times
- [ ] Monitor error rates
- [ ] Check MongoDB Atlas for connection metrics
- [ ] Verify cron job execution logs

## Post-Deployment

### ✅ Verification Tests
- [ ] Homepage loads correctly
- [ ] Citizens page displays data
- [ ] Analytics page shows metrics
- [ ] Social media pages work
- [ ] Chat functionality works
- [ ] Bank page shows data
- [ ] Settings page is accessible

### ✅ API Endpoints Test
- [ ] `GET /api/citizens` - Returns citizens data
- [ ] `GET /api/analytics` - Returns analytics
- [ ] `GET /api/cron` - Returns cron status
- [ ] `POST /api/chat` - Chat functionality
- [ ] `GET /api/bank` - Bank data
- [ ] `GET /api/conversations` - Conversations

### ✅ Cron Job Verification
- [ ] Check Vercel cron logs
- [ ] Verify tasks are running every 5 minutes
- [ ] Check database for updated data
- [ ] Monitor function execution times

## Troubleshooting

### Common Issues
1. **Build Failures**
   - Check TypeScript errors
   - Verify all imports are correct
   - Check for missing dependencies

2. **Environment Variables**
   - Verify all variables are set in Vercel
   - Check variable names match exactly
   - Ensure no extra spaces or quotes

3. **Database Connection**
   - Verify MongoDB URI is correct
   - Check IP whitelist in MongoDB Atlas
   - Test connection string locally

4. **API Timeouts**
   - Check function execution times in Vercel dashboard
   - Optimize long-running operations
   - Consider breaking down large operations

5. **Cron Jobs Not Running**
   - Check Vercel cron configuration
   - Verify cron path is correct
   - Check function logs for errors

## Performance Optimization

### ✅ Implemented Optimizations
- [x] MongoDB connection pooling
- [x] API timeout configuration
- [x] Batch processing limits
- [x] Retry mechanisms
- [x] Serverless-optimized cron service

### 🔄 Monitor and Optimize
- [ ] Monitor function cold starts
- [ ] Optimize database queries
- [ ] Implement caching where appropriate
- [ ] Monitor memory usage
- [ ] Track API response times

## Security Checklist

### ✅ Security Measures
- [x] Environment variables secured
- [x] CORS headers configured
- [x] Input validation in API routes
- [x] Error handling without sensitive data exposure
- [x] MongoDB connection secured

### 🔄 Additional Security
- [ ] Implement rate limiting
- [ ] Add request validation
- [ ] Monitor for suspicious activity
- [ ] Regular security updates

## Success Criteria

Your deployment is successful when:
- ✅ All pages load without errors
- ✅ All API endpoints respond correctly
- ✅ Database operations work
- ✅ Cron jobs execute on schedule
- ✅ No critical errors in logs
- ✅ Performance is acceptable
- ✅ All features work as expected

## Support

If you encounter issues:
1. Check Vercel function logs
2. Review MongoDB Atlas logs
3. Check environment variables
4. Verify all dependencies
5. Test locally first
6. Check Vercel documentation
