import React, { useState, useEffect } from 'react';
import Quote from 'lucide-react/dist/esm/icons/quote';
import Star from 'lucide-react/dist/esm/icons/star';
import Linkedin from 'lucide-react/dist/esm/icons/linkedin';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import MessageSquare from 'lucide-react/dist/esm/icons/message-square';

const Testimonials: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [errorImages, setErrorImages] = useState<Set<number>>(new Set());

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

    const element = document.getElementById('testimonials');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "VP of Technology",
      company: "OCBC Bank",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
      text: "Exceptional project manager who delivered our mobile banking transformation on time and under budget. His technical background made him invaluable in bridging the gap between business requirements and technical implementation.",
      rating: 5
    },
    {
      name: "Ahmed Al-Rashid",
      role: "CTO",
      company: "The Entertainer",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
      text: "His ability to manage multiple complex projects while maintaining high code quality is remarkable. He delivered 35+ applications with consistently high App Store ratings and zero critical bugs in production.",
      rating: 5
    },
    {
      name: "Dr. Farid Khan",
      role: "Director General",
      company: "Punjab IT Board",
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400",
      text: "Led the digital transformation of our law enforcement systems with exceptional skill. The PSRMS project revolutionized how police operations are conducted in Punjab, serving millions of citizens effectively.",
      rating: 5
    },
    {
      name: "Maria Rodriguez",
      role: "Senior Product Manager",
      company: "TechCorp Solutions",
      image: "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=400",
      text: "A rare combination of technical expertise and project management excellence. His Agile implementation reduced our delivery cycles by 40% while improving team satisfaction and product quality significantly.",
      rating: 5
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={i < rating ? "text-gray-800 fill-current" : "text-gray-300"}
      />
    ));
  };

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-full mb-4">
            <MessageSquare className="w-4 h-4 text-gray-600" />
            <span className="text-gray-700 font-medium">Client Testimonials</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            What Clients Say
          </h2>
          <div className="w-20 h-1 bg-gray-800 mx-auto rounded-full"></div>
          <p className="text-lg text-gray-600 mt-6 max-w-3xl mx-auto">
            What colleagues and clients say about working with me
          </p>
        </div>

        {/* Featured Testimonial */}
        <div className={`mb-12 transform transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="relative bg-gray-50 rounded-xl p-8 lg:p-12">
            <div className="absolute top-6 right-6 text-gray-200">
              <Quote size={48} />
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-1 text-center lg:text-left">
                <div className="relative inline-block mb-4">
                  {/* Loading skeleton for main testimonial image */}
                  {!loadedImages.has(currentTestimonial) && !errorImages.has(currentTestimonial) && (
                    <div className="w-24 h-24 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                    </div>
                  )}
                  
                  {/* Error state */}
                  {errorImages.has(currentTestimonial) && (
                    <div className="w-24 h-24 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <span className="text-2xl text-gray-400">👤</span>
                    </div>
                  )}
                  
                  <img
                    src={testimonials[currentTestimonial]?.image}
                    alt={testimonials[currentTestimonial]?.name}
                    className={`w-24 h-24 rounded-xl object-cover transition-opacity duration-300 ${
                      loadedImages.has(currentTestimonial) ? 'opacity-100' : 'opacity-0'
                    }`}
                    loading="lazy"
                    onLoad={() => setLoadedImages(prev => new Set(prev).add(currentTestimonial))}
                    onError={() => setErrorImages(prev => new Set(prev).add(currentTestimonial))}
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                    <Linkedin className="w-4 h-4 text-white" />
                  </div>
                </div>
                
                <h4 className="font-bold text-gray-900 text-lg mb-1">
                  {testimonials[currentTestimonial]?.name}
                </h4>
                <p className="font-semibold text-gray-700 mb-1">
                  {testimonials[currentTestimonial]?.role}
                </p>
                <p className="text-gray-600 mb-3">{testimonials[currentTestimonial]?.company}</p>
                
                <div className="flex justify-center lg:justify-start mb-4">
                  {testimonials[currentTestimonial] && renderStars(testimonials[currentTestimonial].rating)}
                </div>
              </div>

              <div className="lg:col-span-2">
                <p className="text-xl text-gray-700 leading-relaxed italic font-light mb-6">
                  "{testimonials[currentTestimonial]?.text}"
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 font-medium">LinkedIn Recommendation</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={prevTestimonial}
                      className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={nextTestimonial}
                      className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentTestimonial ? 'bg-gray-800' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* All Testimonials Grid */}
        <div className={`grid md:grid-cols-2 gap-6 mb-12 transform transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className="group cursor-pointer" onClick={() => setCurrentTestimonial(index)}>
              <div className={`bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow ${index === currentTestimonial ? 'ring-2 ring-gray-300' : ''}`}>
                <div className="absolute top-3 right-3 text-gray-200">
                  <Quote size={24} />
                </div>
                
                <div className="flex items-center mb-4">
                  <div className="relative mr-3">
                    {/* Loading skeleton for card testimonial image */}
                    {!loadedImages.has(index + 100) && !errorImages.has(index + 100) && (
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
                        <div className="w-3 h-3 border border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                      </div>
                    )}
                    
                    {/* Error state */}
                    {errorImages.has(index + 100) && (
                      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <span className="text-sm text-gray-400">👤</span>
                      </div>
                    )}
                    
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className={`w-10 h-10 rounded-full object-cover transition-opacity duration-300 ${
                        loadedImages.has(index + 100) ? 'opacity-100' : 'opacity-0'
                      }`}
                      loading="lazy"
                      onLoad={() => setLoadedImages(prev => new Set(prev).add(index + 100))}
                      onError={() => setErrorImages(prev => new Set(prev).add(index + 100))}
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{testimonial.name}</h4>
                    <p className="text-sm font-semibold text-gray-700">
                      {testimonial.role}
                    </p>
                    <p className="text-gray-600 text-xs">{testimonial.company}</p>
                  </div>
                </div>

                <div className="flex mb-3">
                  {renderStars(testimonial.rating)}
                </div>

                <p className="text-gray-700 leading-relaxed text-sm italic mb-3 line-clamp-3">
                  "{testimonial.text}"
                </p>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">LinkedIn Recommendation</span>
                  <button className="text-gray-600 hover:text-gray-800 transition-colors">
                    <Linkedin size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className={`bg-gray-50 rounded-xl p-8 text-center transform transition-all duration-700 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Work Together?</h3>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Whether you need a skilled project manager to lead your next digital transformation or a senior developer to build your next great application, I'm here to help bring your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-900 transition-colors font-medium">
              Start a Project
            </button>
            <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Schedule a Call
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;