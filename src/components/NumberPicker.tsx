import { useState, useEffect } from 'react';
import type { BingoNumber } from '../types';

interface PickerProps {
  items: BingoNumber[];
}

export default function NumebrPicker({ items }: PickerProps) {
  const [shuffledItems, setShuffledItems] = useState<BingoNumber[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState<BingoNumber[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This effect runs only on the client side
    setIsClient(true);

    // Shuffle the items array when component mounts
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    setShuffledItems(shuffled);
  }, [items]);

  const handleNext = () => {
    if (currentIndex < shuffledItems.length) {
      setShuffledItems(prev => {
        // Get the current item from the latest state
        const current = prev[currentIndex];
        if (!current) return prev;

        // Create updated item with new label
        const updatedItem = {
          ...current,
          label: `${history.length + 1}. ${current.label}`
        };

        // Update history with the new item
        setHistory(prevHistory => {
          const exists = prevHistory.some(item => item.id === current.id);
          return exists ? prevHistory : [...prevHistory, updatedItem];
        });

        // Return new array with updated item
        const newItems = [...prev];
        newItems[currentIndex] = updatedItem;
        return newItems;
      });

      setCurrentIndex(prev => prev + 1);
    }
  };

  const showHistoryItem = (item: BingoNumber) => {
    const newIndex = shuffledItems.findIndex(i => i.id === item.id);
    if (newIndex >= 0) {
      setCurrentIndex(newIndex);
    }
  };

  const currentItem = shuffledItems[currentIndex];
  const hasMoreItems = currentIndex < shuffledItems.length;

  if (!isClient) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!hasMoreItems) {
    return (
      <div className="text-center py-12">
        <h2 className="text-3xl font-bold mb-4">No more images!</h2>
        <p className="text-xl">All images have been shown.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="overflow-hidden mb-8">
        {/* Main Image Display */}
        <div className="relative w-full aspect-square bg-black flex items-center justify-center">
          <img
            src={currentItem?.src}
            alt={currentItem?.label}
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Label */}
        <div className="p-4 border-t border-gray-200">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center">{currentItem?.label}</h1>
        </div>

        {/* Navigation */}
        <div className="p-4 flex justify-between items-center">
          <span className="text-gray-600">{currentIndex + 1} de {shuffledItems.length}</span>
          <button
            onClick={handleNext}
            disabled={currentIndex >= shuffledItems.length - 1}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {currentIndex < shuffledItems.length - 1 ? 'Siguiente' : '¡Fin!'}
          </button>
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Historial</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => showHistoryItem(item)}
                className={`flex flex-col items-center p-2 rounded-lg transition-colors ${item.id === currentItem?.id ? 'bg-blue-100' : 'hover:bg-gray-100'
                  }`}
              >
                <div className="w-full aspect-square bg-gray-200 rounded-md overflow-hidden mb-2">
                  <img
                    src={item.src}
                    alt={item.label}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs text-center line-clamp-1">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
