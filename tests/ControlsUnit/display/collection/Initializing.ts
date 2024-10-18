import { Collection as CollectionDisplay, Collection } from 'Controls/display';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';

describe('Controls/_display/collection/Initializing', () => {
    it('1. should subscribe on property change of RecordSet', () => {
        const recordSet = new RecordSet({ rawData: [] });
        const subscribeSpy = jest.spyOn(recordSet, 'subscribe').mockClear();

        // eslint-disable-next-line no-unused-expressions,@typescript-eslint/no-unused-expressions
        new Collection({
            keyProperty: 'id',
            collection: recordSet,
        });

        expect(subscribeSpy).toHaveBeenCalledWith('onPropertyChange');
        jest.restoreAllMocks();
    });

    it('2. should subscribe on property change of meta results', () => {
        const metaResults = new Model({ rawData: {} });
        const recordSet = new RecordSet({
            rawData: [],
            metaData: { results: metaResults },
        });

        const subscribeSpy = jest.spyOn(metaResults, 'subscribe').mockClear();

        // eslint-disable-next-line no-unused-expressions,@typescript-eslint/no-unused-expressions
        new Collection({
            keyProperty: 'id',
            collection: recordSet,
        });

        expect(subscribeSpy).toHaveBeenCalledWith('onPropertyChange');
        jest.restoreAllMocks();
    });

    it('3. Should set meta results', () => {
        const results = new Model({ rawData: {} });
        const list = new RecordSet({
            keyProperty: 'id',
            rawData: [],
            metaData: { results },
        });
        const display = new CollectionDisplay({ collection: list });

        expect(results).toEqual(display.getMetaResults());
    });
});
