/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { waitFor } from '@testing-library/react';
import { WasabyEvents } from 'UICore/Events';

import { renderGrid, getCell } from 'Controls-ListsUnit/Lists/GridHelpers';

import UseItemState from 'Controls-demo/gridReact/UseItemState';

describe('Controls-ListsUnit/Lists/Hooks/UseItemState', () => {
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

    it('should rewrite cell content if marker changed', async () => {
        const { getFirstItem, clickItem } = renderGrid(<UseItemState />, {
            container,
        });

        await clickItem(0);

        await waitFor(() => {
            const changedColumn = getCell(getFirstItem(), 1);
            const isBoldLargeText = changedColumn.querySelector(
                '.controls-fontsize-l.controls-fontweight-bold'
            );
            expect(isBoldLargeText).toBeTruthy();
        });
    });
});
