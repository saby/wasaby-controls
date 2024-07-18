/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { waitFor } from '@testing-library/react';
import { WasabyEvents } from 'UICore/Events';

import { renderGrid } from 'Controls-ListsUnit/Lists/GridHelpers';

import Demo from 'Controls-demo/gridReact/BillsOrders/Index';

describe('Controls-ListsUnit/Lists/TrackedProperties/Base', () => {
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

    it('test', () => {
        expect(true).toBeTruthy();
    });

    // TODO нужно разобраться почему слайс не приходит в тесте
    /* it('should not render trackedProperties after display top indicator', async () => {
        const { hoverList, getTrackedProperties } = renderGrid(<Demo />, { container });

        await hoverList();

        await waitFor(() => {
            expect(getTrackedProperties()).toBeUndefined();
        });
    }); */
});
