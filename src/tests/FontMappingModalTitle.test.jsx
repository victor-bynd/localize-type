import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import React from 'react';

import FontCards from '../components/FontCards';
import { useTypo } from '../context/useTypo';

// Mock dependencies
vi.mock('../context/useTypo');
vi.mock('../services/FontLoader', () => ({
    parseFontFile: vi.fn(),
    createFontUrl: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
};


// Mock LanguageSingleSelectModal to checking props
vi.mock('../components/LanguageSingleSelectModal', () => ({
    default: ({ title }) => <div data-testid="mock-modal">{title}</div>
}));

describe('FontCards Mapping Modal', () => {
    it('displays font name in modal title when mapping', () => {
        const mockFont = {
            id: 'font-1',
            type: 'fallback',
            name: 'Test Font 123',
            fileName: 'TestFont.ttf',
            fontObject: { numGlyphs: 100 },
            hidden: false
        };

        const mockUseTypo = {
            fonts: [mockFont],
            activeFont: null,
            fontScales: { fallback: 100 },
            lineHeight: 1.5,
            getFontColor: () => '#000000',
            getEffectiveFontSettings: () => ({}),
            fallbackFontOverrides: {},
            primaryFontOverrides: {},
            unmappedFonts: [mockFont],  // FontCards uses unmappedFonts from useMemo logic internal to it, but we mock the hook return
            // We need to mock what useTypo returns, but FontCards calculates unmappedFonts internally based on fonts
            // So we just need 'fonts' to be populated and correct filters to pass.
            // Wait, FontCards calls useTypo().
            // Let's re-verify what useTypo returns in FontCards.jsx
        };

        // FontCards actually computes 'unmappedFonts' from 'fonts'. 
        // We need to make sure the mocked 'fonts' state allows our font to appear in the 'unmapped' section.
        // It needs: type='fallback', fontObject=truthy, isClone=false/undefined.

        useTypo.mockReturnValue({
            ...mockUseTypo,
            // Add other necessary functions to avoid crashes
            updateFontColor: vi.fn(),
            updateFallbackFontOverride: vi.fn(),
            resetFallbackFontOverrides: vi.fn(),
            setActiveFont: vi.fn(),
            updateFontWeight: vi.fn(),
            toggleFontVisibility: vi.fn(),
            addLanguageSpecificFont: vi.fn(), // used for onMap in some cases?
            setHighlitLanguageId: vi.fn(),
            addFallbackFonts: vi.fn(),
            addStrictlyMappedFonts: vi.fn(),
            unmapFont: vi.fn(),
            weight: 400,
            setIsFallbackLinked: vi.fn(),
            setLineHeight: vi.fn(),
            setActiveConfigTab: vi.fn(),
            setFallbackFont: vi.fn(),
            updateSystemFallbackOverride: vi.fn(),
            resetSystemFallbackOverride: vi.fn(),
            setMissingColor: vi.fn(),
            normalizeFontName: (name) => name.toLowerCase(),
            primaryLanguages: [],
            setFallbackFontOverride: vi.fn()
        });

        render(<FontCards activeTab="ALL" activeGroup="ALL" />);

        // Find the "MAP" button for the font.
        // The Map button text is "MAP".
        // Note: In FontCards.jsx, the button text is just "MAP" for 'ALL' tab.
        const mapButtons = screen.getAllByText('MAP');
        fireEvent.click(mapButtons[0]);

        // Expect modal to appear with correct title
        // Default impl was "Map Font to Language"
        // We want "Map Test Font 123 to Language" or similar.
        const modal = screen.getByTestId('mock-modal');
        expect(modal.textContent).toContain('Test Font 123');
    });
});
