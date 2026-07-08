import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl"
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black backdrop-blur-xs cursor-pointer"
          />

          {/* Dialog Container */}
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ 
                y: '100%', 
                scale: 1 
              }}
              animate={{ 
                y: 0, 
                scale: 1 
              }}
              exit={{ 
                y: '100%', 
                scale: 0.95 
              }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className={`
                w-full sm:${sizeClasses[size]} bg-card text-card-foreground border-t sm:border border-border/80
                rounded-t-2xl sm:rounded-2xl shadow-xl flex flex-col max-h-[85vh] sm:max-h-[90vh]
              `}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-border/40">
                {title ? (
                  <h3 className="text-lg font-semibold tracking-tight text-foreground">
                    {title}
                  </h3>
                ) : <div />}
                <button
                  onClick={onClose}
                  className="p-1 rounded-full text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="p-5 overflow-y-auto flex-1">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
