import React from 'react';
import { motion } from 'framer-motion';

interface ShinyTextProps {
  text: string;
}

export const ShinyText: React.FC<ShinyTextProps> = ({ text }) => {
  return (
    <motion.span
      animate={{
        backgroundPosition: ['120% 0', '-120% 0'],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'linear',
      }}
      style={{
        background: 'linear-gradient(100deg, #6D5DF6 30%, #22D3EE 50%, #6D5DF6 70%)',
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        display: 'inline-block',
      }}
    >
      {text}
    </motion.span>
  );
};
