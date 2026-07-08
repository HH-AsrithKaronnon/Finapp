import React from 'react';
import { motion } from 'framer-motion';

interface TabOption {
  id: string;
  label: string;
}

interface TabsProps {
  options: TabOption[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ options, activeId, onChange, className = '' }) => {
  return (
    <div className={`flex bg-muted/50 p-1 rounded-xl border border-border/30 relative select-none ${className}`}>
      {options.map((option) => {
        const isActive = option.id === activeId;
        return (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={`
              relative flex-1 py-2 text-xs font-semibold rounded-lg transition-colors focus:outline-none z-10 cursor-pointer
              ${isActive ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}
            `}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabBg"
                className="absolute inset-0 bg-primary rounded-lg -z-10 shadow-sm"
                transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              />
            )}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
};
