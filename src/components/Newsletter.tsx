import React, { useState } from 'react';
import Mail from 'lucide-react/dist/esm/icons/mail';
import Send from 'lucide-react/dist/esm/icons/send';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';
import AlertTriangle from 'lucide-react/dist/esm/icons/alert-triangle';

interface NewsletterProps {
  variant?: 'default' | 'compact' | 'footer';
  className?: string;
}

interface NewsletterFormData {
  email: string;
}

interface ValidationErrors {
  email?: string;
}

const Newsletter: React.FC<NewsletterProps> = ({ variant = 'default', className = '' }) => {
  const [formData, setFormData] = useState<NewsletterFormData>({
    email: ''
  });
  
  const [formErrors, setFormErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear error when user starts typing
    if (formErrors[e.target.name as keyof ValidationErrors]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: undefined
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(null);
    
    try {
      // Simulate API call - replace with actual newsletter service
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For now, just simulate success
      console.log('Newsletter subscription:', formData.email);
      
      setFormData({ email: '' });
      setSubmitSuccess(true);
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
      
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setSubmitError('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (variant === 'compact') {
    return (
      <div className={`${className}`}>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={`w-full px-3 py-2 text-sm border ${
                formErrors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
              disabled={isSubmitting}
            />
            {formErrors.email && (
              <div className="mt-1 text-red-500 text-xs flex items-center">
                <AlertTriangle size={12} className="mr-1" />
                {formErrors.email}
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
          >
            {isSubmitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <Send size={16} className="mr-1" />
                Subscribe
              </>
            )}
          </button>
        </form>
        
        {submitSuccess && (
          <div className="mt-2 text-green-600 dark:text-green-400 text-sm flex items-center">
            <CheckCircle size={14} className="mr-1" />
            Successfully subscribed to newsletter!
          </div>
        )}
        
        {submitError && (
          <div className="mt-2 text-red-500 text-sm flex items-center">
            <AlertTriangle size={14} className="mr-1" />
            {submitError}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`${className}`}>
        <div className="flex items-center mb-3">
          <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Stay Updated
          </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
          Subscribe to get notified about new projects and blog posts.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              className={`w-full px-3 py-2 text-sm border ${
                formErrors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
              disabled={isSubmitting}
            />
            {formErrors.email && (
              <div className="mt-1 text-red-500 text-xs flex items-center">
                <AlertTriangle size={12} className="mr-1" />
                {formErrors.email}
              </div>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <Send size={16} className="mr-2" />
                Subscribe to Newsletter
              </>
            )}
          </button>
        </form>
        
        {submitSuccess && (
          <div className="mt-3 text-green-600 dark:text-green-400 text-sm flex items-center">
            <CheckCircle size={14} className="mr-1" />
            Thank you for subscribing!
          </div>
        )}
        
        {submitError && (
          <div className="mt-3 text-red-500 text-sm flex items-center">
            <AlertTriangle size={14} className="mr-1" />
            {submitError}
          </div>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${className}`}>
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
          <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Subscribe to Newsletter
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Get the latest updates on new projects, blog posts, and tech insights delivered to your inbox.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="newsletter-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="newsletter-email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            className={`w-full px-4 py-3 border ${
              formErrors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
            disabled={isSubmitting}
          />
          {formErrors.email && (
            <div className="mt-1 text-red-500 text-sm flex items-center">
              <AlertTriangle size={14} className="mr-1" />
              {formErrors.email}
            </div>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={20} className="animate-spin mr-2" />
              Subscribing...
            </>
          ) : (
            <>
              <Send size={20} className="mr-2" />
              Subscribe Now
            </>
          )}
        </button>
      </form>
      
      {submitSuccess && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="text-green-800 dark:text-green-400 text-sm flex items-center">
            <CheckCircle size={16} className="mr-2" />
            Thank you for subscribing! You'll receive updates about new content and projects.
          </div>
        </div>
      )}
      
      {submitError && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="text-red-800 dark:text-red-400 text-sm flex items-center">
            <AlertTriangle size={16} className="mr-2" />
            {submitError}
          </div>
        </div>
      )}
      
      <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </div>
  );
};

export default Newsletter;