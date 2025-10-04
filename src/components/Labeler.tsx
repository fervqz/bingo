import { useState } from 'react';
import FileSaver from 'file-saver';
const { saveAs } = FileSaver;
import type { BingoNumber } from '../types';
import { mockData as initialData } from '../data/mockData';
import Navbar from './Navbar';

export default function Labeler() {
    const [items, setItems] = useState<BingoNumber[]>(initialData);
    const [isSaving, setIsSaving] = useState(false);
    const [showImages, setShowImages] = useState(true);

    const handleSave = () => {
        try {
            setIsSaving(true);
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `bingo-cards-${timestamp}.json`;
            const json = JSON.stringify(items, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            saveAs(blob, filename);
        } catch (error) {
            console.error('Error saving file:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleLabelChange = (id: number, newLabel: string) => {
        setItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, label: newLabel } : item
            )
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar 
                onSave={handleSave} 
                isSaving={isSaving} 
                onToggleImages={() => setShowImages(!showImages)}
                showImages={showImages}
            />
            <section className="mx-auto max-w-6xl py-8 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold mb-8">Bingo Cards Generator</h1>

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Bingo Cards</h2>
                    <button
                        onClick={() => setShowImages(!showImages)}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    >
                        {showImages ? (
                            <>
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                                Hide Images
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                                Show Images
                            </>
                        )}
                    </button>
                </div>
                <ul className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6 transition-all duration-300 ${showImages ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                    {items.map((item: BingoNumber, index: number) => (
                        <li
                            key={index}
                            className={`flex flex-col items-center p-4 border border-gray-400 rounded-lg shadow-sm hover:shadow-md transition-all ${!item.label.trim() ? 'border-red-500 border-4 shadow-[0_0_10px_3px] shadow-red-500' : ''}`}
                        >
                            <div className="relative w-full aspect-square bg-white border border-black rounded-md overflow-hidden mb-3">
                                <div className="absolute inset-0 flex items-center justify-center bg-black">
                                    <img
                                        src={item.src}
                                        alt={item.label}
                                        className="max-w-full max-h-full object-contain"
                                    />
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                    <div className="text-center">
                                        <span
                                            className="text-2xl font-extrabold text-white"
                                            style={{
                                                textShadow: `
                                                    -1px -1px 0 #000,
                                                    1px -1px 0 #000,
                                                    -1px 1px 0 #000,
                                                    1px 1px 0 #000,
                                                    0 0 10px rgba(0,0,0,0.5)
                                                `,
                                                lineHeight: '1.2',
                                                wordWrap: 'break-word',
                                                maxWidth: '100%',
                                                display: 'inline-block',
                                                padding: '0.25rem 0.5rem',
                                                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                                borderRadius: '0.25rem'
                                            }}
                                        >
                                            #{index + 1} <br /> {item.label}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-500">Label (id: {item.id})</span>
                                </div>
                                <input
                                    type="text"
                                    value={item.label}
                                    onChange={(e) => handleLabelChange(item.id, e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}