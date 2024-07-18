import { IItemsStrategy } from 'Controls/display';
import { Tree, TreeItem } from 'Controls/baseTree';
import { CollectionItem, PseudoParentStrategy } from 'Controls/expandedCompositeTree';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';

function createRecord(id: string, node: boolean, parent: string): Model {
    return new Model({
        keyProperty: 'id',
        rawData: { id, node, parent },
    });
}

function createItem(id: string, node: boolean, parent: TreeItem | string): TreeItem {
    return new TreeItem({
        nodeProperty: 'node',
        parent: (parent as TreeItem).key ? (parent as TreeItem) : undefined,
        contents: createRecord(
            id,
            node,
            (parent as TreeItem).key ? (parent as TreeItem).key : parent
        ),
    });
}

describe('Controls/ExpandedCompositeTree/PseudoParentStrategy', () => {
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
                const collectionItemsToAdd = added.map((contents) => {
                    const parent = items.find((it) => it.key === contents.get('parent')) || null;
                    return new TreeItem({
                        nodeProperty: 'node',
                        parent,
                        contents,
                    });
                });
                return items.splice(start, deleteCount, ...collectionItemsToAdd);
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
    let strategy: PseudoParentStrategy<Model, CollectionItem<Model>>;
    let display: Tree<Model, CollectionItem>;

    beforeEach(() => {
        display = new Tree({
            collection: new RecordSet({
                keyProperty: 'id',
                rawData: [],
            }),
            root: null,
            keyProperty: 'id',
            parentProperty: 'parent',
            nodeProperty: 'node',
        });

        // Создадим стратегию с элементами без родителя
        items = [];
        items.push(createItem('Ad', null, 'A'));
        items.push(createItem('Ae', null, 'A'));
        items.push(createItem('Af', null, 'A'));

        source = getSource(items, { display });
        strategy = new PseudoParentStrategy({
            source,
            display,
        });
    });

    afterEach(() => {
        items = undefined;
        source = undefined;
        strategy = undefined;
    });

    describe('.items', () => {
        // Ожидаем, что при создании добавился псевдо родитель
        it('should have pseudo parent element', () => {
            const expected = ['A', 'Ad', 'Ae', 'Af'];

            strategy.items.forEach((item, index) => {
                expect(item.key).toEqual(expected[index]);
            });

            expect(strategy.items.length).toBe(expected.length);
        });
    });

    describe('.count', () => {
        it('should return items count', () => {
            expect(strategy.count).toEqual(4);
        });
    });

    describe('.getDisplayIndex()', () => {
        it('should return index in projection', () => {
            const expected = [1, 2, 3];
            items.forEach((item, index) => {
                expect(strategy.getDisplayIndex(index)).toEqual(expected[index]);
            });
        });
    });

    describe('.getCollectionIndex()', () => {
        it('should return index in collection', () => {
            const expected = [-1, 0, 1, 2];
            strategy.items.forEach((item, index) => {
                expect(strategy.getCollectionIndex(index)).toEqual(expected[index]);
            });
        });
    });

    describe('.splice()', () => {
        // Ожидаем, что добавился реальный родитель, а псевдо родитель удалился
        it('should add items and remove pseudo parent', () => {
            // init order
            const items = strategy.items;

            const newItems = [];
            newItems.push(createRecord('A', true, null));
            newItems.push(createRecord('Aa', null, 'A'));
            newItems.push(createRecord('Ab', null, 'A'));
            newItems.push(createRecord('Ac', null, 'A'));
            const expected = ['A', 'Aa', 'Ab', 'Ac', 'Ad', 'Ae', 'Af'];

            strategy.splice(0, 0, newItems as any);

            strategy.items.forEach((item, index) => {
                expect(item.key).toEqual(expected[index]);
            });

            expect(strategy.items.length).toBe(expected.length);

            expect(items[0].contents).not.toEqual(strategy.items[0].contents);
        });
    });
});
