import languages from '../data/languages.json';

const languageOrderMap = new Map();
languages.forEach((l, i) => languageOrderMap.set(l.id, i));

// Helper to check if a font is a system font (added by name, no uploaded file)
export const isSystemFont = (font) => !font.fontObject;

export const groupAndSortFonts = (fonts, overridesMap) => {
    const primary = (fonts || []).find(f => f.type === 'primary');
    const allFallback = (fonts || []).filter(f => f.type === 'fallback');

    const overriddenEntries = Object.entries(overridesMap || {});
    // Map fontID -> list of langIds
    const fontUsageMap = new Map();
    overriddenEntries.forEach(([langId, fontId]) => {
        if (!fontUsageMap.has(fontId)) fontUsageMap.set(fontId, []);
        fontUsageMap.get(fontId).push(langId);
    });

    const overriddenFontIds = new Set(fontUsageMap.keys());

    // Separate system fonts from uploaded fonts
    const nonOverriddenFallbacks = allFallback.filter(f => !overriddenFontIds.has(f.id));
    const uploadedFallbackFonts = nonOverriddenFallbacks.filter(f => !isSystemFont(f));
    const systemFonts = nonOverriddenFallbacks.filter(f => isSystemFont(f));

    const overriddenFonts = allFallback
        .filter(f => overriddenFontIds.has(f.id))
        .map(f => {
            const usedInLangs = fontUsageMap.get(f.id) || [];
            return { font: f, languages: usedInLangs };
        })
        .sort((a, b) => {
            const getMinIndex = (langs) => {
                if (!langs.length) return Infinity;
                return Math.min(...langs.map(id => languageOrderMap.get(id) ?? Infinity));
            };
            return getMinIndex(a.languages) - getMinIndex(b.languages);
        });

    // Helper to normalize font names for comparison (consistent with TypoContext)
    const normalizeFontName = (name) => {
        if (!name) return '';
        let n = name.trim().toLowerCase();

        // Remove extension
        const lastDot = n.lastIndexOf('.');
        if (lastDot > 0) {
            n = n.substring(0, lastDot);
        }

        // Remove common suffixes
        const suffixes = [
            '-regular', ' regular', '_regular',
            '-bold', ' bold', '_bold',
            '-italic', ' italic', '_italic',
            '-medium', ' medium', '_medium',
            '-light', ' light', '_light',
            '-thin', ' thin', '_thin',
            '-black', ' black', '_black',
            '-semibold', ' semibold', '_semibold',
            '-extrabold', ' extrabold', '_extrabold',
            '-extralight', ' extralight', '_extralight'
        ];

        for (const suffix of suffixes) {
            if (n.endsWith(suffix)) {
                n = n.substring(0, n.length - suffix.length);
            }
        }

        return n.replace(/[-_]/g, ' ').trim();
    };

    const primaryName = primary ? normalizeFontName(primary.fileName || primary.name) : null;

    // Filter out fallbacks that match the primary font
    const filteredGlobalFallbacks = uploadedFallbackFonts.filter(f => {
        if (!primaryName) return true;
        const fName = normalizeFontName(f.fileName || f.name);

        // Check matching normalized name
        if (fName && fName === primaryName) return false;

        // Check exact filename match if both exist
        if (primary.fileName && f.fileName && primary.fileName === f.fileName) return false;

        return true;
    });

    return {
        primary,
        globalFallbackFonts: filteredGlobalFallbacks, // Using filtered list
        systemFonts,
        overriddenFonts
    };
};

export const getVisualFontIdOrder = (fonts, overridesMap) => {
    const { primary, globalFallbackFonts, overriddenFonts } = groupAndSortFonts(fonts, overridesMap);
    const ids = [];
    if (primary) ids.push(primary.id);
    ids.push(...globalFallbackFonts.map(f => f.id));
    ids.push(...overriddenFonts.map(o => o.font.id));
    return ids;
};
