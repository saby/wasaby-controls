/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { IAbstractListDataFactoryArguments } from 'Controls-DataEnv/abstractList';
import type { TListMobileSourceParams } from '../../types/TListMobileSourceParams';
import type { TListMobileSourceControllerParams } from '../../types/TListMobileSourceControllerParams';

/**
 * Интерфейс аргументов фабрики списка.
 */
export type IListMobileDataFactoryArguments = Omit<
    IAbstractListDataFactoryArguments,
    'isLatestInteractorVersion'
> &
    TListMobileSourceParams &
    Omit<TListMobileSourceControllerParams, 'source'> & {
        model?: string | Function;
    };
