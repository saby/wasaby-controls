import { RecordSet } from 'Types/collection';
import { GridCollection } from 'Controls/grid';

describe('Controls/display/collection/BackgroundStyle', () => {
    it('should set backgroundStyle while initializing', () => {
        const recordSet = new RecordSet({ rawData: [], keyProperty: 'id' });
        const collection = new GridCollection({
            keyProperty: 'id',
            collection: recordSet,
            backgroundStyle: 'custom',
            columns: [{ width: '1px' }],
        });
        expect(collection.getBackgroundStyle()).toEqual('custom');
    });

    it('should set backgroundStyle using setBackgroundStyle', () => {
        const recordSet = new RecordSet({ rawData: [], keyProperty: 'id' });
        const collection = new GridCollection({
            keyProperty: 'id',
            collection: recordSet,
        });
        expect(collection.getVersion()).toBe(0);
        expect(collection.getBackgroundStyle()).toEqual('default');

        collection.setBackgroundStyle('custom');

        expect(collection.getVersion()).toBe(1);
        expect(collection.getBackgroundStyle()).toEqual('custom');
    });

    it('should set backgroundStyle for every CollectionItem', () => {
        const recordSet = new RecordSet({
            rawData: [{ id: 0 }, { id: 1 }, { id: 2 }],
            keyProperty: 'id',
        });
        const collection = new GridCollection({
            keyProperty: 'id',
            collection: recordSet,
            columns: [{}, {}],
        });

        collection.getItems().forEach((column) => {
            jest.spyOn(column, 'setBackgroundStyle').mockClear();
        });

        collection.setBackgroundStyle('custom');

        collection.getItems().forEach((item) => {
            expect(item.setBackgroundStyle).toHaveBeenCalledTimes(1);
        });

        jest.restoreAllMocks();
    });
});
