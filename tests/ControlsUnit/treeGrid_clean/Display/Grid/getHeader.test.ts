import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { TreeGridCollection } from 'Controls/treeGrid';

describe('Controls/treeGrid_clean/Display/Grid/getHeader', () => {
    describe('headerVisibility', () => {
        describe('hasData', () => {
            /* -
             1. Создаём коллекцию на основе рекордсета (с header), в которой 1 запись и headerVisibility = hasData
             2. проверяем, что шапка есть
             3. Удаляем одну запись
             4. проверяем, что шапки нет
             */
            it('should remove the header when the only record has removed', () => {
                const recordSet = new RecordSet({
                    keyProperty: 'id',
                    rawData: [{ id: 1 }],
                });
                const collection = new TreeGridCollection({
                    collection: recordSet,
                    columns: [{ width: '' }],
                    header: [{ caption: '' }],
                    headerVisibility: 'hasdata',
                    keyProperty: 'id',
                });

                expect(!!collection.getHeader()).toBe(true);

                recordSet.removeAt(0);

                expect(!!collection.getHeader()).toBe(false);
            });

            /*
             1. Создаём коллекцию на основе рекордсета (с header), в которой 0 записей и headerVisibility = hasData
             2. проверяем, что шапки нет
             3. + одну запись
             4. проверяем, что шапка есть
            */
            it('should add the header when a record has added', () => {
                const recordSet = new RecordSet({
                    keyProperty: 'id',
                    rawData: [],
                });
                const collection = new TreeGridCollection({
                    collection: recordSet,
                    columns: [{ width: '' }],
                    header: [{ caption: '' }],
                    headerVisibility: 'hasdata',
                    keyProperty: 'id',
                });

                expect(!!collection.getHeader()).toBe(false);

                recordSet.add(
                    new Model({
                        rawData: { id: 0 },
                        keyProperty: 'id',
                    })
                );

                expect(!!collection.getHeader()).toBe(true);
            });

            /*
             1. Создаём коллекцию на основе рекордсета (с header), в которой 2 записей и headerVisibility = hasData
             2. проверяем, что шапка есть
            */
            it('should not remove header when a record has removed', () => {
                const recordSet = new RecordSet({
                    keyProperty: 'id',
                    rawData: [{ id: 1 }, { id: 2 }],
                });
                const collection = new TreeGridCollection({
                    collection: recordSet,
                    columns: [{ width: '' }],
                    header: [{ caption: '' }],
                    headerVisibility: 'hasdata',
                    keyProperty: 'id',
                });

                expect(!!collection.getHeader()).toBe(true);

                recordSet.removeAt(1);

                expect(!!collection.getHeader()).toBe(true);
            });
        });
    });

    describe('expanderPosition', () => {
        it('should set expanderPosition on init', () => {
            const recordSet = new RecordSet({
                keyProperty: 'id',
                rawData: [{ id: 1 }, { id: 2 }],
            });
            const collection = new TreeGridCollection({
                collection: recordSet,
                columns: [{ width: '' }],
                header: [{ caption: '' }],
                headerVisibility: 'hasdata',
                keyProperty: 'id',
                expanderPosition: 'custom'
            });

            const header = collection.getHeader();

            expect(header.getRow().getExpanderPosition()).toBe('custom');
        });
    });
});
