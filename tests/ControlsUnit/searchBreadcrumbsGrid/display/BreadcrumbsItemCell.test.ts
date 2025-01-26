import { SearchGridCollection } from 'Controls/searchBreadcrumbsGrid';
import getRecordSet from 'ControlsUnit/searchBreadcrumbsGrid/display/getRecordSet';

describe('Controls/_searchBreadcrumbsGrid/display/BreadcrumbsItemCell', () => {
    const editArrowVisibilityCallback = (item) => {
        return item.get('node');
    };

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
        editArrowVisibilityCallback,
    });

    describe('shouldDisplayEditArrow', () => {
        it('shouldDisplayEditArrow', () => {
            const cell = searchGridCollection.at(0).getColumns()[0];
            expect(cell.shouldDisplayEditArrow()).toBe(true);
        });
        it('shouldDisplayEditArrow should not return true when custom contentTemplate is set', () => {
            const cell = searchGridCollection.at(0).getColumns()[0];
            expect(
                cell.shouldDisplayEditArrow(() => {
                    return '';
                })
            ).toBe(false);
        });
    });
});
