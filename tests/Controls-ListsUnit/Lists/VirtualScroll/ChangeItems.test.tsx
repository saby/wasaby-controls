/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderList } from 'Controls-ListsUnit/Lists/ListHelpers';
import { WasabyEvents } from 'UICore/Events';

import AddItemInStart from 'Controls-demo/list_new/VirtualScroll/ConstantHeights/AddItemInStart';

describe('Controls-ListsUnit/Lists/VirtualScroll/ChangeItems', () => {
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

    describe('add items', () => {
        it('should not render extra items after add items to range if virtualPageSize is full', async () => {
            const { getItems } = renderList(<AddItemInStart />, { container });

            await userEvent.click(screen.getByText('Add item at 3'));

            await waitFor(() => {
                const items = getItems();
                expect(items.length).toBe(50);
            });
        });
    });
});
