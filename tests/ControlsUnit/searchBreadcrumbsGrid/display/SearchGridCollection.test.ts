import {
    BreadcrumbsItemRow,
    SearchGridCollection,
    SearchSeparatorRow,
} from 'Controls/searchBreadcrumbsGrid';
import getRecordSet from './getRecordSet';
import BreadcrumbsItemCell from 'Controls/_searchBreadcrumbsGrid/display/BreadcrumbsItemCell';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { IOptions } from 'Controls/_searchBreadcrumbsGrid/display/SearchGridCollection';

describe('Controls/_searchBreadcrumbsGrid/display/SearchGridCollection', () => {
    function createCollectionForTest(options?: IOptions): SearchGridCollection {
        const defaultOptions = {
            collection: getRecordSet(),
            root: null,
            keyProperty: 'id',
            parentProperty: 'parent',
            nodeProperty: 'node',
            displayProperty: 'collection display property',
            breadCrumbsMode: 'cell',
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
        };

        return new SearchGridCollection({
            ...defaultOptions,
            ...options,
        });
    }

    const searchGridCollection = createCollectionForTest();

    describe('getSearchBreadcrumbsItemTemplate', () => {
        it('return default value', () => {
            expect(searchGridCollection.getSearchBreadcrumbsItemTemplate()).toEqual(
                'Controls/searchBreadcrumbsGrid:SearchBreadcrumbsItemTemplate'
            );
        });

        it('return custom value', () => {
            const searchBreadCrumbsItemTemplate = 'custom search breadcrumbs item template';
            const collection = createCollectionForTest({
                searchBreadCrumbsItemTemplate,
            });

            expect(collection.getSearchBreadcrumbsItemTemplate()).toEqual(
                searchBreadCrumbsItemTemplate
            );
        });
    });

    describe('createBreadcrumbsItem', () => {
        it('createBreadcrumbsItem', () => {
            const item = searchGridCollection.createBreadcrumbsItem({});
            expect(item).toBeInstanceOf(BreadcrumbsItemRow);
        });

        it('Breadcrumbs display property', () => {
            const item = searchGridCollection.at(0) as unknown as BreadcrumbsItemRow;
            expect(item).toBeInstanceOf(BreadcrumbsItemRow);

            const breadcrumbsCell = item.getColumns()[0];
            expect(breadcrumbsCell.getDisplayProperty() === 'collection display property').toBe(
                true
            );
        });

        it('BreadCrumbsMode', () => {
            const item = searchGridCollection.at(0) as unknown as BreadcrumbsItemRow;
            expect(item).toBeInstanceOf(BreadcrumbsItemRow);

            const breadcrumbsCell = item.getColumns()[0] as BreadcrumbsItemCell<
                Model,
                BreadcrumbsItemRow
            >;
            // Проверяем что опция breadCrumbsMode прокинулась из родительской коллекции до ячейки
            expect('cell').toEqual(breadcrumbsCell.getBreadCrumbsMode());
        });

        it('searchBreadCrumbsItemTemplate', () => {
            const searchBreadCrumbsItemTemplate = 'custom search breadcrumbs item template';
            const collection = createCollectionForTest({
                searchBreadCrumbsItemTemplate,
            });

            const item = collection.at(0) as unknown as BreadcrumbsItemRow;
            expect(item).toBeInstanceOf(BreadcrumbsItemRow);

            const breadcrumbsCell = item.getColumns()[0];
            expect(breadcrumbsCell.getTemplate()).toEqual(searchBreadCrumbsItemTemplate);
        });

        it('multiSelectAccessibilityProperty', () => {
            const collection = createCollectionForTest({
                multiSelectAccessibilityProperty: 'multiSelectAccessibility',
            });
            expect(collection.getItemBySourceKey(1).isReadonlyCheckbox()).toBe(true);
        });
    });

    describe('createRootSeparator', () => {
        it('createRootSeparator', () => {
            const item = searchGridCollection.createRootSeparator({});
            expect(item).toBeInstanceOf(SearchSeparatorRow);
        });
    });

    it('setRoot', () => {
        const items = new RecordSet({
            rawData: [
                { key: 11, parent: 1, type: null },
                { key: 12, parent: 1, type: null },
                { key: 13, parent: 1, type: null },
                { key: 14, parent: 1, type: null },
                { key: 15, parent: 1, type: null },
            ],
            keyProperty: 'key',
        });
        const collection = createCollectionForTest({
            collection: items,
            root: 1,
        });
        expect(collection).toBeDefined();
        expect(collection.setRoot.bind(collection, null)).not.toThrow();
    });

    it('Should create results when root contains single item', () => {
        // При наличии в корне единственного узла (даже если он развернут и у него есть дочерние элементы) - не
        // должны создаваться results.
        const treeGridCollection = new SearchGridCollection({
            collection: new RecordSet({
                rawData: [
                    { key: 1, parent: null, type: true },
                    { key: 2, parent: 1, type: true },
                    { key: 3, parent: 2, type: null },
                ],
                keyProperty: 'key',
            }),
            resultsPosition: 'top',
            keyProperty: 'key',
            parentProperty: 'parent',
            nodeProperty: 'type',
            multiSelectVisibility: 'visible',
            columns: [{}],
            expandedItems: [null],
            root: null,
        });

        expect(treeGridCollection.getResults()).toBeDefined();
    });

    it('not should throw error when update breadcrumbs contents after remove', () => {
        const items = new RecordSet({
            rawData: [
                { key: 1, parent: null, type: true, value: 1 },
                { key: 11, parent: 1, type: null },
                { key: 2, parent: null, type: true },
                { key: 22, parent: 2, type: null },
            ],
            keyProperty: 'key',
        });
        const collection = new SearchGridCollection({
            collection: items,
            keyProperty: 'key',
            parentProperty: 'parent',
            nodeProperty: 'type',
            columns: [{}],
            root: null,
        });

        items.remove(items.getRecordById(11));

        const newItems = new RecordSet({
            rawData: [{ key: 1, parent: null, type: true, value: 2 }],
            keyProperty: 'key',
        });
        items.merge(newItems, { remove: false, add: false });

        expect(collection.getCount()).toEqual(3);
    });

    describe('parent', () => {
        it('should recalculate collection when changed hierarchy', () => {
            /*
            [1]
               11
            [2]
               21
          */
            const items = new RecordSet({
                rawData: [
                    { key: 1, parent: null, node: true },
                    { key: 11, parent: 1, node: null },
                    { key: 2, parent: null, node: true },
                    { key: 21, parent: 2, node: null, value: 123 },
                ],
                keyProperty: 'key',
            });
            const collection = new SearchGridCollection({
                collection: items,
                keyProperty: 'key',
                parentProperty: 'parent',
                nodeProperty: 'node',
                columns: [{}],
                root: null,
            });

            items.setEventRaising(false, true);
            const movedItem = items.getRecordById(21);
            items.getRecordById(21).set('pid', 1);
            movedItem.merge(
                new Model({
                    rawData: { key: 21, parent: 1, node: null, value: 0 },
                    keyProperty: 'key',
                })
            );
            items.setEventRaising(true, true);

            // лениво инициализируем создание всех элементов
            collection.getItems();
            const item = collection.getItemBySourceKey(21);
            const parent = item.getParent();
            expect(parent.getContents()[0].getKey()).toEqual(1);
        });
    });

    describe('recount expander state', () => {
        it('not throw error on recount', () => {
            const collection = createCollectionForTest({
                header: [
                    { startColumn: 1, endColumn: 2 },
                    { startColumn: 2, endColumn: 3 },
                ],
            });

            const rs = collection.getSourceCollection() as RecordSet;
            rs.add(
                new Model({
                    rawData: { id: 77, hasChildren: false, node: true, pid: 0 },
                })
            );
            expect(collection.hasNode.bind(collection)).not.toThrow();
        });
    });
});
