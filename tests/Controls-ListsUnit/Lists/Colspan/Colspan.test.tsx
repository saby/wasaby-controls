/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { WasabyEvents } from 'UICore/Events';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderGrid } from 'Controls-ListsUnit/Lists/GridHelpers';

import ColspanDemo from 'Controls-demo/gridReact/Colspan';
import { getCells } from '../GridHelpers';

describe('Controls-ListsUnit/Lists/Colspan/Colspan', () => {
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

    it('should colspan rows', () => {
        const { getItems } = renderGrid(<ColspanDemo />, { container });

        const items = getItems();
        // Проверяем кол-во ячеек в каждой строке
        expect(getCells(items[0]).length).toBe(1);
        expect(getCells(items[1]).length).toBe(2);
        expect(getCells(items[2]).length).toBe(2);

        // Проверяем порядок ячеек в каждой строке
        expect(items[0].textContent).toBe('1');
        expect(items[1].textContent).toBe('2Оттава');
        expect(items[2].textContent).toBe('3Соединенные Штаты Америки');
    });

    it('should recount colspan after change item', async () => {
        const { getLastItem } = renderGrid(<ColspanDemo />, { container });

        await userEvent.click(screen.getByTestId('change-last-item'));

        await waitFor(() => {
            const item = getLastItem();
            // Проверяем кол-во ячеек
            expect(getCells(item).length).toBe(3);
            // Проверяем порядок ячеек
            expect(item.textContent).toBe('3Соединенные Штаты Америки (без колспана)Вашингтон');
        });
    });
});
