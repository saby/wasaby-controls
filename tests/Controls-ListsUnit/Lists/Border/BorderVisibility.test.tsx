/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WasabyEvents } from 'UICore/Events';

import { renderGrid, getCell } from 'Controls-ListsUnit/Lists/GridHelpers';

import BorderDemo from 'Controls-demo/gridReact/Border';

describe('Controls-ListsUnit/Lists/Border/BorderVisibility', () => {
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

    it('should not add classes if default value', () => {
        const { getFirstItem } = renderGrid(<BorderDemo />, { container });

        const item = getFirstItem();
        const column = getCell(item, 1);
        expect(
            column.matches('.controls-ListView__itemContent_border_visible')
        ).toBeFalsy();
    });

    it('should not add classes if "hidden" value', () => {
        const { getFirstItem } = renderGrid(
            <BorderDemo borderVisibility={'hidden'} />,
            { container }
        );

        const item = getFirstItem();
        const column = getCell(item, 1);
        expect(
            column.matches('.controls-ListView__itemContent_border_visible')
        ).toBeFalsy();
    });

    it('should add classes if "onhover" value', () => {
        const { getFirstItem } = renderGrid(
            <BorderDemo borderVisibility={'onhover'} />,
            { container }
        );

        const item = getFirstItem();
        const column = getCell(item, 1);
        expect(
            column.matches('.controls-ListView__itemContent_border_onhover')
        ).toBeTruthy();
    });

    it('should add classes if "visible" value', () => {
        const { getFirstItem } = renderGrid(
            <BorderDemo borderVisibility={'visible'} />,
            { container }
        );

        const item = getFirstItem();
        const column = getCell(item, 1);
        expect(
            column.matches('.controls-ListView__itemContent_border_visible')
        ).toBeTruthy();
    });

    it('should add correct class for first cell', () => {
        const { getFirstItem } = renderGrid(
            <BorderDemo borderVisibility={'visible'} />,
            { container }
        );

        const item = getFirstItem();
        const column = getCell(item, 0);
        expect(
            column.matches(
                '.controls-ListView__itemContent_border_left_visible'
            )
        ).toBeTruthy();
    });

    it('should add correct class for last cell', () => {
        const { getFirstItem } = renderGrid(
            <BorderDemo borderVisibility={'visible'} />,
            { container }
        );

        const item = getFirstItem();
        const column = getCell(item, 2);
        expect(
            column.matches(
                '.controls-ListView__itemContent_border_right_visible'
            )
        ).toBeTruthy();
    });

    it('should rerender if change borderVisibility', async () => {
        const { getFirstItem } = renderGrid(
            <BorderDemo borderVisibility={'hidden'} />,
            { container }
        );

        const buttonWithRightValue = screen.queryByText('visible');
        await userEvent.click(buttonWithRightValue);

        await waitFor(() => {
            const item = getFirstItem();
            const column = getCell(item, 1);
            expect(
                column.matches('.controls-ListView__itemContent_border_visible')
            ).toBeTruthy();
        });
    });
});
