import { Collection } from 'Controls/display';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';

describe('Controls/_display/collection/UpdateOption', () => {
    const createRecordSet = (metaData?) => {
        return new RecordSet({
            keyProperty: 'id',
            rawData: [],
            metaData,
        });
    };
    const createMetaResults = () => {
        return new Model({ rawData: {} });
    };

    // Коллекция  не может быть создана без данных и нельзя установить пустую коллекцию.
    // Поэтому проверяем только случай когда коллекция была и вызвали установку новой коллекции.
    it('1. Should update subscription on property change of record set. Unsubscribe from old and subscribe to new RecordSet.', () => {
        const oldRecordSet = new RecordSet({ rawData: [] });
        const newRecordSet = new RecordSet({ rawData: [] });

        const collection = new Collection({
            keyProperty: 'id',
            collection: oldRecordSet,
        });

        const subscribeSpy = jest.spyOn(newRecordSet, 'subscribe').mockClear();
        const unsubscribeSpy = jest
            .spyOn(oldRecordSet, 'unsubscribe')
            .mockClear();

        collection.setCollection(newRecordSet);

        expect(subscribeSpy).toHaveBeenCalledWith(
            'onPropertyChange',
            expect.anything()
        );
        expect(unsubscribeSpy).toHaveBeenCalledWith(
            'onPropertyChange',
            expect.anything()
        );
    });

    describe('2. Should update subscription on meta-results model', () => {
        it('1. [without meta-results] -> [with meta-results]. Should subscribe on new meta results.', () => {
            const results = createMetaResults();
            const oldRecordSet = createRecordSet();
            const newRecordSet = createRecordSet({ results });

            const collection = new Collection({
                keyProperty: 'id',
                collection: oldRecordSet,
            });

            const subscribeSpy = jest.spyOn(results, 'subscribe').mockClear();

            collection.setCollection(newRecordSet);

            expect(subscribeSpy).toHaveBeenCalledWith(
                'onPropertyChange',
                expect.anything()
            );
        });

        it('2. [with meta-results] -> [without meta-results]. Should unsubscribe from old meta results.', () => {
            const results = createMetaResults();
            const oldRecordSet = createRecordSet({ results });
            const newRecordSet = createRecordSet();

            const collection = new Collection({
                keyProperty: 'id',
                collection: oldRecordSet,
            });

            const unsubscribeSpy = jest
                .spyOn(results, 'unsubscribe')
                .mockClear();

            collection.setCollection(newRecordSet);

            expect(unsubscribeSpy).toHaveBeenCalledWith(
                'onPropertyChange',
                expect.anything()
            );
        });

        it('3. [with meta-results] -> [with meta-results]. Should unsubscribe from old meta results and subscribe to new.', () => {
            const oldResults = createMetaResults();
            const newResults = createMetaResults();
            const oldRecordSet = createRecordSet({ results: oldResults });
            const newRecordSet = createRecordSet({ results: newResults });

            const collection = new Collection({
                keyProperty: 'id',
                collection: oldRecordSet,
            });

            const unsubscribeSpy = jest
                .spyOn(oldResults, 'unsubscribe')
                .mockClear();
            const subscribeSpy = jest
                .spyOn(newResults, 'subscribe')
                .mockClear();

            collection.setCollection(newRecordSet);

            expect(unsubscribeSpy).toHaveBeenCalledWith(
                'onPropertyChange',
                expect.anything()
            );
            expect(subscribeSpy).toHaveBeenCalledWith(
                'onPropertyChange',
                expect.anything()
            );
        });
    });

    describe('3. Should update meta results state', () => {
        it('1. [without meta-results] -> [with meta-results]', () => {
            const results = createMetaResults();
            const oldRecordSet = createRecordSet();
            const newRecordSet = createRecordSet({ results });

            const collection = new Collection({
                keyProperty: 'id',
                collection: oldRecordSet,
            });

            expect(collection.getMetaResults()).not.toBeDefined();
            collection.setCollection(newRecordSet);
            expect(results).toEqual(collection.getMetaResults());
        });

        it('2. [with meta-results] -> [without meta-results]. Should unsubscribe from old meta results.', () => {
            const results = createMetaResults();
            const oldRecordSet = createRecordSet({ results });
            const newRecordSet = createRecordSet();

            const collection = new Collection({
                keyProperty: 'id',
                collection: oldRecordSet,
            });

            expect(results).toEqual(collection.getMetaResults());
            collection.setCollection(newRecordSet);
            expect(collection.getMetaResults()).not.toBeDefined();
        });
    });
});
