/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WasabyEvents } from 'UICore/Events';

import { renderGrid, getCell } from 'Controls-ListsUnit/Lists/GridHelpers';

import TagDemo from 'Controls-demo/gridReact/TagStyle';

describe('Controls-ListsUnit/Lists/Tag/TagStyle', () => {
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

    it('should not add svg tag template when property has null value', () => {
        const { getFirstItem } = renderGrid(<TagDemo />, { container });

        const item = getFirstItem();
        const column = getCell(item, 2);
        expect(column.querySelector('.js-controls-tag')).toBeFalsy();
    });

    it('should add svg tag template when property has text value', () => {
        const { getItems } = renderGrid(<TagDemo />, { container });

        const item = getItems()[1];
        const column = getCell(item, 2);
        expect(column.querySelector('.js-controls-tag')).toBeTruthy();
    });

    it('should fire tag hover event', async () => {
        const { getItems } = renderGrid(<TagDemo />, { container });

        const item = getItems()[1];
        const column = getCell(item, 2);
        const tag = column.querySelector('.js-controls-tag');
        await userEvent.hover(tag);
        await waitFor(() => {
            // TODO вернуть после разбора https://dev.sbis.ru/opendoc.html?guid=4fc0e8e6-2a66-4fa9-9e0b-0d55bbb0e598&client=3
            // expect(container.querySelector('[data-qa="logger-event"]').innerHTML).toBe('hover');
            // expect(container.querySelector('[data-qa="logger-column"]').innerHTML).toBe('2');
        });
    });

    it('should fire tag click event', async () => {
        const { getItems } = renderGrid(<TagDemo />, { container });

        const item = getItems()[1];
        const column = getCell(item, 2);
        const tag = column.querySelector('.js-controls-tag');
        await userEvent.click(tag);
        await waitFor(() => {
            expect(container.querySelector('[data-qa="logger-event"]').innerHTML).toBe('click');
            expect(container.querySelector('[data-qa="logger-column"]').innerHTML).toBe('2');
        });
    });
});
