import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { easeOut, motion } from 'framer-motion';
import { FaOm, FaCalendarAlt, FaBoxOpen, FaUsers, FaMoneyCheckAlt, FaWhatsapp } from 'react-icons/fa';

const steps = [
  {
    number: 1,
    title: 'Choose Your Puja',
    description: 'Select a puja that with your spiritual needs and aspirations.',
    icon: <FaOm className="text-purple-600 text-xl" />,
  },
  {
    number: 2,
    title: 'Pick a Date',
    description: 'Pick a date that best fits your schedule for the puja.',
    icon: <FaCalendarAlt className="text-blue-600 text-xl" />,
  },
  {
    number: 3,
    title: 'Select Package',
    description: 'Choose a package that matches your ritual requirements and budget.',
    icon: <FaBoxOpen className="text-amber-600 text-xl" />,
  },
  {
    number: 4,
    title: 'Provide Devotee Details',
    description: 'Provide the Names and Gotra (lineage) details of all devotees participating in the puja.',
    icon: <FaUsers className="text-indigo-600 text-xl" />,
  },
  {
    number: 5,
    title: 'Make Payment',
    description: 'Pay securely online to confirm your booking.',
    icon: <FaMoneyCheckAlt className="text-cyan-600 text-xl" />,
  },
  {
    number: 6,
    title: 'Receive Confirmation',
    description: 'Receive your booking confirmation and puja details via WhatsApp.',
    icon: <FaWhatsapp className="text-green-500 text-xl" />,
  },
];



const fadeUpVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease:  easeOut,
    },
  }),
};

const BookingSteps = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-yellow-50 via-orange-100 to-yellow-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How to Book Your Puja - Simple and Quick! 
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm">
            Booking a puja is now easier than ever. Follow these simple steps to complete your booking.
          </p>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              className="bg-white p-6 rounded-2xl shadow-xl border hover:shadow-2xl transition-all duration-300"
              variants={fadeUpVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              custom={index}
              whileHover={{ scale: 1.03 }}
            >
              <div className="flex items-start space-x-4">
              <div className="w-14 h-10 flex items-center justify-center bg-orange-100 rounded-full shadow-inner">
  {step.icon}
</div>


                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-orange-600 font-semibold">
                      Step {step.number}
                    </span>
                    {step.number === 6 && (
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-1">
                    {step.title}
                  </h4>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default BookingSteps;