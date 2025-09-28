# Email Setup for Contact Form

This guide explains how to set up email functionality for the contact form so that messages are automatically sent to the admin email configured in the admin panel.

## Overview

The contact form now includes:
- **Frontend**: Contact form that saves messages to Firestore
- **Backend**: Firebase Cloud Function that automatically sends emails when new messages are received
- **Admin Panel**: Configure the recipient email address through the Contact Editor

## Setup Instructions

### 1. Configure Email Service

The system uses Gmail by default, but you can configure other email providers.

#### For Gmail (Recommended):

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Copy the 16-character password

3. **Set Environment Variables** in Firebase:
   ```bash
   firebase functions:config:set email.user="fahad.iqbal88@gmail.com"
   firebase functions:config:set email.pass="your-16-character-app-password"
   firebase functions:config:set email.default_admin="admin@example.com"
   ```

#### For Other Email Providers:

Modify the `createTransporter` function in `/functions/src/index.ts` to use your preferred email service:

```typescript
// For SendGrid
return nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY,
  },
});

// For Outlook/Hotmail
return nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// For custom SMTP
return nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
```

### 2. Deploy Firebase Functions

```bash
# Build and deploy the functions
cd functions
npm run build
cd ..
firebase deploy --only functions
```

### 3. Configure Admin Email

1. Go to your admin panel: `/admin`
2. Navigate to **Contact Editor**
3. In the **Contact Info** tab, set your email address
4. Save the changes

This email address will be used as the recipient for all contact form submissions.

### 4. Test the Setup

1. Go to your portfolio's contact section
2. Fill out and submit the contact form
3. Check your configured admin email for the notification

## How It Works

1. **User submits contact form** → Data is saved to Firestore `messages` collection
2. **Firebase Function triggers** → `sendContactEmail` function detects new message
3. **Function fetches admin email** → Retrieves email from Contact Editor configuration
4. **Email is sent** → Formatted email is sent to admin with message details
5. **Status is updated** → Message document is updated with email delivery status

## Email Template

The email includes:
- **Subject**: "New Contact Form Submission: [Subject]"
- **Sender Details**: Name, email, subject
- **Message Content**: Full message from the user
- **Metadata**: Timestamp and message ID
- **Professional Formatting**: HTML and plain text versions

## Troubleshooting

### Common Issues:

1. **Emails not sending**:
   - Check Firebase Functions logs: `firebase functions:log`
   - Verify environment variables are set correctly
   - Ensure email credentials are valid

2. **Gmail authentication errors**:
   - Make sure 2FA is enabled
   - Use App Password, not regular password
   - Check if "Less secure app access" is disabled (it should be)

3. **Function deployment errors**:
   - Ensure Node.js version compatibility
   - Check that all dependencies are installed
   - Verify firebase.json configuration

### Check Function Logs:

```bash
# View recent logs
firebase functions:log

# View logs for specific function
firebase functions:log --only sendContactEmail
```

### Environment Variables:

```bash
# View current config
firebase functions:config:get

# Update config
firebase functions:config:set email.user="fahad.iqbal88@gmail.com"

# Deploy after config changes
firebase deploy --only functions
```

## Security Notes

- Never commit email credentials to version control
- Use environment variables for all sensitive data
- Regularly rotate email passwords/API keys
- Monitor function usage and costs
- Consider rate limiting for production use

## Cost Considerations

- Firebase Functions have a generous free tier
- Each email sent triggers one function execution
- Monitor usage in Firebase Console
- Consider implementing rate limiting for high-traffic sites

## Alternative Solutions

If you prefer not to use Firebase Functions, consider:
- **Third-party services**: Formspree, Netlify Forms, EmailJS
- **Webhook services**: Zapier, IFTTT
- **Direct email APIs**: SendGrid, Mailgun, Amazon SES