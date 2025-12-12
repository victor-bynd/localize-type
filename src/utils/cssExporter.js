/**
 * CSS Exporter Utility
 * Generates production-ready CSS from typography settings
 */

/**
 * Convert font file to base64 data URI
 */
async function fontToBase64(fontUrl) {
    try {
        const response = await fetch(fontUrl);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('Error converting font to base64:', error);
        return null;
    }
}

/**
 * Generate @font-face declarations
 */
function generateFontFaceRules(fonts, includeFontFace, fontScales) {
    if (!includeFontFace) return '';

    const rules = [];

    fonts.forEach(font => {
        if (font.fontUrl && font.fileName) {
            const fontFamily = font.fileName.replace(/\.[^/.]+$/, ''); // Remove extension
            const isFallback = font.type === 'fallback';

            // Calculate font-size-adjust value (scale percentage as decimal)
            const sizeAdjust = isFallback ? (fontScales.fallback / 100) : 1;

            rules.push(`@font-face {
  font-family: '${fontFamily}';
  src: url('${font.fontUrl}') format('truetype');
  font-display: swap;
  size-adjust: ${Math.round(sizeAdjust * 100)}%;
}`);
        }
    });

    return rules.length > 0 ? `/* Font Face Declarations */\n${rules.join('\n\n')}\n\n` : '';
}

/**
 * Generate CSS variables
 */
function generateCSSVariables(context) {
    const { baseFontSize, fontScales, lineHeight, headerStyles, colors, fonts } = context;

    const primaryFont = fonts.find(f => f.type === 'primary');
    const primaryFontFamily = primaryFont?.fileName?.replace(/\.[^/.]+$/, '') || 'sans-serif';

    const variables = [
        `  --font-primary: '${primaryFontFamily}', sans-serif;`,
        `  --font-size-base: ${baseFontSize}px;`,
        `  --font-scale-fallback: ${fontScales.fallback}%;`,
        `  --line-height-base: ${lineHeight};`
    ];

    // Add header variables
    Object.entries(headerStyles).forEach(([tag, style]) => {
        variables.push(`  --${tag}-scale: ${style.scale}em;`);
        variables.push(`  --${tag}-line-height: ${style.lineHeight};`);
    });

    return `/* CSS Variables */\n:root {\n${variables.join('\n')}\n}\n\n`;
}

/**
 * Generate base typography styles
 */
function generateBaseStyles(context) {
    const { baseFontSize, lineHeight, colors, fonts } = context;

    const primaryFont = fonts.find(f => f.type === 'primary');
    const primaryFontFamily = primaryFont?.fileName?.replace(/\.[^/.]+$/, '') || 'sans-serif';

    return `/* Base Typography */\nbody {
  font-family: '${primaryFontFamily}', sans-serif;
  font-size: ${baseFontSize}px;
  line-height: ${lineHeight};
}\n\n`;
}

/**
 * Generate header styles
 */
function generateHeaderStyles(headerStyles, baseFontSize) {
    const rules = [];

    Object.entries(headerStyles).forEach(([tag, style]) => {
        const fontSize = Math.round(style.scale * baseFontSize);
        rules.push(`${tag} {
  font-size: ${fontSize}px;
  line-height: ${style.lineHeight};
}`);
    });

    return `/* Header Styles */\n${rules.join('\n\n')}\n\n`;
}

/**
 * Generate fallback font classes
 */
function generateFallbackFontClasses(context) {
    const { fonts, lineHeight } = context;

    const fallbackFonts = fonts.filter(f => f.type === 'fallback');
    if (fallbackFonts.length === 0) return '';

    const rules = [];

    fallbackFonts.forEach(font => {
        const fontFamily = font.fileName?.replace(/\.[^/.]+$/, '') || 'sans-serif';
        const fontLineHeight = font.lineHeight ?? lineHeight;

        const className = fontFamily.toLowerCase().replace(/[^a-z0-9]/g, '-');

        rules.push(`.font-${className} {
  font-family: '${fontFamily}', sans-serif;
  line-height: ${fontLineHeight};
}`);
    });

    return rules.length > 0 ? `/* Fallback Font Classes */\n${rules.join('\n\n')}\n\n` : '';
}

/**
 * Generate language-specific overrides
 */
function generateLanguageOverrides(context, languages) {
    const { fallbackFontOverrides, fonts } = context;

    if (Object.keys(fallbackFontOverrides).length === 0) return '';

    const rules = [];

    Object.entries(fallbackFontOverrides).forEach(([langId, fontId]) => {
        const language = languages.find(l => l.id === langId);
        if (!language) return;

        const font = fonts.find(f => f.id === fontId);
        if (!font) return;

        const fontFamily = font.fileName?.replace(/\.[^/.]+$/, '') || 'sans-serif';
        const lineHeightValue = font.lineHeight || context.lineHeight;

        rules.push(`[lang="${language.code}"] {
  font-family: '${fontFamily}', sans-serif;
  line-height: ${lineHeightValue};
}`);
    });

    return rules.length > 0 ? `/* Language-Specific Overrides */\n${rules.join('\n\n')}\n` : '';
}

/**
 * Main CSS generation function
 */
export function generateCSS(context, languages = [], options = {}) {
    const {
        includeFontFace = false,
        useCSSVariables = true,
        includeComments = true,
        prettyPrint = true
    } = options;

    let css = '';

    // Add header comment
    if (includeComments) {
        css += `/* Generated by Localize Type */\n/* ${new Date().toISOString()} */\n\n`;
    }

    // Generate sections
    css += generateFontFaceRules(context.fonts, includeFontFace, context.fontScales);
    css += generateHeaderStyles(context.headerStyles, context.baseFontSize);
    css += generateLanguageOverrides(context, languages);

    // Minify if needed
    if (!prettyPrint) {
        css = css.replace(/\s+/g, ' ').replace(/\n/g, '').trim();
    }

    return css;
}
