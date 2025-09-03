'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type FontSize = 'small' | 'medium' | 'large';

type FontSizeProviderProps = {
  children: React.ReactNode;
  defaultSize?: FontSize;
  storageKey?: string;
};

type FontSizeProviderState = {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
};

const initialState: FontSizeProviderState = {
  fontSize: 'medium',
  setFontSize: () => null,
  increaseFontSize: () => null,
  decreaseFontSize: () => null,
  resetFontSize: () => null,
};

const FontSizeProviderContext = createContext<FontSizeProviderState>(initialState);

export function FontSizeProvider({
  children,
  defaultSize = 'medium',
  storageKey = 'ph-lex-note-font-size',
  ...props
}: FontSizeProviderProps) {
  const [fontSize, setFontSize] = useState<FontSize>(defaultSize);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage?.getItem(storageKey) as FontSize;
    if (stored && ['small', 'medium', 'large'].includes(stored)) {
      setFontSize(stored);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!mounted) return;

    const body = document.body;
    body.classList.remove('text-sm', 'text-base', 'text-lg');
    
    switch(fontSize) {
      case 'small':
        body.classList.add('text-sm');
        break;
      case 'large':
        body.classList.add('text-lg');
        break;
      default:
        body.classList.add('text-base');
    }
  }, [fontSize, mounted]);

  const handleSetFontSize = (size: FontSize) => {
    if (mounted) {
      localStorage?.setItem(storageKey, size);
    }
    setFontSize(size);
  };

  const increaseFontSize = () => {
    const sizes: FontSize[] = ['small', 'medium', 'large'];
    const currentIndex = sizes.indexOf(fontSize);
    if (currentIndex < sizes.length - 1) {
      handleSetFontSize(sizes[currentIndex + 1]);
    }
  };

  const decreaseFontSize = () => {
    const sizes: FontSize[] = ['small', 'medium', 'large'];
    const currentIndex = sizes.indexOf(fontSize);
    if (currentIndex > 0) {
      handleSetFontSize(sizes[currentIndex - 1]);
    }
  };

  const resetFontSize = () => {
    handleSetFontSize('medium');
  };

  const value = {
    fontSize,
    setFontSize: handleSetFontSize,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
  };

  return (
    <FontSizeProviderContext.Provider {...props} value={value}>
      {children}
    </FontSizeProviderContext.Provider>
  );
}

export const useFontSize = () => {
  const context = useContext(FontSizeProviderContext);

  if (context === undefined)
    throw new Error('useFontSize must be used within a FontSizeProvider');

  return context;
};