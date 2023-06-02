import { getItemsWithHistory, getUniqItems } from 'Controls/_filter/Utils/prepareItems';
import {RecordSet} from 'Types/collection';
import {Memory} from 'Types/source';

describe('Controls/_filter/Utils/prepareItems', () => {
    it('prependNewItems', () => {
        const initItems = [
            { key: 0, title: 'все страны' },
            { key: 1, title: 'Россия' },
            { key: 2, title: 'США' },
            { key: 3, title: 'Великобритания' }
        ];
        const hasMoreData = true;
        let items = new RecordSet({
                keyProperty: 'key',
                rawData: initItems,
                metaData: { test: true }
            });
        let sourceController = {
                hasMoreData: () => {
                    return hasMoreData;
                }
            };
        const source = new Memory({
                keyProperty: 'key',
                data: initItems
            });
        let newItems = new RecordSet({
            keyProperty: 'key',
            rawData: [{ key: 18, title: '18 record' }]
        });
        const expectedItems = [{ key: 18, title: '18 record' }].concat(
            initItems.slice(0, 3)
        );

        let resultItems = getItemsWithHistory(
            items,
            newItems,
            sourceController,
            source,
            'key'
        );
        expect(resultItems.getCount()).toEqual(4);
        expect(resultItems.getRawData()).toEqual(expectedItems);
        expect(resultItems.getMetaData()).toEqual({ test: true });

        newItems = new RecordSet({
            keyProperty: 'key',
            rawData: [
                { key: 20, title: '20 record' },
                { key: 1, title: 'Россия' }
            ]
        });
        resultItems = getItemsWithHistory(
            items,
            newItems,
            sourceController,
            source,
            'key'
        );
        expect(resultItems.getCount()).toEqual(4);
        expect(resultItems.at(0).getId()).toEqual(20);
        expect(resultItems.at(1).getId()).toEqual(1);
        expect(resultItems.at(2).getId()).toEqual(0);
        expect(resultItems.at(3).getId()).toEqual(2);

        items = new RecordSet({
            keyProperty: 'key',
            rawData: initItems,
            model: 'Types/entity:Record',
            metaData: { test: true }
        });
        resultItems = getItemsWithHistory(
            items,
            newItems,
            sourceController,
            source,
            'key'
        );
        expect(resultItems.getModel()).toEqual(items.getModel());

        let folderKey;
        sourceController = {
            hasMoreData: (direction, key) => {
                folderKey = key;
            }
        };
        resultItems = getItemsWithHistory(
            items,
            newItems,
            sourceController,
            source,
            'key',
            'folder1'
        );
        expect(resultItems.getModel()).toEqual(items.getModel());
        expect(folderKey).toEqual('folder1');
    });


    it('getUniqItems', () => {
        const initItems = [
            { key: 1, title: 'все страны' },
            { key: 2, title: 'Россия' }
        ];
        const oldItems = new RecordSet({
            keyProperty: 'key',
            rawData: initItems,
            metaData: { test: true }
        });

        const newItems = new RecordSet({
            keyProperty: 'key',
            rawData: [...initItems, { key: 5, title: 'New item' }]
        });

        const resultItems = getUniqItems(
            oldItems,
            newItems,
            'key'
        );
        expect(resultItems.getCount()).toEqual(3);
        expect(resultItems.getMetaData()).toBeTruthy();
    });
});
