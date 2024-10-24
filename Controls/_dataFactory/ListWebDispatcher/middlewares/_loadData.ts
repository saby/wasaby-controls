import { TListAction } from '../types/TListAction';
import { TListMiddlewareCreator } from '../types/TListMiddleware';
import { IListState } from 'Controls/_dataFactory/List/_interface/IListState';
import { ISourceControllerOptions } from 'Controls/dataSource';
import { IBaseSourceConfig } from 'Controls/_interface/INavigation';
import { TLoadResult } from 'Controls/_dataFactory/List/Slice';

export const _loadData: TListMiddlewareCreator = () => {
    return (next) => async (action: TListAction) => {
        next(action);
    };
};

export function getSourceControllerOptions(state: Partial<IListState>): ISourceControllerOptions {
    return {
        filter: state.filter,
        source: state.source,
        keyProperty: state.keyProperty,
        sorting: state.sorting,
        root: state.root,
        navigation: state.navigation,
        displayProperty: state.displayProperty,
        parentProperty: state.parentProperty,
        nodeProperty: state.nodeProperty,
        groupHistoryId: state.groupHistoryId,
        selectFields: state.selectFields,
        selectedKeys: state.selectedKeys,
        excludedKeys: state.excludedKeys,
        propStorageId: state.propStorageId,
        nodeHistoryId: state.nodeHistoryId,
        nodeHistoryType: state.nodeHistoryType,
        nodeTypeProperty: state.nodeTypeProperty,
        expandedItems: state.expandedItems,
        deepReload: state.deepReload,
        deepScrollLoad: state.deepScrollLoad,
    };
}

export function reloadSourceController(
    state: IListState,
    navigationSourceConfig?: IBaseSourceConfig
): Promise<TLoadResult> {
    // FIXME: Types
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return state.sourceController?.reload(navigationSourceConfig, undefined, false);
}
