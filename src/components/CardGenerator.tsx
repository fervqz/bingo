import { useState, useRef, useCallback } from "react";
import type { BingoNumber } from "../types";
import BingoCard, { type BingoCardHandle } from "./BingoCard";

interface CardGeneratorProps {
    bingoImages: BingoNumber[];
}

interface BingoCard {
    id: number;
    items: BingoNumber[][];
}

const CardGenerator = ({ bingoImages }: CardGeneratorProps) => {
    const [numberOfCards, setNumberOfCards] = useState<number>(3);
    const [size, setSize] = useState<number>(3);
    const [cards, setCards] = useState<BingoCard[]>([]);
    const cardsRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<BingoCardHandle[]>([]);

    const shuffleArray = (array: BingoNumber[]): BingoNumber[] => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    const generateCards = (e: React.FormEvent) => {
        e.preventDefault();

        if (!bingoImages || bingoImages.length === 0) {
            alert('Please add some images first!');
            return;
        }

        if (bingoImages.length < size * size) {
            alert(`Not enough unique images. Need at least ${size * size} images for a ${size}x${size} grid.`);
            return;
        }

        const generatedCards: BingoCard[] = [];

        for (let i = 0; i < numberOfCards; i++) {
            const shuffled = [...bingoImages]
                .sort(() => 0.5 - Math.random())
                .slice(0, size * size);

            // Convert to 2D array
            const cardItems: BingoNumber[][] = [];
            for (let j = 0; j < size; j++) {
                cardItems.push(shuffled.slice(j * size, (j + 1) * size));
            }

            generatedCards.push({
                id: i + 1,
                items: cardItems
            });
        }

        // Reset refs before updating cards to prevent reference issues
        cardRefs.current = [];
        setCards(generatedCards);
    };

    const handleDownloadAll = useCallback(async () => {
        // Wait a small amount of time to ensure all refs are set
        await new Promise(resolve => setTimeout(resolve, 100));

        for (let i = 0; i < cardRefs.current.length; i++) {
            if (cardRefs.current[i]?.download) {
                await cardRefs.current[i].download();
                // Add a small delay between downloads to prevent browser issues
                await new Promise(resolve => setTimeout(resolve, 300));
            }
        }
    }, []);

    return (
        <section>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Bingo Card Generator</h2>
                {cards.length > 0 && (
                    <button
                        onClick={handleDownloadAll}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                        Download All Cards
                    </button>
                )}
            </div>
            <form
                onSubmit={generateCards}
                className="max-w-xl mx-auto flex flex-col gap-4 shadow-sm p-6 rounded-md border border-slate-200 mb-8"
            >
                <div className="space-y-2">
                    <label htmlFor="numberOfCards" className="block text-sm font-medium text-gray-700">
                        Number of cards:
                    </label>
                    <input
                        type="number"
                        id="numberOfCards"
                        min="1"
                        max="20"
                        value={numberOfCards}
                        onChange={(e) => setNumberOfCards(parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                        Grid size (NxN):
                    </label>
                    <input
                        type="number"
                        id="size"
                        min="3"
                        max="10"
                        value={size}
                        onChange={(e) => setSize(parseInt(e.target.value) || 3)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Generate Bingo Cards
                </button>
            </form>

            <div className="space-y-8" ref={cardsRef}>
                {cards.map((card, index) => {
                    return (
                        <BingoCard
                            key={card.id}
                            ref={el => {
                                if (el) {
                                    cardRefs.current[index] = el;
                                }
                            }}
                            items={card.items}
                            index={index}
                        />
                    );
                })}
            </div>
        </section>
    );
};

export default CardGenerator;