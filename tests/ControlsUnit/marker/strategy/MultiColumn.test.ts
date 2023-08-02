import { RecordSet } from 'Types/collection';
import { ColumnsCollection } from 'Controls/columns';
import { default as MultiColumnStrategy } from 'Controls/_marker/strategy/MultiColumn';

let items;
let model;
let strategy;
beforeEach(() => {
    items = new RecordSet({
        rawData: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
        keyProperty: 'id',
    });
    model = new ColumnsCollection({
        keyProperty: 'id',
        collection: items,
    });

    strategy = new MultiColumnStrategy({ model });
});
/* columns [1, 2]
           [3, 4] */
describe('Controls/_marker/strategy/MultiColumn', () => {
    describe('getMarkedKeyByDirection', () => {
        it('right', () => {
            const newMarkedKey = strategy.getMarkedKeyByDirection(0, 'Right');
            expect(newMarkedKey).toEqual(2);
        });

        it('left', () => {
            let newMarkedKey;
            newMarkedKey = strategy.getMarkedKeyByDirection(0, 'Left');
            expect(newMarkedKey).toEqual(1);
            newMarkedKey = strategy.getMarkedKeyByDirection(1, 'Left');
            expect(newMarkedKey).toEqual(1);
        });

        it('bottom', () => {
            const newMarkedKey = strategy.getMarkedKeyByDirection(0, 'Down');
            expect(newMarkedKey).toEqual(3);
        });

        it('up', () => {
            let newMarkedKey;
            newMarkedKey = strategy.getMarkedKeyByDirection(0, 'Up');
            expect(newMarkedKey).toEqual(1);
            newMarkedKey = strategy.getMarkedKeyByDirection(2, 'Up');
            expect(newMarkedKey).toEqual(1);
        });
    });
});
