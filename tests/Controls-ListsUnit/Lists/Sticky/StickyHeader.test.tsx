/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WasabyEvents } from 'UICore/Events';

import { renderGrid, isSticked, getCells } from 'Controls-ListsUnit/Lists/GridHelpers';

import Demo from 'Controls-demo/gridReact/StickyHeader';

describe('Controls-ListsUnit/Lists/Sticky/StickyHeader', () => {
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

    it('header is sticked', () => {
        const { getHeader } = renderGrid(<Demo />, { container });
        const header = getHeader();
        const cells = getCells(header);
        cells.map((cell) => {
            expect(isSticked(cell)).toBeTruthy();
        });
    });
});
