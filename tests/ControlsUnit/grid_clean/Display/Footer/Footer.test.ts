import { GridCollection } from 'Controls/grid';
import { RecordSet } from 'Types/collection';

describe('Controls/grid_clean/Display/Collection', () => {
    it('Init footer in constructor', () => {
        // В опциях переданы только колонки для футера -> футер должен проинициализироваться
        let collection = new GridCollection({
            collection: new RecordSet({
                rawData: [
                    {
                        key: 1,
                        title: 'item_1',
                    },
                ],
                keyProperty: 'key',
            }),
            keyProperty: 'key',
            columns: [{}],
            footer: [],
        });
        expect(!!collection.getFooter()).toBe(true);

        // В опциях передан только шаблон для футера -> футер должен проинициализироваться
        const footerTemplate = 'my custom footer template';
        collection = new GridCollection({
            collection: new RecordSet({
                rawData: [
                    {
                        key: 1,
                        title: 'item_1',
                    },
                ],
                keyProperty: 'key',
            }),
            keyProperty: 'key',
            columns: [{}],
            footerTemplate,
        });
        expect(!!collection.getFooter()).toBe(true);
        expect(
            footerTemplate ===
                collection.getFooter().getColumns()[0].getTemplate()
        ).toBe(true);
    });

    it('Footer template options', () => {
        const template = 'my custom template';
        const templateOptions = {
            customOption1: 1,
            customOptions2: 2,
        };
        const collection = new GridCollection({
            collection: new RecordSet({
                keyProperty: 'key',
                rawData: [
                    {
                        key: 1,
                        title: 'item_1',
                    },
                ],
            }),
            keyProperty: 'key',
            columns: [{}],
            footer: [
                {
                    template,
                    templateOptions,
                },
            ],
        });

        const footerCell = collection.getFooter().getColumns()[0];
        expect(template === footerCell.getTemplate()).toBe(true);
        expect(footerCell.config.templateOptions).toEqual(templateOptions);
    });
});
