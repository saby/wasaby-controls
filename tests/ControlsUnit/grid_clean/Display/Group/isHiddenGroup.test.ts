import { RecordSet } from 'Types/collection';
import { GridGroupRow, GridCollection } from 'Controls/grid';
import { CssClassesAssert } from 'ControlsUnit/CustomAsserts';

const rawData = [
    { key: 1, col1: 'c1-1', col2: 'с2-1', group: 'CONTROLS_HIDDEN_GROUP' },
    { key: 2, col1: 'c1-2', col2: 'с2-2', group: 'g1' },
    { key: 3, col1: 'c1-3', col2: 'с2-3', group: 'CONTROLS_HIDDEN_GROUP' },
    { key: 4, col1: 'c1-4', col2: 'с2-4', group: 'g1' },
];
const columns = [{ displayProperty: 'col1' }, { displayProperty: 'col2' }];

describe('Controls/grid_clean/Display/GroupRow/HasStickyGroup', () => {
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

    it('Hidden groups should not have controls-Grid__row class', () => {
        const gridCollection = new GridCollection({
            collection,
            keyProperty: 'key',
            groupProperty: 'group',
            stickyHeader: true,
            columns,
        });
        const hiddenGroup: GridGroupRow<any> = gridCollection.at(
            0
        ) as undefined as GridGroupRow<any>;

        expect(hiddenGroup.isHiddenGroup()).toBe(true);

        CssClassesAssert.notInclude(
            hiddenGroup.getItemClasses({ style: 'default', theme: 'default' }),
            [
                'controls-ListView__group',
                'controls-Grid__row',
                'controls-Grid__row_default_theme-default',
            ]
        );
    });
});
