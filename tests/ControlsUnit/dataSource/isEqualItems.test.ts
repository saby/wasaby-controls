import { isEqualItems } from 'Controls/dataSource';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';

describe('Controls/dataSource:isEqualItems', () => {
    describe('isEqual by model', () => {
        it('modes as alias', () => {
            let recordSet1;
            let recordSet2;

            recordSet1 = new RecordSet({
                model: 'Types/entity:Model',
            });
            recordSet2 = new RecordSet({
                model: 'Types/entity:Model',
            });
            expect(isEqualItems(recordSet1, recordSet2)).toBe(true);

            recordSet1 = new RecordSet({
                model: 'Types/entity:Model',
            });
            recordSet2 = new RecordSet({
                model: 'Types/entity:Model2',
            });
            expect(isEqualItems(recordSet1, recordSet2)).toBe(false);
        });

        it('modes as alias and class', () => {
            let recordSet1;
            let recordSet2;

            recordSet1 = new RecordSet({
                model: 'Types/entity:Model',
            });
            recordSet2 = new RecordSet({
                model: Model,
            });
            expect(isEqualItems(recordSet1, recordSet2)).toBe(true);

            recordSet1 = new RecordSet({
                model: 'Types/entity:Model2',
            });
            recordSet2 = new RecordSet({
                model: Model,
            });
            expect(isEqualItems(recordSet1, recordSet2)).toBe(false);
        });
    });
});
