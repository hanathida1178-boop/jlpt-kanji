import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, Loader2 } from 'lucide-react';

interface StrokeOrderModalProps {
    kanji: string;
    isOpen: boolean;
    onClose: () => void;
}

export const StrokeOrderModal: React.FC<StrokeOrderModalProps> = ({ kanji, isOpen, onClose }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentStroke, setCurrentStroke] = useState(0);
    const [speed, setSpeed] = useState(1000); // milliseconds per stroke
    const [svgData, setSvgData] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && kanji) {
            fetchKanjiSvg(kanji);
        } else {
            setSvgData(null);
            setCurrentStroke(0);
            setIsPlaying(false);
            setError(null);
            setStrokeCount(0); // Reset stroke count when modal closes or kanji changes
        }
    }, [isOpen, kanji]);

    const [strokeCount, setStrokeCount] = useState(0);

    const fetchKanjiSvg = async (char: string) => {
        setIsLoading(true);
        setError(null);
        setStrokeCount(0);
        try {
            const hex = char.charCodeAt(0).toString(16).toLowerCase().padStart(5, '0');
            const response = await fetch(`https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/${hex}.svg`);
            if (!response.ok) {
                throw new Error('SVG not found');
            }
            const data = await response.text();

            // Count strokes
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'image/svg+xml');
            setStrokeCount(doc.querySelectorAll('path').length);

            setSvgData(data);
        } catch (err) {
            console.error('Error fetching Kanji SVG:', err);
            setError('書き順データが見つかりませんでした');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!isPlaying || !svgData) return;

        if (currentStroke >= strokeCount) {
            setIsPlaying(false);
            return;
        }

        const timer = setTimeout(() => {
            setCurrentStroke(prev => prev + 1);
        }, speed);

        return () => clearTimeout(timer);
    }, [isPlaying, currentStroke, svgData, strokeCount, speed]);

    const handlePlay = () => {
        if (currentStroke >= strokeCount) {
            setCurrentStroke(0);
        }
        setIsPlaying(true);
    };

    const handlePause = () => {
        setIsPlaying(false);
    };

    const handleReset = () => {
        setIsPlaying(false);
        setCurrentStroke(0);
    };

    const renderSvg = () => {
        if (!svgData) return null;

        // Extract the inner path content or modify the SVG
        // KanjiVG paths often have groups. We want to show all paths but with different opacities.
        // We also want to hide the stroke numbers which are usually in a group with id starting with kvg:StrokeNumbers
        let processed = svgData.replace(/<g[^>]*id="kvg:StrokeNumbers[^"]*"[^>]*>[\s\S]*?<\/g>/g, '');

        // Also remove any hardcoded width/height to make it responsive
        processed = processed.replace(/width="109" height="109"/g, 'viewBox="0 0 109 109"');

        let pathIndex = 0;
        const processedSvg = processed.replace(/<path/g, (match) => {
            const opacity = pathIndex < currentStroke ? 1 : 0.1;
            const isCurrent = pathIndex === currentStroke - 1;
            const strokeColor = isCurrent ? '#4f46e5' : '#1e293b';
            const strokeWidth = isCurrent ? '4' : '3';

            const result = `<path style="opacity:${opacity}; transition: opacity 0.3s ease, stroke 0.3s ease; stroke: ${strokeColor}; stroke-width: ${strokeWidth};"`;
            pathIndex++;
            return result;
        });

        return (
            <div
                className="stroke-order-svg w-full flex justify-center"
                dangerouslySetInnerHTML={{ __html: processedSvg }}
            />
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-[2.5rem] p-6 md:p-10 max-w-sm w-full shadow-2xl animate-in zoom-in duration-300 border-[12px] border-indigo-50" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest block mb-1">Writing Guide</span>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">書き順: {kanji}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 hover:bg-slate-100 rounded-2xl transition-all active:scale-90"
                    >
                        <X className="w-6 h-6 text-slate-400" />
                    </button>
                </div>

                {/* SVG Display Area */}
                <div className="bg-slate-50 rounded-[2rem] p-8 mb-8 flex items-center justify-center min-h-[250px] relative overflow-hidden border-2 border-slate-100 shadow-inner">
                    {isLoading ? (
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading SVG...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center text-center px-4">
                            <div className="text-7xl font-bold text-slate-200 mb-4">{kanji}</div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase leading-relaxed tracking-wider">
                                {error}
                            </p>
                        </div>
                    ) : (
                        renderSvg()
                    )}
                </div>

                {/* Progress & Controls */}
                {!isLoading && !error && svgData && (
                    <div className="space-y-6">
                        {/* Progress Bar */}
                        <div>
                            <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                                <span>Progress</span>
                                <span>{currentStroke} / {strokeCount} Strokes</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2.5 p-0.5">
                                <div
                                    className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(79,70,229,0.4)]"
                                    style={{ width: `${strokeCount > 0 ? (currentStroke / strokeCount) * 100 : 0}%` }}
                                />
                            </div>
                        </div>

                        {/* Control Buttons */}
                        <div className="flex gap-3">
                            {!isPlaying ? (
                                <button
                                    onClick={handlePlay}
                                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all text-xs uppercase tracking-widest"
                                >
                                    <Play className="w-4 h-4 fill-current" />
                                    Play
                                </button>
                            ) : (
                                <button
                                    onClick={handlePause}
                                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-amber-500 text-white rounded-2xl font-black shadow-lg shadow-amber-100 hover:bg-amber-600 active:scale-95 transition-all text-xs uppercase tracking-widest"
                                >
                                    <Pause className="w-4 h-4 fill-current" />
                                    Pause
                                </button>
                            )}
                            <button
                                onClick={handleReset}
                                className="px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 active:scale-95 transition-all"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Speed Control */}
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3 text-center">Animation Speed</label>
                            <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
                                {[
                                    { label: '🐢', val: 1500 },
                                    { label: '🏃', val: 1000 },
                                    { label: '⚡', val: 500 }
                                ].map((s) => (
                                    <button
                                        key={s.val}
                                        onClick={() => setSpeed(s.val)}
                                        className={`flex-1 py-2 rounded-xl text-sm transition-all ${speed === s.val ? 'bg-white shadow-sm text-indigo-600 scale-100' : 'text-slate-400 hover:text-slate-600 scale-95'}`}
                                    >
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .stroke-order-svg svg {
                    width: 100%;
                    max-width: 180px;
                    height: auto;
                }
                .stroke-order-svg path {
                    stroke-linecap: round;
                    stroke-linejoin: round;
                    fill: none;
                }
            `}</style>
        </div>
    );
};
