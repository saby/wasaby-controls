import { RecordSet } from 'Types/collection';
import {
    SearchGridCollection,
    SearchSeparatorRow,
} from 'Controls/searchBreadcrumbsGrid';

interface IData {
    key: number;
    pid?: number;
    node?: boolean;
    title?: string;
}

function getRecordSet(rawData: IData[]): RecordSet<IData> {
    return new RecordSet({ rawData, keyProperty: 'key' });
}

function getCollection(
    collection: RecordSet<IData>,
    options: object = {}
): SearchGridCollection {
    return new SearchGridCollection({
        collection,
        ...options,
        root: null,
        keyProperty: 'key',
        parentProperty: 'pid',
        nodeProperty: 'node',
        columns: [
            {
                displayProperty: 'title',
                width: '300px',
                template: 'wml!template1',
            },
            {
                displayProperty: 'taxBase',
                width: '200px',
                template: 'wml!template1',
            },
        ],
    });
}

describe('Controls/searchBreadcrumbsGrid/display/Collection/SetColumns', () => {
    const data: IData[] = [
        {
            key: 1,
            pid: null,
            node: true,
            title: 'A',
        },
        {
            key: 10,
            pid: 1,
            node: null,
            title: 'AA',
        },
        {
            key: 2,
            pid: null,
            node: null,
            title: 'C',
        },
    ];

    it('Should call setColumnsConfig', () => {
        const collection = getCollection(getRecordSet(data));
        const separator = collection.at(2);

        expect(separator).toBeInstanceOf(SearchSeparatorRow);

        const spySetColumnsConfig = jest
            .spyOn(separator, 'setColumnsConfig')
            .mockClear();

        collection.setColumns([
            {
                displayProperty: 'title',
                width: '300px',
            },
            {
                displayProperty: 'taxBase',
                width: '200px',
            },
            {
                displayProperty: 'count',
                width: '100px',
            },
        ]);

        expect(spySetColumnsConfig).toHaveBeenCalled();
    });
});
