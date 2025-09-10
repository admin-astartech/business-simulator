# Scripts

This directory contains utility scripts for the business simulator application.

## Available Scripts

### updateCitizensGender.ts

Updates all citizens in the database with a `gender` attribute based on their first name.

**Usage:**
```bash
npm run update-gender
```

**What it does:**
- Fetches all citizens from the MongoDB database
- Determines gender based on first name using a comprehensive name-to-gender mapping
- Updates each citizen document with a `gender` field ('male', 'female', or 'unknown')
- Provides detailed statistics about the gender distribution

**Features:**
- Comprehensive name database with 200+ common names
- Fallback pattern matching for names not in the database
- Detailed logging of each update
- Statistics summary after completion
- Verification of updates

### populateCitizens.ts

Populates the database with static citizen data and adds online status.

**Usage:**
```bash
npm run populate-citizens
```

### testCitizenEngagement.js

Tests the citizen engagement functionality using OpenAI function calling to simulate citizens interacting with social media posts.

**Usage:**
```bash
node scripts/testCitizenEngagement.js
```

**What it does:**
- Tests the citizen engagement simulation system using AI agents
- Simulates a random online citizen assessing social media posts
- Uses OpenAI function calling with a `likePost` tool to determine engagement
- Sends actual post data (including comments) to the AI model
- Logs which comment the citizen liked most based on AI analysis
- Tests the post liking mechanism

**Features:**
- Picks a random online citizen
- Selects a random platform (LinkedIn, TikTok, or Instagram)
- Fetches the latest 10 posts from the selected platform
- Sends complete post data (content, likes, comments, authors) to OpenAI
- Uses OpenAI function calling with structured tool responses
- AI agent analyzes posts based on citizen's personality and interests
- AI calls the `likePost` function with specific post ID and reasoning
- Logs detailed engagement information including AI reasoning
- Tests the post liking mechanism with actual API calls

**AI Agent Implementation:**
- Uses OpenAI's function calling capabilities
- Provides the AI with a `likePost` tool function
- AI returns structured responses with `tool_call` containing function name and arguments
- AI analyzes citizen personality traits, interests, and professional background
- AI considers post content, comments, and engagement metrics
- AI provides detailed reasoning for post selection

## Prerequisites

- MongoDB connection configured via environment variables
- `MONGODB_URI` and `MONGODB_DATABASE` environment variables set
- Dependencies installed (`npm install`)

## Environment Variables

Make sure these are set in your `.env.local` file:

```
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=business-simulator
```
