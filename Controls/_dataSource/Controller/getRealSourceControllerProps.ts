import { ISourceControllerProps } from 'Controls/_dataSource/Controller/ISourceController';

const SOURCE_CONTROLLER_OPTIONS: (keyof ISourceControllerProps)[] = [
    'source',
    'navigation',
    'navigationParamsChangedCallback',
    'filter',
    'sorting',
    'keyProperty',
    'root',
    'rootHistoryId',
    'parentProperty',
    'nodeProperty',
    'hasChildrenProperty',
    'childrenProperty',
    'nodeTypeProperty',
    'nodeHistoryId',
    'nodeHistoryType',
    'expandedItems',
    'selectedKeys',
    'excludedKeys',
    'groupProperty',
    'collapsedGroups',
    'groupHistoryId',
    'historyIdCollapsedGroups',
    'dataLoadCallback',
    'dataLoadErrback',
    'nodeLoadCallback',
    'displayProperty',
    'propStorageId',
    'listConfigStoreId',
    'error',
    'selectFields',
    'loadTimeout',
    'items',
    'deepScrollLoad',
    'deepReload',
    'filterDescription',
    'countFilterValue',
    'countFilterLinkedNames',
    'countFilterValueConverter',
    'countFilterUserPeriods',
    'countFilterPeriodType',
    'historyItems',
    'id',
    'storeId',
    'observeMetaData',
    'task1183145150',
];

export default function getRealSourceControllerProps<T extends ISourceControllerProps>(
    options: T
): ISourceControllerProps {
    const opts: Record<string, unknown> = {};

    if (options) {
        for (const optionName of SOURCE_CONTROLLER_OPTIONS) {
            if (options.hasOwnProperty(optionName)) {
                opts[optionName] = options[optionName];
            }
        }
    }

    return opts as unknown as ISourceControllerProps;
}
