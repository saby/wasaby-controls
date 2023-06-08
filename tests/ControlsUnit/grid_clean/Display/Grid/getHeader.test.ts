import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { GridCollection } from 'Controls/grid';

describe('Controls/grid_clean/Display/Grid/getHeader', () => {
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
                const collection = new GridCollection({
                    collection: recordSet,
                    columns: [{ width: '' }],
                    header: [{ caption: '' }],
                    headerVisibility: 'hasdata',
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
                const collection = new GridCollection({
                    collection: recordSet,
                    columns: [{ width: '' }],
                    header: [{ caption: '' }],
                    headerVisibility: 'hasdata',
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
                const collection = new GridCollection({
                    collection: recordSet,
                    columns: [{ width: '' }],
                    header: [{ caption: '' }],
                    headerVisibility: 'hasdata',
                });

                expect(!!collection.getHeader()).toBe(true);

                recordSet.removeAt(1);

                expect(!!collection.getHeader()).toBe(true);
            });

            // обновляем шапку, проверяем, что columnSeparator проставился
            it('set columnSeparator on columns update', () => {
                const recordSet = new RecordSet({
                    keyProperty: 'id',
                    rawData: [
                        { id: 1, title: '' },
                        { id: 2, title: '' },
                    ],
                });
                const collection = new GridCollection({
                    collection: recordSet,
                    columns: [{ width: '' }],
                    header: [{ caption: '' }],
                    columnSeparatorSize: 's',
                });

                const stubGetHeaderConstructor = jest
                    .spyOn(collection, 'getHeaderConstructor')
                    .mockClear()
                    .mockImplementation(() => {
                        return (options) => {
                            expect(options.columnSeparatorSize).toBe('s');
                        };
                    });

                // сбрасываем заголовок
                collection.setHeader([{ caption: '' }]);

                // Вызываем инициализацию заголовков
                collection.getHeader();

                expect(stubGetHeaderConstructor).toHaveBeenCalled();
                stubGetHeaderConstructor.mockRestore();
            });
        });
    });

    describe('constructor', () => {
        it('constructor options', () => {
            const collection = new GridCollection({
                collection: new RecordSet({
                    keyProperty: 'key',
                    rawData: [],
                }),
                columns: [{ width: '' }],
                headerVisibility: 'visible',
                multiSelectVisibility: 'visible',
            });

            const fakeGetHeaderConstructorMethod = (options) => {
                expect(options.multiSelectVisibility).toBe('visible');
            };
            jest.spyOn(collection, 'getHeaderConstructor')
                .mockClear()
                .mockImplementation(() => {
                    return fakeGetHeaderConstructorMethod;
                });

            collection.setHeader([{ caption: '' }]);
            collection.getHeader();
        });
    });
});
