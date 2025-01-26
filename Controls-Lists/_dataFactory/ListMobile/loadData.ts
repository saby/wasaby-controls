/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import {
    abstractLoadData,
    type IAbstractListDataFactoryLoadResult,
} from 'Controls-DataEnv/abstractList';

import { RecordSet } from 'Types/collection';
import { ExternalCollectionItemKeys } from './_interface/IExternalTypes';
import { IListMobileDataFactoryArguments } from './interface/factory/IListMobileDataFactoryArguments';
import { IListMobileDataFactory } from './interface/factory/IListMobileDataFactory';

/**
 * Метод загрузки данных для списка.
 */
export const loadData: IListMobileDataFactory['loadData'] = async (
    cfg?: IListMobileDataFactoryArguments
): Promise<IAbstractListDataFactoryLoadResult & { items?: RecordSet }> => {
    const abstractLoadDataResult = await abstractLoadData({
        ...cfg,
        isLatestInteractorVersion: true,
    });

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
            isLatestInteractorVersion: true,
            error,
        };
    }
};
