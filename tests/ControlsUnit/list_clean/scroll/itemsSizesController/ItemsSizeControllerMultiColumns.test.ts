import jsdom = require('jsdom');
const { JSDOM } = jsdom;

import { ItemClass, ItemsContainerUniqueClass } from 'ControlsUnit/list_clean/scroll/DomUtils';
import { ItemsSizeControllerMultiColumns } from 'Controls/baseList';
import { ColumnsCollection, ColumnsCollectionItem } from 'Controls/columns';
import { RecordSet } from 'Types/collection';

function getItemElement(item: ColumnsCollectionItem): HTMLElement {
    const dom = new JSDOM('');

    const itemElement: HTMLElement = dom.window.document.createElement('div');

    itemElement.className = ItemClass;
    itemElement.setAttribute('item-key', item.key);

    const collection = item.getOwner() as ColumnsCollection;
    const column = item.getColumn();
    const itemsColumn = collection.getItems().filter((it) => {
        return it.getColumn() === column;
    });

    let top = 0;
    for (let i = 0; i < itemsColumn.length; i++) {
        if (itemsColumn[i] === item) {
            break;
        }
        top += itemsColumn[i].contents.get('height') || 0;
    }

    jest.spyOn(itemElement, 'getBoundingClientRect')
        .mockClear()
        .mockImplementation(() => {
            return {
                width: item.contents.get('width') || 0,
                height: item.contents.get('height') || 0,
                top,
                left: 0,
                right: 0,
                bottom: 0,
            } as DOMRect;
        });

    return itemElement;
}

function getItemsContainer(collection: ColumnsCollection): HTMLElement {
    const dom = new JSDOM(`<div class="${ItemsContainerUniqueClass}"></div>`);

    const itemsContainer: HTMLElement = dom.window.document.querySelector(
        `.${ItemsContainerUniqueClass}`
    );

    collection.each((item) => {
        const itemElement = getItemElement(item);
        itemsContainer.appendChild(itemElement);
    });

    return itemsContainer;
}

describe('Controls/baseList:ItemsSizeControllerMultiColumns', () => {
    let controller: ItemsSizeControllerMultiColumns;
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
        const collection = new ColumnsCollection({
            collection: new RecordSet({
                rawData: [
                    { key: 1, height: 20 },
                    { key: 2, height: 20 },
                    { key: 3, height: 20 },
                    { key: 4, height: 20 },
                ],
                keyProperty: 'key',
            }),
            keyProperty: 'key',
            columnsCount: 2,
        });

        itemsContainer = getItemsContainer(collection);

        controller = new ItemsSizeControllerMultiColumns({
            itemsContainer,
            itemsQuerySelector: `.${ItemsContainerUniqueClass} > .${ItemClass}`,
            totalCount: collection.getCount(),
        });
    });

    describe('updateItemsSizes', () => {
        it('should update sizes in range', () => {
            const itemsSizes = controller.updateItemsSizes({
                startIndex: 0,
                endIndex: 4,
            });

            expect(itemsSizes).toEqual([
                { size: 20, offset: 0, key: '1' },
                { size: 20, offset: 0, key: '2' },
                { size: 20, offset: 20, key: '3' },
                { size: 20, offset: 20, key: '4' },
            ]);
        });

        it('should update items sizes only in new range', () => {
            controller.updateItemsSizes({ startIndex: 0, endIndex: 4 });
            controller.addItems(4, 4);
            const collection = new ColumnsCollection({
                collection: new RecordSet({
                    rawData: [
                        { key: 5, height: 20 },
                        { key: 6, height: 20 },
                        { key: 7, height: 20 },
                        { key: 8, height: 20 },
                    ],
                    keyProperty: 'key',
                }),
                keyProperty: 'key',
                columnsCount: 2,
            });

            const childElements = Array.from(itemsContainer.children);
            childElements.forEach((it) => {
                return it.remove();
            });
            let column = window.document.createElement('div');
            itemsContainer.appendChild(column);
            collection.getViewIterator(0).each((item) => {
                const itemElement = getItemElement(item);
                column.appendChild(itemElement);
            });
            column = window.document.createElement('div');
            itemsContainer.appendChild(column);
            collection.getViewIterator(1).each((item) => {
                const itemElement = getItemElement(item);
                column.appendChild(itemElement);
            });
            controller.setItemsQuerySelector('div > .item');

            const itemsSizes = controller.updateItemsSizes({
                startIndex: 4,
                endIndex: 8,
            });

            expect(itemsSizes).toEqual([
                { size: 20, offset: 0, key: '1' },
                { size: 20, offset: 0, key: '2' },
                { size: 20, offset: 20, key: '3' },
                { size: 20, offset: 20, key: '4' },
                { size: 20, offset: 20, key: '5' },
                { size: 20, offset: 40, key: '7' },
                { size: 20, offset: 20, key: '6' },
                { size: 20, offset: 40, key: '8' },
            ]);
        });

        it('should update items sizes in new range and recalculate offsets for items after range', () => {
            controller.updateItemsSizes({ startIndex: 0, endIndex: 4 });
            controller.addItems(0, 4);
            const collection = new ColumnsCollection({
                collection: new RecordSet({
                    rawData: [
                        { key: 5, height: 20 },
                        { key: 6, height: 20 },
                        { key: 7, height: 20 },
                        { key: 8, height: 20 },
                    ],
                    keyProperty: 'key',
                }),
                keyProperty: 'key',
                columnsCount: 2,
            });

            const itemsContainer = getItemsContainer(collection);
            controller.setItemsContainer(itemsContainer);

            const itemsSizes = controller.updateItemsSizes({
                startIndex: 0,
                endIndex: 4,
            });

            expect(itemsSizes).toEqual([
                { size: 20, offset: 0, key: '5' },
                { size: 20, offset: 0, key: '6' },
                { size: 20, offset: 20, key: '7' },
                { size: 20, offset: 20, key: '8' },
                { size: 20, offset: 40, key: '1' },
                { size: 20, offset: 40, key: '2' },
                { size: 20, offset: 60, key: '3' },
                { size: 20, offset: 60, key: '4' },
            ]);
        });
    });
});
