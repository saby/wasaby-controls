import { RecordSet } from 'Types/collection';
import { ColumnsCollection } from 'Controls/columns';
import { CompatibleMultiColumnMarkerStrategy as MultiColumnMarkerStrategy } from 'Controls/listAspects';

let items;
let model;
let strategy: MultiColumnMarkerStrategy;
beforeEach(() => {
    items = new RecordSet({
        rawData: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
        keyProperty: 'id',
    });
    model = new ColumnsCollection({
        keyProperty: 'id',
        collection: items,
    });

    strategy = new MultiColumnMarkerStrategy({});
});
/* columns [1, 2]
           [3, 4] */
describe('Controls/_marker/strategy/MultiColumn', () => {
    describe('oldGetMarkedKeyByDirection', () => {
        it('right', () => {
            const newMarkedKey = strategy.oldGetMarkedKeyByDirection(model, 0, 'Right');
            expect(newMarkedKey).toEqual(2);
        });

        it('left', () => {
            let newMarkedKey;
            newMarkedKey = strategy.oldGetMarkedKeyByDirection(model, 0, 'Left');
            expect(newMarkedKey).toEqual(1);
            newMarkedKey = strategy.oldGetMarkedKeyByDirection(model, 1, 'Left');
            expect(newMarkedKey).toEqual(1);
        });

        it('bottom', () => {
            const newMarkedKey = strategy.oldGetMarkedKeyByDirection(model, 0, 'Down');
            expect(newMarkedKey).toEqual(3);
        });

        it('up', () => {
            let newMarkedKey;
            newMarkedKey = strategy.oldGetMarkedKeyByDirection(model, 0, 'Up');
            expect(newMarkedKey).toEqual(1);
            newMarkedKey = strategy.oldGetMarkedKeyByDirection(model, 2, 'Up');
            expect(newMarkedKey).toEqual(1);
        });
    });
});
