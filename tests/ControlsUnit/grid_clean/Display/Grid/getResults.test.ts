import { GridCollection } from 'Controls/grid';
import { RecordSet } from 'Types/collection';

const RAW_DATA = [
    { id: 1, name: 'Ivan', surname: 'Kashitsyn' },
    { id: 2, name: 'Alexey', surname: 'Kudryavcev' },
    { id: 3, name: 'Olga', surname: 'Samokhvalova' },
];

const columns = [{ width: '1fr' }, { width: '1px' }, { width: '1px' }];

describe('Controls/grid_clean/display/GridCollection/getResults', () => {
    it('Create results in constructor', () => {
        function MockedResultsConstructor(options) {
            expect(options.multiSelectVisibility).toBe('visible');
        }

        jest.spyOn(GridCollection.prototype, 'getResultsConstructor')
            .mockClear()
            .mockImplementation(() => {
                return MockedResultsConstructor;
            });

        const gridCollection = new GridCollection({
            collection: new RecordSet({
                rawData: RAW_DATA,
                keyProperty: 'id',
            }),
            resultsPosition: 'top',
            keyProperty: 'id',
            multiSelectVisibility: 'visible',
            columns,
        });

        gridCollection.getResults();

        jest.restoreAllMocks();
    });

    it('Create results after setCollection', () => {
        function MockedResultsConstructor(options) {
            expect(options.multiSelectVisibility).toBe('visible');
        }

        jest.spyOn(GridCollection.prototype, 'getResultsConstructor')
            .mockClear()
            .mockImplementation(() => {
                return MockedResultsConstructor;
            });

        const gridCollection = new GridCollection({
            resultsPosition: 'top',
            collection: new RecordSet({
                rawData: [],
                keyProperty: 'id',
            }),
            keyProperty: 'id',
            multiSelectVisibility: 'visible',
            columns,
        });

        gridCollection.setCollection(
            new RecordSet({
                rawData: RAW_DATA,
                keyProperty: 'id',
            })
        );

        gridCollection.getResults();

        jest.restoreAllMocks();
    });

    describe('columnSeparator', () => {
        // Обновляем данные результатов, проверяем, что columnSeparator проставился
        it('constructor', () => {
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
                columnSeparatorSize: 's',
            });

            const stubGetResultsConstructor = jest
                .spyOn(collection, 'getResultsConstructor')
                .mockClear()
                .mockImplementation(() => {
                    return function (options) {
                        expect(options.columnSeparatorSize).toBe('s');
                    };
                });

            // сбрасываем результаты
            collection.setResultsPosition(null);
            collection.setResultsPosition('top');

            // Вызываем инициализацию строки резудьтатов
            collection.getResults();

            expect(stubGetResultsConstructor).toHaveBeenCalled();
            stubGetResultsConstructor.mockRestore();
        });
    });
});
