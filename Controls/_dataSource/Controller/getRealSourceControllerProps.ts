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
    'propStorageId',
    'historyIdCollapsedGroups',
    'dataLoadCallback',
    'dataLoadErrback',
    'nodeLoadCallback',
    'displayProperty',
    'error',
    'selectFields',
    'loadTimeout',
    'items',
    'deepScrollLoad',
    'deepReload',
    'id',
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
