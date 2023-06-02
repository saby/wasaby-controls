/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WasabyEvents } from 'UICore/Events';
import {
    isSpaceItem,
    checkSpaceItemsBetweenItems,
} from 'Controls-ListsUnit/Lists/ItemsSpacing/Helpers';
import { renderTree } from 'Controls-ListsUnit/Lists/TreeHelpers';

import TreeDemo from 'Controls-demo/ListTests/ItemsSpacing/Tree';

describe('Controls-ListsUnit/Lists/ItemsSpacing/Tree', () => {
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

    it('spacing items count are correct', () => {
        const { getSpaceItems } = renderTree(<TreeDemo />, { container });
        const spaceItems = getSpaceItems();
        expect(spaceItems.length).toBe(4);
    });

    it('spacing items are displayed between data items', () => {
        const { getItems } = renderTree(<TreeDemo />, { container });
        checkSpaceItemsBetweenItems(getItems());
    });

    it('spacing items are displayed inside expanded node', async () => {
        const { getItems, toggleNode, getSpaceItems } = renderTree(
            <TreeDemo />,
            { container }
        );

        await toggleNode(1);

        await waitFor(() => {
            const spaceItems = getSpaceItems();
            expect(spaceItems.length).toBe(12);
            checkSpaceItemsBetweenItems(getItems());
        });
    });

    it('unnecessary spacing items are not displayed after collapse node', async () => {
        const { getItems, toggleNode, getSpaceItems } = renderTree(
            <TreeDemo />,
            { container }
        );

        await toggleNode(1);
        await waitFor(() => {
            return expect(getSpaceItems().length).toBe(12);
        });
        await toggleNode(1);

        await waitFor(() => {
            const spaceItems = getSpaceItems();
            expect(spaceItems.length).toBe(4);
            checkSpaceItemsBetweenItems(getItems());
        });
    });

    it('spacing item are not displayed in end of list after expand last node', async () => {
        const { toggleNode, getLastItem } = renderTree(<TreeDemo />, {
            container,
        });

        await toggleNode(5);

        await waitFor(() => {
            const lastItem = getLastItem();
            expect(isSpaceItem(lastItem)).toBeFalsy();
        });
    });

    it('should not display unnecessary space items after remove node in start of list', async () => {
        const { getSpaceItems } = renderTree(<TreeDemo />, { container });

        await userEvent.click(screen.getByText('Remove node=Apple'));

        await waitFor(() => {
            expect(getSpaceItems().length).toBe(3);
        });
    });

    it('should not display unnecessary space items after remove expanded node in start of list', async () => {
        const { toggleNode, getSpaceItems } = renderTree(<TreeDemo />, {
            container,
        });

        await toggleNode(1);
        // Если не дождаться, что узел свернулся и не проверить это, то тест работает неправильно
        await waitFor(() => {
            expect(getSpaceItems().length).toBe(12);
        });

        await userEvent.click(screen.getByText('Remove node=Apple'));

        await waitFor(() => {
            expect(getSpaceItems().length).toBe(3);
        });
    });

    it('should not display unnecessary space items after remove node in end of list', async () => {
        const { getSpaceItems } = renderTree(<TreeDemo />, { container });

        await userEvent.click(screen.getByText('Remove node=Acer'));

        await waitFor(() => {
            const spaceItems = getSpaceItems();
            expect(spaceItems.length).toBe(3);
        });
    });

    it('should not display unnecessary space items after remove expanded node in end of list', async () => {
        const { toggleNode, getSpaceItems } = renderTree(<TreeDemo />, {
            container,
        });

        await toggleNode(5);
        // Если не дождаться, что узел свернулся и не проверить это, то тест работает неправильно
        await waitFor(() => {
            expect(getSpaceItems().length).toBe(5);
        });

        await userEvent.click(screen.getByText('Remove node=Acer'));

        await waitFor(() => {
            expect(getSpaceItems().length).toBe(3);
        });
    });
});
