# MongoDB Setup for Business Simulator

## Environment Configuration

Create a `.env.local` file in the root directory with the following content:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=business-simulator
```

## MongoDB Connection Options

### Option 1: Local MongoDB
If you have MongoDB installed locally:
```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=business-simulator
```

### Option 2: MongoDB Atlas (Cloud)
If you're using MongoDB Atlas:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DATABASE=business-simulator
```

### Option 3: MongoDB with Authentication
If your MongoDB requires authentication:
```env
MONGODB_URI=mongodb://username:password@localhost:27017
MONGODB_DATABASE=business-simulator
```

## Database Structure

The application will automatically create the following collections:

- **profiles**: Stores user profile information
  - Document ID: `user-001`
  - Fields: id, name, email, role, age, department, location, phone, bio, avatarColor, initials

## Installation

1. Install MongoDB (if using local):
   ```bash
   # macOS with Homebrew
   brew install mongodb-community
   
   # Start MongoDB
   brew services start mongodb-community
   ```

2. Create the `.env.local` file with your MongoDB URI

3. Start the application:
   ```bash
   npm run dev
   ```

## Verification

The profile API will automatically:
- Create the database and collection if they don't exist
- Insert default profile data on first access
- Update profile data when changes are saved

You can verify the data in MongoDB by connecting to your database and checking the `profiles` collection.
