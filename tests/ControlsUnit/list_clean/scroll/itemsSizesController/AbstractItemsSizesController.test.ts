import jsdom = require('jsdom');

import {
    getBeforeListContent,
    getCollection,
    getItemsContainer,
    getScrollContainerWithList,
    ItemClass,
    ItemsContainerUniqueClass,
    ListContainerUniqueClass,
} from 'ControlsUnit/list_clean/scroll/DomUtils';
import { TestItemsSizesController } from 'ControlsUnit/list_clean/scroll/itemsSizesController/TestUtils';

const EMPTY_SIZE = { size: 0, offset: 0 };

describe('Controls/_baseList/Controllers/AbstractItemsSizesController', () => {
    let collection;
    let controller: TestItemsSizesController;
    let scrollContainer: HTMLElement;
    let listContainer: HTMLElement;
    let itemsContainer: HTMLElement;

    let oldWindow;

    const isNode = typeof document === 'undefined';

    before(() => {
        if (isNode) {
            oldWindow = window;
            window = new jsdom.JSDOM('').window;
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

        controller = new TestItemsSizesController({
            itemsContainer,
            listContainer,
            itemsQuerySelector: `.${ItemsContainerUniqueClass} > .${ItemClass}`,
            totalCount: collection.getCount(),
        });
    });

    describe('constructor', () => {
        it('should init itemsSizes with empty values', () => {
            const controller = new TestItemsSizesController({
                itemsContainer,
                listContainer,
                itemsQuerySelector: `.${ItemsContainerUniqueClass} > .${ItemClass}`,
                totalCount: collection.getCount(),
            });

            const itemsSizes = controller.getItemsSizes();

            expect(itemsSizes).toEqual([EMPTY_SIZE, EMPTY_SIZE, EMPTY_SIZE]);
        });

        it("should init itemsSizes with empty values even if containers weren't passed", () => {
            const controller = new TestItemsSizesController({
                itemsQuerySelector: `.${ItemsContainerUniqueClass} > .${ItemClass}`,
                totalCount: collection.getCount(),
            });

            const itemsSizes = controller.getItemsSizes();

            expect(itemsSizes).toEqual([EMPTY_SIZE, EMPTY_SIZE, EMPTY_SIZE]);
        });
    });

    describe('getElement', () => {
        it('should return element by key', () => {
            const element = controller.getElement(2);

            expect(element).toBeTruthy();
            expect(element.getAttribute('item-key')).toEqual('2');
        });

        it('should return null', () => {
            controller.setItemsContainer(null);

            expect(controller.getElement(2)).toBeNull();
        });
    });

    describe('getContentSizeBeforeItems', () => {
        it('should return null', () => {
            controller.setItemsContainer(null);

            expect(controller.getContentSizeBeforeItems()).toBeNull();
        });

        it('should return size of empty content before items', () => {
            expect(controller.getContentSizeBeforeItems()).toEqual(0);
        });

        it('should return size of content before items', () => {
            collection.displayIndicator('top', 'loading');

            expect(controller.getContentSizeBeforeItems()).toEqual(48);
        });
    });

    describe('getContentSizeBeforeList', () => {
        it('should return null', () => {
            controller.setListContainer(null);

            expect(controller.getContentSizeBeforeList()).toBeNull();
        });

        it('should return size of empty content before items', () => {
            expect(controller.getContentSizeBeforeList()).toEqual(0);
        });

        it('content before list doest not include content before items', () => {
            collection.displayIndicator('top', 'loading');
            expect(controller.getContentSizeBeforeList()).toEqual(0);
        });

        it('should return size of content before items', () => {
            const scrollContainer = getScrollContainerWithList(
                collection,
                getBeforeListContent()
            );
            const listContainer = scrollContainer.querySelector(
                `.${ListContainerUniqueClass}`
            );
            controller.setListContainer(listContainer as HTMLElement);

            expect(controller.getContentSizeBeforeList()).toEqual(200);
        });
    });

    describe('setItemsContainer', () => {
        it('should change items container', () => {
            const collection = getCollection([
                { key: 1, height: 30 },
                { key: 2, height: 30 },
                { key: 3, height: 30 },
            ]);

            controller.setItemsContainer(getItemsContainer(collection));
            const itemsSizes = controller.updateItemsSizes({
                startIndex: 0,
                endIndex: 3,
            });

            expect(itemsSizes).toEqual([
                { size: 30, offset: 0, key: '1' },
                { size: 30, offset: 30, key: '2' },
                { size: 30, offset: 60, key: '3' },
            ]);
        });
    });

    describe('setListContainer', () => {
        it('should change list container', () => {
            const scrollContainer = getScrollContainerWithList(
                collection,
                getBeforeListContent()
            );
            const listContainer = scrollContainer.querySelector(
                `.${ListContainerUniqueClass}`
            );

            controller.setListContainer(listContainer as HTMLElement);

            expect(controller.getContentSizeBeforeList()).toEqual(200);
        });
    });

    describe('setItemsQuerySelector', () => {
        it('should change items selector', () => {
            controller.setItemsQuerySelector('.newItemSelector');

            expect(controller.getElement(2)).toBeNull();
        });
    });

    describe('onCollectionChange', () => {
        beforeEach(() => {
            controller.updateItemsSizes({ startIndex: 0, endIndex: 3 });
        });

        describe('addItems', () => {
            it('should add empty item to start', () => {
                const itemsSizes = controller.addItems(0, 1);

                expect(itemsSizes).toEqual([
                    EMPTY_SIZE,
                    { size: 15, offset: 0, key: '1' },
                    { size: 20, offset: 15, key: '2' },
                    { size: 30, offset: 35, key: '3' },
                ]);
            });

            it('should add empty item to middle', () => {
                const itemsSizes = controller.addItems(1, 1);

                expect(itemsSizes).toEqual([
                    { size: 15, offset: 0, key: '1' },
                    EMPTY_SIZE,
                    { size: 20, offset: 15, key: '2' },
                    { size: 30, offset: 35, key: '3' },
                ]);
            });

            it('should add empty item to end', () => {
                const itemsSizes = controller.addItems(3, 1);

                expect(itemsSizes).toEqual([
                    { size: 15, offset: 0, key: '1' },
                    { size: 20, offset: 15, key: '2' },
                    { size: 30, offset: 35, key: '3' },
                    EMPTY_SIZE,
                ]);
            });

            it('should add two empty items to start', () => {
                const itemsSizes = controller.addItems(0, 2);

                expect(itemsSizes).toEqual([
                    EMPTY_SIZE,
                    EMPTY_SIZE,
                    { size: 15, offset: 0, key: '1' },
                    { size: 20, offset: 15, key: '2' },
                    { size: 30, offset: 35, key: '3' },
                ]);
            });
        });

        describe('moveItems', () => {
            it('should move items', () => {
                const itemsSizes = controller.moveItems(0, 1, 2, 1);

                expect(itemsSizes).toEqual([
                    EMPTY_SIZE,
                    { size: 15, offset: 0, key: '1' },
                    { size: 30, offset: 35, key: '3' },
                ]);
            });
        });

        describe('removeItems', () => {
            it('should remove first item', () => {
                const itemsSizes = controller.removeItems(0, 1);

                expect(itemsSizes).toEqual([
                    { size: 20, offset: 15, key: '2' },
                    { size: 30, offset: 35, key: '3' },
                ]);
            });

            it('should remove an item from middle', () => {
                const itemsSizes = controller.removeItems(1, 1);

                expect(itemsSizes).toEqual([
                    { size: 15, offset: 0, key: '1' },
                    { size: 30, offset: 35, key: '3' },
                ]);
            });

            it('should remove last item', () => {
                const itemsSizes = controller.removeItems(2, 1);

                expect(itemsSizes).toEqual([
                    { size: 15, offset: 0, key: '1' },
                    { size: 20, offset: 15, key: '2' },
                ]);
            });

            it('remove two items from start', () => {
                const itemsSizes = controller.removeItems(0, 2);

                expect(itemsSizes).toEqual([
                    { size: 30, offset: 35, key: '3' },
                ]);
            });
        });

        describe('resetItems', () => {
            it('should create an array with two empty items', () => {
                const itemsSizes = controller.resetItems(2);

                expect(itemsSizes).toEqual([EMPTY_SIZE, EMPTY_SIZE]);
            });

            it('should create an array with given sizes', () => {
                const itemsSizes = controller.resetItems(1, [
                    { size: 1, offset: 0 },
                ]);

                expect(itemsSizes).toEqual([{ size: 1, offset: 0 }]);
            });
        });
    });
});
