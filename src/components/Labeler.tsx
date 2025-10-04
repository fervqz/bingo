import { useState, useEffect } from 'react';
import FileSaver from 'file-saver';
const { saveAs } = FileSaver;
import type { BingoNumber } from "../types";
import { mockData as initialData } from "../data/mockData";
import Navbar from "./Navbar";
import CardGenerator from "./CardGenerator";
import BingoImage from "./BingoImage";

export default function Labeler() {
    const [items, setItems] = useState<BingoNumber[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [showCardGenerator, setShowCardGenerator] = useState(false);

    // Initialize with mock data
    useEffect(() => {
        setItems(JSON.parse(JSON.stringify(initialData)));
    }, []);

    const handleLabelChange = (index: number, newLabel: string) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], label: newLabel };
        setItems(newItems);
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            // Here you can add any save logic if needed
            // For now, we'll just log the items
            console.log('Saving items:', items);
        } catch (error) {
            console.error('Error saving items:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const downloadLabels = () => {
        const data = {
            timestamp: new Date().toISOString(),
            items: items.map(item => ({
                id: item.id,
                label: item.label,
                src: item.src
            }))
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        saveAs(blob, `bingo-labels-${new Date().toISOString().slice(0, 10)}.json`);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Navbar onSave={handleSave} isSaving={isSaving} onDownload={downloadLabels} />

            <div className="mt-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Bingo Card Labeler</h1>
                    <button
                        onClick={() => setShowCardGenerator(!showCardGenerator)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        {showCardGenerator ? 'Hide Card Generator' : 'Show Card Generator'}
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {items.map((item, index) => (
                        <div key={item.id} className="relative">
                            <BingoImage
                                item={item}
                                index={index}
                                editable={true}
                                onLabelChange={(newLabel) => handleLabelChange(index, newLabel)}
                                className="mb-3"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {showCardGenerator && (
                <section className="mx-auto max-w-6xl py-8 px-4 sm:px-6 lg:px-8">
                    <CardGenerator bingoImages={items} />
                </section>
            )}
        </div>
    );
}