/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { waitFor } from '@testing-library/react';
import { WasabyEvents } from 'UICore/Events';

import { renderGrid, getCell } from 'Controls-ListsUnit/Lists/GridHelpers';

import TextOverflow from 'Controls-demo/gridReact/TextOverflow';

describe('Controls-ListsUnit/Lists/TextOverflow/Base', () => {
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

    it('be default should add class for word wrap', () => {
        const { getFirstItem } = renderGrid(<TextOverflow />, { container });

        const item = getFirstItem();
        const column = getCell(item, 0);
        expect(column.matches('.tw-break-words')).toBeTruthy();
    });

    it('should add class for word wrap if pass textOverflow=none', () => {
        const { getFirstItem } = renderGrid(<TextOverflow />, { container });

        const item = getFirstItem();
        const column = getCell(item, 1);
        expect(column.matches('.tw-break-words')).toBeTruthy();
    });

    it('should add class for ellipsis text if pass textOverflow=ellipsis', () => {
        const { getLastItem } = renderGrid(<TextOverflow />, { container });

        const item = getLastItem();
        const column = getCell(item, 1);
        expect(column.matches('.tw-truncate')).toBeTruthy();
    });
});
