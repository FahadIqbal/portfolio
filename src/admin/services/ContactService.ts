import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig, 'contactService');

// Initialize Firestore
const db = getFirestore(app);

// Interface for contact form data
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Validation interface for form errors
export interface ValidationErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

// Contact service class
class ContactService {
  // Validate contact form data
  validateContactForm(data: ContactFormData): ValidationErrors {
    const errors: ValidationErrors = {};
    
    // Name validation
    if (!data.name || data.name.trim() === '') {
      errors.name = 'Name is required';
    } else if (data.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || data.email.trim() === '') {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(data.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Subject validation
    if (!data.subject || data.subject.trim() === '') {
      errors.subject = 'Project type is required';
    }
    
    // Message validation
    if (!data.message || data.message.trim() === '') {
      errors.message = 'Message is required';
    } else if (data.message.length < 10) {
      errors.message = 'Message must be at least 10 characters';
    }
    
    return errors;
  }
  
  // Submit contact form data to Firestore
  async submitContactForm(data: ContactFormData): Promise<string> {
    try {
      // Add a new document to the "messages" collection
      const docRef = await addDoc(collection(db, 'messages'), {
        ...data,
        timestamp: serverTimestamp(),
        status: 'new' // Can be used for tracking message status (new, read, replied, etc.)
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
  }
}

// Export a singleton instance
const contactService = new ContactService();
export default contactService;