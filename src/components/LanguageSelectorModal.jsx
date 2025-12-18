import { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTypo } from '../context/useTypo';

const LanguageSelectorModal = ({ onClose }) => {
    const {
        languages,
        visibleLanguageIds,
        isLanguageVisible,
        toggleLanguageVisibility,
        showAllLanguages,
        hideAllLanguages,
        resetVisibleLanguages
    } = useTypo();

    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [onClose]);

    const groups = useMemo(() => {
        const grouped = {
            Latin: [],
            Greek: [],
            Cyrillic: [],
            RTL: [],
            Indic: [],
            'Southeast Asia': [],
            CJK: [],
            Other: []
        };

        const push = (key, lang) => {
            if (!grouped[key]) grouped.Other.push(lang);
            else grouped[key].push(lang);
        };

        languages.forEach((lang) => {
            if (lang.id === 'en-US') {
                push('Latin', lang);
                return;
            }

            if (lang.dir === 'rtl') {
                push('RTL', lang);
                return;
            }

            if (lang.script === 'Latn') push('Latin', lang);
            else if (lang.script === 'Grek') push('Greek', lang);
            else if (lang.script === 'Cyrl') push('Cyrillic', lang);
            else if (['Deva', 'Beng', 'Knda', 'Telu', 'Gujr', 'Guru', 'Mlym', 'Taml'].includes(lang.script)) push('Indic', lang);
            else if (lang.script === 'Thai') push('Southeast Asia', lang);
            else if (['Hans', 'Hant', 'Jpan', 'Kore'].includes(lang.script)) push('CJK', lang);
            else push('Other', lang);
        });

        const order = ['Latin', 'Greek', 'Cyrillic', 'RTL', 'Indic', 'Southeast Asia', 'CJK', 'Other'];
        return order
            .map((key) => ({ key, items: grouped[key] }))
            .filter((g) => g.items.length > 0);
    }, [languages]);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-xl mt-12 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label="Language selector"
            >
                <div className="flex items-center justify-between p-5 border-b border-gray-200">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Languages</h2>
                        <p className="text-xs text-slate-500 mt-1">
                            Showing {visibleLanguageIds.length} of {languages.length}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        title="Close"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div className="p-5">
                    <div className="flex flex-wrap gap-2 mb-4">
                        <button
                            onClick={showAllLanguages}
                            className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                        >
                            Select all
                        </button>
                        <button
                            onClick={hideAllLanguages}
                            className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                        >
                            Select none
                        </button>
                        <button
                            onClick={resetVisibleLanguages}
                            className="px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                        >
                            Reset
                        </button>
                    </div>

                    <div className="max-h-[60vh] overflow-auto pr-1">
                        {groups.map((group) => (
                            <div key={group.key} className="mb-4">
                                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2">
                                    {group.key}
                                </div>
                                <div className="space-y-2">
                                    {group.items.map((lang) => (
                                        <label
                                            key={lang.id}
                                            className="flex items-center justify-between gap-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 cursor-pointer"
                                        >
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <div className="text-sm font-semibold text-slate-800 truncate">{lang.name}</div>
                                                    <span className="text-[10px] font-mono text-slate-600 bg-slate-200/60 border border-slate-200 px-2 py-0.5 rounded-md whitespace-nowrap">
                                                        {lang.id}
                                                    </span>
                                                </div>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={isLanguageVisible(lang.id)}
                                                onChange={() => toggleLanguageVisibility(lang.id)}
                                                className="h-4 w-4 accent-indigo-600"
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 border-t border-gray-200 bg-slate-50 flex items-center justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

LanguageSelectorModal.propTypes = {
    onClose: PropTypes.func.isRequired
};

export default LanguageSelectorModal;
