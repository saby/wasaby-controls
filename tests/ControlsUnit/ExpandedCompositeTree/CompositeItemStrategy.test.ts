import { IItemsStrategy } from 'Controls/display';
import { TreeItem } from 'Controls/baseTree';
import {
    Collection,
    CollectionItem,
    CompositeCollectionItem,
    CompositeItemStrategy,
} from 'Controls/expandedCompositeTree';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';

// Данные

/*
    A
    AA
       AAA
       AAa
    Aa
    B
    Ba
    a
*/

const compositeViewConfig = {
    itemPadding: {
        left: 's',
        right: 's',
    },
};

function createItem(id: string, node: boolean, parent: TreeItem): TreeItem {
    return new TreeItem({
        nodeProperty: 'node',
        parent,
        contents: new Model({
            keyProperty: 'id',
            rawData: { id, node, parent: parent.key },
        }),
    });
}

describe('Controls/ExpandedCompositeTree/CompositeItem', () => {
    function getSource<T>(items: T[], options: object = {}): IItemsStrategy<T, T> {
        return {
            '[Controls/_display/IItemsStrategy]': true,
            options,
            source: null,
            get count(): number {
                return items.length;
            },
            get items(): T[] {
                return items.slice();
            },
            at(index: number): T {
                return items[index];
            },
            getDisplayIndex(index: number): number {
                return index;
            },
            getCollectionIndex(index: number): number {
                return index;
            },
            splice(start: number, deleteCount: number, added?: any[]): T[] {
                return items.splice(start, deleteCount, ...added);
            },
            invalidate(): void {
                // always up to date
            },
            reset(): void {
                items.length = 0;
            },
        };
    }

    let items: TreeItem<Model>[];
    let source: IItemsStrategy<any, TreeItem<any>>;
    let strategy: CompositeItemStrategy<Model, CompositeCollectionItem<Model>>;
    let display: Collection<Model, CollectionItem>;

    beforeEach(() => {
        display = new Collection({
            collection: new RecordSet({
                keyProperty: 'id',
                rawData: [
                    {
                        id: 'A',
                        node: true,
                        parent: null,
                    },
                    {
                        id: 'AA',
                        node: true,
                        parent: 'A',
                    },
                    {
                        id: 'AAA',
                        node: true,
                        parent: 'AA',
                    },
                    {
                        id: 'AAa',
                        node: null,
                        parent: 'AA',
                    },
                    {
                        id: 'Aa',
                        node: null,
                        parent: 'A',
                    },
                    {
                        id: 'B',
                        node: true,
                        parent: null,
                    },
                    {
                        id: 'Ba',
                        node: null,
                        parent: 'B',
                    },
                    {
                        id: 'a',
                        node: null,
                        parent: null,
                    },
                ],
            }),
            root: null,
            keyProperty: 'id',
            parentProperty: 'parent',
            nodeProperty: 'node',
            compositeViewConfig,
            compositeNodesLevel: 3,
        });

        // Комопзитный список строят по трёхуровневой иерархии.
        items = [];
        items.push(createItem('A', true, display.getRoot()));
        items.push(createItem('AA', true, items[0]));
        items.push(createItem('AAA', true, items[1]));
        items.push(createItem('AAa', null, items[1]));
        items.push(createItem('Aa', null, items[0]));
        items.push(createItem('B', true, display.getRoot()));
        items.push(createItem('Ba', null, items[5]));
        items.push(createItem('a', null, display.getRoot()));

        source = getSource(items, { display });
        strategy = new CompositeItemStrategy({
            source,
            display,
        });
    });

    afterEach(() => {
        items = undefined;
        source = undefined;
        strategy = undefined;
    });

    describe('.options', () => {
        it('should return the source options', () => {
            expect(strategy.options).toBe(source.options);
        });
    });

    describe('.items', () => {
        it('should add RootSeparator items at the levels 1 and 0', () => {
            strategy = new CompositeItemStrategy({
                source,
                display,
            });
            const expected = [
                'A',
                'AA',
                'composite-item-nodes-AA',
                'composite-item-leaves-AA',
                'AAA',
                'AAa',
                'root-separator-A',
                'composite-item-leaves-A',
                'Aa',
                'B',
                'composite-item-leaves-B',
                'Ba',
                'root-separator',
                'composite-item-leaves-null',
                'a',
            ];

            strategy.items.forEach((item, index) => {
                expect(item.key).toEqual(expected[index]);
            });

            expect(strategy.items.length).toBe(expected.length);
        });
    });

    describe('.count', () => {
        it('should return items count', () => {
            expect(strategy.count).toEqual(15);
        });
    });

    describe('.getDisplayIndex()', () => {
        it('should return index in projection', () => {
            const expected = [0, 1, 4, 5, 8, 9, 11, 14];
            items.forEach((item, index) => {
                expect(strategy.getDisplayIndex(index)).toEqual(expected[index]);
            });
        });
    });

    describe('.getCollectionIndex()', () => {
        it('should return index in collection', () => {
            const expected = [0, 1, -1, -1, 2, 3, -1, -1, 4, 5, -1, 6, -1, -1, 7];
            strategy.items.forEach((item, index) => {
                expect(strategy.getCollectionIndex(index)).toEqual(expected[index]);
            });
        });
    });

    describe('.splice()', () => {
        it('should add items after separator', () => {
            source = getSource(items, { display });
            strategy = new CompositeItemStrategy({
                source: source as any,
                display,
            });

            const newItems = [createItem('Ab', null, items[1])];
            const at = 5;
            const expected = [
                'A',
                'AA',
                'composite-item-nodes-AA',
                'composite-item-leaves-AA',
                'AAA',
                'AAa',
                'root-separator-A',
                'composite-item-leaves-A',
                'Aa',
                'Ab',
                'B',
                'composite-item-leaves-B',
                'Ba',
                'root-separator',
                'composite-item-leaves-null',
                'a',
            ];

            strategy.splice(at, 0, newItems as any);

            strategy.items.forEach((item, index) => {
                expect(item.key).toEqual(expected[index]);
            });

            expect(strategy.items.length).toBe(expected.length);
        });

        it('should add one more separator', () => {
            source = getSource(items, { display });
            strategy = new CompositeItemStrategy({
                source: source as any,
                display,
            });

            const newItems = [createItem('BB', true, items[6])];
            const at = 6;
            const expected = [
                'A',
                'AA',
                'composite-item-nodes-AA',
                'composite-item-leaves-AA',
                'AAA',
                'AAa',
                'root-separator-A',
                'composite-item-leaves-A',
                'Aa',
                'B',
                'BB',
                'composite-item-leaves-B',
                'Ba',
                'root-separator',
                'composite-item-leaves-null',
                'a',
            ];

            strategy.splice(at, 0, newItems as any);

            strategy.items.forEach((item, index) => {
                expect(item.key).toEqual(expected[index]);
            });

            expect(strategy.items.length).toBe(expected.length);
        });

        it('should remove separator when remove leaf', () => {
            const strategy = new CompositeItemStrategy({
                source,
                display,
            });

            // Aa
            const at = 4;
            const sourceRemoveCount = 1;
            const removeCount = 1;
            const expected = [
                'A',
                // Стратегия по умолчанию смещает наверх,
                // т.к. нет листов для композитного, но вроде вообще надо удалять
                'composite-item-leaves-A',
                'AA',
                'composite-item-nodes-AA',
                'composite-item-leaves-AA',
                'AAA',
                'AAa',
                'B',
                'composite-item-leaves-B',
                'Ba',
                'root-separator',
                'composite-item-leaves-null',
                'a',
            ];

            const sourceCount = source.count;

            // считаем число записей до удаления, заодно инициализируем сортер стратегии
            expect(strategy.count).toBe(15);

            strategy.splice(at, removeCount, []);

            expect(source.count).toBe(sourceCount - sourceRemoveCount);

            expect(strategy.count).toBe(expected.length);

            strategy.items.forEach((item, index) => {
                expect(item.key).toEqual(expected[index]);
            });
        });

        it('should remove separator when remove node', () => {
            const strategy = new CompositeItemStrategy({
                source,
                display,
            });

            // AA
            const at = 1;

            // AA + AAA
            const sourceRemoveCount = 4;
            const removeCount = 4;
            const expected = [
                'A',
                'composite-item-leaves-A',
                'B',
                'composite-item-leaves-B',
                'Ba',
                'root-separator',
                'composite-item-leaves-null',
                'a',
            ];

            const sourceCount = source.count;

            // считаем число записей до удаления, заодно инициализируем сортер стратегии
            expect(strategy.count).toBe(15);

            strategy.splice(at, removeCount, []);

            expect(source.count).toBe(sourceCount - sourceRemoveCount);

            expect(strategy.count).toBe(expected.length);

            strategy.items.forEach((item, index) => {
                expect(item.key).toEqual(expected[index]);
            });
        });

        it('should remove root separator', () => {
            const strategy = new CompositeItemStrategy({
                source,
                display,
            });

            // AA
            const at = 7;

            // AA + AAA
            const sourceRemoveCount = 1;
            const removeCount = 1;
            const expected = [
                'A',
                'AA',
                'composite-item-nodes-AA',
                'composite-item-leaves-AA',
                'AAA',
                'AAa',
                // Стратегия по умолчанию смещает наверх,
                // т.к. нет листов для композитного, но вроде вообще надо удалять
                'composite-item-leaves-null',
                'root-separator-A',
                'composite-item-leaves-A',
                'Aa',
                'B',
                'composite-item-leaves-B',
                'Ba',
            ];

            const sourceCount = source.count;

            // считаем число записей до удаления, заодно инициализируем сортер стратегии
            expect(strategy.count).toBe(15);

            strategy.splice(at, removeCount, []);

            expect(source.count).toBe(sourceCount - sourceRemoveCount);

            expect(strategy.count).toBe(expected.length);

            strategy.items.forEach((item, index) => {
                expect(item.key).toEqual(expected[index]);
            });
        });
    });
});
