/**
 * @kaizen_zone 6d1dacb9-d923-4521-8590-bebd3ba1d8c2
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
import { nodeHistoryUtil } from 'Controls/_dataSource/Utils/nodeHistoryUtil';
import groupUtil from 'Controls/_dataSource/Utils/GroupUtil';

// TODO: Временное дублирование экспорта типов. уйдет по задаче: https://online.sbis.ru/opendoc.html?guid=7d9534d2-1171-441d-aaaa-8919cca866d4&client=3
import { IDataLoaderOptions } from 'Controls/_dataSourceOld/DataLoader';
import { ILoadDataConfig } from 'Controls/_dataSourceOld/DataLoader/interface/ILoadDataConfig';
import { ILoadDataResult } from 'Controls/_dataSourceOld/DataLoader/interface/ILoadDataResult';
import { ILoadDataCustomConfig } from 'Controls/_dataSourceOld/DataLoader/interface/ILoadDataCustomConfig';
import getQueryInstance from 'Controls/_dataSource/DataSet/getQueryInstance';

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
export { INavigationChanges } from 'Controls/_dataSource/NavigationController';

export { error, requestDataUtil, groupUtil, nodeHistoryUtil, getQueryInstance };
export { CrudWrapper } from 'Controls/_dataSource/CrudWrapper';
export {
    default as NewSourceController,
    IControllerState as ISourceControllerState,
    SORTING_USER_PARAM_POSTFIX,
} from './_dataSource/Controller';
export { ISourceControllerProps as ISourceControllerOptions } from './_dataSource/Controller/ISourceController';
export { default as ISourceControllerLoadResult } from './_dataSource/Controller/ISourceControllerLoadResult';
export { default as getStateFromUrl } from './_dataSource/Controller/getStateFromUrl';
export { default as calculatePath, Path } from 'Controls/_dataSource/Utils/calculatePath';
export { isEqualItems } from 'Controls/_dataSource/Utils/isEqualItems';
export { default as NavigationController } from 'Controls/_dataSource/NavigationController';
export { default as PageController, IPageConfig } from 'Controls/_dataSource/PageController';
export {
    getState as getControllerState,
    saveState as saveControllerState,
    IListSavedState,
} from 'Controls/_dataSource/Controller/LocalMemoryState';
export { calculateBreadcrumbsData } from 'Controls/_dataSource/Utils/calculateBreadcrumbsData';
export {
    calculateAddItemsChanges,
    RecordSetChangeType,
    RecordSetChange,
    RecordSetDiffer,
    RecordSetChangeSideEffects,
} from 'Controls/_dataSource/RecordSetDiffer';
export { default as DataSet } from 'Controls/_dataSource/DataSet';
