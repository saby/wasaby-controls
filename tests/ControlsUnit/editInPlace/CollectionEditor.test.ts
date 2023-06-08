import {
    CollectionEditor,
    ERROR_MSG,
} from 'Controls/_editInPlace/CollectionEditor';
import { Collection, CollectionItem } from 'Controls/display';
import { Tree } from 'Controls/baseTree';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';

describe('Controls/_editInPlace/CollectionEditor', () => {
    let items: RecordSet<{ id: number; title: string }>;
    let collection: Collection<Model>;
    let collectionEditor: CollectionEditor;
    let newItem: Model<{ id: number; title: string }>;

    beforeEach(() => {
        items = new RecordSet<{ id: number; title: string }>({
            keyProperty: 'id',
            rawData: [
                { id: 1, title: 'First' },
                { id: 2, title: 'Second' },
                { id: 3, title: 'Third' },
            ],
        });

        newItem = new Model<{ id: number; title: string }>({
            keyProperty: 'id',
            rawData: { id: 4, title: 'Fourth' },
        });

        collection = new Collection({
            keyProperty: 'id',
            collection: items,
        });

        collectionEditor = new CollectionEditor({ collection });
    });

    describe('updateOptions', () => {
        it('should use old collection if new is undefined', () => {
            collectionEditor.updateOptions({});
            // @ts-ignore
            const currentCollection = collectionEditor._options.collection;
            expect(currentCollection).toEqual(collection);
        });

        it('should use new collection if it is defined', () => {
            const newCollection = new Collection({
                keyProperty: 'id',
                collection: items,
            });

            collectionEditor.updateOptions({ collection: newCollection });
            // @ts-ignore
            const currentCollection = collectionEditor._options.collection;
            expect(currentCollection).toEqual(newCollection);
        });

        it('should throw error and use old collection if new has source not type of Types/collection:RecordSet', () => {
            const newCollection = new Collection({
                keyProperty: 'id',
                collection: items,
            });

            newCollection.getSourceCollection()[
                '[Types/_collection/RecordSet]'
            ] = false;

            expect(() => {
                collectionEditor.updateOptions({ collection: newCollection });
            }).toThrow();

            // @ts-ignore
            const currentCollection = collectionEditor._options.collection;
            expect(currentCollection).toEqual(collection);
        });

        it('should not update equal options', () => {
            let wasCollectionUpdated = false;
            Object.defineProperty(collectionEditor._options, 'collection', {
                get() {
                    return collection;
                },
                set() {
                    wasCollectionUpdated = true;
                },
                enumerable: false,
                configurable: true,
            });

            collectionEditor.updateOptions({ collection });
            expect(wasCollectionUpdated).toBe(false);
        });
    });

    describe('edit', () => {
        it('correct', () => {
            // Нет редактирования
            expect(collectionEditor.getEditingItem()).toBeNull();
            expect(collection.isEditing()).toBe(false);

            // Запуск редактирования первой записи
            collectionEditor.edit(items.at(0));

            // Редактирование успешно запустилось
            expect(collectionEditor.getEditingItem().contents.getKey()).toEqual(
                1
            );

            // Коллекция в режиме редактирования
            expect(collection.isEditing()).toBe(true);
            expect(
                collection.find((el) => {
                    return el.isEditing();
                }) instanceof CollectionItem
            ).toBe(true);
        });

        it('should throw error if trying to begin new edit before end current', () => {
            // Нет редактирования
            expect(collectionEditor.getEditingItem()).toBeNull();
            expect(collection.isEditing()).toBe(false);

            // Запуск редактирования первой записи
            collectionEditor.edit(items.at(0));
            expect(collectionEditor.getEditingItem().contents.getKey()).toEqual(
                1
            );

            // Запуск редактирования второй записи должен привести к исключению
            expect(() => {
                collectionEditor.edit(items.at(1));
            }).toThrow();

            // Осталось редактирование первой записи
            expect(collectionEditor.getEditingItem().contents.getKey()).toEqual(
                1
            );
        });

        it("should throw error if trying to begin edit of item that doesn't exist in collection", () => {
            // Нет запущенного редактирования
            expect(collectionEditor.getEditingItem()).toBeNull();
            expect(collection.isEditing()).toBe(false);

            // Попытка начать редактирование несуществующей записи должна привести к исключению
            expect(() => {
                collectionEditor.edit(newItem);
            }).toThrow();

            // Нет запущенного редактирования
            expect(collectionEditor.getEditingItem()).toBeNull();
            expect(collection.isEditing()).toBe(false);
        });
    });

    describe('add', () => {
        it('correct', () => {
            // Нет редактирования
            expect(collectionEditor.getEditingItem()).toBeNull();
            expect(collection.isEditing()).toBe(false);

            // Запуск редактирования первой записи
            collectionEditor.add(newItem);

            // Редактирование успешно запустилось
            expect(collection.isEditing()).toBe(true);
            expect(collectionEditor.getEditingItem().contents.getKey()).toEqual(
                4
            );
        });

        it('should throw error if trying to begin new edit before end current editing', () => {
            // Нет редактирования
            expect(collectionEditor.getEditingItem()).toBeNull();
            expect(collection.isEditing()).toBe(false);

            // Запуск редактирования первой записи
            collectionEditor.edit(items.at(0));
            expect(collection.isEditing()).toBe(true);
            expect(collectionEditor.getEditingItem().contents.getKey()).toEqual(
                1
            );

            // Запуск добавления новой записи должен привести к исключению
            expect(() => {
                collectionEditor.add(newItem);
            }).toThrow();

            // Осталось редактирование первой записи
            expect(collectionEditor.getEditingItem().contents.getKey()).toEqual(
                1
            );
        });

        it('should throw error if trying to begin edit of item that already exists in collection', () => {
            // Нет запущенного редактирования
            expect(collectionEditor.getEditingItem()).toBeNull();
            expect(collection.isEditing()).toBe(false);

            // Попытка начать добавление существующей записи должна привести к исключению
            expect(() => {
                collectionEditor.add(items.at(0));
            }).toThrow();

            // Нет запущенного редактирования
            expect(collectionEditor.getEditingItem()).toBeNull();
            expect(collection.isEditing()).toBe(false);
        });

        describe('addPosition', () => {
            const addPositionAssociations = [
                ['anyInvalid', 'bottom', 3],
                ['default', 'bottom', 3],
                ['top', 'top', 0],
                ['bottom', 'bottom', 3],
                [undefined, 'bottom', 3],
            ];

            addPositionAssociations.forEach(
                ([intoMethodValue, expectedValue, addingItemIndex]: [
                    string | undefined,
                    string,
                    number
                ]) => {
                    it(`should set add position as '${expectedValue}' if passed into method '${intoMethodValue}' as add position`, () => {
                        // Нет запущенного редактирования
                        expect(collectionEditor.getEditingItem()).toBeNull();
                        expect(collection.isEditing()).toBe(false);

                        // Запуск добавления записи с в указанную позицию.
                        // @ts-ignore
                        collectionEditor.add(newItem, intoMethodValue);

                        // Добавление запустилось
                        expect(
                            collectionEditor.getEditingItem().contents.getKey()
                        ).toEqual(newItem.getKey());
                        expect(collection.isEditing()).toBe(true);

                        // Запись отображается в верной позиции
                        expect(collection.at(addingItemIndex).contents).toEqual(
                            collectionEditor.getEditingItem().contents
                        );
                    });
                }
            );
        });

        it('throw error if parent of adding item missing in display:Collection', () => {
            const tree = new Tree({
                collection: new RecordSet({
                    keyProperty: 'id',
                    rawData: [],
                }),
                root: null,
                keyProperty: 'id',
                parentProperty: 'pid',
            });
            collectionEditor = new CollectionEditor({ collection: tree });

            newItem = new Model<{ id: number; title: string; pid: number }>({
                keyProperty: 'id',
                rawData: { id: 4, title: 'Fourth', pid: 0 },
            });

            // Попытка начать добавление записи в родителя, которого нет в коллекции должна привести к исключению
            expect(() => {
                collectionEditor.add(newItem);
            }).toThrow();
        });
    });

    describe('commit', () => {
        it('correct commit editing', () => {
            // Нет редактирования
            expect(collectionEditor.getEditingItem()).toBeNull();
            expect(collection.isEditing()).toBe(false);

            // Запуск редактирования первой записи
            collectionEditor.edit(items.at(0));

            // Редактирование успешно запустилось
            expect(collectionEditor.getEditingItem().contents.getKey()).toEqual(
                1
            );
            expect(collection.isEditing()).toBe(true);

            // Редактируем поля записи
            const editingItem = collectionEditor.getEditingItem().contents;
            editingItem.set('title', 'First edited');
            expect(editingItem.isChanged()).toBe(true);

            // Завершаем редактирование с применением изменений
            collectionEditor.commit();

            // Редактирование завершилось
            expect(collectionEditor.getEditingItem()).toBeNull();

            // Изменения применились
            expect(editingItem.get('title')).toEqual('First edited');
            expect(editingItem.isChanged()).toBe(false);
            expect(items.isChanged()).toBe(false);
        });

        it('correct commit adding', () => {
            // Нет редактирования
            expect(collectionEditor.getEditingItem()).toBeNull();
            expect(collection.isEditing()).toBe(false);

            // В коллекции 3 элемента
            const itemsCountBeforeAdd = collection.getCount();

            // Запуск редактирования первой записи
            collectionEditor.add(newItem);

            // Редактирование успешно запустилось
            expect(collection.isEditing()).toBe(true);
            expect(collectionEditor.getEditingItem().contents.getKey()).toEqual(
                newItem.getKey()
            );

            // Запись отображается
            expect(collection.getCount()).toEqual(itemsCountBeforeAdd + 1);

            // Редактируем поля записи
            const addingItem = collectionEditor.getEditingItem().contents;
            addingItem.set('title', 'Fourth adding');
            expect(addingItem.isChanged()).toBe(true);

            // Завершаем редактирование с применением изменений
            collectionEditor.commit();

            // Редактирование завершилось
            expect(collectionEditor.getEditingItem()).toBeNull();

            // Изменения применились, но запись не добавилась.
            // Контролл не имеет ответственности добавлять запись в источник, только в проекцию.
            expect(collection.getCount()).toEqual(itemsCountBeforeAdd);

            expect(addingItem.get('title')).toEqual('Fourth adding');
            expect(addingItem.isChanged()).toBe(false);
            expect(addingItem.isChanged()).toBe(false);
        });

        it('should throw error if trying to commit without running editing', () => {
            // Нет запущенного редактирования
            expect(collectionEditor.getEditingItem()).toBeNull();
            expect(collection.isEditing()).toBe(false);

            // Завершение редактирования должно привести к исключению
            expect(() => {
                collectionEditor.commit();
            }).toThrow();
        });
    });

    describe('cancel', () => {
        it('correct cancel adding', () => {
            // Нет редактирования
            expect(collectionEditor.getEditingItem()).toBeNull();
            expect(collection.isEditing()).toBe(false);

            // В коллекции 3 элемента
            const itemsCountBeforeAdd = collection.getCount();

            // Запуск редактирования первой записи
            collectionEditor.add(newItem);

            // Редактирование успешно запустилось
            expect(collectionEditor.getEditingItem().contents.getKey()).toEqual(
                newItem.getKey()
            );
            expect(collection.isEditing()).toBe(true);

            // Редактируем поля записи
            const addingItem = collectionEditor.getEditingItem().contents;
            addingItem.set('title', 'Fourth adding');
            expect(addingItem.isChanged()).toBe(true);

            // Завершаем добавление с применением изменений
            collectionEditor.cancel();

            // Добавление завершилось
            expect(collectionEditor.getEditingItem()).toBeNull();
            expect(collection.isEditing()).toBe(false);

            // Изменения не применились, добавляемой записи нет
            expect(items.getCount()).toEqual(itemsCountBeforeAdd);
            expect(items.isChanged()).toBe(false);
        });

        it('should throw error if trying to cancel without running editing', () => {
            // Нет запущенного редактирования
            expect(collectionEditor.getEditingItem()).toBeNull();
            expect(collection.isEditing()).toBe(false);

            // Завершение редактирования должно привести к исключению
            expect(() => {
                collectionEditor.cancel();
            }).toThrow();
        });
    });
});
