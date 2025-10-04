import React, { useState } from 'react';
import type { BingoNumber } from '../types';

interface BingoImageProps {
    item: BingoNumber;
    index: number;
    editable?: boolean;
    onLabelChange?: (label: string) => void;
    className?: string;
    showLabel?: boolean;
}

const BingoImage: React.FC<BingoImageProps> = ({
    item,
    index,
    editable = false,
    onLabelChange = () => {},
    className = '',
    showLabel = true
}) => {
    const [label, setLabel] = useState(item.label);
    const [isEditing, setIsEditing] = useState(false);

    const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newLabel = e.target.value;
        setLabel(newLabel);
        onLabelChange(newLabel);
    };

    const handleLabelClick = () => {
        if (editable) {
            setIsEditing(true);
        }
    };

    const handleBlur = () => {
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            setIsEditing(false);
        }
    };

    return (
        <div className={`relative w-full aspect-square bg-white border border-black rounded-md overflow-hidden ${className}`}>
            <div className="absolute inset-0 flex items-center justify-center bg-black">
                <img 
                    src={item.src} 
                    alt={item.label} 
                    className="max-w-full max-h-full object-contain" 
                />
            </div>
            
            {showLabel && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="text-center">
                        {isEditing ? (
                            <input
                                type="text"
                                value={label}
                                onChange={handleLabelChange}
                                onBlur={handleBlur}
                                onKeyDown={handleKeyDown}
                                className="w-full bg-white/90 text-black px-2 py-1 rounded text-center font-bold"
                                autoFocus
                            />
                        ) : (
                            <span 
                                className="text-2xl font-extrabold text-white cursor-text"
                                style={{
                                    textShadow: `-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0 0 10px rgba(0,0,0,0.5)`,
                                    lineHeight: '1.2',
                                    wordWrap: 'break-word',
                                    maxWidth: '100%',
                                    display: 'inline-block',
                                    padding: '0.25rem 0.5rem',
                                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                    borderRadius: '0.25rem',
                                    ...(editable && !label && { 
                                        backgroundColor: 'rgba(255, 0, 0, 0.3)',
                                        border: '1px solid rgba(255, 0, 0, 0.5)'
                                    })
                                }}
                                onClick={handleLabelClick}
                            >
                                {label || (editable ? 'Click to add label' : '')}
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BingoImage;
