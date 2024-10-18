import { CrudEntityKey } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { TreeGridCollection } from 'Controls/treeGrid';

interface IData {
    key: CrudEntityKey;
    parent: CrudEntityKey;
    type: boolean;
    nodeType?: string;
}

describe('Controls/treeGrid_clean/Display/Grid/getResults', () => {
    let rawData: IData[];

    beforeEach(() => {
        rawData = [
            { key: 1, parent: null, type: true },
            { key: 2, parent: 1, type: true },
            { key: 3, parent: 1, type: null },
        ];
    });

    describe('_resultsIsVisible', () => {
        it('resultsVisibility=hasdata, should not create results when root contains single item', () => {
            // При наличии в корне единственного узла (даже если он развернут и у него есть дочерние элементы) - не
            // должны создаваться results.
            const treeGridCollection = new TreeGridCollection({
                collection: new RecordSet({
                    rawData,
                    keyProperty: 'key',
                }),
                resultsPosition: 'top',
                keyProperty: 'key',
                parentProperty: 'parent',
                nodeProperty: 'type',
                resultsVisibility: 'hasdata',
                multiSelectVisibility: 'visible',
                columns: [{}],
                expandedItems: [null],
                root: null,
                nodeTypeProperty: 'nodeType',
            });

            expect(treeGridCollection.getResults()).toBeUndefined();
        });

        it('resultsVisibility=hasdata, Should create results when root contains single groupNode item', () => {
            // При наличии в корне единственного узла в виде группы если у него есть дочерние элементы
            // должны создаваться results.
            rawData[0].nodeType = 'group';
            const treeGridCollection = new TreeGridCollection({
                collection: new RecordSet({
                    rawData,
                    keyProperty: 'key',
                }),
                resultsPosition: 'top',
                keyProperty: 'key',
                parentProperty: 'parent',
                nodeProperty: 'type',
                resultsVisibility: 'hasdata',
                multiSelectVisibility: 'visible',
                columns: [{}],
                expandedItems: [null],
                root: null,
                nodeTypeProperty: 'nodeType',
            });

            expect(treeGridCollection.getResults()).toBeDefined();
        });

        it('resultsVisibility=visible, should create results when root contains no items', () => {
            const treeGridCollection = new TreeGridCollection({
                collection: new RecordSet({
                    rawData: [],
                    keyProperty: 'key',
                }),
                resultsPosition: 'top',
                keyProperty: 'key',
                parentProperty: 'parent',
                nodeProperty: 'type',
                resultsVisibility: 'visible',
                multiSelectVisibility: 'visible',
                columns: [{}],
                expandedItems: [null],
                root: null,
                nodeTypeProperty: 'nodeType',
            });

            expect(treeGridCollection.getResults()).toBeDefined();
        });
    });



    describe('expanderPosition', () => {
        it('should set expanderPosition on init', () => {
            const treeGridCollection = new TreeGridCollection({
                collection: new RecordSet({
                    rawData: [],
                    keyProperty: 'key',
                }),
                resultsPosition: 'top',
                keyProperty: 'key',
                parentProperty: 'parent',
                nodeProperty: 'type',
                resultsVisibility: 'visible',
                multiSelectVisibility: 'visible',
                columns: [{}],
                expandedItems: [null],
                root: null,
                nodeTypeProperty: 'nodeType',
                expanderPosition: 'custom'
            });

            const results = treeGridCollection.getResults();

            expect(results.getExpanderPosition()).toBe('custom');
        });
    });
});
