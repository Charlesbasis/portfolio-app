'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Linkedin,
  Github,
  Twitter,
  Clock,
  MessageSquare,
  CheckCircle,
} from 'lucide-react';
import Button from '@/src/components/ui/Button';
import Input from '@/src/components/ui/Input';
import Card from '@/src/components/ui/Card';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'hello@johndoe.com',
      href: 'mailto:hello@johndoe.com',
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+1 (555) 123-4567',
      href: 'tel:+15551234567',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'San Francisco, CA',
      href: '#',
    },
    {
      icon: Clock,
      label: 'Working Hours',
      value: 'Mon-Fri: 9AM - 6PM PST',
      href: '#',
    },
  ];

  const socialLinks = [
    { icon: Github, label: 'GitHub', href: 'https://github.com', color: 'hover:bg-gray-700' },
    { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com', color: 'hover:bg-blue-600' },
    { icon: Twitter, label: 'Twitter', href: 'https://twitter.com', color: 'hover:bg-blue-400' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });

    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Get In Touch</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Have a project in mind or just want to chat? I'd love to hear from you.
              Fill out the form below or reach out through any of the contact methods.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <Card key={index} hover className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <Icon size={28} className="text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.label}</h3>
                  {info.href !== '#' ? (
                    <a
                      href={info.href}
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-gray-600">{info.value}</p>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card padding="lg">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                    <MessageSquare className="mr-3 text-blue-600" size={32} />
                    Send a Message
                  </h2>
                  <p className="text-gray-600">
                    Fill out the form below and I'll get back to you within 24 hours.
                  </p>
                </div>

                {isSubmitted && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                    <CheckCircle className="text-green-600 mr-3" size={24} />
                    <div>
                      <p className="text-green-800 font-semibold">Message sent successfully!</p>
                      <p className="text-green-700 text-sm">I'll get back to you soon.</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      label="Your Name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      error={errors.name}
                      required
                    />
                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      error={errors.email}
                      required
                    />
                  </div>

                  <Input
                    label="Subject"
                    name="subject"
                    type="text"
                    placeholder="What's this about?"
                    value={formData.subject}
                    onChange={handleChange}
                    error={errors.subject}
                    required
                  />

                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <textarea
                      name="message"
                      rows={6}
                      placeholder="Tell me about your project or question..."
                      value={formData.message}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical ${
                        errors.message ? 'border-red-500' : 'border-gray-300'
                      }`}
                      required
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    fullWidth
                    isLoading={isSubmitting}
                  >
                    <Send className="mr-2" size={20} />
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Social Links */}
              <Card>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Connect With Me</h3>
                <p className="text-gray-600 mb-6">
                  Follow me on social media for updates and insights.
                </p>
                <div className="space-y-3">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center p-3 rounded-lg bg-gray-100 hover:text-white transition-all ${social.color}`}
                      >
                        <Icon size={24} className="mr-3" />
                        <span className="font-semibold">{social.label}</span>
                      </a>
                    );
                  })}
                </div>
              </Card>

              {/* Quick Info */}
              <Card className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
                <h3 className="text-xl font-bold mb-4">Quick Response</h3>
                <p className="text-blue-100 mb-4">
                  I typically respond to all inquiries within 24 hours during business days.
                </p>
                <p className="text-blue-100 mb-6">
                  For urgent matters, feel free to call me directly.
                </p>
                <a
                  href="tel:+15551234567"
                  className="inline-flex items-center bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  <Phone className="mr-2" size={18} />
                  Call Now
                </a>
              </Card>

              {/* Resume Download */}
              <Card className="bg-gray-900 text-white">
                <h3 className="text-xl font-bold mb-4">Looking to Hire?</h3>
                <p className="text-gray-300 mb-6">
                  Download my resume to learn more about my experience and skills.
                </p>
                <Link
                  href="/resume.pdf"
                  className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  <Mail className="mr-2" size={18} />
                  Download Resume
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (Optional) */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Location</h2>
            <p className="text-gray-600">Based in San Francisco, serving clients worldwide</p>
          </div>
          <div className="bg-gray-200 rounded-xl overflow-hidden h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-semibold">San Francisco, California</p>
              <p className="text-gray-500 text-sm">Available for remote work worldwide</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Project?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Let's discuss how I can help bring your ideas to life.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="mailto:hello@johndoe.com"
              className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors transform hover:scale-105 shadow-lg"
            >
              <Mail className="mr-2" size={20} />
              Email Me
            </a>
            <Link
              href="/about"
              className="inline-flex items-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors transform hover:scale-105"
            >
              Learn More About Me
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
