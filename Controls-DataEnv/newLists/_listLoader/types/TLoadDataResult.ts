import type { IListDataFactoryArguments, IListDataFactoryLoadResult } from 'Controls-DataEnv/list';

/**
 * @private
 */
export type TLoadDataResult =
    | Omit<IListDataFactoryLoadResult, 'isLatestInteractorVersion'>
    | (Omit<IListDataFactoryLoadResult, 'isLatestInteractorVersion'> &
          Omit<IListDataFactoryArguments, 'filter'>);
