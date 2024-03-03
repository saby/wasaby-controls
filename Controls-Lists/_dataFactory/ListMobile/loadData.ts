import type { IListDataFactoryLoadResult } from 'Controls/dataFactory';

import { RecordSet } from 'Types/collection';
import { ExternalCollectionItemKeys } from './_interface/IExternalTypes';

export default async function loadData(): Promise<
    IListDataFactoryLoadResult & { items?: RecordSet }
> {
    try {
        const items = new RecordSet({
            rawData: [],
            keyProperty: ExternalCollectionItemKeys.ident,
        });
        return {
            error: undefined,
            data: items,
            items,
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return {
            error,
        };
    }
}
