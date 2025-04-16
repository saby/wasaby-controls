import { Collection } from 'Controls/display';
import { RecordSet } from 'Types/collection';

describe('Controls/list/display/EmptyTemplate', () => {
    // Проверяем, что emptyTemplateOptions обновляются в emptyTemplateItem
    it('Empty template options are set into the empty template item', () => {
        const recordSet = new RecordSet({
            rawData: [],
            keyProperty: 'key',
        });
        const emptyTemplateOptions = {
            foo: 'bar',
        };
        const collection = new Collection({
            keyProperty: 'key',
            collection: recordSet,
            rowSeparatorSize: 's',
            emptyTemplate: 'TEST_EMPTY_TEMPLATE',
            emptyTemplateOptions,
        });
        // create empty template item
        expect(collection.getEmptyTemplateItem()).toBeTruthy();
        expect(collection.getEmptyTemplateItem().getItemTemplateOptions()).toEqual(
            emptyTemplateOptions
        );
        // update empty template options
        const newEmptyTemplateOptions = {
            foo: 'baz',
        };
        collection.setEmptyTemplateOptions(newEmptyTemplateOptions);
        expect(collection.getEmptyTemplateItem().getItemTemplateOptions()).toEqual(
            newEmptyTemplateOptions
        );
    });
});
