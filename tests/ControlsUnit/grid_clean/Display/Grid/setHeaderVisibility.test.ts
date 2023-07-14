import { GridCollection } from 'Controls/grid';
import { RecordSet } from 'Types/collection';

const RAW_DATA = [
    { key: 1, name: 'Father' },
    { key: 2, name: 'Son' },
    { key: 3, name: 'Holy spirit' },
];

const RAW_EMPTY_DATA = [];

const COLUMNS = [{ width: '1fr' }, { width: '1fr' }];

const HEADER = [{ caption: 'key' }, { caption: 'name' }];

describe('Controls/grid_clean/display/Grid/setHeaderVisibility', () => {
    it('[case 1] => 1) headerVisibility = "hasdata". 2) has data. 3) setHeaderVisibility("visible")', () => {
        const collection = new GridCollection({
            collection: new RecordSet({
                rawData: RAW_DATA,
                keyProperty: 'key',
            }),
            keyProperty: 'key',
            headerVisibility: 'hasdata',
            columns: COLUMNS,
            header: HEADER,
        });

        collection.getHeader();

        const versionBeforeSetHeaderVisibility = collection.getVersion();

        collection.setHeaderVisibility('visible');

        expect(collection.getVersion()).toEqual(versionBeforeSetHeaderVisibility);

        jest.restoreAllMocks();
    });

    it('[case 2] =>1) headerVisibility = "hasdata". 2) no data. 3) setHeaderVisibility("visible")', () => {
        const collection = new GridCollection({
            collection: new RecordSet({
                rawData: RAW_EMPTY_DATA,
                keyProperty: 'key',
            }),
            keyProperty: 'key',
            headerVisibility: 'hasdata',
            columns: COLUMNS,
            header: HEADER,
        });

        collection.getHeader();

        const versionBeforeSetHeaderVisibility = collection.getVersion();

        collection.setHeaderVisibility('visible');

        expect(collection.getVersion()).not.toEqual(versionBeforeSetHeaderVisibility);

        jest.restoreAllMocks();
    });

    it('[case 3] =>1) headerVisibility = "visible". 2) has data. 3) setHeaderVisibility("hasdata")', () => {
        const collection = new GridCollection({
            collection: new RecordSet({
                rawData: RAW_DATA,
                keyProperty: 'key',
            }),
            keyProperty: 'key',
            headerVisibility: 'visible',
            columns: COLUMNS,
            header: HEADER,
        });

        collection.getHeader();

        const versionBeforeSetHeaderVisibility = collection.getVersion();

        collection.setHeaderVisibility('hasdata');

        expect(collection.getVersion()).toEqual(versionBeforeSetHeaderVisibility);

        jest.restoreAllMocks();
    });

    it('[case 4] =>1) headerVisibility = "visible". 2) no data. 3) setHeaderVisibility("hasdata")', () => {
        const collection = new GridCollection({
            collection: new RecordSet({
                rawData: RAW_EMPTY_DATA,
                keyProperty: 'key',
            }),
            keyProperty: 'key',
            headerVisibility: 'visible',
            columns: COLUMNS,
            header: HEADER,
        });

        collection.getHeader();

        const versionBeforeSetHeaderVisibility = collection.getVersion();

        collection.setHeaderVisibility('hasdata');

        expect(collection.getVersion()).not.toEqual(versionBeforeSetHeaderVisibility);

        jest.restoreAllMocks();
    });
});
