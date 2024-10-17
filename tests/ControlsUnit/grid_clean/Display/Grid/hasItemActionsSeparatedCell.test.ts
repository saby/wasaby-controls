import { GridCollection } from 'Controls/grid';
import { RecordSet } from 'Types/collection';

describe('Controls/grid_clean/display/GridCollection/hasItemActionsSeparatedCell', () => {
    const createDisplay = (columnScroll, items) => {
        return new GridCollection({
            collection: new RecordSet({
                rawData: items,
                keyProperty: 'id',
            }),
            columnScroll,
            columns: [{}, {}],
        });
    };

    it('columnScroll = true, no items', () => {
        const display = createDisplay(true, []);
        expect(display.hasItemActionsSeparatedCell()).toBe(true);
    });

    it('columnScroll = false, no items', () => {
        const display = createDisplay(false, []);
        expect(display.hasItemActionsSeparatedCell()).toBe(false);
    });

    it('columnScroll = true, has items', () => {
        const display = createDisplay(true, [{ title: 'title' }]);
        expect(display.hasItemActionsSeparatedCell()).toBe(true);
    });

    it('columnScroll = false, has items', () => {
        const display = createDisplay(false, [{ title: 'title' }]);
        expect(display.hasItemActionsSeparatedCell()).toBe(false);
    });
});
