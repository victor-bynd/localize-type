import { useState } from 'react';
import { generateCSS } from '../utils/cssExporter';
import { useTypo } from '../context/useTypo';

const CSSExporter = ({ onClose, languages = [] }) => {
    const context = useTypo();

    const [copied, setCopied] = useState(false);

    // Fixed options - no toggles
    const options = {
        includeFontFace: true,
        useCSSVariables: true,
        includeComments: true,
        prettyPrint: true
    };

    const cssCode = generateCSS(context, languages, options);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(cssCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    const handleDownload = () => {
        const blob = new Blob([cssCode], { type: 'text/css' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'typography-styles.css';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };



    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Export CSS</h2>
                        <p className="text-sm text-slate-500 mt-1">Copy or download your typography styles</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        title="Close"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>


                {/* Code Display */}
                <div className="flex-1 overflow-auto p-6">
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-auto text-sm font-mono leading-relaxed">
                        <code>{cssCode}</code>
                    </pre>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-slate-50">
                    <div className="text-sm text-slate-500">
                        {cssCode.split('\n').length} lines • {(new Blob([cssCode]).size / 1024).toFixed(1)} KB
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleDownload}
                            className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-gray-300 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            Download .css
                        </button>
                        <button
                            onClick={handleCopy}
                            className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                        >
                            {copied ? (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                    Copy to Clipboard
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CSSExporter;
