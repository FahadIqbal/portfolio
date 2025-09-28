# Firebase Setup Guide for Portfolio Project

This guide will help you set up Firebase for your portfolio project, including authentication, Firestore database, and storage.

## Prerequisites

- Node.js 18+ installed
- npm or yarn installed
- A Google account to create a Firebase project

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter a project name (e.g., "portfolio")
4. Choose whether to enable Google Analytics (recommended)
5. Follow the prompts to complete project creation

## Step 2: Configure Authentication

1. In the Firebase Console, go to your project
2. Navigate to "Authentication" in the left sidebar
3. Click "Get started"
4. Enable the "Email/Password" sign-in method
5. Create an admin user:
   - Go to the "Users" tab
   - Click "Add user"
   - Enter the email and password that match your `.env` file settings

## Step 3: Set Up Firestore Database

1. In the Firebase Console, go to your project
2. Navigate to "Firestore Database" in the left sidebar
3. Click "Create database"
4. Choose "Start in production mode"
5. Select a location closest to your target audience
6. Set up security rules:
   - Go to the "Rules" tab
   - Replace the default rules with the following:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read access to all portfolio data
    match /portfolio/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Default rule - deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Step 4: Configure Storage

1. In the Firebase Console, go to your project
2. Navigate to "Storage" in the left sidebar
3. Click "Get started"
4. Follow the setup wizard
5. Set up security rules:
   - Go to the "Rules" tab
   - Replace the default rules with the following:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow public read access to all files
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Step 5: Get Firebase Configuration

1. In the Firebase Console, go to your project
2. Click the gear icon (⚙️) next to "Project Overview" and select "Project settings"
3. Scroll down to the "Your apps" section
4. If you haven't added a web app yet, click the web icon (</>) to add one
5. Register your app with a nickname (e.g., "portfolio-web")
6. Copy the Firebase configuration object (apiKey, authDomain, etc.)

## Step 6: Configure Environment Variables

1. Create or update the `.env` file in your project root with the Firebase configuration:

```
# Firebase Configuration
VITE_FIREBASE_API_KEY="your-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
VITE_FIREBASE_APP_ID="your-app-id"

# Admin Credentials
VITE_ADMIN_EMAIL=admin@example.com
VITE_ADMIN_PASSWORD=your-secure-password
```

## Step 7: Initialize Default Data

Run the following command to initialize the default data in your Firestore database:

```bash
npm run firebase:init
```

This script will:
1. Authenticate with Firebase using your admin credentials
2. Check if data already exists in the Firestore database
3. If no data exists, it will create default data for all portfolio sections

## Step 8: Test Your Setup

1. Start the development server:

```bash
npm run dev
```

2. Navigate to the admin panel at `http://localhost:5173/admin`
3. Log in with your admin credentials
4. Verify that you can view and edit portfolio data
5. Check the main portfolio page to ensure data is displayed correctly

## Troubleshooting

- **Authentication Issues**: Ensure your admin email and password in the `.env` file match the user you created in Firebase Authentication.
- **Firestore Access Issues**: Verify your security rules are correctly set up to allow read access for all users and write access for authenticated users.
- **Storage Issues**: Check that your storage rules allow read access for all users and write access for authenticated users.
- **Environment Variables**: Make sure your `.env` file contains all the required Firebase configuration values.

## Next Steps

- Set up Firebase Hosting to deploy your portfolio website
- Configure Firebase Analytics to track user engagement
- Implement additional security measures as needed
- Create backup and restore procedures for your data