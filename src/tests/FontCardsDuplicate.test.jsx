
import { render, screen } from '@testing-library/react';
import FontCards from '../components/FontCards';
import { useTypo } from '../context/useTypo';
import { vi, describe, beforeEach, test, expect } from 'vitest';
import '@testing-library/jest-dom';

vi.mock('../context/useTypo');

describe('FontCards Duplication Logic', () => {
    const mockSetHighlitLanguageId = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        global.ResizeObserver = class {
            observe() { }
            unobserve() { }
            disconnect() { }
        };
    });

    test('should not show primary font in fallback list if it exists as a fallback with same name', () => {
        const mockFonts = [
            {
                id: 'primary-1',
                type: 'primary',
                name: 'Roboto',
                fileName: 'Roboto-Regular.ttf',
                fontObject: { numGlyphs: 100 }
            },
            {
                id: 'fallback-1',
                type: 'fallback',
                name: 'Roboto',
                fileName: 'Roboto-Regular.ttf',
                fontObject: { numGlyphs: 100 }
            },
            {
                id: 'fallback-2',
                type: 'fallback',
                name: 'Open Sans',
                fileName: 'OpenSans.ttf',
                fontObject: { numGlyphs: 200 }
            }
        ];

        useTypo.mockReturnValue({
            fonts: mockFonts,
            activeFont: null,
            fontScales: { fallback: 100 },
            getFontColor: () => '#000',
            getEffectiveFontSettings: () => ({}),
            fallbackFontOverrides: {},
            primaryFontOverrides: {},
            primaryLanguages: [],
            fallbackFont: 'sans-serif',
            missingColor: '#ff0000',
            systemFallbackOverrides: {},
            normalizeFontName: (name) => name
        });

        render(
            <FontCards
                activeTab="ALL"
                selectedGroup="ALL"
                setHighlitLanguageId={mockSetHighlitLanguageId}
            />
        );

        // Expect Primary Font Rendering
        expect(screen.getByText('Primary Font')).toBeInTheDocument();

        // Count occurrences of "Roboto-Regular"
        // One in Primary Section, One potentially in General Fallback
        const robotoElements = screen.getAllByText(/^Roboto-Regular$/);

        // Assert: Should be exactly 1
        expect(robotoElements.length).toBe(1);
    });
});
