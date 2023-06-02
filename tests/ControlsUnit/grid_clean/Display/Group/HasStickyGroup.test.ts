import { RecordSet } from 'Types/collection';
import { GridCollection, GridDataRow } from 'Controls/grid';

const rawData = [
    { key: 1, col1: 'c1-1', col2: 'с2-1', group: 'g1' },
    { key: 2, col1: 'c1-2', col2: 'с2-2', group: 'g1' },
    { key: 3, col1: 'c1-3', col2: 'с2-3', group: 'g1' },
    { key: 4, col1: 'c1-4', col2: 'с2-4', group: 'g1' },
];
const columns = [{ displayProperty: 'col1' }, { displayProperty: 'col2' }];

describe('Controls/grid_clean/Display/StickyGroup/HasStickyGroup', () => {
    let collection: RecordSet;
    beforeEach(() => {
        collection = new RecordSet({
            rawData,
            keyProperty: 'key',
        });
    });

    afterEach(() => {
        collection = undefined;
    });

    it('Initialize with stickyHeader and groups', () => {
        const gridCollection = new GridCollection({
            collection,
            keyProperty: 'key',
            groupProperty: 'group',
            stickyHeader: true,
            columns,
        });
        gridCollection.each((item) => {
            if (item.LadderSupport) {
                expect(item.hasStickyGroup()).toBe(true);
            }
        });
    });
    it('Initialize without stickyHeader and with groups', () => {
        const gridCollection = new GridCollection({
            collection,
            keyProperty: 'key',
            groupProperty: 'group',
            columns,
        });
        gridCollection.each((item) => {
            if (item.LadderSupport) {
                expect(item.hasStickyGroup()).not.toBe(true);
            }
        });
    });
    it('Initialize with stickyHeader and without groups', () => {
        const gridCollection = new GridCollection({
            collection,
            keyProperty: 'key',
            stickyHeader: true,
            columns,
        });
        gridCollection.each((item) => {
            if (item.LadderSupport) {
                expect(item.hasStickyGroup()).not.toBe(true);
            }
        });
    });
    it('Initialize without stickyHeader and groups', () => {
        const gridCollection = new GridCollection({
            collection,
            keyProperty: 'key',
            columns,
        });
        gridCollection.each((item) => {
            if (item.LadderSupport) {
                expect(item.hasStickyGroup()).not.toBe(true);
            }
        });
    });

    it('updateHasStickyGroup', () => {
        const gridCollection = new GridCollection({
            collection,
            keyProperty: 'key',
            stickyHeader: true,
            columns,
        });

        expect(gridCollection.getVersion()).toBe(0);

        gridCollection.getViewIterator().each((item: GridDataRow<any>) => {
            if (item.LadderSupport) {
                jest.spyOn(item, 'setHasStickyGroup').mockClear();
            }
        });

        gridCollection.setGroupProperty('group');

        expect(gridCollection.getVersion()).toBe(2);
        gridCollection.getViewIterator().each((item: GridDataRow<any>) => {
            if (item.LadderSupport) {
                expect(item.setHasStickyGroup).toHaveBeenCalledTimes(1);
                expect(item.setHasStickyGroup.mock.calls[0][0]).toBe(true);
            }
        });

        jest.restoreAllMocks();
    });
});
