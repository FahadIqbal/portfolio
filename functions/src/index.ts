/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {setGlobalOptions} from "firebase-functions";
import {onDocumentCreated} from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";
import {config} from "dotenv";

// Load environment variables
config();

// Initialize Firebase Admin
admin.initializeApp();

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// Email configuration
const createTransporter = () => {
  // Get email configuration from environment variables
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  
  if (!emailUser || !emailPass) {
    throw new Error('Email configuration not found. Please set EMAIL_USER and EMAIL_PASS in .env file.');
  }
  
  // Custom SMTP configuration for fahad.my domain
   return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'mail.fahad.my',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
};

// Function to get admin email from contact data
const getAdminEmail = async (): Promise<string> => {
  try {
    const contactDoc = await admin.firestore().collection('contact').doc('data').get();
    if (contactDoc.exists) {
      const contactData = contactDoc.data();
      return contactData?.email || process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com';
    }
    return process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com';
  } catch (error) {
    logger.error('Error fetching admin email:', error);
    return process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com';
  }
};

// Function triggered when a new message is created in Firestore
export const sendContactEmail = onDocumentCreated(
  "messages/{messageId}",
  async (event) => {
    const messageData = event.data?.data();
    
    if (!messageData) {
      logger.error('No message data found');
      return;
    }

    try {
      const adminEmail = await getAdminEmail();
      const transporter = createTransporter();

      // Email content
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: adminEmail,
        subject: `New Contact Form Submission: ${messageData.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
              New Contact Form Submission
            </h2>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #007bff; margin-top: 0;">Contact Details</h3>
              <p><strong>Name:</strong> ${messageData.name}</p>
              <p><strong>Email:</strong> ${messageData.email}</p>
              <p><strong>Subject:</strong> ${messageData.subject}</p>
            </div>
            
            <div style="background-color: #ffffff; padding: 20px; border: 1px solid #dee2e6; border-radius: 5px;">
              <h3 style="color: #333; margin-top: 0;">Message</h3>
              <p style="line-height: 1.6; color: #555;">${messageData.message}</p>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background-color: #e9ecef; border-radius: 5px;">
              <p style="margin: 0; font-size: 12px; color: #6c757d;">
                <strong>Timestamp:</strong> ${messageData.timestamp?.toDate?.() || new Date()}<br>
                <strong>Message ID:</strong> ${event.params.messageId}
              </p>
            </div>
            
            <div style="margin-top: 20px; text-align: center;">
              <p style="color: #6c757d; font-size: 12px;">
                This email was automatically generated from your portfolio contact form.
              </p>
            </div>
          </div>
        `,
        // Also include a plain text version
        text: `
          New Contact Form Submission
          
          Name: ${messageData.name}
          Email: ${messageData.email}
          Subject: ${messageData.subject}
          
          Message:
          ${messageData.message}
          
          Timestamp: ${messageData.timestamp?.toDate?.() || new Date()}
          Message ID: ${event.params.messageId}
        `,
      };

      // Send email
      await transporter.sendMail(mailOptions);
      logger.info(`Email sent successfully for message ${event.params.messageId}`);
      
      // Update message status to indicate email was sent
      await admin.firestore()
        .collection('messages')
        .doc(event.params.messageId)
        .update({
          emailSent: true,
          emailSentAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        
    } catch (error) {
      logger.error('Error sending email:', error);
      
      // Update message to indicate email failed
      await admin.firestore()
        .collection('messages')
        .doc(event.params.messageId)
        .update({
          emailSent: false,
          emailError: error instanceof Error ? error.message : 'Unknown error',
          emailErrorAt: admin.firestore.FieldValue.serverTimestamp(),
        });
    }
  }
);

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
