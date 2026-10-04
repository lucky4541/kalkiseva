import React from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

export default function HelpSupport() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [expandedFAQ, setExpandedFAQ] = React.useState<string | null>(null);

  const faqs: FAQ[] = [
    {
      question: 'How do I update my profile information?',
      answer: 'You can update your profile information by navigating to the Profile page and clicking the "Edit Profile" button. Make your changes and click "Save Changes" when done.',
      category: 'account',
    },
    {
      question: 'How can I cancel a booking?',
      answer: 'To cancel a booking, go to the Bookings page, find the booking you want to cancel, and click the cancel button. Please note our cancellation policy and any applicable fees.',
      category: 'bookings',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. Payment information can be updated in your account settings.',
      category: 'payments',
    },
  ];

  const categories = ['all', 'account', 'bookings', 'payments'];

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-4xl mx-auto">
      <Helmet>
  <title>Help & Support - Get Assistance | Kalki Seva</title>
  <meta
    name="description"
    content="Need help with your bookings or services? Contact Kalki Seva support for assistance with puja bookings, temple services, payments, and more."
  />
  <meta
    name="keywords"
    content="Help, Support, Contact Kalki Seva, Booking Help, Customer Service, Puja Assistance"
  />
  <meta name="author" content="Kalki Seva Team" />
  <meta name="robots" content="index, follow" />
</Helmet>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Help & Support</h1>

          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search for help..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* FAQs */}
            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <div key={faq.question} className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === faq.question ? null : faq.question)}
                    className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50"
                  >
                    <span className="font-medium text-gray-900">{faq.question}</span>
                    <ChevronDown
                      size={20}
                      className={`text-gray-500 transition-transform ${
                        expandedFAQ === faq.question ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expandedFAQ === faq.question && (
                    <div className="p-4 bg-gray-50 border-t">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}

              {filteredFAQs.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No results found for your search.</p>
                </div>
              )}
            </div>

            {/* Contact Support */}
            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <h2 className="text-lg font-medium text-blue-900 mb-2">Need more help?</h2>
              <p className="text-blue-700 mb-4">
                Our support team is available 24/7 to assist you with any questions or concerns.
              </p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}