import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const quotes = [
  {
    text: "You have the right to work, but never to the fruit of work. Let not the fruits of action be your motive, nor let your attachment be to inaction.",
    author: "Bhagavad Gita, Chapter 2, Verse 47",
  },
  {
    text: "Whenever there is a decline in righteousness and an increase in unrighteousness, O Arjuna, at that time I manifest myself on earth.",
    author: "Bhagavad Gita, Chapter 4, Verse 7",
  },
  {
    text: "One who is not disturbed by the incessant flow of desires—that person is the one who has attained peace.",
    author: "Bhagavad Gita, Chapter 2, Verse 70",
  },
  {
    text: "The mind is restless, turbulent, obstinate, and very strong, O Krishna, and to subdue it, I think, is more difficult than controlling the wind.",
    author: "Bhagavad Gita, Chapter 6, Verse 34",
  },
  {
    text: "Let us all worship the Lord, for he is the essence of all beings, the creator and protector of the world.",
    author: "Srimad Bhagavatam, 1.1.2",
  },
  {
    text: "By the touch of your feet, O Rama, the entire earth has become a temple, where all the worship is directed towards you.",
    author: "Ramayana, Yuddha Kanda",
  },
  {
    text: "The one who is devoted to the Lord and engages in his service with love is blessed with eternal peace.",
    author: "Srimad Bhagavatam, 7.9.24",
  },
  {
    text: "In the battle between righteousness and unrighteousness, the soul’s ultimate victory is assured.",
    author: "Mahabharata",
  },
];

const QuotesSection = () => {

  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Spiritual Wisdom</h2>

          <div className="relative h-56 sm:h-48">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuote}
                className="absolute inset-0 px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
              >
                <div className="absolute -top-6 left-0 text-8xl text-primary/20 select-none">"</div>
                <p className="text-2xl text-gray-700 italic mb-4">{quotes[currentQuote].text}</p>
                <p className="text-lg text-primary font-medium">- {quotes[currentQuote].author}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {quotes.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentQuote(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentQuote ? 'bg-primary scale-125' : 'bg-gray-300'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuotesSection;
