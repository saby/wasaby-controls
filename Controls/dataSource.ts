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

// TODO: Временное дублирование экспорта типов. уйдет по задаче: https://online.sbis.ru/opendoc.html?guid=7d9534d2-1171-441d-aaaa-8919cca866d4&client=3
import { IDataLoaderOptions } from 'Controls/_dataSourceOld/DataLoader';
import { ILoadDataConfig } from 'Controls/_dataSourceOld/DataLoader/interface/ILoadDataConfig';
import { ILoadDataResult } from 'Controls/_dataSourceOld/DataLoader/interface/ILoadDataResult';
import { ILoadDataCustomConfig } from 'Controls/_dataSourceOld/DataLoader/interface/ILoadDataCustomConfig';

export {
    TLoadersConfigsMap as TLoadConfig,
    TLoadResultMap,
} from 'Controls/_dataSourceOld/DataLoader';
export {
    ILoadDataConfig,
    ILoadDataResult,
    ILoadDataCustomConfig,
    IDataLoaderOptions,
    ILoadDataConfig as ISourceConfig,
    ILoadDataResult as IRequestDataResult,
};


export {
    error,
    requestDataUtil,
    groupUtil,
    nodeHistoryUtil,
};
export { CrudWrapper } from 'Controls/_dataSource/CrudWrapper';
export {
    default as NewSourceController,
    IControllerState as ISourceControllerState,
    IControllerOptions as ISourceControllerOptions,
    SORTING_USER_PARAM_POSTFIX,
} from './_dataSource/Controller';
export { default as calculatePath, Path } from 'Controls/_dataSource/calculatePath';
export { isEqualItems } from './_dataSource/Controller';
export { default as NavigationController } from './_dataSource/NavigationController';
export { default as PageController, IPageConfig } from './_dataSource/PageController';
export {
    getState as getControllerState,
    saveState as saveControllerState,
    IListSavedState,
} from 'Controls/_dataSource/Controller/State';
