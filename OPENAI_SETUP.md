# OpenAI Integration for Social Media Post Generation

This document explains how to set up and use the new OpenAI-powered social media post generation feature.

## Overview

The social media post generator has been enhanced to use OpenAI's GPT-4 API for generating realistic, personalized posts based on each citizen's personality, role, and platform preferences. The system includes intelligent fallback to the original template-based generation if OpenAI is unavailable.

## Features

- **AI-Powered Generation**: Uses OpenAI GPT-4 to create realistic, personalized posts
- **Personality Analysis**: Analyzes citizen data to determine personality traits and communication style
- **Platform-Specific Content**: Generates content tailored to LinkedIn, TikTok, and Instagram
- **Intelligent Fallback**: Falls back to template-based generation if OpenAI is unavailable
- **Real-time Generation**: Creates fresh, unique content for each post

## Setup

### 1. Get OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the API key (starts with `sk-`)

### 2. Configure Environment Variables

Add your OpenAI API key to your environment variables:

```bash
# .env.local
OPENAI_API_KEY=sk-your-api-key-here
```

Or set it in your deployment environment:

```bash
export OPENAI_API_KEY=sk-your-api-key-here
```

### 3. Install Dependencies

The OpenAI integration uses the built-in `fetch` API, so no additional dependencies are required.

## Usage

### Basic Usage

The API remains the same as before, but now generates AI-powered content:

```typescript
import { SocialMediaPostGenerator } from './lib/socialMediaPostGenerator'

const citizen = {
  id: '1',
  name: 'Sarah Johnson',
  role: 'Software Engineer',
  company: 'TechCorp',
  isOnline: true
}

// Generate a post (now async)
const post = await SocialMediaPostGenerator.generatePost(citizen)
console.log(post.content)
console.log(post.hashtags)
```

### Testing

Run the test script to see the AI generation in action:

```bash
# TypeScript version
npx tsx scripts/testOpenAIPostGeneration.ts

# JavaScript version
node scripts/testOpenAIPostGeneration.js
```

## How It Works

### 1. Personality Analysis

The system analyzes each citizen's data to determine:
- **Primary Traits**: Based on their role (e.g., analytical for developers, creative for designers)
- **Communication Style**: Professional, technical, creative, etc.
- **Interests**: Industry-specific interests and topics
- **Values**: Professional values and motivations
- **Motivation**: What drives them professionally

### 2. Platform-Specific Generation

Each platform has specific guidelines:

- **LinkedIn**: Professional tone, industry insights, 150-300 words
- **TikTok**: Casual, energetic, trending language, 50-150 words
- **Instagram**: Visual storytelling, lifestyle focus, 100-200 words

### 3. AI Prompt Engineering

The system creates detailed prompts that include:
- Citizen's profile and personality analysis
- Platform-specific guidelines
- Requirements for authentic, engaging content
- Instructions for appropriate hashtags

### 4. Fallback System

If OpenAI is unavailable or fails:
- Automatically falls back to template-based generation
- Maintains the same API interface
- Logs warnings for debugging

## Configuration

### OpenAI Service Settings

You can customize the OpenAI service behavior by modifying `lib/services/OpenAIService.ts`:

```typescript
// Model configuration
model: 'gpt-4',           // Use GPT-4 for best results
max_tokens: 500,          // Adjust based on needs
temperature: 0.8,         // Creativity level (0.0-1.0)
```

### Personality Analysis

Customize personality analysis in the `analyzePersonality` method:

```typescript
private analyzePersonality(citizen: Citizen): PersonalityProfile {
  // Add custom logic for your specific use case
  const role = citizen.role.toLowerCase()
  // ... analysis logic
}
```

## Cost Considerations

- **GPT-4**: ~$0.03 per 1K tokens (input) + ~$0.06 per 1K tokens (output)
- **Typical Post**: ~200-400 tokens total
- **Estimated Cost**: ~$0.01-0.02 per post

### Cost Optimization Tips

1. **Use GPT-3.5-turbo** for lower costs (modify the model in OpenAIService)
2. **Implement caching** for similar citizens
3. **Batch requests** when possible
4. **Monitor usage** through OpenAI dashboard

## Error Handling

The system includes comprehensive error handling:

- **API Key Missing**: Falls back to templates with warning
- **API Rate Limits**: Retries with exponential backoff
- **Network Errors**: Falls back to templates
- **Invalid Responses**: Parses what it can, falls back for errors

## Monitoring

### Logs to Watch

```bash
# Successful AI generation
✅ Generated AI-powered post for Sarah Johnson

# Fallback to templates
⚠️ OpenAI generation failed, falling back to templates

# API key issues
⚠️ OPENAI_API_KEY not found in environment variables
```

### Metrics to Track

- AI generation success rate
- Fallback usage frequency
- Response times
- Token usage and costs

## Troubleshooting

### Common Issues

1. **"OpenAI API key not configured"**
   - Check that `OPENAI_API_KEY` is set in environment variables
   - Verify the API key is valid and active

2. **"OpenAI API error: 401"**
   - Invalid API key
   - Check key permissions and billing

3. **"OpenAI API error: 429"**
   - Rate limit exceeded
   - Implement retry logic or reduce frequency

4. **Posts not generating**
   - Check network connectivity
   - Verify API key has sufficient credits
   - Check console for error messages

### Debug Mode

Enable detailed logging by setting:

```bash
DEBUG=openai:*
```

## Future Enhancements

Potential improvements for the future:

1. **Caching**: Cache similar posts to reduce API calls
2. **Batch Processing**: Generate multiple posts in one API call
3. **Custom Models**: Fine-tune models for your specific use case
4. **A/B Testing**: Test different prompt strategies
5. **Analytics**: Track which AI-generated posts perform best
6. **Multi-language**: Support for different languages
7. **Image Generation**: Add AI-generated images for Instagram posts

## Support

For issues or questions:

1. Check the console logs for error messages
2. Verify your OpenAI API key and billing
3. Test with the provided test scripts
4. Review the fallback template generation

The system is designed to be robust and will always generate posts, even if OpenAI is unavailable.
