import {
    Abstract as Display,
    Collection as CollectionDisplay,
    CollectionItem,
    EIndicatorState,
    groupConstants,
    GroupItem,
} from 'Controls/display';

import { IObservable as IBindCollection, RecordSet, ObservableList, List } from 'Types/collection';

import { Model, functor, Record } from 'Types/entity';

const ComputeFunctor = functor.Compute;

import * as coreInstance from 'Core/core-instance';
import { Logger } from 'UICommon/Utils';

describe('Controls/_display/Collection', () => {
    interface IItem {
        id: number;
        name?: string;
    }

    interface IGroupItem {
        id: number;
        group: number;
    }

    function getItems(): IItem[] {
        return [
            {
                id: 1,
                name: 'Иванов',
            },
            {
                id: 2,
                name: 'Петров',
            },
            {
                id: 3,
                name: 'Сидоров',
            },
            {
                id: 4,
                name: 'Пухов',
            },
            {
                id: 5,
                name: 'Молодцов',
            },
            {
                id: 6,
                name: 'Годолцов',
            },
            {
                id: 7,
                name: 'Арбузнов',
            },
        ];
    }

    let items: IItem[];
    let list: ObservableList<IItem>;
    let display: CollectionDisplay<IItem>;

    beforeEach(() => {
        items = getItems();

        list = new ObservableList({
            items,
        });

        display = new CollectionDisplay({
            collection: list,
            keyProperty: 'id',
        });
    });

    afterEach(() => {
        display.destroy();
        display = undefined;

        list.destroy();
        list = undefined;

        items = undefined;
    });

    describe('.constructor()', () => {
        it('should use filter from options', () => {
            list = new List({
                items: [1, 2, 3, 4],
            });

            display = new CollectionDisplay({
                collection: list,
                filter: (item) => {
                    return item === 3;
                },
                keyProperty: 'id',
            });

            let count = 0;
            display.each((item) => {
                expect(item.getContents()).toEqual(3);
                count++;
            });
            expect(count).toEqual(1);
        });

        it('should use group from options', () => {
            list = new List({
                items: [
                    { id: 1, group: 1 },
                    { id: 2, group: 2 },
                    { id: 3, group: 1 },
                    { id: 4, group: 3 },
                ],
            });
            display = new CollectionDisplay({
                collection: list,
                group: (item) => {
                    return item.group;
                },
                keyProperty: 'id',
            });
            const groupedItems = [1, list.at(0), list.at(2), 2, list.at(1), 3, list.at(3)];

            display.each((item, i) => {
                expect(groupedItems[i]).toBe(item.getContents());
            });
        });

        it('should use sort from options', () => {
            const list = new ObservableList({
                items: [5, 4, 3, 2, 1],
            });
            const display = new CollectionDisplay({
                collection: list,
                sort: (a, b) => {
                    return a.collectionItem - b.collectionItem;
                },
                keyProperty: 'id',
            });
            const sortedItems = [1, 2, 3, 4, 5];

            display.each((item, i) => {
                expect(sortedItems[i]).toEqual(item.getContents());
            });
        });

        it('should throw an error on invalid argument', () => {
            let display;

            expect(() => {
                display = new CollectionDisplay({
                    collection: {} as any,
                    keyProperty: 'id',
                });
            }).toThrow();
            expect(() => {
                display = new CollectionDisplay({
                    collection: 'a' as any,
                    keyProperty: 'id',
                });
            }).toThrow();
            expect(() => {
                display = new CollectionDisplay({
                    collection: 1 as any,
                    keyProperty: 'id',
                });
            }).toThrow();
            expect(() => {
                display = new CollectionDisplay({
                    collection: undefined,
                    keyProperty: 'id',
                });
            }).toThrow();

            expect(display).not.toBeDefined();
        });

        it('should add an important property if Compute functor for sort used', () => {
            const importantProps = ['bar'];
            const functor = ComputeFunctor.create(
                (a, b) => {
                    return a - b;
                },
                ['foo']
            );
            const display = new CollectionDisplay({
                collection: list,
                sort: functor,
                importantItemProperties: importantProps,
                keyProperty: 'id',
            });

            expect(importantProps.indexOf('foo') > -1).toBe(true);
            expect(importantProps.indexOf('bar') > -1).toBe(true);

            display.destroy();
        });

        it('should add an important property if Compute functor for group used', () => {
            const importantProps = ['bar'];
            const functor = ComputeFunctor.create(() => {
                return 'banana';
            }, ['foo']);
            const display = new CollectionDisplay({
                collection: list,
                group: functor,
                importantItemProperties: importantProps,
                keyProperty: 'id',
            });

            expect(importantProps.indexOf('foo') > -1).toBe(true);
            expect(importantProps.indexOf('bar') > -1).toBe(true);

            display.destroy();
        });

        it('should use stickyHeader and stickyGroup from options', () => {
            let collection: CollectionDisplay;

            // Создаем коллекцию с зафиксированным заголовком и не указываем фиксировать или нет заголовки групп
            // Заголовки групп должны так же стать зафиксированными
            collection = new CollectionDisplay({
                collection: new List({ items: [] }),
                stickyHeader: true,
                keyProperty: 'id',
            });
            expect(collection.isStickyGroup()).toBe(true);
            expect(collection.isStickyHeader()).toBe(true);

            // Создаем коллекцию с зафиксированным заголовком и говорим что фиксировать заголовки групп не надо
            collection = new CollectionDisplay({
                collection: new List({ items: [] }),
                stickyHeader: true,
                stickyGroup: false,
                keyProperty: 'id',
            });
            expect(collection.isStickyGroup()).toBe(false);
            expect(collection.isStickyHeader()).toBe(true);
        });
    });

    describe('.getEnumerator()', () => {
        it('should return a display enumerator', () => {
            const display = new CollectionDisplay({
                collection: new ObservableList(),
                keyProperty: 'id',
            });
            expect(
                coreInstance.instanceOfModule(
                    display.getEnumerator(),
                    'Controls/_display/CollectionEnumerator'
                )
            ).toBe(true);
        });

        describe('if has repeatable ids', () => {
            let items: ObservableList<{ id: string }>;
            let display: CollectionDisplay<{ id: string }>;

            beforeEach(() => {
                items = new ObservableList({
                    items: [
                        { id: 'a' },
                        { id: 'aa' },
                        { id: 'ab' },
                        { id: 'b' },
                        { id: 'ba' },
                        { id: 'b' },
                        { id: 'bb' },
                    ],
                });

                display = new CollectionDisplay({
                    collection: items,
                    keyProperty: 'id',
                });
            });

            afterEach(() => {
                display.destroy();
                display = undefined;
                items = undefined;
            });

            it('should include repeatable elements if unique=false', () => {
                const enumerator = display.getEnumerator();
                const expected = ['a', 'aa', 'ab', 'b', 'ba', 'b', 'bb'];

                let index = 0;
                while (enumerator.moveNext()) {
                    const item = enumerator.getCurrent();
                    expect(item.getContents().id).toBe(expected[index]);
                    index++;
                }
                expect(index).toEqual(expected.length);
            });

            it('should skip repeatable elements if unique=true', () => {
                display.setUnique(true);

                const enumerator = display.getEnumerator();
                const expected = ['a', 'aa', 'ab', 'b', 'ba', 'bb'];

                let index = 0;
                while (enumerator.moveNext()) {
                    const item = enumerator.getCurrent();
                    expect(item.getContents().id).toBe(expected[index]);
                    index++;
                }
                expect(index).toEqual(expected.length);
            });

            it('should skip repeatable elements and log error about their', () => {
                const stubLogger = jest.spyOn(Logger, 'error').mockImplementation();

                display = new CollectionDisplay({
                    collection: items,
                    keyProperty: 'id',
                    unique: true,
                    validateUnique: true,
                });

                expect(stubLogger).toHaveBeenCalledWith(
                    'Данные содержат дубли записей с ключом="b". Не возможна корректная работа списка.'
                );
            });
        });
    });

    describe('.each()', () => {
        it('should return every item in original order', () => {
            let ok = true;
            let index = 0;
            display.each((item) => {
                if (item.getContents() !== items[index]) {
                    ok = false;
                }
                index++;
            });
            expect(ok).toBe(true);
        });

        it('should return every item index in original order', () => {
            let ok = true;
            let index = 0;
            display.each((item, innerIndex) => {
                if (index !== innerIndex) {
                    ok = false;
                }
                index++;
            });
            expect(ok).toBe(true);
        });

        it('should return items in order of sort function', () => {
            const list = new RecordSet({
                rawData: [
                    { id: 1, title: 1 },
                    { id: 2, title: 2 },
                    { id: 3, title: 3 },
                    { id: 4, title: 4 },
                ],
                keyProperty: 'id',
            });
            const display = new CollectionDisplay({
                collection: list,
                importantItemProperties: ['title'],
                filter: (a) => {
                    return a.get('title') < 3;
                },
                sort: (a, b) => {
                    return a.collectionItem.get('title') - b.collectionItem.get('title');
                },
                keyProperty: 'id',
            });
            const sortedItems = [1, 4, 2];

            list.at(3).set('title', 1);
            const result = [];
            display.each((item) => {
                result.push(item.getContents().getKey());
            });
            expect(result).toEqual(sortedItems);
        });

        it('should return groups and items together', () => {
            const expected = [];
            const groups = [];
            items.forEach((item) => {
                if (groups.indexOf(item.id) === -1) {
                    groups.push(item.id);
                    expected.push(item.id);
                }
                expected.push(item);
            });

            display.setGroup((item) => {
                return item.id;
            });

            let count = 0;
            display.each((item, index) => {
                expect(item.getContents()).toEqual(expected[index]);
                count++;
            });
            expect(count).toEqual(expected.length);
        });

        it('should return new group after prepend an item with filter', () => {
            const items = [
                { id: 1, group: 1 },
                { id: 2, group: 2 },
            ];
            const list = new ObservableList({
                items,
            });
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
                group: (item) => {
                    return item.group;
                },
                filter: () => {
                    return true;
                },
            });
            const item = { id: 2, group: 3 };
            const expected = [3, item, 1, items[0], 2, items[1]];
            let count = 0;

            list.add(item, 0);

            display.each((item, index) => {
                expect(item.getContents()).toEqual(expected[index]);
                count++;
            });
            expect(count).toEqual(expected.length);
        });

        it('should remove empty groups after add an item', () => {
            const items = [
                { id: 1, group: 1 },
                { id: 2, group: 2 },
            ];
            const list = new ObservableList({
                items,
            });
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
                group: (item) => {
                    return item.group;
                },
            });
            const item = { id: 2, group: 3 };
            const expected = [2, items[1], 3, item];
            let count = 0;

            list.removeAt(0);
            list.add(item);

            display.each((item, index) => {
                expect(item.getContents()).toEqual(expected[index]);
                count++;
            });
            expect(count).toEqual(expected.length);
        });

        it('should return groups and items together', () => {
            const expected = [];
            const groups = [];
            let count;
            items.forEach((item) => {
                if (groups.indexOf(item.id) === -1) {
                    groups.push(item.id);
                    expected.push(item.id);
                }
                expected.push(item);
            });

            display.setGroup((item) => {
                return item.id;
            });

            count = 0;
            display.each((item, index) => {
                expect(item.getContents()).toEqual(expected[index]);
                count++;
            });
            expect(count).toEqual(expected.length);
        });
    });

    describe('.getCount()', () => {
        let items: number[];
        let list: ObservableList<number>;
        let display: CollectionDisplay<number>;

        beforeEach(() => {
            items = [1, 2, 3, 4];

            list = new ObservableList({ items });

            display = new CollectionDisplay({
                collection: list,
                group: (item) => {
                    return item % 2;
                },
                keyProperty: 'id',
            });
        });

        it('should consider groups', () => {
            expect(display.getCount()).toEqual(1.5 * items.length);
        });

        it('should skip groups', () => {
            expect(display.getCount(true)).toEqual(items.length);
        });
    });

    describe('.setCollection()', () => {
        it('Increase version after .setCollection', () => {
            const list = new ObservableList({
                items: [1, 2, 3, 4],
            });
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });

            expect(display.getVersion()).toBe(0);

            const newList = new ObservableList({
                items: [5, 6, 7],
            });

            display.setCollection(newList);
            expect(display.getVersion()).toBe(2);
        });
    });
    describe('.setFilter()', () => {
        function getItems(): number[] {
            return [1, 2, 3, 4];
        }

        it('should filter display by collection item', () => {
            const list = new ObservableList({
                items: getItems(),
            });
            const filter = (item) => {
                return item === 3;
            };
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });

            display.setFilter(filter);
            let count = 0;
            display.each((item) => {
                expect(item.getContents()).toEqual(3);
                count++;
            });
            expect(count).toEqual(1);
        });

        it('should filter display by collection position', () => {
            const list = new ObservableList({
                items: getItems(),
            });
            const filter = (item, index) => {
                return index === 1;
            };
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });

            display.setFilter(filter);
            let count = 0;
            display.each((item) => {
                expect(list.getIndex(item.getContents())).toEqual(1);
                count++;
            });
            expect(count).toEqual(1);
        });

        it('should filter display by display item', () => {
            const list = new ObservableList({
                items: getItems(),
            });
            const filter = (item, index, displayItem) => {
                return displayItem.getContents() === 2;
            };
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });

            display.setFilter(filter);
            let count = 0;
            display.each((item) => {
                expect(item.getContents()).toEqual(2);
                count++;
            });
            expect(count).toEqual(1);
        });

        it('should filter display by display index', () => {
            const filter = (item, index, displayItem, displayIndex) => {
                return displayIndex === 3;
            };
            const sort = (a, b) => {
                return b.collectionItem - a.collectionItem;
            };
            const list = new ObservableList({
                items: getItems(),
            });
            const display = new CollectionDisplay({
                collection: list,
                filter,
                sort,
                keyProperty: 'id',
            });

            display.setFilter(filter);
            let count = 0;
            display.each((item) => {
                expect(list.getIndex(item.getContents())).toEqual(0);
                count++;
            });
            expect(count).toEqual(1);
        });

        it('should call filter for all items if it use display index', () => {
            const data = [{ id: 1 }, { id: 2 }, { id: 3 }];
            const list = new RecordSet({
                rawData: data,
                keyProperty: 'id',
            });
            let count = 0;
            const display = new CollectionDisplay({
                collection: list,
                importantItemProperties: ['id'],
                filter: (item, index, displayItem, displayIndex) => {
                    count++;
                    return displayIndex > -1;
                },
                keyProperty: 'id',
            });
            count = 0;
            list.at(0).set('id', 'foo');
            expect(count).toEqual(data.length);

            display.destroy();
            list.destroy();
        });

        it('should filter display use array of filters', () => {
            const list = new ObservableList({
                items: getItems(),
            });
            const filterA = (item) => {
                return item > 2;
            };
            const filterB = (item) => {
                return item < 4;
            };
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });

            display.setFilter([filterA, filterB] as any);
            let count = 0;
            display.each((item) => {
                expect(item.getContents()).toEqual(3);
                count++;
            });
            expect(count).toEqual(1);
        });

        it('should filter display use several filters', () => {
            const list = new ObservableList({
                items: getItems(),
            });
            const filterA = (item) => {
                return item > 2;
            };
            const filterB = (item) => {
                return item < 4;
            };
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });

            display.setFilter(filterA, filterB);
            let count = 0;
            display.each((item) => {
                expect(item.getContents()).toEqual(3);
                count++;
            });
            expect(count).toEqual(1);
        });

        it('should filter display after add item', () => {
            const list = new ObservableList({
                items: getItems(),
            });
            const filter = (item) => {
                return item === 3;
            };
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });

            display.setFilter(filter);
            list.add(4);
            list.add(3);
            let count = 0;
            display.each((item) => {
                expect(item.getContents()).toEqual(3);
                count++;
            });
            expect(count).toEqual(2);
        });

        it('should filter display after remove item', () => {
            const list = new ObservableList({
                items: [1, 2, 3, 3],
            });
            const filter = (item) => {
                return item === 3;
            };
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });

            display.setFilter(filter);
            list.removeAt(3);
            let count = 0;
            display.each((item) => {
                expect(item.getContents()).toEqual(3);
                count++;
            });
            expect(count).toEqual(1);
        });

        it('should filter display after replace item', () => {
            const list = new ObservableList({
                items: [1, 2, 3, 2],
            });
            const filter = (item) => {
                return item === 3;
            };
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });

            display.setFilter(filter);
            list.replace(3, 1);
            let count = 0;
            display.each((item) => {
                expect(item.getContents()).toEqual(3);
                count++;
            });
            expect(count).toEqual(2);
        });

        it('should not refilter display after change item', () => {
            const changeModel = new Model({
                rawData: { max: 2 },
                keyProperty: 'max',
            });
            const list = new ObservableList({
                items: [
                    new Model({
                        rawData: { max: 1 },
                        keyProperty: 'max',
                    }),
                    new Model({
                        rawData: { max: 3 },
                        keyProperty: 'max',
                    }),
                    new Model({
                        rawData: { max: 4 },
                        keyProperty: 'max',
                    }),
                    changeModel,
                ],
            });
            const filter = (item) => {
                return item.get('max') === 3;
            };
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });

            display.setFilter(filter);
            changeModel.set('max', 3);
            let count = 0;
            display.each((item) => {
                expect(item.getContents().get('max')).toEqual(3);
                count++;
            });
            expect(count).toEqual(1);
        });

        it('should refilter display after change item', () => {
            const changeModel = new Model({
                rawData: { max: 2 },
                keyProperty: 'max',
            });
            const list = new ObservableList({
                items: [
                    new Model({
                        rawData: { max: 1 },
                        keyProperty: 'max',
                    }),
                    new Model({
                        rawData: { max: 3 },
                        keyProperty: 'max',
                    }),
                    new Model({
                        rawData: { max: 4 },
                        keyProperty: 'max',
                    }),
                    changeModel,
                ],
            });
            const filter = (item) => {
                return item.get('max') === 3;
            };
            const display = new CollectionDisplay({
                collection: list,
                importantItemProperties: ['max'],
                keyProperty: 'id',
            });

            display.setFilter(filter);
            changeModel.set('max', 3);
            let count = 0;
            display.each((item) => {
                expect(item.getContents().get('max')).toEqual(3);
                count++;
            });
            expect(count).toEqual(2);
        });
    });

    describe('.getFilter()', () => {
        it('should return a display filters', () => {
            const display = new CollectionDisplay({
                collection: new ObservableList(),
                keyProperty: 'id',
            });
            const filter = () => {
                return true;
            };

            display.setFilter(filter);
            expect(display.getFilter()).toEqual([filter]);
            display.setFilter(filter);
            expect(display.getFilter()).toEqual([filter]);
        });
    });

    describe('.addFilter()', () => {
        function getItems(): number[] {
            return [1, 2, 3, 4];
        }

        it('should add a filter', () => {
            const list = new ObservableList({
                items: getItems(),
            });
            const filter = (item) => {
                return item === 3;
            };
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });

            display.addFilter(filter);
            let count = 0;
            display.each((item) => {
                expect(item.getContents()).toEqual(3);
                count++;
            });
            expect(count).toEqual(1);
        });

        it('should trigger onCollectionChange', () => {
            const list = new ObservableList({
                items: getItems(),
            });
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });
            const expected = [
                {
                    action: IBindCollection.ACTION_REMOVE,
                    newItems: [],
                    newItemsIndex: 0,
                    oldItems: [display.at(0), display.at(1)],
                    oldItemsIndex: 0,
                },
                {
                    action: IBindCollection.ACTION_REMOVE,
                    newItems: [],
                    newItemsIndex: 0,
                    oldItems: [display.at(3)],
                    oldItemsIndex: 1,
                },
            ];
            const given = [];
            const handler = (event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) => {
                given.push({
                    action,
                    newItems,
                    newItemsIndex,
                    oldItems,
                    oldItemsIndex,
                });
            };
            const filter = (item) => {
                return item === 3;
            };

            display.subscribe('onCollectionChange', handler);
            display.addFilter(filter);
            display.unsubscribe('onCollectionChange', handler);

            for (let i = 0; i < Math.max(expected.length, given.length); i++) {
                expect(given[i].action).toEqual(expected[i].action);
                expect(given[i].newItems).toEqual(expected[i].newItems);
                expect(given[i].oldItems).toEqual(expected[i].oldItems);
                expect(given[i].newItemsIndex).toBe(expected[i].newItemsIndex);
                expect(given[i].oldItemsIndex).toBe(expected[i].oldItemsIndex);
            }
        });

        it('should recount groups', () => {
            const list = new RecordSet({
                rawData: [
                    { key: 1, group: 'group-1' },
                    { key: 2, group: 'group-1' },
                    { key: 3, group: 'group-2' },
                ],
                keyProperty: 'key',
            });
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'key',
                groupProperty: 'group',
            });

            display.addFilter((item) => {
                return !item.getKey || item.getKey() === 3;
            });

            const items = [];
            display.each((item) => {
                return items.push(item);
            });
            expect(items.length).toEqual(2);
            expect(items[0].key).toEqual('group-2');
            expect(items[1].key).toEqual(3);
        });
    });

    describe('.removeFilter()', () => {
        function getItems(): number[] {
            return [1, 2, 3, 4];
        }

        it('should remove a filter', () => {
            const list = new ObservableList({
                items: getItems(),
            });
            const filter = (item) => {
                return item === 3;
            };
            const display = new CollectionDisplay({
                collection: list,
                filter,
                keyProperty: 'id',
            });

            display.removeFilter(filter);
            let count = 0;
            display.each((item, index) => {
                expect(item.getContents()).toEqual(list.at(index));
                count++;
            });
            expect(count).toEqual(list.getCount());
        });

        it('should trigger onCollectionChange', () => {
            const list = new ObservableList({
                items: getItems(),
            });
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });
            const expected = [
                {
                    action: IBindCollection.ACTION_ADD,
                    newItems: [display.at(0), display.at(1)],
                    newItemsIndex: 0,
                    oldItems: [],
                    oldItemsIndex: 0,
                },
                {
                    action: IBindCollection.ACTION_ADD,
                    newItems: [display.at(3)],
                    newItemsIndex: 3,
                    oldItems: [],
                    oldItemsIndex: 0,
                },
            ];
            const given = [];
            const handler = (event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) => {
                given.push({
                    action,
                    newItems,
                    newItemsIndex,
                    oldItems,
                    oldItemsIndex,
                });
            };
            const filter = (item) => {
                return item === 3;
            };

            display.setFilter(filter);
            display.subscribe('onCollectionChange', handler);
            display.removeFilter(filter);
            display.unsubscribe('onCollectionChange', handler);

            for (let i = 0; i < Math.max(expected.length, given.length); i++) {
                expect(given[i].action).toEqual(expected[i].action);
                expect(given[i].newItems).toEqual(expected[i].newItems);
                expect(given[i].oldItems).toEqual(expected[i].oldItems);
                expect(given[i].newItemsIndex).toBe(expected[i].newItemsIndex);
                expect(given[i].oldItemsIndex).toBe(expected[i].oldItemsIndex);
            }
        });

        it('should recount groups', () => {
            const list = new RecordSet({
                rawData: [
                    { key: 1, group: 'group-1' },
                    { key: 2, group: 'group-1' },
                    { key: 3, group: 'group-2' },
                ],
                keyProperty: 'key',
            });
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'key',
                groupProperty: 'group',
            });

            const filter = (item) => {
                return !item.getKey || item.getKey() === 3;
            };
            display.addFilter(filter);
            display.removeFilter(filter);

            const items = [];
            display.each((item) => {
                return items.push(item);
            });
            expect(items.length).toEqual(5);
            expect(items[0].key).toEqual('group-1');
            expect(items[1].key).toEqual(1);
            expect(items[2].key).toEqual(2);
            expect(items[3].key).toEqual('group-2');
            expect(items[4].key).toEqual(3);
        });
    });

    describe('.setSort()', () => {
        const getItems = () => {
            return [1, 2, 3, 4];
        };
        const getSortedItems = () => {
            return [4, 3, 2, 1];
        };
        const sort = (a, b) => {
            return b.collectionItem - a.collectionItem;
        };

        it('should sort display', () => {
            const list = new ObservableList({
                items: getItems(),
            });
            const sortedItems = getSortedItems();
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });

            display.setSort(sort);
            display.each((item, i) => {
                expect(sortedItems[i]).toEqual(item.getContents());
            });
        });

        it('should sort display use several sorters', () => {
            const items = [
                { id: 0, x: 1, y: 1 },
                { id: 1, x: 1, y: 2 },
                { id: 2, x: 2, y: 1 },
                { id: 3, x: 2, y: 2 },
            ];
            const list = new ObservableList({
                items,
            });
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });
            const sortX = (a, b) => {
                return a.collectionItem.x - b.collectionItem.x;
            };
            const sortY = (a, b) => {
                return b.collectionItem.y - a.collectionItem.y;
            };
            const expected = [1, 3, 0, 2];

            display.setSort(sortY, sortX);
            display.each((item, i) => {
                expect(item.getContents().id).toEqual(expected[i]);
            });
        });

        it('should trigger onCollectionChange', () => {
            const list = new ObservableList({
                items: getItems(),
            });
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });
            const expected = [
                {
                    action: IBindCollection.ACTION_MOVE,
                    newItems: [display.at(3)],
                    newItemsIndex: 0,
                    oldItems: [display.at(3)],
                    oldItemsIndex: 3,
                },
                {
                    action: IBindCollection.ACTION_MOVE,
                    newItems: [display.at(2)],
                    newItemsIndex: 1,
                    oldItems: [display.at(2)],
                    oldItemsIndex: 3,
                },
                {
                    action: IBindCollection.ACTION_MOVE,
                    newItems: [display.at(1)],
                    newItemsIndex: 2,
                    oldItems: [display.at(1)],
                    oldItemsIndex: 3,
                },
            ];
            const given = [];
            const handler = (event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) => {
                given.push({
                    action,
                    newItems,
                    newItemsIndex,
                    oldItems,
                    oldItemsIndex,
                });
            };

            display.subscribe('onCollectionChange', handler);
            display.setSort(sort);
            display.unsubscribe('onCollectionChange', handler);

            expect(given).toEqual(expected);
        });

        it('should reset a sort display', () => {
            const list = new ObservableList({
                items: getItems(),
            });
            const sortedItems = getItems();
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });

            display.setSort(sort);
            display.setSort();
            display.each((item, i) => {
                expect(sortedItems[i]).toEqual(item.getContents());
            });
        });

        it('should sort display after add item', () => {
            const list = new ObservableList({
                items: getItems(),
            });
            const sortedItems = [5, 4, 3, 2, 1];
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });

            display.setSort(sort);
            list.add(5);
            display.each((item, i) => {
                expect(sortedItems[i]).toEqual(item.getContents());
            });
        });

        it('should sort display after remove item', () => {
            const list = new ObservableList({
                items: [1, 2, 10, 3, 4],
            });
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });
            const expected = [4, 3, 2, 1];
            const given = [];

            display.setSort(sort);
            list.removeAt(2);
            display.each((item) => {
                given.push(item.getContents());
            });

            expect(given).toEqual(expected);
        });

        it('should sort display after replace item', () => {
            const list = new ObservableList({
                items: [1, 2, 2, 3, 5],
            });
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });
            const expected = [5, 4, 3, 2, 1];

            display.setSort(sort);
            list.replace(4, 2);
            display.each((item, i) => {
                expect(expected[i]).toEqual(item.getContents());
            });
        });

        it('should not resort display after change item', () => {
            const changeModel = new Model({
                rawData: { max: 2 },
                keyProperty: 'max',
            });
            const list = new ObservableList({
                items: [
                    new Model({
                        rawData: { max: 1 },
                        keyProperty: 'max',
                    }),
                    new Model({
                        rawData: { max: 3 },
                        keyProperty: 'max',
                    }),
                    new Model({
                        rawData: { max: 4 },
                        keyProperty: 'max',
                    }),
                    changeModel,
                ],
            });
            const sortedItems = [4, 3, 10, 1];
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });

            display.setSort((a, b) => {
                return b.collectionItem.get('max') - a.collectionItem.get('max');
            });
            changeModel.set('max', 10);
            display.each((item, i) => {
                expect(sortedItems[i]).toEqual(item.getContents().get('max'));
            });
        });

        it('should resort display after change item', () => {
            const changeModel = new Model({
                rawData: { max: 2 },
                keyProperty: 'max',
            });
            const list = new ObservableList({
                items: [
                    new Model({
                        rawData: { max: 1 },
                        keyProperty: 'max',
                    }),
                    new Model({
                        rawData: { max: 3 },
                        keyProperty: 'max',
                    }),
                    new Model({
                        rawData: { max: 4 },
                        keyProperty: 'max',
                    }),
                    changeModel,
                ],
            });
            const sortedItems = [10, 4, 3, 1];
            const display = new CollectionDisplay({
                collection: list,
                importantItemProperties: ['max'],
                keyProperty: 'id',
            });

            display.setSort((a, b) => {
                return b.collectionItem.get('max') - a.collectionItem.get('max');
            });
            changeModel.set('max', 10);
            display.each((item, i) => {
                expect(sortedItems[i]).toEqual(item.getContents().get('max'));
            });
        });

        it('should add an important property if Compute functor used', () => {
            const importantProps = ['bar'];
            const functor = ComputeFunctor.create(
                (a, b) => {
                    return a - b;
                },
                ['foo']
            );
            const display = new CollectionDisplay({
                collection: list,
                importantItemProperties: importantProps,
                keyProperty: 'id',
            });

            display.setSort(functor);
            expect(importantProps.indexOf('foo') > -1).toBe(true);
            expect(importantProps.indexOf('bar') > -1).toBe(true);
        });

        it('should remove an important property if Compute functor no longer used', () => {
            const importantProps = ['bar'];
            const functor = ComputeFunctor.create(
                (a, b) => {
                    return a - b;
                },
                ['foo']
            );
            const display = new CollectionDisplay({
                collection: list,
                sort: functor,
                importantItemProperties: importantProps,
                keyProperty: 'id',
            });

            display.setSort();
            expect(importantProps.indexOf('foo') === -1).toBe(true);
            expect(importantProps.indexOf('bar') > -1).toBe(true);
        });
    });

    describe('.getSort()', () => {
        it('should return a display sort', () => {
            const sort = () => {
                return 0;
            };
            const display = new CollectionDisplay({
                collection: new ObservableList(),
                sort,
                keyProperty: 'id',
            });

            expect(display.getSort()).toEqual([sort]);
        });
    });

    describe('.addSort()', () => {
        const getItems = () => {
            return [1, 2, 3, 4];
        };
        const getSortedItems = () => {
            return [4, 3, 2, 1];
        };
        const sort = (a, b) => {
            return b.collectionItem - a.collectionItem;
        };

        it('should sort display', () => {
            const list = new ObservableList({
                items: getItems(),
            });
            const sortedItems = getSortedItems();
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });

            display.addSort(sort);
            display.each((item, i) => {
                expect(item.getContents()).toEqual(sortedItems[i]);
            });
        });

        it('should trigger onCollectionChange', () => {
            const list = new ObservableList({
                items: getItems(),
            });
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });
            const expected = [
                {
                    action: IBindCollection.ACTION_MOVE,
                    newItems: [display.at(3)],
                    newItemsIndex: 0,
                    oldItems: [display.at(3)],
                    oldItemsIndex: 3,
                },
                {
                    action: IBindCollection.ACTION_MOVE,
                    newItems: [display.at(2)],
                    newItemsIndex: 1,
                    oldItems: [display.at(2)],
                    oldItemsIndex: 3,
                },
                {
                    action: IBindCollection.ACTION_MOVE,
                    newItems: [display.at(1)],
                    newItemsIndex: 2,
                    oldItems: [display.at(1)],
                    oldItemsIndex: 3,
                },
            ];
            const given = [];
            const handler = (event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) => {
                given.push({
                    action,
                    newItems,
                    newItemsIndex,
                    oldItems,
                    oldItemsIndex,
                });
            };

            display.subscribe('onCollectionChange', handler);
            display.addSort(sort);
            display.unsubscribe('onCollectionChange', handler);

            for (let i = 0; i < Math.max(expected.length, given.length); i++) {
                expect(given[i].action).toEqual(expected[i].action);
                expect(given[i].newItems).toEqual(expected[i].newItems);
                expect(given[i].oldItems).toEqual(expected[i].oldItems);
                expect(given[i].newItemsIndex).toBe(expected[i].newItemsIndex);
                expect(given[i].oldItemsIndex).toBe(expected[i].oldItemsIndex);
            }
        });
    });

    describe('.removeSort()', () => {
        const getItems = () => {
            return [1, 2, 3, 4];
        };
        const sort = (a, b) => {
            return b.collectionItem - a.collectionItem;
        };

        it('should sort display', () => {
            const list = new ObservableList({
                items: getItems(),
            });
            const unsortedItems = getItems();
            const display = new CollectionDisplay({
                collection: list,
                sort,
                keyProperty: 'id',
            });

            display.removeSort(sort);
            display.each((item, i) => {
                expect(item.getContents()).toEqual(unsortedItems[i]);
            });
        });

        it('should trigger onCollectionChange', () => {
            const list = new ObservableList({
                items: getItems(),
            });
            const display = new CollectionDisplay({
                collection: list,
                sort,
                keyProperty: 'id',
            });
            const expected = [
                {
                    action: IBindCollection.ACTION_MOVE,
                    newItems: [display.at(3)],
                    newItemsIndex: 0,
                    oldItems: [display.at(3)],
                    oldItemsIndex: 3,
                },
                {
                    action: IBindCollection.ACTION_MOVE,
                    newItems: [display.at(2)],
                    newItemsIndex: 1,
                    oldItems: [display.at(2)],
                    oldItemsIndex: 3,
                },
                {
                    action: IBindCollection.ACTION_MOVE,
                    newItems: [display.at(1)],
                    newItemsIndex: 2,
                    oldItems: [display.at(1)],
                    oldItemsIndex: 3,
                },
            ];
            const given = [];
            const handler = (event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) => {
                given.push({
                    action,
                    newItems,
                    newItemsIndex,
                    oldItems,
                    oldItemsIndex,
                });
            };

            display.subscribe('onCollectionChange', handler);
            display.removeSort(sort);
            display.unsubscribe('onCollectionChange', handler);

            for (let i = 0; i < Math.max(expected.length, given.length); i++) {
                expect(given[i].action).toEqual(expected[i].action);
                expect(given[i].newItems).toEqual(expected[i].newItems);
                expect(given[i].oldItems).toEqual(expected[i].oldItems);
                expect(given[i].newItemsIndex).toBe(expected[i].newItemsIndex);
                expect(given[i].oldItemsIndex).toBe(expected[i].oldItemsIndex);
            }
        });
    });

    describe('.setGroup()', () => {
        function getItems(): IGroupItem[] {
            return [
                { id: 1, group: 1 },
                { id: 2, group: 2 },
                { id: 3, group: 1 },
                { id: 4, group: 2 },
            ];
        }

        it('should add an important property if Compute functor used', () => {
            const importantProps = ['bar'];
            const functor = ComputeFunctor.create(() => {
                return 'banana';
            }, ['foo']);
            const display = new CollectionDisplay({
                collection: list,
                importantItemProperties: importantProps,
                keyProperty: 'id',
            });

            display.setGroup(functor);
            expect(importantProps.indexOf('foo') > -1).toBe(true);
            expect(importantProps.indexOf('bar') > -1).toBe(true);
        });

        it('should group the display', () => {
            const list = new ObservableList({
                items: getItems(),
            });
            const groupedItems = [1, list.at(0), list.at(2), 2, list.at(1), list.at(3)];
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });

            display.setGroup((item) => {
                return item.group;
            });
            display.each((item, i) => {
                expect(groupedItems[i]).toEqual(item.getContents());
            });
        });

        it('should group the display with filter', () => {
            const items = [
                { id: 1, group: 1, enabled: true },
                { id: 2, group: 2, enabled: false },
                { id: 3, group: 3, enabled: true },
                { id: 4, group: 4, enabled: false },
            ];
            const list = new ObservableList({
                items,
            });
            const display = new CollectionDisplay({
                collection: list,
                filter: (item, index, collectionItem, position, hasMembers) => {
                    if (collectionItem['[Controls/_display/GroupItem]']) {
                        return hasMembers;
                    }
                    return item.enabled;
                },
                keyProperty: 'id',
            });
            const expectedItems = [1, items[0], 3, items[2]];

            let count = 0;
            display.setGroup((item) => {
                return item.group;
            });
            display.each((item) => {
                expect(item.getContents()).toBe(expectedItems[count]);
                count++;
            });
            expect(count).toEqual(expectedItems.length);
        });

        it('should skip repeatable groups with filter', () => {
            const items = [
                { id: 1, group: 1, enabled: true },
                { id: 2, group: 2, enabled: false },
                { id: 3, group: 3, enabled: true },
                { id: 4, group: 4, enabled: false },
                { id: 5, group: 3, enabled: true },
                { id: 6, group: 5, enabled: true },
            ];
            const list = new ObservableList({
                items,
            });
            const display = new CollectionDisplay({
                collection: list,
                filter: (item, index, collectionItem, position, hasMembers) => {
                    if (collectionItem['[Controls/_display/GroupItem]']) {
                        return hasMembers;
                    }
                    return item.enabled;
                },
                keyProperty: 'id',
            });
            const expectedItems = [1, items[0], 3, items[2], items[4], 5, items[5]];

            let count = 0;
            display.setGroup((item) => {
                return item.group;
            });
            display.each((item) => {
                expect(item.getContents()).toBe(expectedItems[count]);
                count++;
            });
            expect(count).toEqual(expectedItems.length);
        });

        it('should enum items in original order', () => {
            const items = [
                { id: 1, group: 1 },
                { id: 2, group: 1 },
                { id: 3, group: 1 },
                { id: 4, group: 1 },
                { id: 5, group: 2 },
                { id: 6, group: 2 },
                { id: 7, group: 2 },
                { id: 8, group: 2 },
                { id: 9, group: 3 },
                { id: 10, group: 3 },
                { id: 11, group: 3 },
                { id: 12, group: 3 },
                { id: 13, group: 4 },
                { id: 14, group: 4 },
                { id: 15, group: 4 },
                { id: 16, group: 4 },
                { id: 17, group: 5 },
                { id: 18, group: 5 },
                { id: 19, group: 5 },
                { id: 20, group: 5 },
                { id: 21, group: 6 },
                { id: 22, group: 6 },
                { id: 23, group: 6 },
                { id: 24, group: 6 },
            ];
            const list = new ObservableList({
                items,
            });
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });

            let index = 0;
            display.setGroup((item) => {
                return item.group;
            });
            display.each((item) => {
                if (item['[Controls/_display/GroupItem]']) {
                    expect(item.getContents()).toBe(items[index + 1].group);
                } else {
                    expect(item.getContents()).toBe(items[index]);
                    index++;
                }
            });
            expect(index).toBe(items.length);
        });

        it('should enum item in groups in reverse order', () => {
            const items = [
                { id: 1, group: 1 },
                { id: 2, group: 1 },
                { id: 3, group: 1 },
                { id: 4, group: 1 },
                { id: 5, group: 2 },
                { id: 6, group: 2 },
                { id: 7, group: 2 },
                { id: 8, group: 2 },
                { id: 9, group: 3 },
                { id: 10, group: 3 },
                { id: 11, group: 3 },
                { id: 12, group: 3 },
                { id: 13, group: 4 },
                { id: 14, group: 4 },
                { id: 15, group: 4 },
                { id: 16, group: 4 },
            ];
            const list = new ObservableList({
                items,
            });
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });
            const expected = [
                4,
                items[15],
                items[14],
                items[13],
                items[12],
                3,
                items[11],
                items[10],
                items[9],
                items[8],
                2,
                items[7],
                items[6],
                items[5],
                items[4],
                1,
                items[3],
                items[2],
                items[1],
                items[0],
            ];

            let index = 0;
            display.setSort((a, b) => {
                return b.index - a.index;
            });
            display.setGroup((item) => {
                return item.group;
            });
            display.each((item, position) => {
                expect(item.getContents()).toBe(expected[index]);
                index++;
            });
            expect(index).toBe(expected.length);
        });

        it('should reset a group of the display', () => {
            const list = new ObservableList({
                items: getItems(),
            });
            const expected = [list.at(0), list.at(1), list.at(2), list.at(3)];
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });

            display.setGroup((item) => {
                return item.group;
            });
            display.setGroup();
            display.each((item, i) => {
                expect(expected[i]).toEqual(item.getContents());
            });
        });

        it('should regroup the display after add an item', () => {
            const list = new ObservableList({
                items: getItems(),
            });
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });
            const added = { id: 5, group: 1 };
            const expected = [1, list.at(0), list.at(2), added, 2, list.at(1), list.at(3)];

            display.setGroup((item) => {
                return item.group;
            });
            list.add(added);
            display.each((item, i) => {
                expect(expected[i]).toEqual(item.getContents());
            });
        });

        it('should regroup the display after remove an item', () => {
            const list = new ObservableList({
                items: getItems(),
            });
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });
            const expected = [1, list.at(0), 2, list.at(1), list.at(3)];

            display.setGroup((item) => {
                return item.group;
            });
            list.removeAt(2);
            display.each((item, i) => {
                expect(expected[i]).toEqual(item.getContents());
            });
        });

        it('should regroup the display after replace an item', () => {
            const list = new ObservableList({
                items: getItems(),
            });
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });
            const replace = { id: 5, group: 2 };
            const expected = [1, list.at(0), 2, list.at(1), replace, list.at(3)];

            display.setGroup((item) => {
                return item.group;
            });
            list.replace(replace, 2);
            display.each((item, i) => {
                expect(expected[i]).toEqual(item.getContents());
            });
        });

        it('should regroup the display after change an item', () => {
            const changeModel = new Model({
                rawData: { id: 4, group: 2 },
                keyProperty: 'id',
            });
            const list = new ObservableList({
                items: [
                    new Model({
                        rawData: { id: 1, group: 1 },
                        keyProperty: 'id',
                    }),
                    new Model({
                        rawData: { id: 2, group: 2 },
                        keyProperty: 'id',
                    }),
                    new Model({
                        rawData: { id: 3, group: 1 },
                        keyProperty: 'id',
                    }),
                    changeModel,
                ],
            });
            const display = new CollectionDisplay({
                collection: list,
                importantItemProperties: ['group'],
                keyProperty: 'id',
            });
            const expected = [1, list.at(0), list.at(2), list.at(3), 2, list.at(1)];

            display.setGroup((item) => {
                return item.get('group');
            });
            changeModel.set('group', 1);
            display.each((item, i) => {
                expect(expected[i]).toEqual(item.getContents());
            });
        });

        it('should lookup groups order after add an item in the new group', () => {
            const list = new ObservableList({
                items: [
                    { id: 1, group: 2 },
                    { id: 2, group: 3 },
                    { id: 3, group: 2 },
                ],
            });
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });
            const added = { id: 4, group: 1 };
            const expected = [2, list.at(0), list.at(2), 1, added, 3, list.at(1)];

            display.setGroup((item) => {
                return item.group;
            });
            list.add(added, 1);
            display.each((item, i) => {
                expect(expected[i]).toEqual(item.getContents());
            });
        });

        it('should lookup groups order after add an items some of which in the new group', () => {
            const list = new ObservableList({
                items: [
                    { id: 1, group: 2 },
                    { id: 2, group: 3 },
                    { id: 3, group: 2 },
                ],
            });
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });
            const newItems = [
                { id: 4, group: 2 },
                { id: 5, group: 1 },
            ];
            const expected = [
                2,
                list.at(0),
                list.at(2),
                newItems[0],
                3,
                list.at(1),
                1,
                newItems[1],
            ];

            display.setGroup((item) => {
                return item.group;
            });
            list.append(newItems);
            display.each((item, i) => {
                expect(expected[i]).toEqual(item.getContents());
            });
        });

        it('should remove grouping filter when null was passed', () => {
            const list = new ObservableList({
                items: [{ id: 1 }, { id: 2 }, { id: 3 }],
            });
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });
            const spyRemoveFilter = jest.spyOn(display, 'removeFilter').mockClear();
            display.setGroup((item) => {
                return item.group;
            });
            display.setGroup(null);
            expect(spyRemoveFilter).toHaveBeenCalled();
            spyRemoveFilter.mockRestore();
        });

        it('should add grouping filter when handler was passed', () => {
            const list = new ObservableList({
                items: [
                    { id: 1, group: 2 },
                    { id: 2, group: 3 },
                    { id: 3, group: 2 },
                ],
            });
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });
            const spyAddFilter = jest.spyOn(display, 'addFilter').mockClear();
            display.setGroup((item) => {
                return item.group;
            });
            expect(spyAddFilter).toHaveBeenCalled();
            spyAddFilter.mockRestore();
        });

        // Проверка правильной перегруппировки после добавления нового элемента.
        it('should correctly re-group after adding new item', () => {
            const list = new ObservableList({
                items: [
                    { id: 1, group: 2 },
                    { id: 2, group: 3 },
                    { id: 3, group: 2 },
                ],
            });
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });
            display.setGroup((item) => {
                return item.group;
            });
            const contents = new Model({
                rawData: { id: 4, group: 3 },
                keyProperty: 'id',
            });
            const editingItem = display.createItem({ contents, isAdd: true });
            editingItem.setEditing(true, contents, false);
            display.setAddingItem(editingItem, { position: 'bottom' });
            display.resetAddingItem();
            expect(display.getCount(false)).toEqual(5);
        });
    });

    describe('.getGroupItems()', () => {
        function getItems(): IGroupItem[] {
            return [
                { id: 1, group: 1 },
                { id: 2, group: 2 },
                { id: 3, group: 1 },
                { id: 4, group: 2 },
            ];
        }

        const check = (items, expected) => {
            expect(items.length).toEqual(expected.length);
            for (let index = 0; index < expected.length; index++) {
                expect(expected[index]).toEqual(items[index].getContents().id);
            }
        };

        it('should return group items', () => {
            const list = new List({
                items: getItems(),
            });
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });

            display.setGroup((item) => {
                return item.group;
            });

            check(display.getGroupItems(0), []);
            check(display.getGroupItems(1), [1, 3]);
            check(display.getGroupItems(2), [2, 4]);
            check(display.getGroupItems(3), []);
        });

        it('should return group for new items', () => {
            const list = new ObservableList({
                items: getItems(),
            });
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });

            display.setGroup((item) => {
                return item.group;
            });

            list.add({ id: 5, group: 3 }, 2);

            check(display.getGroupItems(0), []);
            check(display.getGroupItems(1), [1, 3]);
            check(display.getGroupItems(2), [2, 4]);
            check(display.getGroupItems(3), [5]);
            check(display.getGroupItems(4), []);
        });

        it('should return empty group for old items', () => {
            const list = new ObservableList({
                items: getItems(),
            });
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });

            display.setGroup((item) => {
                return item.group;
            });

            list.removeAt(2);

            check(display.getGroupItems(0), []);
            check(display.getGroupItems(1), [1]);
            check(display.getGroupItems(2), [2, 4]);
            check(display.getGroupItems(3), []);

            list.removeAt(0);

            check(display.getGroupItems(0), []);
            check(display.getGroupItems(1), []);
            check(display.getGroupItems(2), [2, 4]);
            check(display.getGroupItems(3), []);
        });
    });

    describe('.isAllGroupsCollapsed()', () => {
        const list = new List({
            items: [
                { id: 1, group: 1 },
                { id: 2, group: 2 },
            ],
        });

        it('set by options collapsed groups', () => {
            const display = new CollectionDisplay({
                collection: list,
                collapsedGroups: [1, 2],
                groupingKeyCallback: (item) => {
                    return item.group;
                },
                keyProperty: 'id',
            });

            expect(display.isAllGroupsCollapsed()).toBe(true);
            display.setCollapsedGroups([1]);
            expect(display.isAllGroupsCollapsed()).toBe(false);
        });

        it('set collapsed by group item state', () => {
            const display = new CollectionDisplay({
                collection: list,
                groupingKeyCallback: (item) => {
                    return item.group;
                },
                keyProperty: 'id',
            });

            display.each((it) => {
                return it instanceof GroupItem ? it.setExpanded(false) : null;
            });

            expect(display.isAllGroupsCollapsed()).toBe(true);
        });
    });

    describe('.getGroupByIndex()', () => {
        function getItems(): IGroupItem[] {
            return [
                { id: 1, group: 1 },
                { id: 2, group: 2 },
                { id: 3, group: 1 },
                { id: 4, group: 2 },
            ];
        }

        it('should return group id', () => {
            const list = new List({
                items: getItems(),
            });
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });
            const expected = [1, 1, 1, 2, 2, 2];

            display.setGroup((item) => {
                return item.group;
            });

            for (let index = 0; index < expected.length; index++) {
                expect(display.getGroupByIndex(index)).toEqual(expected[index]);
            }
        });

        it('should return valid group id in filtered mode', () => {
            const list = new List({
                items: getItems(),
            });
            const display = new CollectionDisplay({
                collection: list,
                group: (item) => {
                    return item.group;
                },
                filter: (item) => {
                    return item && item.id !== 2;
                },
                keyProperty: 'id',
            });
            const expected = [1, 1, 1, 2, 2];

            for (let index = 0; index < expected.length; index++) {
                expect(display.getGroupByIndex(index)).toEqual(expected[index]);
            }
        });
    });

    describe('.getKeyProperty()', () => {
        it('should return given value', () => {
            expect(display.getKeyProperty()).toEqual('id');
        });
    });

    describe('.isUnique()', () => {
        it('should return false by default', () => {
            expect(display.isUnique()).toBe(false);
        });
    });

    describe('.setUnique()', () => {
        it('should change the unique option', () => {
            display.setUnique(true);
            expect(display.isUnique()).toBe(true);

            display.setUnique(false);
            expect(display.isUnique()).toBe(false);
        });
    });

    describe('shortcuts', () => {
        let list: ObservableList<number>;
        let display: CollectionDisplay<number>;

        beforeEach(() => {
            list = new ObservableList({
                items: [1, 2, 3, 4],
            });
            display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });
        });

        describe('.getSourceIndexByIndex()', () => {
            it('should return equal indexes', () => {
                display.each((item, index) => {
                    expect(display.getSourceIndexByIndex(index)).toEqual(index);
                });
            });

            it('should return inverted indexes', () => {
                const max = display.getCount() - 1;
                display.setSort((a, b) => {
                    return b.collectionItem - a.collectionItem;
                });
                display.each((item, index) => {
                    expect(display.getSourceIndexByIndex(index)).toEqual(max - index);
                });
            });

            it('should return -1', () => {
                expect(display.getSourceIndexByIndex(-1)).toEqual(-1);
                expect(display.getSourceIndexByIndex(99)).toEqual(-1);
                expect(display.getSourceIndexByIndex(null)).toEqual(-1);
                expect(display.getSourceIndexByIndex(undefined)).toEqual(-1);
            });
        });

        describe('.getSourceIndexByItem()', () => {
            it('should return equal indexes', () => {
                display.each((item, index) => {
                    expect(display.getSourceIndexByItem(item)).toEqual(index);
                });
            });

            it('should return inverted indexes', () => {
                const max = display.getCount() - 1;
                display.setSort((a, b) => {
                    return b.collectionItem - a.collectionItem;
                });
                display.each((item, index) => {
                    expect(display.getSourceIndexByItem(item)).toEqual(max - index);
                });
            });

            it('should return -1', () => {
                expect(display.getSourceIndexByItem({} as any)).toEqual(-1);
                expect(display.getSourceIndexByItem(null)).toEqual(-1);
                expect(display.getSourceIndexByItem(undefined)).toEqual(-1);
            });
        });

        describe('.getIndexBySourceIndex()', () => {
            it('should return equal indexes', () => {
                list.each((item, index) => {
                    expect(display.getIndexBySourceIndex(index)).toEqual(index);
                });
            });

            it('should return inverted indexes', () => {
                const max = display.getCount() - 1;
                display.setSort((a, b) => {
                    return b.collectionItem - a.collectionItem;
                });
                list.each((item, index) => {
                    expect(display.getIndexBySourceIndex(index)).toEqual(max - index);
                });
            });

            it('should return -1', () => {
                expect(display.getIndexBySourceIndex(-1)).toEqual(-1);
                expect(display.getIndexBySourceIndex(99)).toEqual(-1);
                expect(display.getIndexBySourceIndex(null)).toEqual(-1);
                expect(display.getIndexBySourceIndex(undefined)).toEqual(-1);
            });
        });

        describe('.getIndexBySourceItem()', () => {
            it('should return equal indexes', () => {
                list.each((item, index) => {
                    expect(display.getIndexBySourceItem(item)).toEqual(index);
                });
            });

            it('should return inverted indexes', () => {
                const max = display.getCount() - 1;
                display.setSort((a, b) => {
                    return b.collectionItem - a.collectionItem;
                });
                list.each((item, index) => {
                    expect(display.getIndexBySourceItem(item)).toEqual(max - index);
                });
            });

            it('should return -1', () => {
                expect(display.getIndexBySourceItem({} as any)).toEqual(-1);
                expect(display.getIndexBySourceItem(null)).toEqual(-1);
                expect(display.getIndexBySourceItem(undefined)).toEqual(-1);
            });
        });

        describe('.getItemBySourceIndex()', () => {
            it('should return equal indexes', () => {
                list.each((item, index) => {
                    expect(display.getItemBySourceIndex(index)).toBe(display.at(index));
                });
            });

            it('should return inverted indexes', () => {
                const max = display.getCount() - 1;
                display.setSort((a, b) => {
                    return b.collectionItem - a.collectionItem;
                });
                list.each((item, index) => {
                    expect(display.getItemBySourceIndex(index)).toBe(display.at(max - index));
                });
            });

            it('should return undefined', () => {
                expect(display.getItemBySourceIndex(-1)).not.toBeDefined();
                expect(display.getItemBySourceIndex(99)).not.toBeDefined();
                expect(display.getItemBySourceIndex(null)).not.toBeDefined();
                expect(display.getItemBySourceIndex(undefined)).not.toBeDefined();
            });
        });

        describe('.getItemBySourceItem()', () => {
            it('should return equal indexes', () => {
                list.each((item, index) => {
                    expect(display.getItemBySourceItem(item)).toBe(display.at(index));
                });
            });

            it('should return inverted indexes', () => {
                const max = display.getCount() - 1;
                display.setSort((a, b) => {
                    return b.collectionItem - a.collectionItem;
                });
                list.each((item, index) => {
                    expect(display.getItemBySourceItem(item)).toBe(display.at(max - index));
                });
            });

            it('should return undefined', () => {
                expect(display.getItemBySourceItem({} as any)).not.toBeDefined();
                expect(display.getItemBySourceItem(null)).not.toBeDefined();
                expect(display.getItemBySourceItem(undefined)).not.toBeDefined();
            });
        });
    });

    describe('.setEventRaising()', () => {
        it('should enable and disable onCurrentChange', () => {
            let fired = false;
            const handler = () => {
                fired = true;
            };
        });

        it('should enable and disable onCollectionChange', () => {
            let fired = false;
            const handler = () => {
                fired = true;
            };

            display.subscribe('onCollectionChange', handler);

            display.setEventRaising(true);
            list.add({ id: 999 });
            expect(fired).toBe(true);

            fired = false;
            display.setEventRaising(false);
            list.add({ id: 1000 });
            expect(fired).toBe(false);

            display.unsubscribe('onCollectionChange', handler);
        });

        it('should enable and disable onBeforeCollectionChange when unfrozen without session', () => {
            let fired = false;
            const handler = () => {
                fired = true;
            };

            display.subscribe('onBeforeCollectionChange', handler);

            display.setEventRaising(false);
            list.add({ id: 999 });
            display.setEventRaising(true, true);
            display.unsubscribe('onBeforeCollectionChange', handler);

            expect(fired).toBe(false);
        });

        it('should save original element if source item has been removed and added in one transaction', () => {
            list.setEventRaising(false, true);
            const item = list.at(0);
            const displaysItem = display.getItemBySourceItem(item);
            list.removeAt(0);
            list.add(item, 1);
            list.setEventRaising(true, true);
            expect(display.getItemBySourceItem(item)).toEqual(displaysItem);
        });

        it('should fire after wake up', (done) => {
            const actions = [IBindCollection.ACTION_REMOVE, IBindCollection.ACTION_ADD];
            const contents = [list.at(0), list.at(0)];
            let fireId = 0;
            const handler = (event, action, newItems, newItemsIndex, oldItems) => {
                try {
                    expect(action).toBe(actions[fireId]);
                    switch (action) {
                        case IBindCollection.ACTION_ADD:
                            expect(newItems[0].getContents()).toBe(contents[fireId]);
                            break;
                        case IBindCollection.ACTION_REMOVE:
                        case IBindCollection.ACTION_MOVE:
                            expect(oldItems[0].getContents()).toBe(contents[fireId]);
                            break;
                    }
                    if (fireId === actions.length - 1) {
                        done();
                    }
                } catch (err) {
                    done(err);
                }
                fireId++;
            };

            display.subscribe('onCollectionChange', handler);
            display.setEventRaising(false, true);

            const item = list.at(0);
            list.removeAt(0);
            list.add(item);

            display.setEventRaising(true, true);
            display.unsubscribe('onCollectionChange', handler);
        });
    });

    describe('.isEventRaising()', () => {
        it('should return true by default', () => {
            expect(display.isEventRaising()).toBe(true);
        });

        it('should return true if enabled', () => {
            display.setEventRaising(true);
            expect(display.isEventRaising()).toBe(true);
        });

        it('should return false if disabled', () => {
            display.setEventRaising(false);
            expect(display.isEventRaising()).toBe(false);
        });
    });

    describe('.concat()', () => {
        it('should throw an error anyway', () => {
            expect(() => {
                (display as any).concat(new List());
            }).toThrow();
            expect(() => {
                (display as any).concat();
            }).toThrow();
        });
    });

    describe('.getSourceCollection()', () => {
        it('should return source collection', () => {
            expect(list).toBe(display.getSourceCollection() as any);
        });
    });

    describe('.getItems()', () => {
        it('should return array of items', () => {
            const items = display.getItems();
            expect(items.length > 0).toBe(true);
            for (let i = 0; i < items.length; i++) {
                expect(items[i]).toBe(display.at(i));
            }
        });
    });

    describe('.getItemUid()', () => {
        it("should return model's primary key value as String", () => {
            const list = new ObservableList({
                items: [
                    new Model({
                        rawData: { id: 1, foo: 'bar' },
                        keyProperty: 'foo',
                    }),
                ],
            });
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });

            expect(display.getItemUid(display.at(0))).toBe('bar');
        });

        it('should return keyProperty value as String', () => {
            const list = new ObservableList({
                items: [{ id: 1 }],
            });
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });

            expect(display.getItemUid(display.at(0))).toBe('1');
        });

        it('should return same value for same item', () => {
            const list = new ObservableList({
                items: [{ id: 'foo' }],
            });
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });
            const item = display.at(0);

            expect(display.getItemUid(item)).toBe('foo');
            expect(display.getItemUid(item)).toBe('foo');
        });

        it('should return variuos values for items with the same keyProperty value', () => {
            const list = new ObservableList({
                items: [{ id: 'foo' }, { id: 'bar' }, { id: 'foo' }, { id: 'foo' }],
            });
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });

            expect(display.getItemUid(display.at(0))).toBe('foo');
            expect(display.getItemUid(display.at(1))).toBe('bar');
            expect(display.getItemUid(display.at(2))).toBe('foo-1');
            expect(display.getItemUid(display.at(3))).toBe('foo-2');
        });

        it('should throw an error if keyProperty is empty', () => {
            const list = new ObservableList({
                items: [{ id: 1 }],
            });
            const display = new CollectionDisplay({
                collection: list,
            });
            const item = display.at(0);

            expect(() => {
                display.getItemUid(item);
            }).toThrow();
        });
    });

    describe('.getFirst()', () => {
        it('should return first item', () => {
            expect(display.getFirst()).toBe(display.at(0));
        });

        it('should not skip groups', () => {
            const items = [1, 2];
            const list = new List({
                items,
            });
            const display = new CollectionDisplay({
                collection: list,
                group: (item) => {
                    return item % 2;
                },
                keyProperty: 'id',
            });

            expect(display.getFirst()).toBe(display.at(0));
        });

        it('should skip groups for editingItems', () => {
            const items = [1, 2];
            const list = new List({
                items,
            });
            const display = new CollectionDisplay({
                collection: list,
                group: (item) => {
                    return item % 2;
                },
                keyProperty: 'id',
            });

            expect(display.getFirst('EditableItem')).toBe(display.at(1));
        });
    });

    describe('.getLast()', () => {
        it('should return last item', () => {
            expect(display.getLast()).toBe(display.at(display.getCount() - 1));
        });

        it('should return undefined in empty list', () => {
            list = new ObservableList({
                items: [],
            });
            display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });
            expect(display.getLast()).toBe(undefined);
        });
    });

    describe('.getNext()', () => {
        it('should return next item', () => {
            const item = display.at(0);
            expect(display.getNext(item)).toBe(display.at(1));
        });

        it('should skip groups', () => {
            const items = [1, 2, 3];
            const list = new List({
                items,
            });
            const display = new CollectionDisplay({
                collection: list,
                group: (item) => {
                    return item % 2;
                },
                keyProperty: 'id',
            });

            let item = display.at(1); // contents = 1
            expect(display.getNext(item)).toBe(display.at(2)); // contents = 3

            item = display.at(2); // contents = 3
            expect(display.getNext(item)).toBe(display.at(4)); // contents = 2

            item = display.at(4); // contents = 2
            expect(display.getNext(item)).not.toBeDefined();
        });
    });

    describe('.getPrevious()', () => {
        it('should return previous item', () => {
            const item = display.at(1);
            expect(display.getPrevious(item)).toBe(display.at(0));
        });

        it('should skip groups', () => {
            const items = [1, 2, 3];
            const list = new List({
                items,
            });
            const display = new CollectionDisplay({
                collection: list,
                group: (item) => {
                    return item % 2;
                },
                keyProperty: 'id',
            });

            let item = display.at(1); // contents = 1
            expect(display.getPrevious(item)).not.toBeDefined();

            item = display.at(2); // contents = 3
            expect(display.getPrevious(item)).toBe(display.at(1)); // contents = 1

            item = display.at(4); // contents = 2
            expect(display.getPrevious(item)).toBe(display.at(2)); // contents = 3
        });
    });

    describe('.subscribe()', () => {
        const outsideItems = [1, 3];
        const getItems = () => {
            return [1, 2, 3, 4];
        };
        const sort = (a, b) => {
            return b.collectionItem - a.collectionItem;
        };
        const filter = (item) => {
            return outsideItems.indexOf(item) === -1;
        };
        const getCollectionChangeHandler = (given, itemsMapper?) => {
            return (event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) => {
                given.push({
                    action,
                    newItems: itemsMapper ? newItems.map(itemsMapper) : newItems,
                    newItemsIndex,
                    oldItems: itemsMapper ? oldItems.map(itemsMapper) : oldItems,
                    oldItemsIndex,
                });
            };
        };
        const handleGiven = (given, action, newItems, newItemsIndex, oldItems, oldItemsIndex) => {
            given.push({
                action,
                newItems,
                newItemsIndex,
                oldItems,
                oldItemsIndex,
            });
        };
        const checkGivenAndExpected = (given, expected) => {
            expect(expected.length).toEqual(given.length);

            for (let i = 0; i < given.length; i++) {
                expect(given[i].action).toBe(expected[i].action);

                expect(given[i].newItems.length).toBe(expected[i].newItems.length);
                expect(given[i].newItemsIndex).toBe(expected[i].newItemsIndex);
                for (let j = 0; j < given[i].newItems.length; j++) {
                    expect(given[i].newItems[j].getContents()).toBe(expected[i].newItems[j]);
                }

                expect(given[i].oldItems.length).toBe(expected[i].oldItems.length);
                expect(given[i].oldItemsIndex).toBe(expected[i].oldItemsIndex);
                for (let j = 0; j < given[i].oldItems.length; j++) {
                    expect(given[i].oldItems[j].getContents()).toBe(expected[i].oldItems[j]);
                }
            }
        };

        describe('when change a collection', () => {
            const itemsOld = getItems();
            const itemsNew = [9, 8, 7];
            // TODO Usually a reset event is fired on assign, however we've
            // disabled it in favour of the complete recreation of the collection.
            // Decide if this test is still applicable.
            const cases = [
                // {
                //     method: 'assign',
                //     action: IBindCollection.ACTION_RESET,
                //     newAt: 0,
                //     newItems: itemsNew,
                //     oldAt: 0,
                //     oldItems: itemsOld
                // },
                {
                    method: 'append',
                    action: IBindCollection.ACTION_ADD,
                    newAt: 4,
                    newItems: itemsNew,
                    oldAt: 0,
                    oldItems: [],
                },
                {
                    method: 'prepend',
                    action: IBindCollection.ACTION_ADD,
                    newAt: 0,
                    newItems: itemsNew,
                    oldAt: 0,
                    oldItems: [],
                },
                // {
                //     method: 'clear',
                //     action: IBindCollection.ACTION_RESET,
                //     newAt: 0,
                //     newItems: [],
                //     oldAt: 0,
                //     oldItems: itemsOld
                // }
            ];

            while (cases.length) {
                ((theCase) => {
                    it(`should fire "onCollectionChange" on ${theCase.method}`, () => {
                        const given: any[] = [];
                        const handler = (
                            event,
                            action,
                            newItems,
                            newItemsIndex,
                            oldItems,
                            oldItemsIndex
                        ) => {
                            given.push({
                                action,
                                newItems,
                                newItemsIndex,
                                oldItems,
                                oldItemsIndex,
                            });
                        };
                        const list = new ObservableList({
                            items: itemsOld.slice(),
                        });
                        const display = new CollectionDisplay({
                            collection: list,
                            keyProperty: 'id',
                        });

                        display.subscribe('onCollectionChange', handler);
                        display.getSourceCollection()[theCase.method](itemsNew);
                        display.unsubscribe('onCollectionChange', handler);

                        expect(given.length).toBe(1);

                        const firstGiven = given[0];
                        expect(firstGiven.action).toBe(theCase.action);

                        expect(firstGiven.newItems.length).toBe(theCase.newItems.length);
                        for (let i = 0; i < theCase.newItems.length; i++) {
                            expect(firstGiven.newItems[i].getContents()).toBe(theCase.newItems[i]);
                        }
                        expect(firstGiven.newItemsIndex).toBe(theCase.newAt);

                        expect(firstGiven.oldItems.length).toBe(theCase.oldItems.length);
                        for (let i = 0; i < theCase.oldItems.length; i++) {
                            expect(firstGiven.oldItems[i].getContents()).toBe(theCase.oldItems[i]);
                        }
                        expect(firstGiven.oldItemsIndex).toBe(theCase.oldAt);
                    });

                    it(
                        'should fire "onBeforeCollectionChange" then "onCollectionChange" and then' +
                            `"onAfterCollectionChange" on ${theCase.method}`,
                        () => {
                            const expected = ['before', 'on', 'after'];
                            const given = [];
                            const handlerBefore = () => {
                                given.push('before');
                            };
                            const handlerOn = () => {
                                given.push('on');
                            };
                            const handlerAfter = () => {
                                given.push('after');
                            };
                            const list = new ObservableList({
                                items: itemsOld.slice(),
                            });
                            const display = new CollectionDisplay({
                                collection: list,
                                keyProperty: 'id',
                            });

                            display.subscribe('onBeforeCollectionChange', handlerBefore);
                            display.subscribe('onCollectionChange', handlerOn);
                            display.subscribe('onAfterCollectionChange', handlerAfter);

                            display.getSourceCollection()[theCase.method](itemsNew);

                            display.unsubscribe('onBeforeCollectionChange', handlerBefore);
                            display.unsubscribe('onCollectionChange', handlerOn);
                            display.unsubscribe('onAfterCollectionChange', handlerAfter);

                            expect(given).toEqual(expected);
                        }
                    );
                })(cases.shift());
            }
        });

        it('should fire "onCollectionChange" after add an item', (done) => {
            const items = getItems();
            const list = new ObservableList({
                items,
            });
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });
            const handler = (event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) => {
                try {
                    expect(action).toBe(IBindCollection.ACTION_ADD);
                    expect(newItems[0].getContents()).toBe(5);
                    expect(newItemsIndex).toBe(items.length - 1);
                    expect(oldItems.length).toBe(0);
                    expect(oldItemsIndex).toBe(0);
                    done();
                } catch (err) {
                    done(err);
                }
            };

            display.subscribe('onCollectionChange', handler);
            list.add(5);
            display.unsubscribe('onCollectionChange', handler);
        });

        it('should fire "onCollectionChange" after add an item if filter uses display index', () => {
            const items = getItems();
            const list = new ObservableList({
                items,
            });
            const display = new CollectionDisplay({
                collection: list,
                filter: (item, index, collectionItem, collectionIndex) => {
                    return collectionIndex < 3;
                },
            });
            const expected = [
                [IBindCollection.ACTION_REMOVE, [], 0, [3], 2],
                [IBindCollection.ACTION_ADD, [999], 1, [], 0],
            ];
            const given = [];
            const handler = (event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) => {
                given.push([
                    action,
                    newItems.map((item) => {
                        return item.getContents();
                    }),
                    newItemsIndex,
                    oldItems.map((item) => {
                        return item.getContents();
                    }),
                    oldItemsIndex,
                ]);
            };

            display.subscribe('onCollectionChange', handler);
            list.add(999, 1);
            display.unsubscribe('onCollectionChange', handler);

            expect(given).toEqual(expected);
        });

        it('should fire "onCollectionChange" after remove an item', (done) => {
            const items = getItems();
            const list = new ObservableList({
                items,
            });
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });
            const handler = (event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) => {
                try {
                    expect(action).toBe(IBindCollection.ACTION_REMOVE);
                    expect(newItems.length).toBe(0);
                    expect(newItemsIndex).toBe(0);
                    expect(oldItems[0].getContents()).toBe(2);
                    expect(oldItemsIndex).toBe(1);
                    done();
                } catch (err) {
                    done(err);
                }
            };

            display.subscribe('onCollectionChange', handler);
            list.remove(2);
            display.unsubscribe('onCollectionChange', handler);
        });

        it('should fire "onCollectionChange" after remove an item if filter uses display index', () => {
            const items = getItems();
            const list = new ObservableList({
                items,
            });
            const display = new CollectionDisplay({
                collection: list,
                filter: (item, index, collectionItem, collectionIndex) => {
                    return collectionIndex < 3;
                },
                keyProperty: 'id',
            });
            const expected = [
                [IBindCollection.ACTION_REMOVE, [], 0, [2], 1],
                [IBindCollection.ACTION_ADD, [4], 2, [], 0],
            ];
            const given = [];
            const handler = (event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) => {
                given.push([
                    action,
                    newItems.map((item) => {
                        return item.getContents();
                    }),
                    newItemsIndex,
                    oldItems.map((item) => {
                        return item.getContents();
                    }),
                    oldItemsIndex,
                ]);
            };

            display.subscribe('onCollectionChange', handler);
            list.removeAt(1);
            display.unsubscribe('onCollectionChange', handler);

            expect(given).toEqual(expected);
        });

        it('should fire "onCollectionChange" after replace an item', () => {
            const items = getItems();
            const list = new ObservableList({
                items,
            });
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });
            const given = [];
            const expected = [
                {
                    action: IBindCollection.ACTION_CHANGE,
                    newItems: [33],
                    newItemsIndex: 2,
                    oldItems: [33],
                    oldItemsIndex: 2,
                },
            ];
            const handler = (event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) => {
                handleGiven(given, action, newItems, newItemsIndex, oldItems, oldItemsIndex);
            };

            display.subscribe('onCollectionChange', handler);
            list.replace(33, 2);
            display.unsubscribe('onCollectionChange', handler);

            checkGivenAndExpected(given, expected);
        });

        it('should fire "onCollectionChange" after move an item forward', () => {
            const items = [1, 2, 3, 4];
            const list = new ObservableList({
                items,
            });
            const display = new CollectionDisplay({
                collection: list,
            });
            const moveFrom = 1;
            const moveTo = 2;
            const expected = [
                {
                    action: IBindCollection.ACTION_MOVE,
                    newItems: [items[moveTo]],
                    newItemsIndex: moveFrom,
                    oldItems: [items[moveTo]],
                    oldItemsIndex: moveTo,
                },
            ];
            const given = [];
            const handler = getCollectionChangeHandler(given, (item) => {
                return item.getContents();
            });

            display.subscribe('onCollectionChange', handler);
            list.move(moveFrom, moveTo);
            display.unsubscribe('onCollectionChange', handler);

            expect(given).toEqual(expected);
        });

        it('should fire "onCollectionChange" after move an item backward', () => {
            const items = [1, 2, 3, 4];
            const list = new ObservableList({
                items,
            });
            const display = new CollectionDisplay({
                collection: list,
            });
            const moveFrom = 2;
            const moveTo = 1;
            const expected = [
                {
                    action: IBindCollection.ACTION_MOVE,
                    newItems: [items[moveFrom]],
                    newItemsIndex: moveTo,
                    oldItems: [items[moveFrom]],
                    oldItemsIndex: moveFrom,
                },
            ];
            const given = [];
            const handler = getCollectionChangeHandler(given, (item) => {
                return item.getContents();
            });

            display.subscribe('onCollectionChange', handler);
            list.move(moveFrom, moveTo);
            display.unsubscribe('onCollectionChange', handler);

            expect(given).toEqual(expected);
        });

        it('should fire "onCollectionChange" after change wreezed item with grouping', () => {
            const items = [{ id: 1 }, { id: 2 }];
            const list = new RecordSet({
                rawData: items,
                keyProperty: 'id',
            });
            const display = new CollectionDisplay({
                collection: list,
                group: () => {
                    return 'group';
                },
            });
            const changedItem = list.at(0);
            const given = [];
            const expected = [
                {
                    action: IBindCollection.ACTION_CHANGE,
                    newItems: [changedItem],
                    newItemsIndex: 1,
                    oldItems: [changedItem],
                    oldItemsIndex: 1,
                },
            ];
            const handler = (event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) => {
                handleGiven(given, action, newItems, newItemsIndex, oldItems, oldItemsIndex);
            };

            list.setEventRaising(false, true);
            changedItem.set('id', 'foo');
            display.subscribe('onCollectionChange', handler);
            list.setEventRaising(true, true);
            display.unsubscribe('onCollectionChange', handler);

            checkGivenAndExpected(given, expected);
        });

        it('should fire "onCollectionChange" after sort the display', () => {
            const list = new ObservableList({
                items: getItems(),
            });
            const display = new CollectionDisplay({
                collection: list,
            });
            const given = [];
            const expected = [
                {
                    action: IBindCollection.ACTION_MOVE, // 4, 1, 2, 3
                    newItems: [4],
                    newItemsIndex: 0,
                    oldItems: [4],
                    oldItemsIndex: 3,
                },
                {
                    action: IBindCollection.ACTION_MOVE, // 4, 3, 1, 2
                    newItems: [3],
                    newItemsIndex: 1,
                    oldItems: [3],
                    oldItemsIndex: 3,
                },
                {
                    action: IBindCollection.ACTION_MOVE, // 4, 3, 2, 1
                    newItems: [2],
                    newItemsIndex: 2,
                    oldItems: [2],
                    oldItemsIndex: 3,
                },
            ];
            const handler = (event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) => {
                handleGiven(given, action, newItems, newItemsIndex, oldItems, oldItemsIndex);
            };

            display.subscribe('onCollectionChange', handler);
            display.setSort(sort); // 1, 2, 3, 4 -> 4, 3, 2, 1
            display.unsubscribe('onCollectionChange', handler);

            checkGivenAndExpected(given, expected);
        });

        it('should fire "onCollectionChange" after sort the display if items moved forward', () => {
            const list = new ObservableList({
                items: [1, 2, 4, 5, 6, 3, 7, 8, 9, 10],
            });
            const display = new CollectionDisplay({
                collection: list,
            });
            const given = [];
            const expected = [
                {
                    action: IBindCollection.ACTION_MOVE,
                    newItems: [3],
                    newItemsIndex: 2,
                    oldItems: [3],
                    oldItemsIndex: 5,
                },
            ];
            const handler = (event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) => {
                handleGiven(given, action, newItems, newItemsIndex, oldItems, oldItemsIndex);
            };

            display.subscribe('onCollectionChange', handler);
            // 1, 2, 4, 5, 6, 3, 7, 8, 9, 10 -> 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
            display.setSort((a, b) => {
                return a.collectionItem - b.collectionItem;
            });
            display.unsubscribe('onCollectionChange', handler);

            checkGivenAndExpected(given, expected);
        });

        it('should fire "onCollectionChange" after filter the display', (done) => {
            const list = new ObservableList({
                items: getItems(),
            });
            const display = new CollectionDisplay({
                collection: list,
            });
            const firesToBeDone = 1;
            let fireId = 0;
            const handler = (event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) => {
                try {
                    expect(action).toBe(IBindCollection.ACTION_REMOVE);
                    expect(newItems.length).toBe(0);
                    expect(newItemsIndex).toBe(0);
                    expect(outsideItems.indexOf(oldItems[0].getContents())).not.toEqual(-1);
                    expect(oldItemsIndex).toBe(fireId);
                    if (fireId === firesToBeDone) {
                        done();
                    }
                } catch (err) {
                    done(err);
                }
                fireId++;
            };

            display.subscribe('onCollectionChange', handler);
            display.setFilter(filter);
            display.unsubscribe('onCollectionChange', handler);
        });

        it('should fire "onCollectionChange" with move after group the display', () => {
            const list = new ObservableList({
                items: [
                    { id: 1, group: 1 },
                    { id: 2, group: 2 },
                    { id: 3, group: 1 },
                    { id: 4, group: 2 },
                ],
            });
            const display = new CollectionDisplay({
                collection: list,
            });
            const given = [];
            const expected = [
                {
                    action: IBindCollection.ACTION_ADD,
                    newItems: [1],
                    newItemsIndex: 0,
                    oldItems: [],
                    oldItemsIndex: 0,
                },
                {
                    action: IBindCollection.ACTION_ADD,
                    newItems: [2],
                    newItemsIndex: 3,
                    oldItems: [],
                    oldItemsIndex: 0,
                },
                {
                    action: IBindCollection.ACTION_MOVE,
                    newItems: [list.at(2)],
                    newItemsIndex: 2,
                    oldItems: [list.at(2)],
                    oldItemsIndex: 4,
                },
                {
                    action: IBindCollection.ACTION_MOVE,
                    newItems: [2],
                    newItemsIndex: 3,
                    oldItems: [2],
                    oldItemsIndex: 4,
                },
            ];
            const handler = (event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) => {
                handleGiven(given, action, newItems, newItemsIndex, oldItems, oldItemsIndex);
            };

            display.subscribe('onCollectionChange', handler);
            display.setGroup((item) => {
                return item.group;
            });
            display.unsubscribe('onCollectionChange', handler);

            // 1, 2, 3, 4 ->
            // (1), 1, 2, 3, 4 ->
            // (1), 1, 2, (2), 3, 4 ->
            // (1), 1, 3, 2, (2), 4 ->
            // (1), 1, 3, (2), 2, 4

            checkGivenAndExpected(given, expected);
        });

        it('should fire "onCollectionChange" not split by groups after add an items', () => {
            const list = new ObservableList({
                items: [
                    { id: 1, group: 1 },
                    { id: 2, group: 1 },
                    { id: 3, group: 1 },
                    { id: 4, group: 1 },
                ],
            });
            const display = new CollectionDisplay({
                collection: list,
            });
            const newItems = [
                { id: 5, group: 2 },
                { id: 6, group: 1 },
                { id: 7, group: 2 },
                { id: 8, group: 3 },
            ];
            const given = [];
            const expected = [
                {
                    action: IBindCollection.ACTION_ADD,
                    newItems: [newItems[1], 2, newItems[0], newItems[2], 3, newItems[3]],
                    newItemsIndex: 5,
                    oldItems: [],
                    oldItemsIndex: 0,
                },
            ];
            const handler = (event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) => {
                handleGiven(given, action, newItems, newItemsIndex, oldItems, oldItemsIndex);
            };

            display.setGroup((item) => {
                return item.group;
            });
            display.subscribe('onCollectionChange', handler);
            list.append(newItems);

            // (1), 1, 2, 3, 4 ->
            // (1), 1, 2, 3, 4, 6 ->
            // (1), 1, 2, 3, 4, 6, (2), 5, 7 ->
            // (1), 1, 2, 3, 4, 6, (2), 5, 7, (3), 8
            display.unsubscribe('onCollectionChange', handler);

            checkGivenAndExpected(given, expected);
        });

        it('should fire "onCollectionChange" split by groups after remove an items', () => {
            const list = new ObservableList({
                items: [
                    { id: 1, group: 1 },
                    { id: 2, group: 1 },
                    { id: 3, group: 2 },
                    { id: 4, group: 2 },
                ],
            });
            const display = new CollectionDisplay({
                collection: list,
            });
            const given = [];
            const expected = [
                {
                    action: IBindCollection.ACTION_REMOVE,
                    newItems: [],
                    newItemsIndex: 0,
                    oldItems: [1, list.at(0), list.at(1)],
                    oldItemsIndex: 0,
                },
                {
                    action: IBindCollection.ACTION_REMOVE,
                    newItems: [],
                    newItemsIndex: 0,
                    oldItems: [list.at(3)],
                    oldItemsIndex: 2,
                },
            ];
            const handler = (event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) => {
                handleGiven(given, action, newItems, newItemsIndex, oldItems, oldItemsIndex);
            };

            display.setGroup((item) => {
                return item.group;
            });
            display.subscribe('onCollectionChange', handler);
            list.setEventRaising(false, true);
            list.removeAt(3);
            list.removeAt(1);
            list.removeAt(0);
            list.setEventRaising(true, true);
            display.unsubscribe('onCollectionChange', handler);

            checkGivenAndExpected(given, expected);
        });

        it('should fire "onCollectionChange" with valid group after filter an items', () => {
            const list = new ObservableList({
                items: [
                    { id: 1, group: 1 },
                    { id: 2, group: 1 },
                    { id: 3, group: 2 },
                    { id: 4, group: 2 },
                ],
            });
            const display = new CollectionDisplay({
                collection: list,
            });
            const given = [];
            const expected = [
                {
                    action: IBindCollection.ACTION_REMOVE,
                    newItems: [],
                    newItemsIndex: 0,
                    oldItems: [list.at(1)],
                    oldItemsIndex: 2,
                },
            ];
            const handler = (event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) => {
                handleGiven(given, action, newItems, newItemsIndex, oldItems, oldItemsIndex);
            };

            display.setGroup((item) => {
                return item.group;
            });
            display.subscribe('onCollectionChange', handler);
            list.setEventRaising(false, true);
            display.setFilter((item) => {
                return item.id !== 2;
            });
            list.setEventRaising(true, true);
            display.unsubscribe('onCollectionChange', handler);

            checkGivenAndExpected(given, expected);
        });

        it('should fire "onCollectionChange" with valid item contents when work in events queue', () => {
            const getModel = (data) => {
                return new Model({
                    keyProperty: 'id',
                    rawData: data,
                });
            };
            const list = new ObservableList({
                items: [getModel({ id: 1 }), getModel({ id: 2 }), getModel({ id: 3 })],
            });

            let updatedItem;
            let displayUpdatedItem;
            list.subscribe('onCollectionChange', () => {
                updatedItem = list.at(1);
                updatedItem.set('id', 'test');
            });

            const display = new CollectionDisplay({
                collection: list,
            });

            display.subscribe('onCollectionChange', (e, action, newItems) => {
                if (newItems.length) {
                    displayUpdatedItem = newItems[0].getContents();
                }
            });

            list.removeAt(0);

            expect(updatedItem).toBe(displayUpdatedItem);
        });

        it('should keep sequence "onBeforeCollectionChange, onCollectionChange, onAfterCollectionChange" unbreakable', () => {
            const expected = ['onList', 'before', 'on', 'after', 'before', 'on', 'after'];
            const list = new ObservableList();
            // eslint-disable-next-line prefer-const
            let display;
            const given = [];

            let filterAdded = false;
            const handlerOnList = () => {
                given.push('onList');
            };
            const handlerBefore = () => {
                given.push('before');
                if (!filterAdded) {
                    filterAdded = true;
                    display.setFilter(() => {
                        return false;
                    });
                }
            };
            const handlerOn = () => {
                given.push('on');
            };
            const handlerAfter = () => {
                given.push('after');
            };

            list.subscribe('onCollectionChange', handlerOnList);

            display = new CollectionDisplay({
                collection: list,
            });
            display.subscribe('onBeforeCollectionChange', handlerBefore);
            display.subscribe('onCollectionChange', handlerOn);
            display.subscribe('onAfterCollectionChange', handlerAfter);

            list.add('foo');

            list.unsubscribe('onCollectionChange', handlerOnList);
            display.unsubscribe('onBeforeCollectionChange', handlerBefore);
            display.unsubscribe('onCollectionChange', handlerOn);
            display.unsubscribe('onAfterCollectionChange', handlerAfter);

            expect(given).toEqual(expected);
        });

        it('should fire "onCollectionChange" after setEventRaising if "analize" is true', () => {
            let fired = false;
            const args = {} as {
                action: string;
                newItems: CollectionItem<IItem>[];
                newItemsIndex: number;
                oldItems: CollectionItem<IItem>[];
                oldItemsIndex: number;
            };
            const handler = (event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) => {
                fired = true;
                args.action = action;
                args.newItems = newItems;
                args.newItemsIndex = newItemsIndex;
                args.oldItems = oldItems;
                args.oldItemsIndex = oldItemsIndex;
            };

            display.subscribe('onCollectionChange', handler);
            display.setEventRaising(false, true);
            list.add({ id: 999 });

            expect(fired).toBe(false);

            display.setEventRaising(true, true);
            display.unsubscribe('onCollectionChange', handler);

            expect(fired).toBe(true);
            expect(args.action).toBe(IBindCollection.ACTION_ADD);
            expect(args.newItems[0].getContents().id).toBe(999);
            expect(args.newItemsIndex).toBe(list.getCount() - 1);
            expect(args.oldItems.length).toBe(0);
            expect(args.oldItemsIndex).toBe(0);
        });

        it('should fire "onCollectionChange" after setEventRaising if items was moved', () => {
            const expected = [
                {
                    action: IBindCollection.ACTION_REMOVE,
                    newItems: [],
                    oldItems: [list.at(0)],
                },
                {
                    action: IBindCollection.ACTION_ADD,
                    newItems: [list.at(0)],
                    oldItems: [],
                },
            ];
            const given = [];
            const handler = (event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) => {
                given.push({
                    action,
                    newItems: newItems.map((item) => {
                        return item.getContents();
                    }),
                    newItemsIndex,
                    oldItems: oldItems.map((item) => {
                        return item.getContents();
                    }),
                    oldItemsIndex,
                });
            };

            display.subscribe('onCollectionChange', handler);
            display.setEventRaising(false, true);

            const item = list.at(0);
            list.removeAt(0);
            list.add(item);

            display.setEventRaising(true, true);
            display.unsubscribe('onCollectionChange', handler);

            expect(given.length).toBe(expected.length);
            for (let i = 0; i < given.length; i++) {
                expect(given[i].action).toBe(expected[i].action);
                expect(given[i].newItems).toEqual(expected[i].newItems);
                expect(given[i].oldItems).toEqual(expected[i].oldItems);
            }
        });

        it(
            'should fire "onCollectionChange" with valid item contents when the display and the collection are not ' +
                'synchronized',
            () => {
                const getModel = (data) => {
                    return new Model({ rawData: data, keyProperty: 'id' });
                };
                const items = [
                    getModel({ id: 'one' }),
                    getModel({ id: 'two' }),
                    getModel({ id: 'three' }),
                ];
                const list = new ObservableList({
                    items,
                });
                const display = new CollectionDisplay({
                    collection: list,
                });
                let expectItem;
                let givenItem;
                let expectIndex;
                let givenIndex;

                display.subscribe('onCollectionChange', (e, action, newItems, newItemsIndex) => {
                    if (action === IBindCollection.ACTION_CHANGE) {
                        givenItem = newItems[0].getContents();
                        givenIndex = newItemsIndex;
                    }
                });

                const handler = (event, action) => {
                    if (action === IBindCollection.ACTION_REMOVE) {
                        expectIndex = 1;
                        expectItem = list.at(expectIndex);
                        expectItem.set('id', 'foo');
                    }
                };
                list.setEventRaising(false, true);
                list.subscribe('onCollectionChange', handler);
                list.removeAt(0);
                list.add(getModel({ id: 'bar' }), 1);
                list.setEventRaising(true, true);
                list.unsubscribe('onCollectionChange', handler);

                expect(expectItem).toBeDefined();
                expect(givenItem).toBe(expectItem);
                expect(givenIndex).toBe(expectIndex);
            }
        );

        it(
            'should fire "onBeforeCollectionChange" and "onAfterCollectionChange" around each change when the ' +
                'display and the collection are not synchronized',
            () => {
                const list = new RecordSet({
                    rawData: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                    keyProperty: 'id',
                });
                const display = new CollectionDisplay({
                    collection: list,
                });
                const expected = [
                    'before',
                    IBindCollection.ACTION_REMOVE,
                    'after',
                    'before',
                    IBindCollection.ACTION_CHANGE,
                    'after',
                    'before',
                    IBindCollection.ACTION_CHANGE,
                    'after',
                ];
                const given = [];
                const handlerBefore = () => {
                    given.push('before');
                };
                const handlerAfter = () => {
                    given.push('after');
                };
                const handlerOn = (event, action) => {
                    given.push(action);
                };
                const handlerOnList = (event, action) => {
                    if (action === IBindCollection.ACTION_REMOVE) {
                        list.at(0).set('id', 'foo');
                        list.at(1).set('id', 'bar');
                    }
                };

                display.subscribe('onBeforeCollectionChange', handlerBefore);
                display.subscribe('onCollectionChange', handlerOn);
                display.subscribe('onAfterCollectionChange', handlerAfter);
                list.subscribe('onCollectionChange', handlerOnList);

                list.setEventRaising(false, true);
                list.removeAt(3);
                list.setEventRaising(true, true);

                display.unsubscribe('onBeforeCollectionChange', handlerBefore);
                display.unsubscribe('onCollectionChange', handlerOn);
                display.unsubscribe('onAfterCollectionChange', handlerAfter);
                list.unsubscribe('onCollectionChange', handlerOnList);

                expect(given).toEqual(expected);
            }
        );

        it('should trigger "onCollectionChange" with ACTION_CHANGE if source collection item changed while frozen', () => {
            const list = new RecordSet({
                rawData: items,
                keyProperty: 'id',
            });
            const display = new CollectionDisplay({
                collection: list,
            });
            const expected = [
                {
                    action: IBindCollection.ACTION_CHANGE,
                    newItems: [list.at(2)],
                    newItemsIndex: 2,
                    oldItems: [list.at(2)],
                    oldItemsIndex: 2,
                },
            ];
            const given = [];
            const handler = (event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) => {
                given.push({
                    action,
                    newItems,
                    newItemsIndex,
                    oldItems,
                    oldItemsIndex,
                });
            };

            list.setEventRaising(false, true);
            list.at(2).set('name', 'foo');
            display.subscribe('onCollectionChange', handler);
            list.setEventRaising(true, true);
            display.unsubscribe('onCollectionChange', handler);

            expect(given.length).toEqual(expected.length);
            for (let i = 0; i < given.length; i++) {
                expect(given[i].action).toBe(expected[i].action);

                expect(given[i].newItems.length).toBe(expected[i].newItems.length);
                expect(given[i].newItemsIndex).toBe(expected[i].newItemsIndex);
                for (let j = 0; j < given[i].newItems.length; j++) {
                    expect(given[i].newItems[j].getContents()).toBe(expected[i].newItems[j]);
                }

                expect(given[i].oldItems.length).toBe(expected[i].oldItems.length);
                expect(given[i].oldItemsIndex).toBe(expected[i].oldItemsIndex);
                for (let j = 0; j < given[i].oldItems.length; j++) {
                    expect(given[i].oldItems[j].getContents()).toBe(expected[i].oldItems[j]);
                }
            }
        });

        it(
            'should trigger "onCollectionChange" with ACTION_CHANGE if source collection items changed while frozen ' +
                'and display inverts the collection',
            () => {
                const list = new RecordSet({
                    rawData: items,
                    keyProperty: 'id',
                });
                const max = list.getCount() - 1;
                const display = new CollectionDisplay({
                    collection: list,
                    sort: (a, b) => {
                        return b.index - a.index;
                    },
                });
                const expected = [
                    {
                        action: IBindCollection.ACTION_CHANGE,
                        newItems: [list.at(1)],
                        newItemsIndex: max - 1,
                        oldItems: [list.at(1)],
                        oldItemsIndex: max - 1,
                    },
                    {
                        action: IBindCollection.ACTION_CHANGE,
                        newItems: [list.at(4), list.at(3)],
                        newItemsIndex: max - 4,
                        oldItems: [list.at(4), list.at(3)],
                        oldItemsIndex: max - 4,
                    },
                    {
                        action: IBindCollection.ACTION_CHANGE,
                        newItems: [list.at(6)],
                        newItemsIndex: max - 6,
                        oldItems: [list.at(6)],
                        oldItemsIndex: max - 6,
                    },
                ];
                const given = [];
                const handler = (
                    event,
                    action,
                    newItems,
                    newItemsIndex,
                    oldItems,
                    oldItemsIndex
                ) => {
                    given.push({
                        action,
                        newItems,
                        newItemsIndex,
                        oldItems,
                        oldItemsIndex,
                    });
                };

                list.setEventRaising(false, true);
                list.at(1).set('name', 'fooA');
                list.at(3).set('name', 'fooB');
                list.at(4).set('name', 'fooC');
                list.at(6).set('name', 'fooD');
                display.subscribe('onCollectionChange', handler);
                list.setEventRaising(true, true);
                display.unsubscribe('onCollectionChange', handler);

                expect(given.length).toEqual(expected.length);
                for (let i = 0; i < given.length; i++) {
                    expect(given[i].action).toBe(expected[i].action);

                    expect(given[i].newItems.length).toBe(expected[i].newItems.length);
                    expect(given[i].newItemsIndex).toBe(expected[i].newItemsIndex);
                    for (let j = 0; j < given[i].newItems.length; j++) {
                        expect(given[i].newItems[j].getContents()).toBe(expected[i].newItems[j]);
                    }

                    expect(given[i].oldItems.length).toBe(expected[i].oldItems.length);
                    expect(given[i].oldItemsIndex).toBe(expected[i].oldItemsIndex);
                    for (let j = 0; j < given[i].oldItems.length; j++) {
                        expect(given[i].oldItems[j].getContents()).toBe(expected[i].oldItems[j]);
                    }
                }
            }
        );

        it('should fire "onCollectionChange" after change an item', () => {
            const items = [{ id: 1 }, { id: 2 }, { id: 3 }];
            const list = new RecordSet({
                rawData: items,
                keyProperty: 'id',
            });
            const display = new CollectionDisplay({
                collection: list,
            });
            const given = [];
            const expected = [
                {
                    items: [display.at(1)],
                    index: 1,
                },
            ];
            const handler = (event, action, newItems, newItemsIndex) => {
                given.push({
                    items: newItems,
                    index: newItemsIndex,
                });
            };

            display.subscribe('onCollectionChange', handler);
            list.at(1).set('id', 'bar');
            display.unsubscribe('onCollectionChange', handler);

            expect(given.length).toBe(expected.length);
            for (let i = 0; i < given.length; i++) {
                expect(given[i].items).toEqual(expected[i].items);
                expect(given[i].index).toBe(expected[i].index);
            }
        });

        it('should fire "onCollectionChange" after change an item in group', () => {
            const items = [
                { id: 1, g: 1 },
                { id: 2, g: 1 },
                { id: 3, g: 2 },
            ];
            const list = new RecordSet({
                rawData: items,
                keyProperty: 'id',
            });
            const display = new CollectionDisplay({
                collection: list,
                group: (item) => {
                    return item.get('g');
                },
            });
            const given = [];
            const expected = [
                {
                    items: [display.at(2)],
                    index: 2,
                },
            ];
            const handler = (event, action, newItems, newItemsIndex) => {
                given.push({
                    items: newItems,
                    index: newItemsIndex,
                });
            };

            display.subscribe('onCollectionChange', handler);
            list.at(1).set('id', 'bar');
            display.unsubscribe('onCollectionChange', handler);

            expect(given.length).toBe(expected.length);
            for (let i = 0; i < given.length; i++) {
                expect(given[i].items).toEqual(expected[i].items);
                expect(given[i].index).toBe(expected[i].index);
            }
        });

        it('should fire "onCollectionChange" after changed item is not moved as item only changed', () => {
            const items = [{ id: 1 }, { id: 3 }, { id: 5 }];
            const list = new RecordSet({
                rawData: items,
                keyProperty: 'id',
            });
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
                sort: (a, b) => {
                    return a.collectionItem.get('id') - b.collectionItem.get('id');
                },
            });
            const given = [];
            const expected = [
                {
                    action: IBindCollection.ACTION_CHANGE,
                    newItems: [display.at(1)],
                    newItemsIndex: 1,
                    oldItems: [display.at(1)],
                    oldItemsIndex: 1,
                },
            ];
            const handler = (event, action, newItems, newItemsIndex, oldItems, oldItemsIndex) => {
                given.push({
                    action,
                    newItems,
                    newItemsIndex,
                    oldItems,
                    oldItemsIndex,
                });
            };

            display.subscribe('onCollectionChange', handler);
            list.at(1).set('id', 2);
            display.unsubscribe('onCollectionChange', handler);

            expect(given.length).toBe(expected.length);
            for (let i = 0; i < given.length; i++) {
                expect(given[i].action).toEqual(expected[i].action);
                expect(given[i].newItems).toEqual(expected[i].newItems);
                expect(given[i].newItemsIndex).toBe(expected[i].newItemsIndex);
                expect(given[i].oldItems).toEqual(expected[i].oldItems);
                expect(given[i].oldItemsIndex).toBe(expected[i].oldItemsIndex);
            }
        });

        it(
            'should fire "onCollectionChange" after changed item is moved down as it\'s sibling moved up and item ' +
                'changed',
            () => {
                const items = [{ id: 1 }, { id: 3 }, { id: 5 }];
                list = new RecordSet({
                    rawData: items,
                    keyProperty: 'id',
                });
                const display = new CollectionDisplay({
                    collection: list,
                    keyProperty: 'id',
                    sort: (a, b) => {
                        return a.collectionItem.get('id') - b.collectionItem.get('id');
                    },
                });
                const given = [];
                const expected = [
                    {
                        action: IBindCollection.ACTION_MOVE,
                        newItems: [display.at(1)],
                        newItemsIndex: 0,
                        oldItems: [display.at(1)],
                        oldItemsIndex: 1,
                    },
                    {
                        action: IBindCollection.ACTION_CHANGE,
                        newItems: [display.at(0)],
                        newItemsIndex: 1,
                        oldItems: [display.at(0)],
                        oldItemsIndex: 1,
                    },
                ];
                const handler = (
                    event,
                    action,
                    newItems,
                    newItemsIndex,
                    oldItems,
                    oldItemsIndex
                ) => {
                    given.push({
                        action,
                        newItems,
                        newItemsIndex,
                        oldItems,
                        oldItemsIndex,
                    });
                };

                display.subscribe('onCollectionChange', handler);
                list.at(0).set('id', 4);
                display.unsubscribe('onCollectionChange', handler);

                expect(given.length).toBe(expected.length);
                for (let i = 0; i < given.length; i++) {
                    expect(given[i].action).toEqual(expected[i].action);
                    expect(given[i].newItems).toEqual(expected[i].newItems);
                    expect(given[i].newItemsIndex).toBe(expected[i].newItemsIndex);
                    expect(given[i].oldItems).toEqual(expected[i].oldItems);
                    expect(given[i].oldItemsIndex).toBe(expected[i].oldItemsIndex);
                }
            }
        );

        it('should fire "onCollectionChange" after changed item is moved up as it\'s really moved up', () => {
            const items = [{ id: 1 }, { id: 3 }, { id: 5 }];
            const list = new RecordSet({
                rawData: items,
                keyProperty: 'id',
            });
            const display = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
                sort: (a, b) => {
                    return a.collectionItem.get('id') - b.collectionItem.get('id');
                },
            });
            const expected = [
                {
                    action: IBindCollection.ACTION_MOVE,
                    newItems: [display.at(1)],
                    newItemsIndex: 0,
                    oldItems: [display.at(1)],
                    oldItemsIndex: 1,
                },
            ];
            const given = [];
            const handler = getCollectionChangeHandler(given);

            display.subscribe('onCollectionChange', handler);
            list.at(1).set('id', 0);
            display.unsubscribe('onCollectionChange', handler);

            expect(given).toEqual(expected);
        });

        it(
            'should fire "onBeforeCollectionChange" then "onCollectionChange" and then "onAfterCollectionChange" ' +
                'after change an item',
            () => {
                const items = [{ id: 1 }, { id: 2 }, { id: 3 }];
                const list = new RecordSet({
                    rawData: items,
                    keyProperty: 'id',
                });
                const display = new CollectionDisplay({
                    collection: list,
                });
                const expected = ['before', 'on', 'after'];
                const given = [];
                const handlerBefore = () => {
                    given.push('before');
                };
                const handlerOn = () => {
                    given.push('on');
                };
                const handlerAfter = () => {
                    given.push('after');
                };

                display.subscribe('onBeforeCollectionChange', handlerBefore);
                display.subscribe('onCollectionChange', handlerOn);
                display.subscribe('onAfterCollectionChange', handlerAfter);

                list.at(1).set('id', 'bar');

                display.unsubscribe('onBeforeCollectionChange', handlerBefore);
                display.unsubscribe('onCollectionChange', handlerOn);
                display.unsubscribe('onAfterCollectionChange', handlerAfter);

                expect(given).toEqual(expected);
            }
        );

        it(
            'should fire "onBeforeCollectionChange" then "onCollectionChange" and then "onAfterCollectionChange" ' +
                'after change an item while frozen',
            () => {
                const items = [{ id: 1 }, { id: 2 }, { id: 3 }];
                const list = new RecordSet({
                    rawData: items,
                    keyProperty: 'id',
                });
                const display = new CollectionDisplay({
                    collection: list,
                });
                const expected = ['before', 'after', 'before', 'on', 'after'];
                const given = [];
                const handlerBefore = () => {
                    given.push('before');
                };
                const handlerOn = () => {
                    given.push('on');
                };
                const handlerAfter = () => {
                    given.push('after');
                };

                display.subscribe('onBeforeCollectionChange', handlerBefore);
                display.subscribe('onCollectionChange', handlerOn);
                display.subscribe('onAfterCollectionChange', handlerAfter);

                list.setEventRaising(false, true);
                list.at(1).set('id', 'bar');
                list.setEventRaising(true, true);

                display.unsubscribe('onBeforeCollectionChange', handlerBefore);
                display.unsubscribe('onCollectionChange', handlerOn);
                display.unsubscribe('onAfterCollectionChange', handlerAfter);

                expect(given).toEqual(expected);
            }
        );

        it(
            'should observe "onEventRaisingChange" with analize=false on the source collection and become actual ' +
                'on enable',
            () => {
                const list = new ObservableList({
                    items: items.slice(),
                });
                const display = new CollectionDisplay({
                    collection: list,
                });
                const at = 1;
                const listItem = list.at(at);
                const nextListItem = list.at(at + 1);
                const displayItem = display.at(at);
                const nextDisplayItem = display.at(at + 1);

                list.setEventRaising(false);
                list.removeAt(at);
                expect(display.at(at)).toBe(displayItem);
                expect(display.at(at).getContents()).toBe(listItem);
                expect(display.at(at + 1)).toBe(nextDisplayItem);
                expect(display.at(at + 1).getContents()).toBe(nextListItem);

                list.setEventRaising(true);
                expect(display.at(at).getContents()).toBe(nextListItem);
                expect(display.at(at + 1).getContents()).not.toEqual(nextListItem);
            }
        );

        it(
            'should observe "onEventRaisingChange" with analize=true on the source collection and become actual ' +
                'on enable',
            () => {
                const list = new ObservableList({
                    items: items.slice(),
                });
                const display = new CollectionDisplay({
                    collection: list,
                });
                const at = 1;
                const listItem = list.at(at);
                const nextListItem = list.at(at + 1);
                const displayItem = display.at(at);
                const nextDisplayItem = display.at(at + 1);

                list.setEventRaising(false, true);
                list.removeAt(at);
                expect(display.at(at)).toBe(displayItem);
                expect(display.at(at).getContents()).toBe(listItem);
                expect(display.at(at + 1)).toBe(nextDisplayItem);
                expect(display.at(at + 1).getContents()).toBe(nextListItem);

                list.setEventRaising(true, true);
                expect(display.at(at)).toBe(nextDisplayItem);
                expect(display.at(at).getContents()).toBe(nextListItem);
                expect(display.at(at + 1)).not.toEqual(nextDisplayItem);
                expect(display.at(at + 1).getContents()).not.toEqual(nextListItem);
            }
        );

        it('should notify onCollectionChange after call setEventRaising if "analize" is true', () => {
            const item = { id: 999 };
            const expected = [
                {
                    action: IBindCollection.ACTION_ADD,
                    newItems: [item],
                    newItemsIndex: 7,
                    oldItems: [],
                    oldItemsIndex: 0,
                },
            ];
            const given = [];
            const handler = getCollectionChangeHandler(given, (item) => {
                return item.getContents();
            });

            display.subscribe('onCollectionChange', handler);
            display.setEventRaising(false, true);
            list.add(item);

            expect(given.length === 0).toBe(true);

            display.setEventRaising(true, true);
            display.unsubscribe('onCollectionChange', handler);

            expect(given).toEqual(expected);
        });

        describe('should increase version if certain properties of source collection item change', () => {
            const propertiesOfInterest = ['editingContents', 'animated', 'canShowActions'];
            propertiesOfInterest.forEach((property) => {
                it(property, () => {
                    const items = [
                        {
                            id: 1,
                            editingContents: null,
                            animated: null,
                            canShowActions: null,
                        },
                    ];
                    const list = new RecordSet({
                        rawData: items,
                        keyProperty: 'id',
                    });
                    const display = new CollectionDisplay({
                        collection: list,
                    });
                    const prevVersion = display.getVersion();
                    list.at(0).set(property, true);
                    expect(display.getVersion()).toBeGreaterThan(prevVersion);
                });
            });
        });
    });

    describe('::getDefaultDisplay()', () => {
        it('should return certain class instance for ObservableList', () => {
            const items = [{ id: 0 }];
            const list = new ObservableList({
                items,
            });
            const display = Display.getDefaultDisplay(list);

            expect(display).toBeInstanceOf(CollectionDisplay);
        });
    });

    // TODO используются методы _getOptions из миксина OptionsToProperty. Раскоментировать когда будет актуально
    /*    describe('.toJSON()', () => {
        it('should serialize the collection', () => {
            display.setFilter(() => true);
            display.setGroup(() => 0);
            const json = display.toJSON();
            expect(json.module).toBe('Controls/display:Collection');
            expect(typeof json.id).toBe('number');
            expect(json.id > 0).toBe(true);
            expect(json.state.$options).toEqual((display as any)._getOptions());
            expect(json.state.$options.filter).toBe((display as any)._$filter);
            expect(json.state.$options.group).toBe((display as any)._$group);
            expect(json.state.$options.sort).toBe((display as any)._$sort);
            expect((json.state as any)._composer._result.items).toEqual(display.getItems());
        });

        it('should clone the collection', () => {
            const serializer = new Serializer();
            const json = JSON.stringify(display, serializer.serialize);
            const clone = JSON.parse(json, serializer.deserialize);
            const items = display.getItems();
            const cloneItems = clone.getItems();

            for (let i = 0; i < items.length; i++) {
                expect(clone.at(i)).toBe(cloneItems[i]);

                expect(cloneItems[i].getInstanceId()).toBe(items[i].getInstanceId());

                expect(cloneItems[i].getContents()).toEqual(items[i].getContents());

                expect(cloneItems[i].getOwner()).toBe(clone);
            }
        });

        it(
            'should keep relation between a collection item contents and the source collection',
            () => {
                const serializer = new Serializer();
                const json = JSON.stringify(display, serializer.serialize);
                const clone = JSON.parse(json, serializer.deserialize);
                clone.each((item) => {
                    expect(clone.getCollection().getIndex(item.getContents())).not.toEqual(-1);
                });

            }
        );
    });

    describe('::fromJSON()', () => {
        it('should keep items order if source collection has been affected', () => {
            const items = getItems();
            const list = new ObservableList({
                items
            });
            const strategy = new CollectionDisplay({
                collection: list,
                keyProperty: 'id'
            });
            const serializer = new Serializer();
            const json = JSON.stringify(strategy, serializer.serialize);
            const clone = JSON.parse(json, serializer.deserialize);
            const cloneItems = [];

            clone.getCollection().removeAt(0);
            clone.each((item) => {
                cloneItems.push(item.getContents());
            });

            expect(cloneItems).toEqual(items.slice(1));
        });

        it('should restore items contents in all decorators', () => {
            const items = getItems();
            const list = new ObservableList({
                items
            });
            const strategy = new CollectionDisplay({
                collection: list,
                keyProperty: 'id'
            });
            const serializer = new Serializer();
            const json = JSON.stringify(strategy, serializer.serialize);
            const clone = JSON.parse(json, serializer.deserialize);
            let cloneDecorator = clone._composer.getResult();

            while (cloneDecorator) {
                cloneDecorator.items.forEach((item) => {
                    expect(item._contentsIndex).not.toBeDefined();
                });
                cloneDecorator = cloneDecorator.source;
            }
        });
    });*/

    it('.getDisplayProperty()', () => {
        const displayProperty = 'displayProperty';
        const collection = new CollectionDisplay({
            collection: [],
            displayProperty,
        });
        expect(collection.getDisplayProperty()).toBe(displayProperty);
    });

    it('.setMultiSelectVisibility()', () => {
        const multiSelectVisibility = 'multiSelectVisibility';
        const collection = new CollectionDisplay({
            collection: [],
            multiSelectVisibility,
        });
        expect(collection.getMultiSelectVisibility()).toBe(multiSelectVisibility);

        const prevVersion = collection.getVersion();
        collection.setMultiSelectVisibility('anotherVisibility');
        expect(collection.getMultiSelectVisibility()).toBe('anotherVisibility');
        expect(collection.getVersion()).toBeGreaterThan(prevVersion);
    });

    it('.getPadding()', () => {
        const itemPadding = {
            left: 'leftPadding',
            right: 'rightPadding',
            top: 'topPadding',
            bottom: 'bottomPadding',
        };
        const list = new RecordSet({
            rawData: [{ id: 1 }],
            keyProperty: 'id',
        });
        const collection = new CollectionDisplay({
            collection: list,
            itemPadding,
            keyProperty: 'id',
        });
        expect(collection.getLeftPadding()).toBe(itemPadding.left);
        expect(collection.getRightPadding()).toBe(itemPadding.right);
        expect(collection.getTopPadding()).toBe(itemPadding.top);
        expect(collection.getBottomPadding()).toBe(itemPadding.bottom);
    });

    it('.setEditingConfig()', () => {
        const editingConfig = 'editingConfig';
        const collection = new CollectionDisplay({
            collection: [],
            editingConfig,
        });

        const prevVersion = collection.getVersion();
        collection.setEditingConfig('anotherEditingConfig');
        expect(collection.getVersion()).toBeGreaterThan(prevVersion);
    });

    it('.setSearchValue()', () => {
        const searchValue = 'searchValue';
        const collection = new CollectionDisplay({
            collection: [],
        });
        collection.setSearchValue(searchValue);
        expect(collection.getSearchValue()).toBe(searchValue);
    });

    it('.getSearchValue()', () => {
        const searchValue = 'searchValue';
        const collection = new CollectionDisplay({
            collection: [],
            searchValue,
        });
        expect(collection.getSearchValue()).toBe(searchValue);
    });

    describe('.getItemBySourceKey()', () => {
        it('.getItemBySourceKey() for item', () => {
            const list = new RecordSet({
                rawData: items,
                keyProperty: 'id',
            });
            const collection = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });
            const item = collection.getItemBySourceKey(1);
            expect(item.getContents().getId()).toBe(1);
        });

        it('.getItemBySourceKey() without filter for editing item', () => {
            const list = new RecordSet({
                rawData: items,
                keyProperty: 'id',
            });
            const collection = new CollectionDisplay({
                collection: list,
                keyProperty: 'id',
            });

            // Переводим итем с id 1 в режим редактирования
            const item = collection.getItemBySourceKey(1, false);
            item.setEditing(true, item.getContents().clone());

            // Еще раз получаем итем по id
            const item1 = collection.getItemBySourceKey(1, false);
            expect(!!item1).toBe(true);
        });
    });

    it('.getIndexByKey()', () => {
        const list = new RecordSet({
            rawData: items,
            keyProperty: 'id',
        });
        const collection = new CollectionDisplay({
            collection: list,
            keyProperty: 'id',
        });
        expect(collection.getIndexByKey(5)).toBe(
            items.findIndex((item) => {
                return item.id === 5;
            })
        );
    });

    describe('version increases on collection change', () => {
        let rs: RecordSet;
        let display: CollectionDisplay<unknown>;

        beforeEach(() => {
            const items = [
                { id: 1, name: 'Ivan' },
                { id: 2, name: 'Alexey' },
                { id: 3, name: 'Olga' },
            ];
            rs = new RecordSet({
                rawData: items,
                keyProperty: 'id',
            });
            display = new CollectionDisplay({
                collection: rs,
            });
        });

        it('collection reset', () => {
            const version = display.getVersion();

            rs.setEventRaising(false, true);
            while (rs.getCount() > 0) {
                rs.removeAt(0);
            }
            rs.add(
                new Record({
                    rawData: {
                        id: 4,
                        name: 'Nataly',
                    },
                })
            );
            rs.setEventRaising(true, true);

            expect(display.getVersion()).toBeGreaterThan(version);
        });

        it('collection change', () => {
            const version = display.getVersion();
            rs.at(0).set('name', 'Dmitry');
            expect(display.getVersion()).toBeGreaterThan(version);
        });

        it('collection add', () => {
            const version = display.getVersion();
            rs.add(
                new Record({
                    rawData: {
                        id: 4,
                        name: 'Vadim',
                    },
                })
            );
            expect(display.getVersion()).toBeGreaterThan(version);
        });

        it('collection remove', () => {
            const version = display.getVersion();
            rs.removeAt(0);
            expect(display.getVersion()).toBeGreaterThan(version);
        });

        it('collection replace', () => {
            const version = display.getVersion();
            rs.replace(
                new Record({
                    rawData: {
                        id: 4,
                        name: 'Daniel',
                    },
                }),
                0
            );
            expect(display.getVersion()).toBeGreaterThan(version);
        });

        it('collection move', () => {
            const version = display.getVersion();
            rs.move(1, 0);
            expect(display.getVersion()).toBeGreaterThan(version);
        });
    });

    // возможно, это уйдёт из Collection
    describe('setActiveItem(), getActiveItem()', () => {
        let rs: RecordSet;
        let display: CollectionDisplay<unknown>;

        beforeEach(() => {
            const items = [
                { id: 1, name: 'Ivan' },
                { id: 2, name: 'Alexey' },
                { id: 3, name: 'Olga' },
            ];
            rs = new RecordSet({
                rawData: items,
                keyProperty: 'id',
            });
            display = new CollectionDisplay({
                collection: rs,
            });
        });

        it('deactivates old active item', () => {
            const testingItem = display.getItemBySourceKey(1);
            display.setActiveItem(display.getItemBySourceKey(1));
            display.setActiveItem(display.getItemBySourceKey(2));
            expect(testingItem.isActive()).toBe(false);
        });
        it('activates new active item', () => {
            const testingItem = display.getItemBySourceKey(2);
            display.setActiveItem(display.getItemBySourceKey(1));
            display.setActiveItem(display.getItemBySourceKey(2));
            expect(testingItem.isActive()).toBe(true);
        });
        it('correctly returns active item', () => {
            const testingItem = display.getItemBySourceKey(2);
            display.setActiveItem(display.getItemBySourceKey(2));
            expect(display.getActiveItem()).toEqual(testingItem);
        });
    });

    describe('drag', () => {
        let display: CollectionDisplay<unknown>;
        let notifyLaterSpy;
        let notifyCollectionChangeSpy;
        let rs;
        beforeEach(() => {
            const items = [
                { id: 1, name: 'Ivan' },
                { id: 2, name: 'Alexey' },
                { id: 3, name: 'Olga' },
            ];
            rs = new RecordSet({
                rawData: items,
                keyProperty: 'id',
            });
            display = new CollectionDisplay({
                collection: rs,
            });

            notifyLaterSpy = jest.spyOn(display, '_notifyLater').mockClear();
            notifyCollectionChangeSpy = jest.spyOn(display, '_notifyCollectionChange').mockClear();
        });

        it('setDraggedItems', () => {
            const draggedItem = display.getItemBySourceKey(1);
            display.setDraggedItems(draggedItem, [1]);

            expect(notifyCollectionChangeSpy).toHaveBeenCalledTimes(2);
            const firstCallArgs = notifyCollectionChangeSpy.mock.calls[0];
            expect(firstCallArgs[0]).toEqual('rm');
            expect(firstCallArgs[1]).toEqual([]);
            expect(firstCallArgs[2]).toEqual(0);
            expect(firstCallArgs[3]).toEqual([draggedItem]);
            expect(firstCallArgs[4]).toEqual(0);

            const secondCallArgs = notifyCollectionChangeSpy.mock.calls[1];
            expect(secondCallArgs[0]).toEqual('a');
            expect(secondCallArgs[1]).toEqual([display.getItems()[0]]);
            expect(secondCallArgs[2]).toEqual(0);
            expect(secondCallArgs[3]).toEqual([]);
            expect(secondCallArgs[4]).toEqual(0);
        });

        it('setDraggedItems and was add item', () => {
            const draggedItem = display.createItem({
                contents: {
                    getKey: () => {
                        return '123';
                    },
                },
            });
            display.setDraggedItems(draggedItem, ['123']);
            expect(display.getItems()[2].getContents().getKey()).toEqual('123');
            expect(notifyLaterSpy).toHaveBeenCalled();
        });

        it('setDraggedItems to empty model', () => {
            const emptyDisplay = new CollectionDisplay({
                collection: new RecordSet({
                    rawData: [],
                    keyProperty: 'id',
                }),
            });

            const draggedItem = emptyDisplay.createItem({
                contents: {
                    getKey: () => {
                        return '123';
                    },
                },
            });
            emptyDisplay.setDraggedItems(draggedItem, ['123']);
            expect(emptyDisplay.getItems()[0].getContents().getKey()).toEqual('123');
        });

        it('setDraggedItems and was not add item', () => {
            const draggedItem = display.getItemBySourceKey(1);
            display.setDraggedItems(draggedItem, [1]);
            expect(display.getItems()[0].getContents().getKey()).toEqual(1);
            expect(notifyLaterSpy).toHaveBeenCalled();
        });

        it('resetDraggedItems and was not add item', () => {
            const draggedItem = display.getItemBySourceKey(1);
            display.setDraggedItems(draggedItem, [1]);
            expect(display.getItems()[0].getContents().getKey()).toEqual(1);
            expect(notifyLaterSpy).toHaveBeenCalled();

            display.resetDraggedItems();
            expect(notifyLaterSpy).toHaveBeenCalled();
        });

        it('resetDraggedItems and was add item', () => {
            const draggedItem = display.createItem({
                contents: {
                    getKey: () => {
                        return '123';
                    },
                },
            });
            display.setDraggedItems(draggedItem, ['123']);
            expect(display.getItems()[2].getContents().getKey()).toEqual('123');
            expect(notifyLaterSpy).toHaveBeenCalled();

            notifyLaterSpy.mockClear();
            display.resetDraggedItems();
            expect(notifyLaterSpy).toHaveBeenCalled();
        });

        it('resetDraggedItems and was not added item on dragStart', () => {
            const draggedItem = display.getItemBySourceKey(1);
            display.setDraggedItems(draggedItem, [1]);
            expect(display.getItems()[0].getContents().getKey()).toEqual(1);
            expect(notifyLaterSpy).toHaveBeenCalled();

            notifyLaterSpy.mockClear();
            display.resetDraggedItems();
            expect(notifyLaterSpy).toHaveBeenCalled();
        });

        it('DragOutsideList', () => {
            expect(display.isDragOutsideList()).toBe(false);
            display.setDragOutsideList(true);
            expect(display.isDragOutsideList()).toBe(true);
        });
    });

    describe('multiSelectAccessibility', () => {
        const items = [
            { id: 1, name: 'Ivan', multiSelectAccessibility: true },
            { id: 2, name: 'Alexey', multiSelectAccessibility: true },
            { id: 3, name: 'Olga', multiSelectAccessibility: true },
        ];

        let display: CollectionDisplay;
        let rs;
        beforeEach(() => {
            rs = new RecordSet({
                rawData: items,
                keyProperty: 'id',
            });
            display = new CollectionDisplay({
                collection: rs,
                multiSelectAccessibilityProperty: 'multiSelectAccessibility',
            });
        });

        it('change multiSelectAccessibility', () => {
            const item = display.at(0);
            expect(item.isVisibleCheckbox()).toBe(true);
            expect(item.isReadonlyCheckbox()).toBe(false);

            rs.at(0).set('multiSelectAccessibility', null);

            expect(item.isVisibleCheckbox()).toBe(false);
            expect(item.isReadonlyCheckbox()).toBe(true);
        });
    });

    describe('setDisplayProperty, getDisplayProperty', () => {
        const display = new CollectionDisplay({
            collection: new RecordSet({
                rawData: items,
                keyProperty: 'id',
            }),
            multiSelectAccessibilityProperty: 'multiSelectAccessibility',
        });

        it('changed display property', () => {
            const curVersion = display.getVersion();
            display.setDisplayProperty('name');
            expect(display.getDisplayProperty()).toEqual('name');
            expect(display.getVersion()).toEqual(curVersion + 1);
        });

        it('not changed display property', () => {
            const curVersion = display.getVersion();
            display.setDisplayProperty('name');
            expect(display.getDisplayProperty()).toEqual('name');
            expect(display.getVersion()).toEqual(curVersion);
        });
    });

    describe('hoverBackgroundStyle', () => {
        it('exists in options', () => {
            const display = new CollectionDisplay({
                collection: new RecordSet({
                    rawData: items,
                    keyProperty: 'id',
                }),
                hoverBackgroundStyle: 'custom',
            });
            expect(display.getHoverBackgroundStyle()).toEqual('custom');
        });

        it('not exists in options', () => {
            const display = new CollectionDisplay({
                collection: new RecordSet({
                    rawData: items,
                    keyProperty: 'id',
                }),
            });
            expect(display.getHoverBackgroundStyle()).toEqual('default');
        });

        it('not exists in options but exists style in options', () => {
            const display = new CollectionDisplay({
                collection: new RecordSet({
                    rawData: items,
                    keyProperty: 'id',
                }),
                style: 'master',
            });
            expect(display.getHoverBackgroundStyle()).toEqual('master');
        });
    });

    describe('hiddenGroupPosition', () => {
        const items = new RecordSet({
            rawData: [
                { id: 1, group: 111 },
                { id: 2, group: 111 },
                { id: 3, group: groupConstants.hiddenGroup },
            ],
            keyProperty: 'id',
        });

        it('first', () => {
            const collection = new CollectionDisplay({
                collection: items,
                keyProperty: 'id',
                groupProperty: 'group',
            });

            expect(collection.at(0).getContents()).toEqual(groupConstants.hiddenGroup);
        });

        it('byorder', () => {
            const collection = new CollectionDisplay({
                collection: items,
                keyProperty: 'id',
                groupProperty: 'group',
                hiddenGroupPosition: 'byorder',
            });

            expect(collection.at(3).getContents()).toEqual(groupConstants.hiddenGroup);
        });
    });

    describe('footer', () => {
        it('initialize footer', () => {
            // Создаем коллекцию без опции footerTemplate, футер проинициализироваться не должен
            let collection = new CollectionDisplay({
                collection: [],
            });
            expect(!!collection.getFooter()).toBe(false);

            // Создаем коллекцию с опцией footerTemplate, футер должен проинициализироваться
            const footerTemplate = 'footer template';
            collection = new CollectionDisplay({
                collection: [],
                footerTemplate,
            });
            expect(!!collection.getFooter()).toBe(true);
            expect(collection.getFooter().getContentTemplate()).toEqual(footerTemplate);
        });

        it('set footer by template', () => {
            // Создаем модель без футера
            const collection = new CollectionDisplay({
                collection: [],
            });
            let collectionVersion = collection.getVersion();
            const footerTemplate = 'footer template';

            // Зададим коллекции футер
            collection.setFooter({ footerTemplate });
            expect(!!collection.getFooter()).toBe(true);
            expect(collection.getFooter().getContentTemplate()).toEqual(footerTemplate);
            expect(collection.getVersion() > collectionVersion).toBe(true);

            // Присваиваем тот же шаблон футера в коллекцию
            collectionVersion = collection.getVersion();
            collection.setFooter({ footerTemplate });
            expect(collection.getFooter().getContentTemplate()).toEqual(footerTemplate);
            expect(collection.getVersion() === collectionVersion).toBe(true);

            // Присваиваем новый футер в коллекцию
            const newFooterTemplate = 'new footer template';
            collectionVersion = collection.getVersion();
            collection.setFooter({ footerTemplate: newFooterTemplate });
            expect(collection.getFooter().getContentTemplate()).toEqual(newFooterTemplate);
            expect(collection.getVersion() > collectionVersion).toBe(true);

            // Сбрасываем футер в коллекции
            collectionVersion = collection.getVersion();
            collection.setFooter({ footerTemplate: undefined });
            expect(!!collection.getFooter()).toBe(false);
            expect(collection.getVersion() > collectionVersion).toBe(true);
        });

        it('set footer by sticky', () => {
            const footerTemplate = 'footer template';
            const collection = new CollectionDisplay({
                collection: [],
                footerTemplate,
            });

            // Фиксируем футер
            let collectionVersion = collection.getVersion();
            collection.setFooter({
                footerTemplate,
                stickyFooter: true,
            });
            expect(collection.getVersion() > collectionVersion).toBe(true);

            // Еще раз присваиваем новое тоже значение stickyFooter
            collectionVersion = collection.getVersion();
            collection.setFooter({
                footerTemplate,
                stickyFooter: true,
            });
            expect(collection.getVersion() === collectionVersion).toBe(true);
        });
    });

    describe('indicators', () => {
        it('update version on change metaData', () => {
            const items = new RecordSet({
                rawData: [{ id: 1 }, { id: 2 }],
                metaData: {},
                keyProperty: 'id',
            });
            const collection = new CollectionDisplay({
                collection: items,
                keyProperty: 'id',
            });
            collection.displayIndicator('bottom', EIndicatorState.PortionedSearch);

            const version = collection.getVersion();
            items.setMetaData({ count: 10 });
            expect(collection.getVersion() > version).toBe(true);
        });
    });

    describe('setIndexes', () => {
        it('event fires', () => {
            const items = new RecordSet({
                rawData: [{ id: 1 }, { id: 2 }],
                metaData: {},
                keyProperty: 'id',
            });
            const collection = new CollectionDisplay({
                collection: items,
                keyProperty: 'id',
            });
            let indexesChangedFired = false;
            collection.subscribe('indexesChanged', () => {
                indexesChangedFired = true;
            });
            collection.setIndexes(0, 1);
            expect(indexesChangedFired).toBe(true);
        });
    });

    describe('onCollectionChange', () => {
        it('should recount groups when properties changed', () => {
            const recordSet = new RecordSet({
                rawData: [
                    { key: 1, group: 'group-1' },
                    { key: 2, group: 'group-1' },
                ],
                keyProperty: 'key',
            });
            const display = new CollectionDisplay({
                collection: recordSet,
                keyProperty: 'key',
                groupProperty: 'group',
            });

            recordSet.setEventRaising(false, true);

            const item2 = recordSet.getRecordById(2);
            const newItem2 = item2.clone();
            newItem2.set('group', 'group-2');
            item2.merge(newItem2);

            recordSet.setEventRaising(true, true);

            const items = [];
            display.each((item) => {
                return items.push(item);
            });
            expect(items.length).toEqual(4);
            expect(items[0].key).toEqual('group-1');
            expect(items[1].key).toEqual(1);
            expect(items[2].key).toEqual('group-2');
            expect(items[3].key).toEqual(2);
        });
    });
});
