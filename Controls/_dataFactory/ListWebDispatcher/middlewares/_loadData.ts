import { TListAction } from '../types/TListAction';
import { TListMiddlewareCreator } from '../types/TListMiddleware';
import { IListState } from 'Controls/_dataFactory/List/_interface/IListState';
import { ISourceControllerOptions } from 'Controls/dataSource';

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
