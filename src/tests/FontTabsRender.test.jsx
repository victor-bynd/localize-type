import { render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import React from 'react';
import { TypoProvider } from '../context/TypoContext';
import FontTabs from '../components/FontTabs';
import { DndContext } from '@dnd-kit/core';

// Mock FontLoader services
vi.mock('../services/FontLoader', () => ({
    parseFontFile: vi.fn(),
    createFontUrl: vi.fn(),
}));

describe('FontTabs Component', () => {
    it('renders without crashing', () => {
        render(
            <TypoProvider>
                <DndContext>
                    <FontTabs />
                </DndContext>
            </TypoProvider>
        );
    });
});
