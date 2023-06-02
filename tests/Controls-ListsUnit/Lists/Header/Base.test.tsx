/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { waitFor } from '@testing-library/react';
import { WasabyEvents } from 'UICore/Events';

import { renderGrid } from 'Controls-ListsUnit/Lists/GridHelpers';

import UseItemState from 'Controls-demo/gridReact/Header';

describe('Controls-ListsUnit/Lists/Header/Base', () => {
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

    it('should render header', () => {
        const { getHeader } = renderGrid(<UseItemState />, { container });

        const header = getHeader();
        expect(header).toBeDefined();
    });
});
