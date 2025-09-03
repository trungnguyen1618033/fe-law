'use client';

import { useFontSize } from './FontSizeProvider';

export function FontSizeControls() {
  const { decreaseFontSize, resetFontSize, increaseFontSize } = useFontSize();

  return (
    <div className="font-size-controls flex items-center space-x-1">
      <button 
        onClick={decreaseFontSize}
        className="text-sm px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700" 
        aria-label="Decrease font size"
      >
        A-
      </button>
      <button 
        onClick={resetFontSize}
        className="text-base px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700" 
        aria-label="Reset font size"
      >
        A
      </button>
      <button 
        onClick={increaseFontSize}
        className="text-lg px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700" 
        aria-label="Increase font size"
      >
        A+
      </button>
    </div>
  );
}