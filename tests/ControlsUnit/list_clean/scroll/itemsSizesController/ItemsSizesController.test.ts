import jsdom = require('jsdom');
const { JSDOM } = jsdom;

import {
    getBeforeListContent,
    getCollection,
    getScrollContainerWithList,
    ItemClass,
    ItemsContainerUniqueClass,
    ListContainerUniqueClass,
    renderCollectionChanges,
} from 'ControlsUnit/list_clean/scroll/DomUtils';
import { ItemsSizeController } from 'Controls/_baseList/Controllers/ScrollController/ItemsSizeController/ItemsSizeController';
import { Logger } from 'UI/Utils';

const EMPTY_SIZE = { size: 0, offset: 0 };

describe('Controls/_baseList/Controllers/ItemsSizeController', () => {
    let controller: ItemsSizeController;
    let collection;
    let scrollContainer: HTMLElement;
    let listContainer: HTMLElement;
    let itemsContainer: HTMLElement;

    let oldWindow;
    let stubLoggerError;

    const isNode = typeof document === 'undefined';

    before(() => {
        if (isNode) {
            oldWindow = window;
            window = new JSDOM('').window;
            global.getComputedStyle = window.getComputedStyle;
        }
    });

    after(() => {
        if (isNode) {
            window = oldWindow;
        }
    });

    beforeEach(() => {
        collection = getCollection([
            { key: 1, height: 15 },
            { key: 2, height: 20 },
            { key: 3, height: 30 },
        ]);

        scrollContainer = getScrollContainerWithList(collection);
        itemsContainer = scrollContainer.querySelector(
            `.${ItemsContainerUniqueClass}`
        ) as HTMLElement;
        listContainer = scrollContainer.querySelector(
            `.${ListContainerUniqueClass}`
        ) as HTMLElement;

        controller = new ItemsSizeController({
            itemsContainer,
            listContainer,
            itemsQuerySelector: `.${ItemsContainerUniqueClass} > .${ItemClass}`,
            totalCount: collection.getCount(),
        });

        stubLoggerError = jest.spyOn(Logger, 'error').mockClear().mockImplementation();
    });

    describe('updateItemsSizes', () => {
        it('should update sizes in range', () => {
            const itemsSizes = controller.updateItemsSizes({
                startIndex: 0,
                endIndex: 3,
            });

            expect(itemsSizes).toEqual([
                { size: 15, offset: 0, key: '1' },
                { size: 20, offset: 15, key: '2' },
                { size: 30, offset: 35, key: '3' },
            ]);
        });

        it('should update offsets after range', () => {
            controller.resetItems(6, [
                { size: 10, offset: 0, key: '1' },
                { size: 10, offset: 10, key: '2' },
                { size: 10, offset: 20, key: '3' },
                { size: 10, offset: 30, key: '4' },
                { size: 10, offset: 40, key: '5' },
                { size: 10, offset: 50, key: '6' },
            ]);

            const itemsSizes = controller.updateItemsSizes({
                startIndex: 0,
                endIndex: 3,
            });

            expect(itemsSizes).toEqual([
                { size: 15, offset: 0, key: '1' },
                { size: 20, offset: 15, key: '2' },
                { size: 30, offset: 35, key: '3' },
                { size: 10, offset: 65, key: '4' },
                { size: 10, offset: 75, key: '5' },
                { size: 10, offset: 85, key: '6' },
            ]);
        });

        it('should update items sizes only in the new range', () => {
            controller.updateItemsSizes({ startIndex: 0, endIndex: 3 });
            controller.addItems(3, 3);
            const collection = getCollection([
                { key: 4, height: 20 },
                { key: 5, height: 20 },
                { key: 6, height: 20 },
            ]);
            renderCollectionChanges(itemsContainer, collection);

            const itemsSizes = controller.updateItemsSizes({
                startIndex: 3,
                endIndex: 6,
            });

            expect(itemsSizes).toEqual([
                { size: 15, offset: 0, key: '1' },
                { size: 20, offset: 15, key: '2' },
                { size: 30, offset: 35, key: '3' },
                { size: 20, offset: 65, key: '4' },
                { size: 20, offset: 85, key: '5' },
                { size: 20, offset: 105, key: '6' },
            ]);
        });

        it('should log error if passed invalid range', () => {
            controller.updateItemsSizes({ startIndex: 3, endIndex: 8 });

            expect(stubLoggerError).toHaveBeenCalled();
        });

        it('should log error if count dom elements is less than range length', () => {
            controller.updateItemsSizes({ startIndex: 0, endIndex: 2 });

            expect(stubLoggerError).toHaveBeenCalled();
        });

        it('should log error if count dom elements is higher than range length', () => {
            controller.updateItemsSizes({ startIndex: 0, endIndex: 4 });

            expect(stubLoggerError).toHaveBeenCalled();
        });

        it('should log error if the range includes items rendered outside of it', () => {
            controller.setItemsRenderedOutsideRange([{ key: '1', collectionIndex: 0 }]);

            controller.updateItemsSizes({ startIndex: 0, endIndex: 3 });

            expect(stubLoggerError).toHaveBeenCalled();
        });

        it('should not log error if there are items rendered outside of updated range', () => {
            controller.updateItemsSizes({ startIndex: 0, endIndex: 3 });
            controller.addItems(3, 3);
            const collection = getCollection([
                { key: 1, height: 20 },
                { key: 4, height: 20 },
                { key: 5, height: 20 },
                { key: 6, height: 20 },
            ]);
            renderCollectionChanges(itemsContainer, collection);
            controller.setItemsRenderedOutsideRange([{ key: '1', collectionIndex: 0 }]);

            const itemsSizes = controller.updateItemsSizes({
                startIndex: 3,
                endIndex: 6,
            });

            expect(stubLoggerError).not.toHaveBeenCalled();
            expect(itemsSizes).toEqual([
                { size: 20, offset: 0, key: '1' },
                { size: 20, offset: 15, key: '2' },
                { size: 30, offset: 35, key: '3' },
                { size: 20, offset: 65, key: '4' },
                { size: 20, offset: 85, key: '5' },
                { size: 20, offset: 105, key: '6' },
            ]);
        });

        it('items sizes should be empty if itemsContainer is null', () => {
            controller.setItemsContainer(null);

            const itemsSizes = controller.updateItemsSizes({
                startIndex: 0,
                endIndex: 3,
            });

            expect(itemsSizes).toEqual([EMPTY_SIZE, EMPTY_SIZE, EMPTY_SIZE]);
        });

        it('if itemsContainer is undefined items sizes should be empty', () => {
            controller.setItemsContainer(undefined);

            const itemsSizes = controller.updateItemsSizes({
                startIndex: 0,
                endIndex: 3,
            });

            expect(itemsSizes).toEqual([EMPTY_SIZE, EMPTY_SIZE, EMPTY_SIZE]);
        });

        it('offsets should include content before items', () => {
            collection.displayIndicator('top', 'loading');

            const itemsSizes = controller.updateItemsSizes({
                startIndex: 0,
                endIndex: 3,
            });

            expect(itemsSizes).toEqual([
                { size: 15, offset: 48, key: '1' },
                { size: 20, offset: 63, key: '2' },
                { size: 30, offset: 83, key: '3' },
            ]);
        });

        it('should correct content size before items', () => {
            collection.displayIndicator('top', 'loading');
            controller.updateItemsSizes({ startIndex: 0, endIndex: 3 });
            controller.addItems(0, 3);
            renderCollectionChanges(
                itemsContainer,
                getCollection([
                    { key: -1, height: 20 },
                    { key: 0, height: 20 },
                    { key: 1, height: 15 },
                    { key: 2, height: 20 },
                    { key: 3, height: 30 },
                ])
            );

            const itemsSizes = controller.updateItemsSizes({
                startIndex: 1,
                endIndex: 6,
            });

            expect(itemsSizes).toEqual([
                { size: 0, offset: 0 },
                { size: 20, offset: 48, key: '-1' },
                { size: 20, offset: 68, key: '0' },
                { size: 15, offset: 88, key: '1' },
                { size: 20, offset: 103, key: '2' },
                { size: 30, offset: 123, key: '3' },
            ]);
        });
    });

    describe('getContentSizeBeforeList', () => {
        it('should return size of content before items', () => {
            const scrollContainer = getScrollContainerWithList(collection, getBeforeListContent());
            const listContainer = scrollContainer.querySelector(
                `.${ListContainerUniqueClass}`
            ) as HTMLElement;
            const controller = new ItemsSizeController({
                itemsContainer,
                listContainer,
                itemsQuerySelector: `.${ItemsContainerUniqueClass} > .${ItemClass}`,
                totalCount: collection.getCount(),
            });

            expect(controller.getContentSizeBeforeList()).toEqual(200);
        });
    });
});
