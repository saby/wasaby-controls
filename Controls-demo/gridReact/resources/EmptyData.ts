import { RecordSet } from 'Types/collection';

import { getColumns, getItems } from 'Controls-demo/gridReact/resources/CountriesData';

export { getItems, getColumns };

export function getEmptyItems(): RecordSet {
    return new RecordSet({
        keyProperty: 'key',
        rawData: [],
    });
}
