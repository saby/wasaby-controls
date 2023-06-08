/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WasabyEvents } from 'UICore/Events';

import { renderTree } from 'Controls-ListsUnit/Lists/TreeHelpers';
import { getCell } from 'Controls-ListsUnit/Lists/GridHelpers';

import ExpanderPosition from 'Controls-demo/treeGridReact/Expander/ExpanderPosition';

describe('Controls-ListsUnit/Lists/Expander/ExpanderPosition', () => {
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

    it('expander is displayed left if expanderPosition=default', () => {
        const { getFirstItem } = renderTree(
            <ExpanderPosition expanderPosition={'default'} />,
            { container }
        );
        const firstColumn = getCell(getFirstItem(), 0);
        expect(firstColumn).toMatchSnapshot();
    });

    it('expander is displayed right if expanderPosition=right', () => {
        const { getFirstItem } = renderTree(
            <ExpanderPosition expanderPosition={'right'} />,
            { container }
        );
        const firstColumn = getCell(getFirstItem(), 0);
        expect(firstColumn).toMatchSnapshot();
    });

    it('should rerender if change expanderPosition', async () => {
        const { getFirstItem } = renderTree(
            <ExpanderPosition expanderPosition={'default'} />,
            { container }
        );

        const buttonWithRightValue = screen.queryByText('right');
        await userEvent.click(buttonWithRightValue);

        await waitFor(() => {
            const firstColumn = getCell(getFirstItem(), 0);
            // Экспандер должен быть справа
            expect(firstColumn).toMatchSnapshot();
        });
    });
});
