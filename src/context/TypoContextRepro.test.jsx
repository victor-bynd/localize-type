import { render, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React, { useContext, useEffect } from 'react';
import { TypoProvider, TypoContext } from './TypoContext';

// Mock FontLoader services
vi.mock('../services/FontLoader', () => ({
    parseFontFile: vi.fn(),
    createFontUrl: vi.fn(),
}));

// Helper component
const TestConsumer = ({ onContext }) => {
    const context = useContext(TypoContext);
    useEffect(() => {
        onContext(context);
    }, [context, onContext]);
    return null;
};

describe('TypoContext Repro', () => {
    it('toggles primary font line height auto correctly', () => {
        let contextValues;
        render(
            <TypoProvider>
                <TestConsumer onContext={(ctx) => (contextValues = ctx)} />
            </TypoProvider>
        );

        // 1. Initial State
        // Default lineHeight is 1.2
        expect(contextValues.fontStyles.primary.lineHeight).toBe(1.2);

        // 2. Set Manual Line Height to 1.5
        act(() => {
            contextValues.setLineHeight(1.5);
        });
        expect(contextValues.fontStyles.primary.lineHeight).toBe(1.5);

        // 3. Toggle Auto ON
        act(() => {
            contextValues.toggleGlobalLineHeightAuto();
        });
        expect(contextValues.fontStyles.primary.lineHeight).toBe('normal');
        // Check if previousValue was saved
        expect(contextValues.fontStyles.primary.previousLineHeight).toBe(1.5);

        // 4. Toggle Auto OFF
        act(() => {
            contextValues.toggleGlobalLineHeightAuto();
        });

        // It should restore 1.5
        expect(contextValues.fontStyles.primary.lineHeight).toBe(1.5);
    });
});
