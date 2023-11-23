import type { IListDataFactoryArguments } from 'Controls/dataFactory';
import type { IListMobileSourceParams } from './IListMobileSourceParams';
import type { IListMobileSourceControllerParams } from './IListMobileSourceControllerParams';

export type IListMobileDataFactoryArguments = IListDataFactoryArguments &
    IListMobileSourceParams &
    Omit<IListMobileSourceControllerParams, 'source'>;
