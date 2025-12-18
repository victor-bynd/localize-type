import { render, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React, { useContext, useEffect } from 'react';
import { TypoProvider, TypoContext } from './TypoContext';

// Mock FontLoader services
vi.mock('../services/FontLoader', () => ({
    parseFontFile: vi.fn(),
    createFontUrl: vi.fn(),
}));

const TestConsumer = ({ onContext }) => {
    const context = useContext(TypoContext);
    useEffect(() => {
        onContext(context);
    }, [context, onContext]);
    return null;
};

describe('TypoContext Duplication Prevention', () => {
    it('prevents adding a system fallback font if it matches the primary font name', () => {
        let contextValues;
        render(
            <TypoProvider>
                <TestConsumer onContext={(ctx) => (contextValues = ctx)} />
            </TypoProvider>
        );

        // 1. Manually set a primary font (simulated load)
        const primaryFont = {
            id: 'primary',
            type: 'primary',
            name: 'Roboto', // Primary Font Name
            fileName: 'Roboto-Regular.ttf'
        };

        act(() => {
            contextValues.updateStyleState('primary', prev => ({
                ...prev,
                fonts: [primaryFont],
                activeFont: 'primary'
            }));
        });

        // 2. Try to add a system fallback with the SAME name
        const duplicateFallback = {
            id: 'fallback-rob',
            name: 'Roboto', // Same Name
            type: 'fallback'
            // No fontObject -> System font
        };

        act(() => {
            contextValues.addFallbackFont(duplicateFallback);
        });

        const fonts = contextValues.fontStyles.primary.fonts;
        // Should STILL be 1 (failed to add), but currently likely 2 (repro)
        // We expect this to FAIL initially if the bug exists.
        // For the purpose of "reproducing", we might assert it IS 2 now if we want to prove failure,
        // or assert it IS 1 and expect the test to fail.
        // Let's assert expected behavior (1) so the test fails.
        expect(fonts).toHaveLength(1);
    });

    it('prevents adding an uploaded fallback font if it matches the primary font filename', () => {
        let contextValues;
        render(
            <TypoProvider>
                <TestConsumer onContext={(ctx) => (contextValues = ctx)} />
            </TypoProvider>
        );

        // 1. Primary Font
        const primaryFont = {
            id: 'primary',
            type: 'primary',
            name: 'Inter',
            fileName: 'Inter-Regular.ttf',
            fontObject: { familyName: 'Inter' }
        };

        act(() => {
            contextValues.updateStyleState('primary', prev => ({
                ...prev,
                fonts: [primaryFont],
                activeFont: 'primary'
            }));
        });

        // 2. Try to add duplicate uploaded font
        const duplicateUpload = {
            id: 'fallback-inter',
            name: 'Inter',
            fileName: 'Inter-Regular.ttf', // Same filename
            type: 'fallback',
            fontObject: { familyName: 'Inter' }
        };

        act(() => {
            contextValues.addFallbackFont(duplicateUpload);
        });

        const fonts = contextValues.fontStyles.primary.fonts;
        expect(fonts).toHaveLength(1);
    });
});
