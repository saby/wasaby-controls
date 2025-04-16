/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { waitFor } from '@testing-library/react';
import { WasabyEvents } from 'UICore/Events';

import { renderGrid, getCell } from 'Controls-ListsUnit/Lists/GridHelpers';

import TextOverflow from 'Controls-demo/gridReact/TextOverflow';

function isEllipsedText(element: HTMLElement): boolean {
    return !!element.querySelector('.tw-truncate');
}

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

    it('be default should not ellipse text', () => {
        const { getFirstItem } = renderGrid(<TextOverflow />, { container });

        const item = getFirstItem();
        const column = getCell(item, 0);
        expect(isEllipsedText(column)).toBeFalsy();
    });

    it('should not ellipse text if pass textOverflow=none', () => {
        const { getFirstItem } = renderGrid(<TextOverflow />, { container });

        const item = getFirstItem();
        const column = getCell(item, 1);
        expect(isEllipsedText(column)).toBeFalsy();
    });

    it('should ellipse text if pass textOverflow=ellipsis', () => {
        const { getLastItem } = renderGrid(<TextOverflow />, { container });

        const item = getLastItem();
        const column = getCell(item, 1);
        expect(isEllipsedText(column)).toBeTruthy();
    });
});
