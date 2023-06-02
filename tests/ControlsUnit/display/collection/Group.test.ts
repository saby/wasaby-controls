import { RecordSet } from 'Types/collection';
import { Collection as DisplayCollection } from 'Controls/display';

describe('onCollectionChange', () => {
    it('should update collection when item group was changed', () => {
        const recordSet = new RecordSet({
            keyProperty: 'key',
            rawData: [
                { key: 1, group: 1 },
                { key: 2, group: 2 },
                { key: 3, group: 1 },
                { key: 4, group: 3 },
            ],
        });
        const display = new DisplayCollection({ collection: recordSet });
        const displayItemAt3 = display.at(3);
        let handlerCalledTimes = 0;
        const handler = (
            event,
            action,
            newItems,
            newItemsIndex,
            oldItems,
            oldItemsIndex
        ) => {
            expect(action).toEqual('ch');
            expect(newItems[0]).toEqual(displayItemAt3);
            handlerCalledTimes++;
        };

        expect(display.getVersion()).toEqual(0);

        display.subscribe('onCollectionChange', handler);
        displayItemAt3.getContents().set('group', 2);
        display.unsubscribe('onCollectionChange', handler);

        expect(display.getVersion()).toEqual(1);
        expect(handlerCalledTimes).toEqual(1);

        // handler assertions are above;
    });
});
