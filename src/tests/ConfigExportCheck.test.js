
import { ConfigService } from '../services/ConfigService';

describe('ConfigService Font Card Persistence', () => {
    it('should persist all font card configurations including advanced metrics and overrides', () => {
        const mockState = {
            activeFontStyleId: 'primary',
            fontStyles: {
                primary: {
                    baseFontSize: 16,
                    fontScales: { active: 100, fallback: 100 },
                    lineHeight: 1.5,
                    letterSpacing: 0.05,
                    weight: 400,
                    fonts: [
                        {
                            id: 'font-1',
                            type: 'primary',
                            name: 'Primary Font',
                            fileName: 'primary.ttf',
                            fontObject: { some: 'object' }, // Should be removed
                            fontUrl: 'blob:url', // Should be removed
                            // Configurations
                            sizeAdjust: 90, // Check if this persists
                            lineGapOverride: 0.1,
                            ascentOverride: 0.9,
                            descentOverride: 0.3,
                            color: '#123456',
                            hidden: false
                        },
                        {
                            id: 'font-2',
                            type: 'fallback',
                            name: 'Fallback Font',
                            fileName: 'fallback.ttf',
                            fontObject: { some: 'object' },
                            fontUrl: 'blob:url',
                            // Configurations
                            scale: 110, // JS scale
                            lineHeight: 1.4,
                            letterSpacing: 0.1,
                            weightOverride: 700,
                            sizeAdjust: 85,
                            lineGapOverride: 0.2,
                            ascentOverride: 0.8,
                            descentOverride: 0.4,
                            color: '#654321',
                            hidden: true
                        }
                    ]
                }
            },
            // Other necessary root keys
            headerStyles: {},
            headerOverrides: {},
            textOverrides: {},
            visibleLanguageIds: [],
            colors: {},
            headerFontStyleMap: {},
            textCase: 'none',
            viewMode: 'h1',
            gridColumns: 1,
            showFallbackColors: true,
            showAlignmentGuides: false,
            showBrowserGuides: false,
            DEFAULT_PALETTE: ['#000000']
        };

        const serialized = ConfigService.serializeConfig(mockState);
        const data = serialized.data;
        const restoredStyle = data.fontStyles.primary;

        // Verify Primary Font
        const f1 = restoredStyle.fonts.find(f => f.id === 'font-1');
        expect(f1.fontObject).toBeUndefined();
        expect(f1.fontUrl).toBeUndefined();
        expect(f1.sizeAdjust).toBe(90);
        expect(f1.lineGapOverride).toBe(0.1);
        expect(f1.ascentOverride).toBe(0.9);
        expect(f1.descentOverride).toBe(0.3);
        expect(f1.color).toBe('#123456');
        expect(f1.hidden).toBe(false);

        // Verify Fallback Font
        const f2 = restoredStyle.fonts.find(f => f.id === 'font-2');
        expect(f2.fontObject).toBeUndefined();
        expect(f2.fontUrl).toBeUndefined();
        expect(f2.scale).toBe(110);
        expect(f2.lineHeight).toBe(1.4);
        expect(f2.letterSpacing).toBe(0.1);
        expect(f2.weightOverride).toBe(700);
        expect(f2.sizeAdjust).toBe(85);
        expect(f2.lineGapOverride).toBe(0.2);
        expect(f2.ascentOverride).toBe(0.8);
        expect(f2.descentOverride).toBe(0.4);
        expect(f2.color).toBe('#654321');
        expect(f2.hidden).toBe(true);
    });
});
