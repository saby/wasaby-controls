import { RecordSet } from 'Types/collection';
import { Collection } from 'Controls/display';

describe('Controls/display/collection/HoverBackgroundStyle.test', () => {
    it('should set hoverBackgroundStyle while initializing', () => {
        const recordSet = new RecordSet({ rawData: [], keyProperty: 'id' });
        const collection = new Collection({
            keyProperty: 'id',
            collection: recordSet,
            hoverBackgroundStyle: 'custom',
        });
        expect(collection.getHoverBackgroundStyle()).toEqual('custom');
    });

    it('should set hoverBackgroundStyle using setBackgroundStyle', () => {
        const recordSet = new RecordSet({ rawData: [], keyProperty: 'id' });
        const collection = new Collection({
            keyProperty: 'id',
            collection: recordSet,
        });
        expect(collection.getVersion()).toBe(0);
        expect(collection.getHoverBackgroundStyle()).toEqual('default');

        collection.setHoverBackgroundStyle('custom');

        expect(collection.getVersion()).toBe(1);
        expect(collection.getHoverBackgroundStyle()).toEqual('custom');
    });

    it('should set actionsConfig.style using setHoverBackgroundStyle', () => {
        const recordSet = new RecordSet({ rawData: [], keyProperty: 'id' });
        const collection = new Collection({
            keyProperty: 'id',
            collection: recordSet,
        });
        collection.setActionsTemplateConfig({
            style: 'default',
        });
        collection.setHoverBackgroundStyle('custom');
        expect(collection.getActionsTemplateConfig({}).style).toEqual('custom');
    });

    it('should set hoverBackgroundStyle for every CollectionItem', () => {
        const recordSet = new RecordSet({
            rawData: [{ id: 0 }, { id: 1 }, { id: 2 }],
            keyProperty: 'id',
        });
        const collection = new Collection({
            keyProperty: 'id',
            collection: recordSet,
            columns: [{}, {}],
        });

        collection.getItems().forEach((column) => {
            jest.spyOn(column, 'setHoverBackgroundStyle').mockClear();
        });

        collection.setHoverBackgroundStyle('custom');

        collection.getItems().forEach((item) => {
            expect(item.setHoverBackgroundStyle).toHaveBeenCalledTimes(1);
        });

        jest.restoreAllMocks();
    });
});
