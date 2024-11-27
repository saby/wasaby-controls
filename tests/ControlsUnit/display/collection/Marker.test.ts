import { IObservable, RecordSet } from 'Types/collection';
import { Collection } from 'Controls/display';
import { SyntheticEvent } from 'Vdom/Vdom';

describe('Controls/display/collection/Marker', () => {
    it('should notify onCollectionChange event', () => {
        const collection = new Collection({
            keyProperty: 'id',
            collection: new RecordSet({
                rawData: [{ id: 1 }],
                keyProperty: 'id',
            }),
        });

        const onCollectionChange = (
            event: SyntheticEvent,
            action,
            newItems,
            newItemsIndex,
            oldItems,
            oldItemsIndex
        ) => {
            expect(action).toEqual(IObservable.ACTION_CHANGE);
            expect(newItems.length).toEqual(1);
            expect(newItems[0].getContents().getKey()).toEqual(1);
            expect(newItems.properties).toEqual('marked');
            expect(oldItems.length).toEqual(1);
            expect(oldItems[0].getContents().getKey()).toEqual(1);
            expect(oldItems.properties).toEqual('marked');
        };
        collection.subscribe('onCollectionChange', onCollectionChange);
        collection.setMarkedKey(1);
    });

    it('set marker on item', () => {
        const collection = new Collection({
            keyProperty: 'id',
            collection: new RecordSet({
                rawData: [{ id: 1 }, { id: 2 }],
                keyProperty: 'id',
            }),
        });
        collection.setMarkedKey(1);
        expect(collection.getItemBySourceKey(1).isMarked()).toBe(true);
    });

    it('unset marker on item', () => {
        const collection = new Collection({
            keyProperty: 'id',
            collection: new RecordSet({
                rawData: [{ id: 1 }, { id: 2 }],
                keyProperty: 'id',
            }),
        });
        collection.setMarkedKey(1);
        expect(collection.getItemBySourceKey(1).isMarked()).toBe(true);
        collection.setMarkedKey(undefined);
        expect(collection.getItemBySourceKey(1).isMarked()).toBe(false);
    });
});
