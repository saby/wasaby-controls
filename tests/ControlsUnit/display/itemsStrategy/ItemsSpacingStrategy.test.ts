/* eslint-disable no-magic-numbers */
import { Model } from 'Types/entity';
import { List, RecordSet } from 'Types/collection';
import Abstract from 'Controls/_display/Abstract';
import Direct from 'Controls/_display/itemsStrategy/Direct';
import IItemsStrategy from 'Controls/_display/IItemsStrategy';
import Composer from 'Controls/_display/itemsStrategy/Composer';
import { Collection, groupConstants } from 'Controls/display';
import { SpaceCollectionItem } from 'Controls/display';
import ItemsSpacingStrategy from 'Controls/_display/itemsStrategy/ItemsSpacingStrategy';
import GroupItem from 'Controls/_display/GroupItem';
import CollectionItem from 'Controls/_display/CollectionItem';

class TestCollection extends Abstract<string, string> {
    createItem(options: { contents: string }): string {
        return options.contents;
    }
}

describe('Controls/_display/itemsStrategy/ItemsSpacingStrategy', () => {
    describe('clean tests', () => {
        function createStrategy(itemsCount: number): IItemsStrategy<string, string> {
            const items: Record<string, string>[] = [];

            for (let i = 0; i < itemsCount; i++) {
                items.push({
                    key: `item-${i + 1}`,
                });
            }

            const composer = new Composer<string, string>();
            composer.append(Direct, {
                display: new TestCollection({
                    collection: new List({ items }),
                }),
            });
            composer.append(ItemsSpacingStrategy, {
                enabled: true,
                spaceItemFactory: (item) => {
                    return { key: `space-${item.key}` };
                },
            });

            return composer.getResult();
        }

        // Проверяем что стратегия создаёт дополнительные элементы когда в коллекции больше 1 записи.
        // По одной дополнительной на каждую запись кроме первой.
        it('should create strategy items when count of source more then one', () => {
            let items: string[];
            let strategy: IItemsStrategy<string, string>;

            strategy = createStrategy(0);
            items = strategy.items;
            expect(items.length).toEqual(0);

            strategy = createStrategy(1);
            items = strategy.items;
            expect(items.length).toEqual(1);

            strategy = createStrategy(2);
            items = strategy.items;
            expect(items.length).toEqual(3);

            strategy = createStrategy(3);
            items = strategy.items;
            expect(items.length).toEqual(5);
        });

        // Проверяем что стратегия по индексу возвращает корректный итем
        it('get item by index', () => {
            const strategy = createStrategy(3);
            expect(strategy.at(0)).toEqual({ key: 'item-1' });
            expect(strategy.at(1)).toEqual({ key: 'space-item-2' });
            expect(strategy.at(2)).toEqual({ key: 'item-2' });
            expect(strategy.at(3)).toEqual({ key: 'space-item-3' });
            expect(strategy.at(4)).toEqual({ key: 'item-3' });
            expect(strategy.at(5)).toEqual(undefined);
        });

        it('getDisplayIndex', () => {
            const strategy = createStrategy(3);
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            strategy.items;
            expect(strategy.getDisplayIndex(0)).toEqual(0);
            expect(strategy.getDisplayIndex(1)).toEqual(2);
            expect(strategy.getDisplayIndex(2)).toEqual(4);
        });

        it('getCollectionIndex', () => {
            const strategy = createStrategy(3);
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            strategy.items;
            expect(strategy.getCollectionIndex(0)).toEqual(0);
            expect(strategy.getCollectionIndex(1)).toEqual(-1);
            expect(strategy.getCollectionIndex(2)).toEqual(1);
            expect(strategy.getCollectionIndex(3)).toEqual(-1);
            expect(strategy.getCollectionIndex(4)).toEqual(2);
            expect(strategy.getCollectionIndex(5)).toEqual(-1);
        });
    });

    describe('Collection', () => {
        function createCollection(itemsCount: number): Collection {
            const list: Record<string, number>[] = [];

            for (let i = 0; i < itemsCount; i++) {
                list.push({ key: i });
            }

            return new Collection({
                itemsSpacing: 'm',
                keyProperty: 'key',
                collection: new RecordSet({
                    rawData: list,
                    keyProperty: 'key',
                }),
            });
        }

        // Проверяем что записи-отступы создаются когда в коллекции больше 1 записи
        it('should create space item when count of records more then one', () => {
            let collection = createCollection(0);
            expect(collection.getCount()).toEqual(0);

            collection = createCollection(1);
            expect(collection.getCount()).toEqual(1);

            collection = createCollection(2);
            expect(collection.getCount()).toEqual(3);
        });

        it('should create instance of SpaceCollectionItem', () => {
            const collection = createCollection(2);
            const spaceItem = collection.at(1);
            expect(spaceItem).toBeInstanceOf(SpaceCollectionItem);
        });

        // Проверяем что при задании коллекции itemsSpacing появляются пустые записи
        it('set items spacing null -> value', () => {
            const recordSet = new RecordSet({
                keyProperty: 'id',
                rawData: [{ id: 1 }, { id: 2 }],
            });
            const collection = new Collection({
                keyProperty: 'id',
                collection: recordSet,
            });

            expect(collection.getCount()).toEqual(2);
            collection.setItemsSpacing('m');
            expect(collection.getCount()).toEqual(3);
        });

        // Проверяем что пустые итемы пропадают при сбросе itemsSpacing
        it('set items spacing value -> null', () => {
            const recordSet = new RecordSet({
                keyProperty: 'id',
                rawData: [{ id: 1 }, { id: 2 }],
            });
            const collection = new Collection({
                keyProperty: 'id',
                itemsSpacing: 'm',
                collection: recordSet,
            });

            expect(collection.getCount()).toEqual(3);
            collection.setItemsSpacing(null);
            expect(collection.getCount()).toEqual(2);
        });

        // Проверяем что при создании новой записи в режиме редактирования
        // перед ней так же создается запись отступ
        it('add edited item', () => {
            const recordSet = new RecordSet({
                rawData: [{ id: 1 }, { id: 2 }],
                keyProperty: 'id',
            });
            const collection = new Collection({
                keyProperty: 'id',
                collection: recordSet,
                itemsSpacing: 's',
            });

            const item = new Model({
                rawData: { id: 3 },
                keyProperty: 'id',
            });

            const newItem = collection.createItem({
                contents: item,
                isAdd: true,
            });

            newItem.setEditing(true, item, false);
            collection.setAddingItem(newItem, { position: 'bottom' });

            expect(collection.getCount()).toEqual(5);
        });

        describe('onCollectionChange', () => {
            it('add collection item', () => {
                const collection = createCollection(3);
                expect(collection.getCount()).toEqual(5);

                const source = collection.getSourceCollection() as unknown as RecordSet;
                source.add(
                    new Model({
                        rawData: { key: 3 },
                        keyProperty: 'key',
                    })
                );
                expect(collection.getCount()).toEqual(7);
            });

            it('remove collection item', () => {
                const collection = createCollection(3);
                expect(collection.getCount()).toEqual(5);

                const source = collection.getSourceCollection() as unknown as RecordSet;
                source.removeAt(0);
                expect(collection.getCount()).toEqual(3);
            });
        });

        describe('grouping', () => {
            // Проверяем что при создании коллекции с группировкой
            // пустые итемы создаются и перед обычными записями и перед записями групп (кроме первой)
            it('init with grouping', () => {
                const recordSet = new RecordSet({
                    keyProperty: 'id',
                    rawData: [
                        { id: 1, group: 'g1' },
                        { id: 2, group: 'g1' },
                        { id: 3, group: 'g2' },
                        { id: 4, group: 'g2' },
                    ],
                });
                const collection = new Collection({
                    itemsSpacing: 'm',
                    keyProperty: 'id',
                    groupProperty: 'group',
                    collection: recordSet,
                });
                expect(collection.getCount()).toEqual(11);
            });

            // Проверяем что при наличии скрытой группы не добавляется пустая запись
            // между скрытой группой и её первым итемом т.к. запись скрытой группы не
            // имеет высоты и отступ между неё и её первым итемом не нужен
            it('init with hidden group', () => {
                const recordSet = new RecordSet({
                    keyProperty: 'id',
                    rawData: [
                        { id: 1, group: groupConstants.hiddenGroup },
                        { id: 2, group: groupConstants.hiddenGroup },
                        { id: 3, group: 'g2' },
                        { id: 4, group: 'g2' },
                    ],
                });
                const collection = new Collection({
                    itemsSpacing: 'm',
                    keyProperty: 'id',
                    groupProperty: 'group',
                    collection: recordSet,
                });

                expect(collection.getCount()).toEqual(10);
                expect(collection.at(0)).toBeInstanceOf(GroupItem);
                expect(collection.at(1)).toBeInstanceOf(CollectionItem);
                expect(collection.at(2)).toBeInstanceOf(SpaceCollectionItem);
            });

            // Проверяем что при задании группировки на коллекции
            // для записей групп создаются пустые итемы
            it('set grouping', () => {
                const recordSet = new RecordSet({
                    keyProperty: 'id',
                    rawData: [
                        { id: 1, group: 'g1' },
                        { id: 2, group: 'g1' },
                        { id: 3, group: 'g2' },
                        { id: 4, group: 'g2' },
                    ],
                });
                const collection = new Collection({
                    itemsSpacing: 'm',
                    keyProperty: 'id',
                    collection: recordSet,
                });

                expect(collection.getCount()).toEqual(7);
                collection.setGroupProperty('group');
                expect(collection.getCount()).toEqual(11);
            });

            // Проверяем что при сбросе группировки пустые итемы для групп так же исчезают
            it('clear grouping', () => {
                const recordSet = new RecordSet({
                    keyProperty: 'id',
                    rawData: [
                        { id: 1, group: 'g1' },
                        { id: 2, group: 'g1' },
                        { id: 3, group: 'g2' },
                        { id: 4, group: 'g2' },
                    ],
                });
                const collection = new Collection({
                    itemsSpacing: 'm',
                    keyProperty: 'id',
                    groupProperty: 'group',
                    collection: recordSet,
                });

                expect(collection.getCount()).toEqual(11);
                collection.setGroupProperty(null);
                expect(collection.getCount()).toEqual(7);
            });
        });
    });
});
