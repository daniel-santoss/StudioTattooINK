import React from 'react';

interface RatingDisplayProps {
    rating: number;
    count?: number;
    size?: string;
    showText?: boolean;
    activeColor?: string;
    bgColor?: string;
}

/**
 * Componente para exibir estrelas de avaliação com suporte a frações
 */
export const RatingDisplay: React.FC<RatingDisplayProps> = ({
    rating,
    count,
    size = "18px",
    showText = true,
    activeColor = "text-amber-500",
    bgColor = "text-white/10"
}) => {
    return (
        <div className="flex items-center gap-1.5 font-inter">
            {showText && (
                <span 
                    className="text-white font-bold leading-none" 
                    style={{ fontSize: `calc(${size} * 0.9)` }}
                >
                    {rating.toFixed(1)}
                </span>
            )}
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((starIndex) => {
                    const fillAmount = Math.min(Math.max(rating - (starIndex - 1), 0), 1) * 100;
                    return (
                        <div 
                            key={starIndex} 
                            className="relative inline-block" 
                            style={{ width: size, height: size }}
                        >
                            {/* Background Star (Solid but Dimmed) */}
                            <span
                                className={`material-symbols-outlined absolute inset-0 ${bgColor} select-none`}
                                style={{ fontSize: size, fontVariationSettings: "'FILL' 1" }}
                            >
                                star
                            </span>
                            {/* Foreground Star (Filled with Clip) */}
                            <div
                                className="absolute inset-0 overflow-hidden select-none"
                                style={{ width: `${fillAmount}%` }}
                            >
                                <span
                                    className={`material-symbols-outlined ${activeColor}`}
                                    style={{ fontSize: size, fontVariationSettings: "'FILL' 1" }}
                                >
                                    star
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
            {count !== undefined && (
                <span 
                    className="text-text-muted font-medium ml-0.5 leading-none" 
                    style={{ fontSize: `calc(${size} * 0.8)` }}
                >
                    ({count >= 1000 ? count.toLocaleString('pt-BR') : count})
                </span>
            )}
        </div>
    );
};

export default RatingDisplay;
