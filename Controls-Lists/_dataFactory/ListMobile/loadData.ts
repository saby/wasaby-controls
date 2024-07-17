import { abstractLoadData, type IListDataFactoryLoadResult } from 'Controls/dataFactory';

import { RecordSet } from 'Types/collection';
import { ExternalCollectionItemKeys } from './_interface/IExternalTypes';
import { IListMobileDataFactoryArguments } from './_interface/IListMobileDataFactoryArguments';

export default async function loadData(
    cfg: IListMobileDataFactoryArguments
): Promise<IListDataFactoryLoadResult & { items?: RecordSet }> {
    const abstractLoadDataResult = await abstractLoadData(cfg);

    try {
        const items = new RecordSet({
            rawData: [],
            model: cfg.model,
            keyProperty: ExternalCollectionItemKeys.ident,
        });
        return {
            error: undefined,
            data: items,
            items,
            ...abstractLoadDataResult,
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return {
            error,
        };
    }
}
