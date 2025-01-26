/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { WasabyEvents } from 'UICore/Events';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderGrid } from 'Controls-ListsUnit/Lists/GridHelpers';

import Demo from 'Controls-demo/gridReact/ChangeItems';

describe('Controls-ListsUnit/Lists/ItemsChanges/Base', () => {
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

    it('should redraw all items if records was recreated', async () => {
        const { getItems } = renderGrid(<Demo />, { container });

        await userEvent.click(screen.getByTestId('update-items'));

        await waitFor(() => {
            const items = getItems();
            expect(items[0].textContent).toBe('Россия(changed)Москва');
            expect(items[1].textContent).toBe('Канада(changed)Оттава');
            expect(items[2].textContent).toBe('Соединенные Штаты Америки(changed)Вашингтон');
        });
    });
});
