import { SearchGridCollection } from 'Controls/searchBreadcrumbsGrid';
import getRecordSet from 'ControlsUnit/searchBreadcrumbsGrid/display/getRecordSet';

describe('Controls/_searchBreadcrumbsGrid/display/SearchGridDataRow', () => {
    const searchGridCollection = new SearchGridCollection({
        collection: getRecordSet(),
        root: null,
        keyProperty: 'id',
        parentProperty: 'parent',
        nodeProperty: 'node',
        columns: [
            {
                displayProperty: 'title',
                width: '300px',
                template: 'wml!template1',
            },
            {
                displayProperty: 'taxBase',
                width: '200px',
                template: 'wml!template1',
            },
        ],
    });

    describe('getWrapperClasses', () => {
        it('getWrapperClasses', () => {
            const item = searchGridCollection.at(5);
            const classes = item.getWrapperClasses();
            expect(classes.includes('controls-TreeGrid__row-rootLeaf')).toBe(
                false
            );
        });
    });
});
