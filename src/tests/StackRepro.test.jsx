import { render, screen, act } from '@testing-library/react';
import { TypoProvider, TypoContext } from '../context/TypoContext';
import LanguageCard from '../components/LanguageCard';
import { useContext, useEffect } from 'react';

// Helper to access context
const TestController = ({ setup }) => {
    const context = useContext(TypoContext);
    useEffect(() => {
        setup(context);
    }, []);
    return null;
};

test('checks for primary font duplication in fallback stack', async () => {
    const language = { id: 'en-US', name: 'English', pangram: 'Test' };

    const mockFontObject = {
        unitsPerEm: 1000,
        ascender: 800,
        descender: -200,
        charToGlyphIndex: (char) => 0, // All chars missing -> trigger fallback
        tables: { os2: { sTypoLineGap: 0 } },
        hhea: { lineGap: 0 }
    };

    const setup = (context) => {
        // 1. Load Primary Font
        context.loadFont(mockFontObject, 'blob:primary', 'MyFont.ttf', {});

        // 2. Add a system fallback with the SAME name as the primary font (simulating duplication)
        // System fonts don't have fontObject/fontUrl
        context.addFallbackFont({
            id: 'duplicate-1',
            name: 'MyFont.ttf', // Name matches primary file name? Or just verify if it appears
            type: 'fallback',
        });
    };

    render(
        <TypoProvider>
            <TestController setup={setup} />
            <LanguageCard language={language} />
        </TypoProvider>
    );

    // Wait for the UI to update with the new font
    // The span should be rendered. 
    // We expect the stack to contain "MyFont.ttf" because we added it as duplicate.
    const charSpan = await screen.findByText('T');

    const fontFamily = charSpan.style.fontFamily;
    console.log('Generated Stack: "' + fontFamily + '"');

    // Assertion: If the bug exists, the primary font name is present in the fallback stack.
    // If we fix it, it should NOT be present (assuming we filter it out).
    // For now, confirm it IS present to reproduce.
    if (fontFamily.includes('MyFont.ttf')) {
        console.log('✅ Reproduction Confirmed: Primary font found in fallback stack.');
    } else {
        console.log('❌ Reproduction Failed: Primary font NOT found in fallback stack.');
    }
});
