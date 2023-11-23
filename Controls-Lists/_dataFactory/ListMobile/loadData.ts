import type { IListDataFactoryLoadResult } from 'Controls/dataFactory';
import type { IListMobileDataFactoryArguments } from './_interface/IListMobileDataFactoryArguments';

import { RecordSet } from 'Types/collection';

export default async function loadData(
    config: IListMobileDataFactoryArguments
): Promise<IListDataFactoryLoadResult & { items?: RecordSet }> {
    try {
        const items = new RecordSet({
            rawData: [],
            keyProperty: config.keyProperty,
        });
        return {
            error: null,
            data: items,
            items,
        };
    } catch (error) {
        return {
            error,
        };
    }
}
