import { SearchGridCollection } from 'Controls/searchBreadcrumbsGrid';
import getRecordSet from 'ControlsUnit/searchBreadcrumbsGrid/display/getRecordSet';
import { CssClassesAssert } from 'ControlsUnit/CustomAsserts';

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

    describe('getTemplate', () => {
        it('getTemplate', () => {
            const cell = searchGridCollection.at(0).getColumns()[0];
            expect(cell.getTemplate()).toEqual(
                'Controls/searchBreadcrumbsGrid:SearchBreadcrumbsItemTemplate'
            );
        });
    });

    describe('getWrapperClasses', () => {
        it('getWrapperClasses', () => {
            const cell = searchGridCollection.at(0).getColumns()[0];
            expect(
                cell
                    .getWrapperClasses()
                    .includes(
                        'controls-TreeGrid__row__searchBreadCrumbs' +
                            ' js-controls-ListView__notEditable controls-hover-background-default'
                    )
            ).toBe(true);
        });
    });

    describe('getContentClasses', () => {
        it('getContentClasses', () => {
            const expected =
                'controls-Grid__row-cell__content controls-Grid__row-cell__content_colspaned' +
                ' controls-Grid__cell_spacingLastCol_default controls-Grid__row-cell_rowSpacingTop_default' +
                ' controls-Grid__row-cell_rowSpacingBottom_default controls-Grid__cell_spacingFirstCol_default' +
                ' controls-hover-background-default';
            const cell = searchGridCollection.at(0).getColumns()[0];
            CssClassesAssert.isSame(cell.getContentClasses('default', 'default'), expected);
        });
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
