/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';
import { TBaseControl, getClass } from './ColumnScrollControl';
import { executeSyncOrAsync } from 'UICommon/Deps';

export type TSupportedLibs =
    | 'Controls/grid'
    | 'Controls/treeGrid'
    | 'Controls/searchBreadcrumbsGrid';

const LIB_CONTROLLERS: Record<TSupportedLibs, string> = {
    'Controls/grid': 'GridControl',
    'Controls/treeGrid': 'TreeGridControl',
    'Controls/searchBreadcrumbsGrid': 'SearchGridControl',
};

export function resolveColumnScrollControl(libName: TSupportedLibs): ReturnType<typeof getClass> {
    const isLibLoaded = isLoaded(libName);
    if (!isLibLoaded) {
        executeSyncOrAsync(['Controls/listErrors'], (errs) => errs.GridColumnScrollError(libName));
    }
    const BaseControl = (
        isLibLoaded ? loadSync(libName)[LIB_CONTROLLERS[libName]] : class {}
    ) as TBaseControl;

    return getClass(BaseControl);
}
