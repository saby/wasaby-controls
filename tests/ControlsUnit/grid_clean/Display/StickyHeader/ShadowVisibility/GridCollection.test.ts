import Collection from 'Controls/_grid/display/Collection';
import { RecordSet } from 'Types/collection';
/**
 * TODO: регистрация Controls/grid:GridDataRow находится именно в библиотеке,
 * и некоторые тесты этим пользуются
 */
import 'Controls/grid';

describe('Controls/grid_clean/Display/StickyHeader/ShadowVisibility', () => {
    const items = new RecordSet({
        rawData: [
            { id: 1, col: 'col1', group: 'group-1' },
            { id: 2, col: 'col2', group: 'group-1' },
            { id: 3, col: 'col3', group: 'group-2' },
            { id: 4, col: 'col4', group: 'group-2' },
        ],
        keyProperty: 'id',
    });
    let collection;

    it('has more data to up and sticky items', () => {
        collection = new Collection({
            collection: items,
            keyProperty: 'id',
            columns: [{ displayProperty: 'col' }],
            hasMoreData: { up: true, down: false },
            stickyHeader: true,
            groupProperty: 'group',
        });

        expect(collection.at(0).getShadowVisibility()).toEqual('initial');
    });

    it('has more data to up and not sticky items', () => {
        collection = new Collection({
            collection: items,
            keyProperty: 'id',
            columns: [{ displayProperty: 'col' }],
            hasMoreData: { up: true, down: false },
            stickyHeader: false,
            groupProperty: 'group',
        });

        expect(collection.at(0).getShadowVisibility()).toEqual('visible');
    });

    it('not has more data to up and sticky items', () => {
        collection = new Collection({
            collection: items,
            keyProperty: 'id',
            columns: [{ displayProperty: 'col' }],
            hasMoreData: { up: false, down: false },
            stickyHeader: true,
            groupProperty: 'group',
        });

        expect(collection.at(0).getShadowVisibility()).toEqual('visible');
    });
});
