import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { GridCollection } from 'Controls/grid';

describe('Controls/grid_clean/Display/Grid/BackgroundStyle', () => {
    describe('getHeader', () => {
        it('data was added', () => {
            const recordSet = new RecordSet({
                keyProperty: 'id',
                rawData: [],
            });

            const collection = new GridCollection({
                collection: recordSet,
                columns: [{ width: '' }],
                header: [{ caption: '' }],
                backgroundStyle: 'custom',
                headerVisibility: 'hasdata',
            });

            recordSet.add(
                new Model({
                    rawData: { id: 0 },
                    keyProperty: 'id',
                })
            );

            // После добавления инициализируется headerModel,
            // Мы проверяем, что инициализация произошла с backgroundStyle
            const row = collection.getHeader().getRow();
            expect(row.getBackgroundStyle()).toEqual('custom');
        });
    });

    describe('getResults', () => {
        it('data was added', () => {
            const recordSet = new RecordSet({
                keyProperty: 'id',
                rawData: [],
            });

            const collection = new GridCollection({
                collection: recordSet,
                columns: [{ width: '' }],
                header: [{ caption: '' }],
                backgroundStyle: 'custom',
                resultsPosition: 'top',
                resultsVisibility: 'hasdata',
            });

            recordSet.assign(
                new RecordSet({
                    rawData: [{ id: 0 }, { id: 1 }],
                    keyProperty: 'id',
                })
            );

            // После добавления инициализируется results,
            // Мы проверяем, что инициализация произошла с backgroundStyle
            const row = collection.getResults();
            expect(row.getBackgroundStyle()).toEqual('custom');
        });
    });

    describe('setFooter', () => {
        const footerTemplate = () => {
            return 'footer';
        };

        it('data was added', () => {
            const recordSet = new RecordSet({
                keyProperty: 'id',
                rawData: [],
            });

            const collection = new GridCollection({
                collection: recordSet,
                columns: [{ width: '' }],
                header: [{ caption: '' }],
                backgroundStyle: 'custom',
            });

            collection.setFooter({
                footerTemplate,
                footer: [{ width: '' }],
            });

            // После добавления инициализируется footer,
            // Мы проверяем, что инициализация произошла с backgroundStyle
            const row = collection.getFooter();
            expect(row.getBackgroundStyle()).toEqual('custom');
        });
    });
});
