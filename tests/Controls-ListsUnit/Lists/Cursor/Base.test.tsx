/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { waitFor } from '@testing-library/react';
import { WasabyEvents } from 'UICore/Events';

import { renderGrid } from 'Controls-ListsUnit/Lists/GridHelpers';

import CursorDemo from 'Controls-demo/gridReact/Cursor';

describe('Controls-ListsUnit/Lists/Cursor/Base', () => {
    let container = null;

    beforeEach(() => {
        container = document.createElement('div');
        WasabyEvents.initInstance(container);
        document.body.appendChild(container);
    });

    afterEach(() => {
        unmountComponentAtNode(container);
        WasabyEvents.destroyInstance(container);
        container.remove();
        container = null;
    });

    it('should apply cursor on row and cell', () => {
        const { getItems } = renderGrid(<CursorDemo />, { container });

        const items = getItems();
        const cursorPointer = items[0].querySelectorAll('.tw-cursor-pointer');
        const cursorText = items[0].querySelectorAll('.tw-cursor-text');
        expect(cursorPointer.length).toBe(1);
        expect(cursorText.length).toBe(2);
    });
});
