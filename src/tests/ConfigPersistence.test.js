
import { ConfigService } from '../services/ConfigService';

describe('ConfigService - New Feature Persistence', () => {
    it('should persist execution-time overrides including lineHeight normal and vertical metrics', () => {
        const mockState = {
            activeFontStyleId: 'primary',
            fontStyles: {
                primary: {
                    baseFontSize: 16,
                    lineHeight: 'normal', // Global auto
                    fonts: [
                        {
                            id: 'font-1',
                            type: 'primary',
                            name: 'Primary Font',
                            fontSizeAdjust: 0.9, // Size adjust
                            // Primary usually doesn't have these, but we added Auto button which might affect global or local? 
                            // The Auto button on Primary sets GLOBAL line height.
                        },
                        {
                            id: 'font-2',
                            type: 'fallback',
                            name: 'Fallback Font',
                            lineHeight: 'normal', // Fallback auto
                            ascentOverride: 0.8,
                            descentOverride: 0.2,
                            lineGapOverride: 0.1,
                            fontSizeAdjust: 1.1
                        }
                    ]
                }
            },
            colors: { primary: '#000' }
        };

        const serialized = ConfigService.serializeConfig(mockState);
        const normalized = ConfigService.normalizeConfig(serialized);

        // Verify Primary Style Global LH
        expect(normalized.fontStyles.primary.lineHeight).toBe('normal');

        // Verify Fallback Font Overrides
        const fallback = normalized.fontStyles.primary.fonts.find(f => f.type === 'fallback');
        expect(fallback.lineHeight).toBe('normal');
        expect(fallback.ascentOverride).toBe(0.8);
        expect(fallback.descentOverride).toBe(0.2);
        expect(fallback.lineGapOverride).toBe(0.1);
        expect(fallback.fontSizeAdjust).toBe(1.1);
    });
});
