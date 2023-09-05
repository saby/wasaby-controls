/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WasabyEvents } from 'UICore/Events';

import { renderGrid } from 'Controls-ListsUnit/Lists/GridHelpers';
import { STYLES_SELECTORS } from './SelectorsForTests';

import BorderDemo from 'Controls-demo/gridReact/Border';

describe('Controls-ListsUnit/Lists/Border/BorderStyle', () => {
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

    it('should add classes with default value', () => {
        const { getFirstItem } = renderGrid(<BorderDemo borderVisibility={'visible'} />, {
            container,
        });

        const item = getFirstItem();
        expect(item.matches(STYLES_SELECTORS.ROW.DEFAULT)).toBeTruthy();
    });

    it('should not add classes if border is hidden', () => {
        const { getFirstItem } = renderGrid(<BorderDemo borderVisibility={'hidden'} />, {
            container,
        });

        const item = getFirstItem();
        expect(item.matches(STYLES_SELECTORS.ROW.DEFAULT)).toBeFalsy();
    });

    it('should add classes with "default" value', () => {
        const { getFirstItem } = renderGrid(
            <BorderDemo borderVisibility={'visible'} borderStyle={'default'} />,
            { container }
        );

        const item = getFirstItem();
        expect(item.matches(STYLES_SELECTORS.ROW.DEFAULT)).toBeTruthy();
    });

    it('should add classes with "danger" value', () => {
        const { getFirstItem } = renderGrid(
            <BorderDemo borderVisibility={'visible'} borderStyle={'danger'} />,
            { container }
        );

        const item = getFirstItem();
        expect(item.matches(STYLES_SELECTORS.ROW.DANGER)).toBeTruthy();
    });

    it('should rerender if change borderStyle', async () => {
        const { getFirstItem } = renderGrid(
            <BorderDemo borderVisibility={'visible'} borderStyle={'default'} />,
            { container }
        );

        const buttonWithRightValue = screen.queryByText('danger');
        await userEvent.click(buttonWithRightValue);

        await waitFor(() => {
            // Должен измениться классы стилей
            const item = getFirstItem();
            expect(item.matches(STYLES_SELECTORS.ROW.DANGER)).toBeTruthy();
        });
    });
});
