/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { waitFor } from '@testing-library/react';
import { WasabyEvents } from 'UICore/Events';

import { renderGrid, getCell } from 'Controls-ListsUnit/Lists/GridHelpers';

import TooltipDemo from 'Controls-demo/gridReact/Tooltip';

describe('Controls-ListsUnit/Lists/Tooltip/Base', () => {
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

    it('should display title on cell', () => {
        const { getFirstItem } = renderGrid(<TooltipDemo />, { container });

        const item = getFirstItem();
        const column = getCell(item, 1);
        const title = column.getAttribute('title');
        expect(title).toBe('Россия');
    });
});
