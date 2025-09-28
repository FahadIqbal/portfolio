import React, { useState, useEffect } from 'react';
import Mail from 'lucide-react/dist/esm/icons/mail';
import Phone from 'lucide-react/dist/esm/icons/phone';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Linkedin from 'lucide-react/dist/esm/icons/linkedin';
import Github from 'lucide-react/dist/esm/icons/github';
import Send from 'lucide-react/dist/esm/icons/send';
import Calendar from 'lucide-react/dist/esm/icons/calendar';
import Download from 'lucide-react/dist/esm/icons/download';
import MessageSquare from 'lucide-react/dist/esm/icons/message-square';
import Clock from 'lucide-react/dist/esm/icons/clock';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2';
import AlertTriangle from 'lucide-react/dist/esm/icons/alert-triangle';
import { useData } from '../admin/context/DataContext';
import contactService, { ContactFormData, ValidationErrors } from '../admin/services/ContactService';

const Contact: React.FC = () => {
  const { contactData } = useData();
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [formErrors, setFormErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry && entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: window.innerWidth <= 768 ? 0.1 : 0.3 }
    );

    const element = document.getElementById('contact');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const errors = contactService.validateContactForm(formData);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(null);
    
    try {
      // Submit form data to Firebase
      await contactService.submitContactForm(formData);
      
      // Clear form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Show success message
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('There was an error sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 bg-gray-50 dark:bg-gray-900" style={{ position: 'relative', zIndex: 10, visibility: 'visible', display: 'block', opacity: 1, overflow: 'visible' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full mb-4 shadow-sm">
            <MessageSquare className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">Let's Connect</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Let's Work Together
          </h2>
          <div className="w-20 h-1 bg-gray-800 dark:bg-gray-600 mx-auto rounded-full"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-6 max-w-3xl mx-auto">
            Ready to discuss your next project? I'm available for both project management and development roles.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className={`space-y-6 transform transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Get In Touch</h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Whether you need strategic project leadership or hands-on development expertise, 
                I'm here to help transform your ideas into successful digital solutions.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: Mail,
                  title: "Email",
                  value: contactData?.email || "contact@yourname.com"
                },
                {
                  icon: Phone,
                  title: "Phone",
                  value: contactData?.phone || "+1 (555) 123-4567"
                },
                {
                  icon: MapPin,
                  title: "Location",
                  value: contactData?.location || "Available globally (Remote)"
                }
              ].map((contact, index) => (
                <div key={index} className="group">
                  <div className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors">
                      <contact.icon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-1">{contact.title}</h4>
                      <p className="text-gray-600 dark:text-gray-300 font-medium">{contact.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 dark:text-white text-lg">Connect on Social</h4>
              <div className="flex space-x-3">
                {[
                  { icon: Linkedin, url: contactData?.socialLinks?.linkedin || '#' },
                  { icon: Github, url: contactData?.socialLinks?.github || '#' },
                  { icon: Calendar, url: '#' }
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gray-800 dark:bg-gray-700 text-white rounded-lg flex items-center justify-center hover:bg-gray-900 dark:hover:bg-gray-600 transition-colors"
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>


          </div>

          {/* Contact Form */}
          <div className={`transform transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Send className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
                Send a Message
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${formErrors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    placeholder="Your full name"
                  />
                  {formErrors.name && (
                    <div className="mt-1 text-red-500 text-sm flex items-center">
                      <AlertTriangle size={14} className="mr-1" />
                      {formErrors.name}
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${formErrors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    placeholder="your.email@company.com"
                  />
                  {formErrors.email && (
                    <div className="mt-1 text-red-500 text-sm flex items-center">
                      <AlertTriangle size={14} className="mr-1" />
                      {formErrors.email}
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project Type
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${formErrors.subject ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                  >
                    <option value="">Select project type</option>
                    <option value="project-management">Project Management</option>
                    <option value="mobile-development">Mobile App Development</option>
                    <option value="web-development">Web Development</option>
                    <option value="consultation">Technical Consultation</option>
                    <option value="other">Other</option>
                  </select>
                  {formErrors.subject && (
                    <div className="mt-1 text-red-500 text-sm flex items-center">
                      <AlertTriangle size={14} className="mr-1" />
                      {formErrors.subject}
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project Details
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className={`w-full px-4 py-3 border ${formErrors.message ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    placeholder="Tell me about your project requirements, timeline, and goals..."
                  ></textarea>
                  {formErrors.message && (
                    <div className="mt-1 text-red-500 text-sm flex items-center">
                      <AlertTriangle size={14} className="mr-1" />
                      {formErrors.message}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center space-x-2 bg-gray-800 dark:bg-gray-700 text-white py-3 px-6 rounded-lg hover:bg-gray-900 dark:hover:bg-gray-600 transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
                
                {submitSuccess && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                    Your message has been sent successfully! An email notification has been sent and I'll get back to you soon.
                  </div>
                )}
                
                {submitError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {submitError}
                  </div>
                )}
              </form>

              <div className="mt-6 flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
                <Clock size={14} />
                <p className="text-sm font-medium dark:text-gray-300">I typically respond within 24 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;