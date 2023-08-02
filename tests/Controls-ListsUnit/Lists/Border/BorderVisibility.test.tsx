/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WasabyEvents } from 'UICore/Events';

import { renderGrid, getCell } from 'Controls-ListsUnit/Lists/GridHelpers';
import { VISIBILITY_SELECTORS } from './SelectorsForTests';

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
        expect(item.matches(VISIBILITY_SELECTORS.ROW.VISIBLE)).toBeFalsy();

        expect(item.matches(VISIBILITY_SELECTORS.ROW.ONHOVER)).toBeFalsy();
    });

    it('should not add classes if "hidden" value', () => {
        const { getFirstItem } = renderGrid(<BorderDemo borderVisibility={'hidden'} />, {
            container,
        });

        const item = getFirstItem();
        expect(item.matches(VISIBILITY_SELECTORS.ROW.VISIBLE)).toBeFalsy();

        expect(item.matches(VISIBILITY_SELECTORS.ROW.ONHOVER)).toBeFalsy();
    });

    it('should add classes if "onhover" value', () => {
        const { getFirstItem } = renderGrid(<BorderDemo borderVisibility={'onhover'} />, {
            container,
        });

        const item = getFirstItem();
        expect(item.matches(VISIBILITY_SELECTORS.ROW.ONHOVER)).toBeTruthy();
    });

    it('should add classes if "visible" value', () => {
        const { getFirstItem } = renderGrid(<BorderDemo borderVisibility={'visible'} />, {
            container,
        });

        const item = getFirstItem();
        expect(item.matches(VISIBILITY_SELECTORS.ROW.VISIBLE)).toBeTruthy();
    });

    it('should rerender if change borderVisibility', async () => {
        const { getFirstItem } = renderGrid(<BorderDemo borderVisibility={'hidden'} />, {
            container,
        });

        const buttonWithRightValue = screen.queryByText('visible');
        await userEvent.click(buttonWithRightValue);

        await waitFor(() => {
            const item = getFirstItem();
            expect(item.matches(VISIBILITY_SELECTORS.ROW.VISIBLE)).toBeTruthy();
        });
    });
});
