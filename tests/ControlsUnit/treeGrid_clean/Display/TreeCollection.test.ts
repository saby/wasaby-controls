import { TreeGridCollection } from 'Controls/treeGrid';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';

const RAW_DATA = [
    { key: 1, parent: null, type: true },
    { key: 2, parent: 1, type: true },
    { key: 3, parent: 2, type: null },
];

describe('Controls/treeGrid_clean/Display/TreeCollection', () => {
    it('Restore expandedItems after reset collection', () => {
        const recordSet = new RecordSet({
            rawData: [{ key: 1, parent: null, type: true }],
            keyProperty: 'key',
        });

        const treeGridCollection = new TreeGridCollection({
            collection: recordSet,
            keyProperty: 'key',
            parentProperty: 'parent',
            nodeProperty: 'type',
            root: null,
            columns: [{}],
            expandedItems: [1],
        });

        recordSet.merge(
            new RecordSet({
                rawData: RAW_DATA,
                keyProperty: 'key',
            })
        );
        expect(treeGridCollection.getCount()).toBe(2);
    });

    it('setExpandedItems for deep into nodes', () => {
        const recordSet = new RecordSet({
            rawData: [
                { key: 1, parent: null, type: true },
                { key: 2, parent: 1, type: true },
                { key: 3, parent: 2, type: true },
            ],
            keyProperty: 'key',
        });

        const treeGridCollection = new TreeGridCollection({
            collection: recordSet,
            keyProperty: 'key',
            parentProperty: 'parent',
            nodeProperty: 'type',
            root: null,
            columns: [{}],
            expandedItems: [],
        });
        treeGridCollection.setExpandedItems([1, 2, 3]);

        expect(treeGridCollection.at(0).isExpanded()).toBe(true);
        expect(treeGridCollection.at(1).isExpanded()).toBe(true);
        expect(treeGridCollection.at(2).isExpanded()).toBe(true);
    });

    it('Init footer in constructor', () => {
        const recordSet = new RecordSet({
            rawData: [{ key: 1, parent: null, type: true }],
            keyProperty: 'key',
        });

        // В опциях переданы только колонки для футера -> футер должен проинициализироваться
        let collection = new TreeGridCollection({
            collection: recordSet,
            keyProperty: 'key',
            parentProperty: 'parent',
            nodeProperty: 'type',
            root: null,
            columns: [{}],
            footer: [],
        });
        expect(!!collection.getFooter()).toBe(true);

        // В опциях передан только шаблон для футера -> футер должен проинициализироваться
        const footerTemplate = 'my custom footer template';
        collection = new TreeGridCollection({
            collection: recordSet,
            keyProperty: 'key',
            parentProperty: 'parent',
            nodeProperty: 'type',
            root: null,
            columns: [{}],
            footerTemplate,
        });
        expect(!!collection.getFooter()).toBe(true);
        expect(
            footerTemplate ===
                collection.getFooter().getColumns()[0].getTemplate()
        ).toBe(true);
    });

    describe('Reset header model on collection change', () => {
        describe("headerVisibility === 'hasdata'", () => {
            // Поверяем что при очистке данных коллекции модель заголовка сбрасывается
            it('Should reset header model to null on clear collection', () => {
                const recordSet = new RecordSet({
                    rawData: [{ id: 0 }, { id: 1 }],
                    keyProperty: 'id',
                });
                // Создадим коллекцию с данными и видимостью заголовка, зависящую от наличия данных
                const collection = new TreeGridCollection({
                    keyProperty: 'id',
                    nodeProperty: 'type',
                    parentProperty: 'parent',
                    columns: [],
                    header: [{}, {}],
                    headerVisibility: 'hasdata',
                    collection: recordSet,
                });

                // 1. Проверим что заголовок создался
                expect(!!collection.getHeader()).toBe(true);
                // 2. Очистим данные
                recordSet.clear();
                // 3. Модель заголовка должна сброситься т.к. данных в RecordSet не стало
                expect(collection.getHeader()).toBeNull();
            });

            // Поверяем что при заполнении коллекции модель заголовка создается
            it('Should create header model on fill collection', () => {
                const recordSet = new RecordSet({
                    rawData: [],
                    keyProperty: 'id',
                });
                // Создадим коллекцию без данных и видимостью заголовка, зависящую от наличия данных
                const collection = new TreeGridCollection({
                    keyProperty: 'id',
                    nodeProperty: 'type',
                    parentProperty: 'parent',
                    columns: [],
                    header: [{}, {}],
                    headerVisibility: 'hasdata',
                    collection: recordSet,
                });

                // 1. Проверим что заголовка нет
                expect(!!collection.getHeader()).toBe(false);
                // 2. Присвоим в RecordSet новые данные
                recordSet.assign([
                    new Model({ keyProperty: 'id', rawData: { id: 1 } }),
                ]);
                // 3. Модель заголовка должна быть, т.к. появились данные
                expect(!!collection.getHeader()).toBe(true);
            });
        });

        describe("headerVisibility === 'visible'", () => {
            // Поверяем что при очистке данных коллекции модель заголовка не пересоздается
            it('Should not recreate header model on clear collection', () => {
                const recordSet = new RecordSet({
                    rawData: [{ id: 1 }, { id: 2 }],
                    keyProperty: 'id',
                });
                // Создадим коллекцию с данными и всегда видимым заголовком
                const collection = new TreeGridCollection({
                    keyProperty: 'id',
                    nodeProperty: 'type',
                    parentProperty: 'parent',
                    columns: [],
                    header: [{}, {}],
                    headerVisibility: 'visible',
                    collection: recordSet,
                });

                // Запомним изначальный инстанс модели заголовка и проверим что он есть
                const firstHeaderModel = collection.getHeader();
                expect(!!firstHeaderModel).toBe(true);

                // Очистим данные
                recordSet.clear();

                // Проверяем что после изменения коллекции модель заголовка осталась той же
                const secondHeaderModel = collection.getHeader();
                expect(!!secondHeaderModel).toBe(true);
                expect(firstHeaderModel === secondHeaderModel).toBe(true);
            });

            // Поверяем что при заполнении коллекции модель заголовка не пересоздается
            it('Should recreate header model on fill collection', () => {
                const recordSet = new RecordSet({
                    rawData: [],
                    keyProperty: 'id',
                });
                // Создадим коллекцию без данных и всегда видимым заголовком
                const collection = new TreeGridCollection({
                    keyProperty: 'id',
                    nodeProperty: 'type',
                    parentProperty: 'parent',
                    columns: [],
                    header: [{}, {}],
                    headerVisibility: 'visible',
                    collection: recordSet,
                });

                // Запомним изначальный инстанс модели заголовка и проверим что он есть
                const firstHeaderModel = collection.getHeader();
                expect(!!firstHeaderModel).toBe(true);

                // Добавим данные в RecordSet
                recordSet.assign([
                    new Model({ keyProperty: 'id', rawData: { parent: null } }),
                ]);

                // Проверяем что после изменения коллекции модель заголовка осталась той же
                const secondHeaderModel = collection.getHeader();
                expect(!!secondHeaderModel).toBe(true);
                expect(firstHeaderModel === secondHeaderModel).toBe(true);
            });
        });
    });

    describe('multiSelectVisibility', () => {
        it("change multiSelectVisibility onhover => visible, shouldn't update version", () => {
            const gridCollection = new TreeGridCollection({
                collection: [{ key: 1 }, { key: 2 }, { key: 3 }],
                keyProperty: 'key',
                nodeProperty: 'type',
                parentProperty: 'parent',
                columns: [
                    {
                        displayProperty: 'id',
                        resultTemplate: () => {
                            return 'result';
                        },
                    },
                ],
                footer: [
                    {
                        template: () => {
                            return 'footer';
                        },
                    },
                ],
                header: [
                    {
                        template: () => {
                            return 'header';
                        },
                    },
                ],
                emptyTemplate: 'emptyTemplate',
                resultsPosition: 'top',
                multiSelectVisibility: 'onhover',
                rowSeparatorSize: 's',
            });

            const headerInitialVersion = gridCollection
                .getHeader()
                .getVersion();
            const resultsInitialVersion = gridCollection
                .getResults()
                .getVersion();
            const footerInitialVersion = gridCollection
                .getFooter()
                .getVersion();
            const emptyGridInitialVersion = gridCollection
                .getEmptyGridRow()
                .getVersion();

            // setMultiSelectVisibility
            gridCollection.setMultiSelectVisibility('visible');

            expect(gridCollection.getHeader().getVersion()).toBe(
                headerInitialVersion
            );
            expect(gridCollection.getResults().getVersion()).toBe(
                resultsInitialVersion
            );
            expect(gridCollection.getFooter().getVersion()).toBe(
                footerInitialVersion
            );
            expect(gridCollection.getEmptyGridRow().getVersion()).toBe(
                emptyGridInitialVersion
            );
        });
    });
});
