/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { abstractLoadData, type IListDataFactoryLoadResult } from 'Controls/dataFactory';

import { RecordSet } from 'Types/collection';
import { ExternalCollectionItemKeys } from './_interface/IExternalTypes';
import { IListMobileDataFactoryArguments } from './_interface/IListMobileDataFactoryArguments';

/**
 * Метод загрузки данных для списка.
 * @function Controls-Lists/_dataFactory/ListMobile/loadData
 * @return {Promise<IListDataFactoryLoadResult & { items?: RecordSet }>}
 * @param {Controls/_dataFactory/ListMobile/_interface/IListMobileDataFactoryArguments} cfg Аргументы фабрики данных списка.
 */
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
