import { describe, it, expect } from 'vitest';
import { ConfigService } from '../services/ConfigService';

describe('ConfigService Advanced Overrides', () => {
    it('should preserve advanced font metric overrides in export/import', () => {
        const mockState = {
            activeFontStyleId: 'primary',
            fontStyles: {
                primary: {
                    fonts: [
                        {
                            id: 'font1',
                            type: 'primary',
                            fontObject: null, // Should be stripped
                            fontUrl: 'blob:url', // Should be stripped
                            name: 'Test Font',

                            // Advanced Overrides
                            sizeAdjust: '90%',
                            ascentOverride: '100%',
                            descentOverride: '20%',
                            lineGapOverride: '10%'
                        },
                        {
                            id: 'font2',
                            type: 'fallback',
                            name: 'Fallback Font',
                            // Some set, some not
                            ascentOverride: '95%'
                        }
                    ],
                    fallbackFontOverrides: {}
                }
            },
            // Minimal required other state
            headerStyles: {},
            headerOverrides: {},
            textOverrides: {},
            visibleLanguageIds: [],
            colors: {},
            headerFontStyleMap: {},
            textCase: 'none',
            viewMode: 'h1',
            gridColumns: 1
        };

        // 1. Serialize (Export)
        const exported = ConfigService.serializeConfig(mockState);
        const font1 = exported.data.fontStyles.primary.fonts[0];
        const font2 = exported.data.fontStyles.primary.fonts[1];

        // Check Font 1 properties
        expect(font1.sizeAdjust).toBe('90%');
        expect(font1.ascentOverride).toBe('100%');
        expect(font1.descentOverride).toBe('20%');
        expect(font1.lineGapOverride).toBe('10%');

        // Verify we didn't keep non-serializable stuff
        expect(font1.fontObject).toBeUndefined();
        expect(font1.fontUrl).toBeUndefined();

        // Check Font 2 properties
        expect(font2.ascentOverride).toBe('95%');
        expect(font2.descentOverride).toBeUndefined(); // shouldn't exist if not set

        // 2. Normalize (Import)
        const imported = ConfigService.normalizeConfig(exported);

        // Verify structure remains correct after import
        const importedFont1 = imported.fontStyles.primary.fonts[0];
        expect(importedFont1.sizeAdjust).toBe('90%');
        expect(importedFont1.lineGapOverride).toBe('10%');
    });

    it('should handle numeric values if they are stored as numbers (sanity check)', () => {
        // Sometimes users might store '90' instead of '90%' if the UI handles the string conversion
        // We want to ensure ConfigService doesn't care about type.
        const mockState = {
            fontStyles: {
                primary: {
                    fonts: [{
                        id: 'f1',
                        sizeAdjust: 0.9,
                        ascentOverride: 1.0
                    }]
                }
            }
        };

        const exported = ConfigService.serializeConfig(mockState);
        expect(exported.data.fontStyles.primary.fonts[0].sizeAdjust).toBe(0.9);
    });
});
