import { useState, useEffect } from 'react';

export function AccessibilitySkipLinks() {
  const [isVisible, setIsVisible] = useState(false);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      setIsVisible(true);
    }
  };

  const handleBlur = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div 
      className={`fixed top-0 left-0 z-[100] transition-transform duration-200 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium"
        onBlur={handleBlur}
      >
        Skip to main content
      </a>
      <a
        href="#navigation"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-32 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium"
        onBlur={handleBlur}
      >
        Skip to navigation
      </a>
    </div>
  );
}