# Cron Services Architecture

This directory contains the refactored cron service architecture, split into focused sub-services for better maintainability and separation of concerns.

## Architecture Overview

The cron service has been refactored from a monolithic class into a modular architecture with the following components:

### BaseCronService
- **Purpose**: Provides common functionality and configuration for all cron services
- **Features**:
  - Shared configuration constants (`CRON_CONFIG`)
  - Common API request methods
  - Utility functions for citizen data fetching
  - Logging helpers
  - Type definitions

### CitizenStatusService
- **Purpose**: Manages citizen online/offline status simulation
- **Responsibilities**:
  - Updating random citizens' online status
  - Dispatching status change events
  - Handling auto-responses for citizens who come online
  - Logging status update results

### MessageService
- **Purpose**: Handles unread message monitoring and conversation management
- **Responsibilities**:
  - Checking for unread user messages
  - Logging conversation status
  - Formatting unread message reports

### SocialMediaService
- **Purpose**: Manages social media post generation and database operations
- **Responsibilities**:
  - Generating social media posts from random online citizens
  - Saving posts to appropriate database collections
  - Verifying post saves
  - Platform-specific post handling (LinkedIn, TikTok, Instagram)
  - Testing functionality

### CronService (Main Orchestrator)
- **Purpose**: Coordinates all sub-services and manages cron job scheduling
- **Responsibilities**:
  - Scheduling cron jobs
  - Delegating work to appropriate sub-services
  - Managing service lifecycle (start/stop/restart)
  - Providing unified interface for external usage

## Benefits of This Architecture

1. **Single Responsibility Principle**: Each service has one clear purpose
2. **Maintainability**: Easier to modify individual features without affecting others
3. **Testability**: Each service can be tested independently
4. **Reusability**: Services can be used independently if needed
5. **Code Organization**: Related functionality is grouped together
6. **Easier Debugging**: Issues can be isolated to specific services

## Usage

The main `CronService` maintains the same public API as before, so existing code doesn't need to change:

```typescript
import CronService from './lib/cronService'

const cronService = CronService.getInstance()
cronService.start()
cronService.stop()
cronService.testSocialMediaPostGeneration()
```

## Service Dependencies

- `BaseCronService` ← `CitizenStatusService`
- `BaseCronService` ← `MessageService`
- `BaseCronService` ← `SocialMediaService`
- `CronService` → `CitizenStatusService`
- `CronService` → `MessageService`
- `CronService` → `SocialMediaService`

## Configuration

All services share the same configuration through `CRON_CONFIG` in `BaseCronService`. This ensures consistency across all services and makes it easy to update settings in one place.
