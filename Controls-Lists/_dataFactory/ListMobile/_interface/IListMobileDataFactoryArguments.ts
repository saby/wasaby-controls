import type { IListDataFactoryArguments, TCollectionType } from 'Controls/dataFactory';
import type { IListMobileSourceParams } from './IListMobileSourceParams';
import type { IListMobileSourceControllerParams } from './IListMobileSourceControllerParams';

export type IListMobileDataFactoryArguments = Omit<
    IListDataFactoryArguments,
    'keyProperty' | 'parentProperty' | 'nodeProperty' | 'source' | 'sourceController'
> &
    IListMobileSourceParams &
    Omit<IListMobileSourceControllerParams, 'source'> & {
        collectionType: TCollectionType;
    };
