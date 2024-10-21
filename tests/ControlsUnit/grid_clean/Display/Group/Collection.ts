import { GridCollection } from 'Controls/grid';
import { RecordSet } from 'Types/collection';

describe('Controls/grid/Display/Group/Collection', () => {
    it('setColspanGroup::should update model version only if items updated.', () => {
        const recordSet = new RecordSet({
            keyProperty: 'id',
            rawData: [{ id: 1 }],
        });
        const collection = new GridCollection({
            collection: recordSet,
            columns: [{ width: '' }],
        });

        const oldVersion = collection.getVersion();
        collection.setColspanGroup(!collection.getColspanGroup());
        const newVersion = collection.getVersion();

        expect(oldVersion).toEqual(newVersion);
    });
});
