import React from 'react';
import { motion } from 'framer-motion';

const TypingIndicator = ({ userName = "Quelqu'un", className = "" }) => {
  const dotVariants = {
    start: { y: "0%" },
    end: { y: "-100%" }
  };

  const dotTransition = {
    duration: 0.5,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut"
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`flex items-end space-x-2 ${className}`}
    >
      {/* Avatar */}
      <div className="w-6 h-6 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
        {userName[0]?.toUpperCase()}
      </div>

      {/* Bulle de frappe */}
      <div className="bg-gray-200 px-4 py-2 rounded-2xl rounded-bl-md max-w-xs">
        <div className="flex items-center space-x-1">
          <span className="text-sm text-gray-600 mr-2">
            {userName} tape...
          </span>
          
          {/* Animation des points */}
          <div className="flex space-x-1">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-2 h-2 bg-gray-500 rounded-full"
                variants={dotVariants}
                initial="start"
                animate="end"
                transition={{
                  ...dotTransition,
                  delay: index * 0.2
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Espace pour l'alignement */}
      <div className="w-6" />
    </motion.div>
  );
};

export default TypingIndicator;
