/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { waitFor, screen } from '@testing-library/react';
import { WasabyEvents } from 'UICore/Events';

import { renderGrid } from 'Controls-ListsUnit/Lists/GridHelpers';

import Demo from 'Controls-demo/treeGridReact/GetRowProps';

describe('Controls-ListsUnit/Lists/GetRowProps/TreeGrid', () => {
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

    it('should call getRowProps once for every item', () => {
        renderGrid(<Demo />, { container });

        expect(screen.getByText('getRowProps called 27 times')).toBeDefined();
    });
});
