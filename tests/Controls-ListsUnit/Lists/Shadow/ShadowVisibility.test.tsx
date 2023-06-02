/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WasabyEvents } from 'UICore/Events';

import { renderGrid, getCell } from 'Controls-ListsUnit/Lists/GridHelpers';

import ShadowDemo from 'Controls-demo/gridReact/Shadow';

describe('Controls-ListsUnit/Lists/Shadow/ShadowVisibility', () => {
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
        const { getFirstItem } = renderGrid(<ShadowDemo />, { container });

        const item = getFirstItem();
        const column = getCell(item, 0);
        expect(
            column.matches('.controls-ListView__item_shadow_visible')
        ).toBeFalsy();
        expect(
            column.matches('.controls-ListView__item_shadow_onhover')
        ).toBeFalsy();
    });

    it('should not add classes if "hidden" value', () => {
        const { getFirstItem } = renderGrid(
            <ShadowDemo shadowVisibility={'hidden'} />,
            { container }
        );

        const item = getFirstItem();
        const column = getCell(item, 0);
        expect(
            column.matches('.controls-ListView__item_shadow_visible')
        ).toBeFalsy();
        expect(
            column.matches('.controls-ListView__item_shadow_onhover')
        ).toBeFalsy();
    });

    it('should add classes if "onhover" value', () => {
        const { getFirstItem } = renderGrid(
            <ShadowDemo shadowVisibility={'onhover'} />,
            { container }
        );

        const item = getFirstItem();
        const column = getCell(item, 0);
        expect(
            column.matches('.controls-ListView__item_shadow_onhover')
        ).toBeTruthy();
    });

    it('should add classes if "visible" value', () => {
        const { getFirstItem } = renderGrid(
            <ShadowDemo shadowVisibility={'visible'} />,
            { container }
        );

        const item = getFirstItem();
        const column = getCell(item, 0);
        expect(
            column.matches('.controls-ListView__item_shadow_visible')
        ).toBeTruthy();
    });

    it('should rerender if change shadowVisibility', async () => {
        const { getFirstItem } = renderGrid(
            <ShadowDemo shadowVisibility={'hidden'} />,
            { container }
        );

        const buttonWithVisibleValue = screen.queryByText('visible');
        await userEvent.click(buttonWithVisibleValue);

        await waitFor(() => {
            const item = getFirstItem();
            const column = getCell(item, 0);
            expect(
                column.matches('.controls-ListView__item_shadow_visible')
            ).toBeTruthy();
        });
    });
});
