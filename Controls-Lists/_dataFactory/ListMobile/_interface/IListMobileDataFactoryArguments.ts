/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { IListDataFactoryArguments, TCollectionType } from 'Controls/dataFactory';
import type { IListMobileSourceParams } from './IListMobileSourceParams';
import type { IListMobileSourceControllerParams } from './IListMobileSourceControllerParams';

/**
 * Интерфейс аргументов фабрики списка.
 * @interface Controls/_dataFactory/ListMobile/_interface/IListMobileDataFactoryArguments
 * @public
 */
export type IListMobileDataFactoryArguments = Omit<
    IListDataFactoryArguments,
    'source' | 'sourceController'
> &
    IListMobileSourceParams &
    Omit<IListMobileSourceControllerParams, 'source'> & {
        collectionType: TCollectionType;
        model?: string | Function;
        ladderProperties?: string[];
    };
