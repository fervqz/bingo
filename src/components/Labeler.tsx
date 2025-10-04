
import { useState } from 'react';
import type { BingoNumber } from '../types';
import { mockData as initialData } from '../data/mockData';

export default function Labeler() {
    const [items, setItems] = useState<BingoNumber[]>(initialData);

    const handleLabelChange = (id: number, newLabel: string) => {
        setItems(prevItems => 
            prevItems.map(item => 
                item.id === id ? { ...item, label: newLabel } : item
            )
        );
    };

    return (
        <section className="mx-auto max-w-6xl py-4">
            <h1 className="text-3xl font-bold">Label Images</h1>

            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
                {items.map((item: BingoNumber) => (
                    <li key={item.id} className="flex flex-col items-center p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <img
                            src={item.src}
                            alt={item.label}
                            className="w-full h-48 object-cover rounded mb-3"
                        />
                        <div className="w-full">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-500">ID: {item.id}</span>
                                <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                                    {item.label}
                                </span>
                            </div>
                            <input
                                type="text"
                                defaultValue={item.label}
                                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={(e) => handleLabelChange(item.id, e.target.value)}
                            />
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}