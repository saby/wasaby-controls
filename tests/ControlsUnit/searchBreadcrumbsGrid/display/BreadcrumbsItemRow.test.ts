import { SearchGridCollection } from 'Controls/searchBreadcrumbsGrid';
import getRecordSet from 'ControlsUnit/searchBreadcrumbsGrid/display/getRecordSet';

describe('Controls/_searchBreadcrumbsGrid/display/BreadcrumbsItemRow', () => {
    let searchGridCollection;

    beforeEach(() => {
        searchGridCollection = new SearchGridCollection({
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
    });

    describe('getCellTemplate', () => {
        it('getCellTemplate', () => {
            const item = searchGridCollection.at(0);
            expect(item.getCellTemplate()).toEqual(
                'Controls/searchBreadcrumbsGrid:SearchBreadcrumbsItemTemplate'
            );
        });
    });

    describe('getLevel', () => {
        it('getLevel', () => {
            const item = searchGridCollection.at(0);
            expect(item.getLevel()).toEqual(1);
        });
    });

    describe('getTemplate', () => {
        it('getTemplate', () => {
            const item = searchGridCollection.at(0);
            expect(item.getTemplate()).toEqual('Controls/grid:ItemTemplate');
        });
    });

    describe('getParent', () => {
        it('getParent', () => {
            const item = searchGridCollection.at(0);
            expect(item.getParent().isRoot()).toBe(true);
        });
    });

    describe('colspan', () => {
        it('default', () => {
            const item = searchGridCollection.at(0);
            expect(item.getColumnsCount()).toEqual(1);
        });

        it('hasColumnScroll', () => {
            searchGridCollection = new SearchGridCollection({
                collection: getRecordSet(),
                root: null,
                keyProperty: 'id',
                parentProperty: 'parent',
                nodeProperty: 'node',
                columnScroll: true,
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
            const item = searchGridCollection.at(0);
            expect(item.getColumnsCount()).toEqual(2);
        });
    });

    describe('isRoot', () => {
        it('can not be root', () => {
            const item = searchGridCollection.at(0);
            expect(item.isRoot()).toBe(false);
        });
    });

    describe('isGroupNode', () => {
        it('can not be group node', () => {
            const item = searchGridCollection.at(0);
            expect(item.GroupNodeItem).toBeUndefined();
        });
    });
});
