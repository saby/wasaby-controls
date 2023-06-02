/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
/**
 * Библиотека компонентов для упрощения загрузки данных: формирования запросов, обработки ошибок.
 * Если нужно обработать ошибки, то вместо этой библиотеки нужно использовать библиотеку {@link Controls/error}.
 * @library
 * @includes error Controls/dataSource:error
 * @includes requestDataUtil Controls/_dataSource/requestDataUtil
 * @public
 */
import * as error from 'Controls/_dataSource/error';
import requestDataUtil from 'Controls/_dataSource/requestDataUtil';
import { nodeHistoryUtil } from 'Controls/_dataSource/nodeHistoryUtil';
import groupUtil from 'Controls/_dataSource/GroupUtil';
import { IDataLoaderOptions } from './_dataSource/DataLoader';
import { ILoadDataConfig } from './_dataSource/DataLoader/interface/ILoadDataConfig';
import { ILoadDataResult } from './_dataSource/DataLoader/interface/ILoadDataResult';
import { ILoadDataCustomConfig } from './_dataSource/DataLoader/interface/ILoadDataCustomConfig';

export {
    error,
    requestDataUtil,
    groupUtil,
    nodeHistoryUtil,
    IDataLoaderOptions,
    ILoadDataConfig as ISourceConfig,
    ILoadDataResult as IRequestDataResult,
};
export { CrudWrapper } from 'Controls/_dataSource/CrudWrapper';
export {
    default as NewSourceController,
    IControllerState as ISourceControllerState,
    IControllerOptions as ISourceControllerOptions,
} from './_dataSource/Controller';
export {
    default as calculatePath,
    Path,
} from 'Controls/_dataSource/calculatePath';
export { isEqualItems } from './_dataSource/Controller';
export { default as NavigationController } from './_dataSource/NavigationController';
export {
    default as DataLoader,
    TLoadersConfigsMap as TLoadConfig,
    TLoadResultMap,
} from './_dataSource/DataLoader';
export { ILoadDataConfig, ILoadDataResult, ILoadDataCustomConfig };
export {
    default as PageController,
    IPageConfig,
} from './_dataSource/PageController';
export {
    getState as getControllerState,
    saveState as saveControllerState,
    IListSavedState,
} from 'Controls/_dataSource/Controller/State';
export const FILTER_EDITORS_WHICH_REQUIRED_DATA_LOAD = [
    'Controls/filterPanel:ListEditor',
    'Controls/filterPanel:LookupEditor',
];
