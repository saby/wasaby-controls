import { Collection } from 'Controls/display';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';

describe('Controls/_display/collection/UpdateMetaData', () => {
    const createRecordSet = (metaData?) => {
        return new RecordSet({
            keyProperty: 'id',
            rawData: [],
            metaData,
        });
    };
    const createMetaResults = () => {
        return new Model({ rawData: {} });
    };

    it('1. Update version and meta results state', () => {
        const results = createMetaResults();
        const oldRecordSet = createRecordSet();
        const newRecordSet = createRecordSet({ results });

        const collection = new Collection({
            keyProperty: 'id',
            collection: oldRecordSet,
        });

        expect(collection.getVersion()).toEqual(0);
        expect(collection.getMetaResults()).not.toBeDefined();

        collection.setCollection(newRecordSet);

        expect(collection.getVersion()).toEqual(3);
        expect(collection.getMetaResults()).toEqual(results);
    });
});
