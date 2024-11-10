/**
 * @jest-environment jsdom
 */
import { unmountComponentAtNode } from 'react-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderList } from 'Controls-ListsUnit/Lists/ListHelpers';
import {
    isSpaceItem,
    checkSpaceItemsBetweenItems,
} from 'Controls-ListsUnit/Lists/ItemsSpacing/Helpers';
import { WasabyEvents } from 'UICore/Events';

import ListDemo from 'Controls-demo/ListTests/ItemsSpacing/List';
import ListWithGroupingDemo from 'Controls-demo/ListTests/ItemsSpacing/ListWithGrouping';

describe('Controls-ListsUnit/Lists/ItemsSpacing/List', () => {
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

    describe('base checks', () => {
        it('spacing items are displayed', () => {
            const { getSpaceItems } = renderList(<ListDemo />, { container });
            const items = getSpaceItems();
            expect(items.length).toBe(4);
        });

        it('spacing items are not displayed in backward edge', () => {
            const { getFirstItem } = renderList(<ListDemo />, { container });
            const firstItem = getFirstItem();
            expect(isSpaceItem(firstItem)).toBeFalsy();
        });

        it('spacing items are not displayed in forward edge', () => {
            const { getLastItem } = renderList(<ListDemo />, { container });
            const lastItem = getLastItem();
            expect(isSpaceItem(lastItem)).toBeFalsy();
        });

        it('spacing items are displayed between data items', () => {
            const { getItems } = renderList(<ListDemo />, { container });
            checkSpaceItemsBetweenItems(getItems());
        });
    });

    describe('with grouping', () => {
        it('should display space item around group', () => {
            const { getItems } = renderList(<ListWithGroupingDemo />, {
                container,
            });
            const items = getItems();
            expect(isSpaceItem(items[10])).toBeTruthy();
            expect(isSpaceItem(items[11])).toBeFalsy();
            expect(isSpaceItem(items[12])).toBeTruthy();
        });

        // TODO еще нужен тест если задан hiddenGroupPosition
        it('should not display space item after hidden group', () => {
            const { getItems } = renderList(<ListWithGroupingDemo />, {
                container,
            });
            const items = getItems();
            expect(isSpaceItem(items[0])).toBeFalsy();
            expect(isSpaceItem(items[1])).toBeFalsy();
            expect(isSpaceItem(items[2])).toBeTruthy();
        });

        it('spacing items are displayed after remove item before group', async () => {
            const { getSpaceItems, getItems } = renderList(<ListWithGroupingDemo />, { container });

            await userEvent.click(screen.getByText('Remove item before group'));

            await waitFor(() => {
                expect(getSpaceItems().length).toBe(9);
                const items = getItems();
                expect(isSpaceItem(items[10])).toBeTruthy();
                expect(isSpaceItem(items[11])).toBeFalsy();
                expect(isSpaceItem(items[12])).toBeTruthy();
            });
        });

        it('spacing items are displayed after remove item after group', async () => {
            const { getSpaceItems, getItems } = renderList(<ListWithGroupingDemo />, { container });

            await userEvent.click(screen.getByText('Remove item after group'));

            await waitFor(() => {
                expect(getSpaceItems().length).toBe(9);
                const items = getItems();
                expect(isSpaceItem(items[8])).toBeTruthy();
                expect(isSpaceItem(items[9])).toBeFalsy();
                expect(isSpaceItem(items[10])).toBeTruthy();
            });
        });

        it('should not display space items from collapsed group', async () => {
            const { getSpaceItems, toggleGroup } = renderList(<ListWithGroupingDemo />, {
                container,
            });

            await toggleGroup('Группа 1');

            await waitFor(() => {
                expect(getSpaceItems().length).toBe(5);
            });
        });

        it('should display space items from expanded group', async () => {
            const { getSpaceItems, toggleGroup } = renderList(<ListWithGroupingDemo />, {
                container,
            });

            await toggleGroup('Группа 1');
            // Если не дождаться, что группа свернулась и не проверить это, то тест работает неправильно
            await waitFor(() => {
                expect(getSpaceItems().length).toBe(5);
            });

            await toggleGroup('Группа 1');
            await waitFor(() => {
                expect(getSpaceItems().length).toBe(10);
            });
        });
    });

    describe('handle data changes', () => {
        describe('remove items', () => {
            it('spacing items are displayed after remove item from start', async () => {
                const { getSpaceItems, getItems } = renderList(<ListDemo />, {
                    container,
                });

                await userEvent.click(screen.getByText('Remove item from start'));

                await waitFor(() => {
                    expect(getSpaceItems().length).toBe(3);
                    checkSpaceItemsBetweenItems(getItems());
                });
            });

            it('spacing items are displayed after remove 2 items from start', async () => {
                const { getSpaceItems, getItems } = renderList(<ListDemo />, {
                    container,
                });

                await userEvent.click(screen.getByText('Remove 2 items from start'));

                await waitFor(() => {
                    expect(getSpaceItems().length).toBe(2);
                    checkSpaceItemsBetweenItems(getItems());
                });
            });

            it('spacing items are displayed after remove last item', async () => {
                const { getSpaceItems, getItems } = renderList(<ListDemo />, {
                    container,
                });

                await userEvent.click(screen.getByText('Remove last item'));

                await waitFor(() => {
                    expect(getSpaceItems().length).toBe(3);
                    checkSpaceItemsBetweenItems(getItems());
                });
            });

            it('spacing items are displayed after remove 2 last items', async () => {
                const { getSpaceItems, getItems } = renderList(<ListDemo />, {
                    container,
                });

                await userEvent.click(screen.getByText('Remove 2 last items'));

                await waitFor(() => {
                    expect(getSpaceItems().length).toBe(2);
                    checkSpaceItemsBetweenItems(getItems());
                });
            });

            it('should remove all space items after remove all data items', async () => {
                const { getSpaceItems } = renderList(<ListDemo />, {
                    container,
                });

                await userEvent.click(screen.getByText('Remove all items'));

                await waitFor(() => {
                    const items = getSpaceItems();
                    expect(items.length).toBe(0);
                });
            });
        });

        describe('add items', () => {
            it('spacing items are displayed after add item to start', async () => {
                const { getSpaceItems, getItems } = renderList(<ListDemo />, {
                    container,
                });

                await userEvent.click(screen.getByText('Add item to start'));

                await waitFor(() => {
                    expect(getSpaceItems().length).toBe(5);
                    checkSpaceItemsBetweenItems(getItems());
                });
            });

            it('spacing items are displayed after add 2 items to start', async () => {
                const { getSpaceItems, getItems } = renderList(<ListDemo />, {
                    container,
                });

                await userEvent.click(screen.getByText('Add 2 items to start'));

                await waitFor(() => {
                    expect(getSpaceItems().length).toBe(6);
                    checkSpaceItemsBetweenItems(getItems());
                });
            });

            it('spacing items are displayed after add item to middle', async () => {
                const { getSpaceItems, getItems } = renderList(<ListDemo />, {
                    container,
                });

                await userEvent.click(screen.getByText('Add item to middle'));

                await waitFor(() => {
                    expect(getSpaceItems().length).toBe(5);
                    checkSpaceItemsBetweenItems(getItems());
                });
            });

            it('spacing items are displayed after add 2 items to middle', async () => {
                const { getSpaceItems, getItems } = renderList(<ListDemo />, {
                    container,
                });

                await userEvent.click(screen.getByText('Add 2 items to middle'));

                await waitFor(() => {
                    expect(getSpaceItems().length).toBe(6);
                    checkSpaceItemsBetweenItems(getItems());
                });
            });

            it('spacing items are displayed after add item to end', async () => {
                const { getSpaceItems, getItems } = renderList(<ListDemo />, {
                    container,
                });

                await userEvent.click(screen.getByText('Add item to end'));

                await waitFor(() => {
                    expect(getSpaceItems().length).toBe(5);
                    checkSpaceItemsBetweenItems(getItems());
                });
            });

            it('spacing items are displayed after add 2 items to end', async () => {
                const { getSpaceItems, getItems } = renderList(<ListDemo />, {
                    container,
                });

                await userEvent.click(screen.getByText('Add 2 items to end'));

                await waitFor(() => {
                    expect(getSpaceItems().length).toBe(6);
                    checkSpaceItemsBetweenItems(getItems());
                });
            });
        });
    });
});
