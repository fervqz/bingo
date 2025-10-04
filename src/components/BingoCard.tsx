import { useRef, forwardRef, useImperativeHandle } from 'react';
import { toPng } from 'html-to-image';
import type { BingoNumber } from "../types";
import BingoImage from "./BingoImage";

export type BingoCardHandle = {
    download: () => Promise<void>;
};

interface BingoCardProps {
    items: (BingoNumber | null)[][];
    index: number;
    className?: string;
}

const BingoCard = forwardRef<BingoCardHandle, BingoCardProps>(({ items, index, className = '' }, ref) => {
    const size = items.length;
    const cardRef = useRef<HTMLDivElement>(null);

    const download = async () => {
        if (!cardRef.current) return;

        try {
            const dataUrl = await toPng(cardRef.current, {
                backgroundColor: '#ffffff',
                pixelRatio: 2 // For better quality
            });

            const link = document.createElement('a');
            link.download = `bingo-card-milton-${index + 1}.png`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error('Error downloading card:', error);
            throw error;
        }
    };

    useImperativeHandle(ref, () => ({
        download
    }));

    const handleDownloadClick = () => {
        download().catch(console.error);
    };

    return (
        <div className={`p-4 border border-black border-4 rounded-lg shadow-sm bg-white ${className}`}>
            <div
                ref={cardRef}
            >

                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-[3rem] font-black text-center flex-1">Bingo Card Milton 🏰 - #{index + 1}</h3>
                </div>
                <div
                    className="grid gap-2"
                    style={{
                        gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`
                    }}
                >
                    {items.flat().map((item, idx) => (
                        <div
                            key={idx}
                            className={`aspect-square p-2 ${!item ? 'bg-gray-100' : ''}`}
                        >
                            {item && (
                                <BingoImage
                                    item={item}
                                    index={idx}
                                    editable={false}
                                    className="h-full"
                                    showLabel={true}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <button
                onClick={handleDownloadClick}
                className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                Download
            </button>
        </div>
    );
});

export default BingoCard;
