import React, { useEffect } from 'react';

export default function Toast({ message, visible, onClose }) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div 
      className="fixed bottom-8 right-8 px-6 py-3.5 bg-gradient-to-r from-blue-dark to-blue-petrol text-white rounded-lg text-sm font-semibold shadow-2xl z-50 transition-all border-l-4 border-cyan-brand animate-fade-in-up"
    >
      {message}
    </div>
  );
}
