import { useState } from 'react';
import PropTypes from 'prop-types';
import { useTypo } from '../context/useTypo';
import FallbackFontAdder from './FallbackFontAdder';
import { buildWeightSelectOptions, resolveWeightToAvailableOption } from '../utils/weightUtils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export const SortableFontCard = ({
    font,
    index,
    isActive,
    globalWeight,
    globalLineHeight,
    globalLetterSpacing,
    setGlobalLineHeight,
    setGlobalLetterSpacing,
    hasLineHeightOverrides,
    lineHeightOverrideCount,
    resetAllLineHeightOverrides,
    getFontColor,
    updateFontColor,
    getEffectiveFontSettings,
    fontScales,
    lineHeight,
    updateFallbackFontOverride,
    resetFallbackFontOverrides,
    setActiveFont,
    handleRemove,
    updateFontWeight
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: font.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        position: 'relative',
        zIndex: isDragging ? 999 : 'auto',
    };

    const isPrimary = font.type === 'primary';

    const effectiveWeight = getEffectiveFontSettings(font.id)?.weight ?? 400;
    const weightOptions = buildWeightSelectOptions(font);
    const resolvedWeight = resolveWeightToAvailableOption(font, effectiveWeight);

    const globalLineHeightPct = Math.round((typeof globalLineHeight === 'number' ? globalLineHeight : 1.2) * 100);
    const globalLetterSpacingEm = typeof globalLetterSpacing === 'number' ? globalLetterSpacing : 0;

    const isInheritingGlobalWeight = font.type === 'fallback' && (font.weightOverride === undefined || font.weightOverride === null || font.weightOverride === '');
    const isGlobalWeightUnavailable = isInheritingGlobalWeight && typeof globalWeight === 'number' && effectiveWeight !== globalWeight;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`
                bg-slate-50 rounded-lg p-3 border transition-all relative
                ${isPrimary ? 'cursor-pointer' : ''}
                ${isActive
                    ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }
            `}
            onClick={() => setActiveFont(font.id)}
        >
            {font.type !== 'primary' && (
                <button
                    onClick={(e) => handleRemove(e, font.id)}
                    className="absolute top-2 right-2 text-slate-400 hover:text-rose-500 transition-colors p-1 z-10"
                    title="Remove font"
                    onPointerDown={(e) => e.stopPropagation()}
                    type="button"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                </button>
            )}
            <div className={`flex items-center gap-1 mb-1 ${!isPrimary ? '-ml-[3px]' : ''}`}>
                <div
                    className="text-slate-400 cursor-move flex-shrink-0 hover:text-indigo-600 transition-colors p-1 -ml-1 rounded hover:bg-slate-100 touch-none"
                    title="Drag to reorder"
                    {...attributes}
                    {...listeners}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                        <path d="M7 2a2 2 0 1 1 0 4a2 2 0 0 1 0-4ZM7 8a2 2 0 1 1 0 4a2 2 0 0 1 0-4ZM7 14a2 2 0 1 1 0 4a2 2 0 0 1 0-4ZM13 2a2 2 0 1 1 0 4a2 2 0 0 1 0-4ZM13 8a2 2 0 1 1 0 4a2 2 0 0 1 0-4ZM13 14a2 2 0 1 1 0 4a2 2 0 0 1 0-4Z" />
                    </svg>
                </div>
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    {font.type === 'primary' ? 'Main Font' : 'Fallback Font'}
                </div>
            </div>
            <div className={`font-mono text-sm break-all text-slate-700 font-medium pr-6 ${!isPrimary ? '' : ''}`}>
                {font.fileName || font.name || 'No font uploaded'}
            </div>
            {!isPrimary && isGlobalWeightUnavailable && (
                <div className="text-[10px] text-amber-600 mt-1">
                    Main weight {globalWeight} not available; using {effectiveWeight}.
                </div>
            )}
            {font.fontObject && (
                <div className={`text-xs text-slate-400 mt-2 flex items-center gap-2 ${!isPrimary ? '' : ''}`}>
                    <div className="relative w-3 h-3 flex-shrink-0 cursor-pointer group">
                        <div
                            className="absolute inset-0 rounded-full ring-1 ring-slate-200 group-hover:ring-indigo-300 transition-shadow"
                            style={{ backgroundColor: getFontColor(index) }}
                        />
                        <input
                            type="color"
                            value={getFontColor(index)}
                            onChange={(e) => updateFontColor(index, e.target.value)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            title={`Change color for ${isPrimary ? 'Primary' : 'Fallback'} font`}
                            onClick={(e) => e.stopPropagation()}
                            onPointerDown={e => e.stopPropagation()}
                        />
                    </div>
                    {font.fontObject.numGlyphs} glyphs
                </div>
            )}
            {!font.fontObject && font.name && (
                <div className={`text-xs text-slate-400 mt-2 flex items-center gap-2 ${!isPrimary ? '' : ''}`}>
                    <div className="relative w-3 h-3 flex-shrink-0 cursor-pointer group">
                        <div
                            className="absolute inset-0 rounded-full ring-1 ring-slate-200 group-hover:ring-indigo-300 transition-shadow"
                            style={{ backgroundColor: getFontColor(index) }}
                        />
                        <input
                            type="color"
                            value={getFontColor(index)}
                            onChange={(e) => updateFontColor(index, e.target.value)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            title={`Change color for ${isPrimary ? 'Primary' : 'Fallback'} font`}
                            onClick={(e) => e.stopPropagation()}
                            onPointerDown={e => e.stopPropagation()}
                        />
                    </div>
                    System/Web Font
                </div>
            )}

            {/* Main Font Controls */}
            {isPrimary && (
                <div className="mt-3 pt-2 border-t border-slate-200/60 animate-in fade-in slide-in-from-top-2 duration-200 cursor-auto">
                    <div className="space-y-2" onClick={e => e.stopPropagation()} onPointerDown={e => e.stopPropagation()}>
                        {/* Weight */}
                        <div>
                            <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                                <span>Weight</span>
                                <span className="text-slate-400 font-mono text-[10px]">{effectiveWeight}</span>
                            </div>
                            <select
                                value={resolvedWeight}
                                onChange={(e) => {
                                    const raw = e.target.value;
                                    updateFontWeight(font.id, parseInt(raw));
                                }}
                                className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                            >
                                {weightOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Line Height */}
                        <div>
                            <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                                <span>Line Height</span>
                                <div className="flex items-center gap-1">
                                    <input
                                        type="number"
                                        min="50"
                                        max="300"
                                        step="5"
                                        value={globalLineHeightPct}
                                        onChange={(e) => {
                                            const parsed = parseInt(e.target.value);
                                            if (isNaN(parsed)) return;
                                            const constrained = Math.max(50, Math.min(300, parsed));
                                            setGlobalLineHeight?.(constrained / 100);
                                        }}
                                        className="w-12 text-right font-mono bg-transparent border-b border-slate-300 focus:border-indigo-600 focus:outline-none px-1"
                                    />
                                    <span className="font-mono">%</span>
                                </div>
                            </div>
                            <input
                                type="range"
                                min="50"
                                max="300"
                                step="5"
                                value={globalLineHeightPct}
                                onChange={(e) => {
                                    const parsed = parseInt(e.target.value);
                                    const constrained = Math.max(50, Math.min(300, parsed));
                                    setGlobalLineHeight?.(constrained / 100);
                                }}
                                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 block"
                            />
                            {hasLineHeightOverrides && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        resetAllLineHeightOverrides?.();
                                    }}
                                    className="w-full mt-2 py-1 text-[10px] font-bold text-rose-500 border border-rose-200 rounded hover:bg-rose-50 transition-colors"
                                    type="button"
                                >
                                    Reset {lineHeightOverrideCount} Overrides
                                </button>
                            )}
                        </div>

                        {/* Letter Spacing */}
                        <div>
                            <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                                <span>Letter Spacing</span>
                                <span>{globalLetterSpacingEm}em</span>
                            </div>
                            <input
                                type="range"
                                min="-0.1"
                                max="0.5"
                                step="0.01"
                                value={globalLetterSpacingEm}
                                onChange={(e) => {
                                    const val = parseFloat(e.target.value);
                                    if (isNaN(val)) return;
                                    setGlobalLetterSpacing?.(val);
                                }}
                                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 block"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Weight Control */}
            {!isPrimary && isActive && (
                <div className="mt-3 pt-2 border-t border-slate-200/60 animate-in fade-in slide-in-from-top-2 duration-200 cursor-auto">
                    {(() => {
                        const effectiveSettings = getEffectiveFontSettings(font.id);
                        const hasOverrides = effectiveSettings && (
                            (effectiveSettings.scale !== fontScales.fallback) ||
                            (effectiveSettings.lineHeight !== lineHeight) ||
                            (font.weightOverride !== undefined)
                        );

                        return (
                            <div className="space-y-2" onClick={e => e.stopPropagation()} onPointerDown={e => e.stopPropagation()}>
                                {/* Header with Reset */}
                                <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                        Overrides
                                    </span>
                                    {hasOverrides && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                resetFallbackFontOverrides(font.id);
                                            }}
                                            className="text-[9px] text-rose-500 font-bold hover:text-rose-700 hover:underline"
                                        >
                                            Reset
                                        </button>
                                    )}
                                </div>

                                {/* Weight Override */}
                                <div>
                                    <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                                        <span>Weight</span>
                                        {font.weightOverride !== undefined && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    updateFallbackFontOverride(font.id, 'weightOverride', undefined);
                                                }}
                                                className="text-[9px] text-slate-400 hover:text-rose-500"
                                                title="Reset to Main Weight"
                                                type="button"
                                            >
                                                ↺
                                            </button>
                                        )}
                                    </div>
                                    <select
                                        value={resolvedWeight}
                                        onChange={(e) => {
                                            const raw = e.target.value;
                                            updateFontWeight(font.id, parseInt(raw));
                                        }}
                                        className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                                    >
                                        {weightOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Font Scale Slider */}
                                <div>
                                    <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                                        <span>Size Adjust</span>
                                        <div className="flex items-center gap-1">
                                            <input
                                                type="number"
                                                min="25"
                                                max="300"
                                                step="5"
                                                value={font.scale !== undefined ? font.scale : fontScales.fallback}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (val === '') {
                                                        updateFallbackFontOverride(font.id, 'scale', '');
                                                    } else {
                                                        const parsed = parseFloat(val);
                                                        updateFallbackFontOverride(font.id, 'scale', parsed);
                                                    }
                                                }}
                                                onBlur={(e) => {
                                                    let val = parseFloat(e.target.value);
                                                    if (isNaN(val)) {
                                                        // If empty/invalid, reset to undefined to use global fallback
                                                        resetFallbackFontOverrides(font.id);
                                                    } else {
                                                        // Clamp value
                                                        val = Math.max(25, Math.min(300, val));
                                                        updateFallbackFontOverride(font.id, 'scale', val);
                                                    }
                                                }}
                                                className="w-12 text-right font-mono bg-transparent border-b border-slate-300 focus:border-indigo-600 focus:outline-none px-1"
                                            />
                                            <span className="font-mono">%</span>
                                        </div>
                                    </div>
                                    <input
                                        type="range"
                                        min="25"
                                        max="300"
                                        step="5"
                                        value={effectiveSettings?.scale || fontScales.fallback}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value);
                                            updateFallbackFontOverride(font.id, 'scale', val);
                                        }}
                                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 block"
                                    />
                                </div>

                                {/* Line Height Slider */}
                                <div>
                                    <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                                        <span>Line Height</span>
                                        <div className="flex items-center gap-1">
                                            <input
                                                type="number"
                                                min="50"
                                                max="400"
                                                step="5"
                                                value={font.lineHeight !== undefined && font.lineHeight !== '' ? Math.round(font.lineHeight * 100) : Math.round(lineHeight * 100)}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (val === '') {
                                                        updateFallbackFontOverride(font.id, 'lineHeight', '');
                                                    } else {
                                                        const parsed = parseFloat(val);
                                                        updateFallbackFontOverride(font.id, 'lineHeight', parsed / 100);
                                                    }
                                                }}
                                                onBlur={(e) => {
                                                    let val = parseFloat(e.target.value);
                                                    if (isNaN(val)) {
                                                        updateFallbackFontOverride(font.id, 'lineHeight', undefined);
                                                    } else {
                                                        val = Math.max(50, Math.min(400, val));
                                                        updateFallbackFontOverride(font.id, 'lineHeight', val / 100);
                                                    }
                                                }}
                                                className="w-12 text-right font-mono bg-transparent border-b border-slate-300 focus:border-indigo-600 focus:outline-none px-1"
                                            />
                                            <span className="font-mono">%</span>
                                        </div>
                                    </div>
                                    <input
                                        type="range"
                                        min="0.5"
                                        max="4.0"
                                        step="0.05"
                                        value={font.lineHeight !== undefined && font.lineHeight !== '' ? font.lineHeight : lineHeight}
                                        onChange={(e) => {
                                            const val = parseFloat(e.target.value);
                                            updateFallbackFontOverride(font.id, 'lineHeight', val);
                                        }}
                                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 block"
                                    />
                                </div>
                            </div>
                        );
                    })()}
                </div>
            )}
        </div>
    );
};

SortableFontCard.propTypes = {
    font: PropTypes.shape({
        id: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        fontObject: PropTypes.object,
        fileName: PropTypes.string,
        name: PropTypes.string,
        scale: PropTypes.number,
        lineHeight: PropTypes.number,
        axes: PropTypes.object,
        isVariable: PropTypes.bool,
        weightOverride: PropTypes.number,
        staticWeight: PropTypes.number
    }).isRequired,
    index: PropTypes.number.isRequired,
    isActive: PropTypes.bool.isRequired,
    globalWeight: PropTypes.number,
    globalLineHeight: PropTypes.number,
    globalLetterSpacing: PropTypes.number,
    setGlobalLineHeight: PropTypes.func,
    setGlobalLetterSpacing: PropTypes.func,
    hasLineHeightOverrides: PropTypes.bool,
    lineHeightOverrideCount: PropTypes.number,
    resetAllLineHeightOverrides: PropTypes.func,
    getFontColor: PropTypes.func.isRequired,
    updateFontColor: PropTypes.func.isRequired,
    getEffectiveFontSettings: PropTypes.func.isRequired,
    fontScales: PropTypes.object.isRequired,
    lineHeight: PropTypes.number.isRequired,
    updateFallbackFontOverride: PropTypes.func.isRequired,
    resetFallbackFontOverrides: PropTypes.func.isRequired,
    setActiveFont: PropTypes.func.isRequired,
    handleRemove: PropTypes.func.isRequired,
    updateFontWeight: PropTypes.func.isRequired
};

const FontTabs = () => {
    const {
        fonts,
        activeFont,
        setActiveFont,
        removeFallbackFont,
        getFontColor,
        getEffectiveFontSettings,
        fontScales,
        lineHeight,
        updateFallbackFontOverride,
        resetFallbackFontOverrides,
        colors,
        updateFontColor,
        setColors,
        updateFontWeight,
        weight
    } = useTypo();
    const [showAdder, setShowAdder] = useState(false);

    const handleRemove = (e, fontId) => {
        e.stopPropagation();
        if (confirm('Remove this font?')) {
            removeFallbackFont(fontId);
        }
    };

    const fallbackFonts = (fonts || []).filter(f => f.type === 'fallback');

    return (
        <div className="pb-4 space-y-2">
            {fallbackFonts.map((font) => (
                <SortableFontCard
                    key={font.id}
                    font={font}
                    index={(fonts || []).findIndex(f => f.id === font.id)}
                    isActive={font.id === activeFont}
                    globalWeight={weight}
                    getFontColor={getFontColor}
                    updateFontColor={updateFontColor}
                    getEffectiveFontSettings={getEffectiveFontSettings}
                    fontScales={fontScales}
                    lineHeight={lineHeight}
                    updateFallbackFontOverride={updateFallbackFontOverride}
                    resetFallbackFontOverrides={resetFallbackFontOverrides}
                    setActiveFont={setActiveFont}
                    handleRemove={handleRemove}
                    updateFontWeight={updateFontWeight}
                />
            ))}

            {/* Static System Fallback Tab */}
            <div className="bg-slate-50/50 rounded-lg p-3 border border-slate-200 border-dashed relative select-none">
                <div className="flex items-center gap-2 mb-1">
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                        Final Fallback
                    </div>
                </div>

                <div className="text-xs text-slate-400 mt-2 flex items-center gap-2">
                    <div className="relative w-3 h-3 flex-shrink-0 cursor-pointer group">
                        <div
                            className="absolute inset-0 rounded-full ring-1 ring-slate-200 group-hover:ring-indigo-300 transition-shadow"
                            style={{ backgroundColor: colors.missing }}
                        />
                        <input
                            type="color"
                            value={colors.missing}
                            onChange={(e) => setColors(prev => ({ ...prev, missing: e.target.value }))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            title="Change system fallback color"
                        />
                    </div>
                    System Default
                </div>
            </div>

            {/* Add Fallback Font Button */}
            <button
                onClick={() => setShowAdder(!showAdder)}
                className="w-full bg-slate-100 hover:bg-slate-200 border border-slate-300 border-dashed rounded-lg p-2.5 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={`w-4 h-4 transition-transform duration-300 ${showAdder ? 'rotate-45' : 'rotate-0'}`}
                >
                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                </svg>
                <span>{showAdder ? 'Cancel' : 'Add Fallback Font'}</span>
            </button>

            {/* Fallback Font Adder */}
            {showAdder && (
                <FallbackFontAdder
                    onClose={() => setShowAdder(false)}
                    onAdd={() => setShowAdder(false)}
                />
            )}
        </div>
    );
};

export default FontTabs;
