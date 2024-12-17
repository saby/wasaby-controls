import type { IListState } from 'Controls/_dataFactory/interface/IListState';
import type { IHasMoreStorage } from 'Controls/baseTree';
import type { CrudEntityKey } from 'Types/source';
import type {
    ISourceControllerOptions,
    NewSourceController as SourceController,
} from 'Controls/dataSource';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { IListLoadResult } from 'Controls/_dataFactory/List/_interface/IListLoadResult';
import { IListDataFactoryArguments } from 'Controls/_dataFactory/List/_interface/IListDataFactoryArguments';
import { PrefetchProxy } from 'Types/source';

// FIXME: Убрать null или превратить объект в Map.
//  В текущих списках повсеместная проблема с объектами-картами типа ключ-значение:
//  ключ может быть null, тогда при записи в объякт он бует преобразован в 'null', что не является типо-безопасным.
export function initHasMoreStorage(nextState: IListState): IHasMoreStorage {
    return (nextState.expandedItems || []).reduce<IHasMoreStorage>((result, key: CrudEntityKey) => {
        result[key] = {
            forward: nextState.sourceController?.hasMoreData('down', key),
            backward: nextState.sourceController?.hasMoreData('up', key),
        };
        return result;
    }, {});
}

type TCreateSourceController = {
    (state: IListState): SourceController;
    (loadResult: IListLoadResult, config: IListDataFactoryArguments): SourceController;
};

export const createSourceController: TCreateSourceController = (
    stateOrLoadResult: IListLoadResult | IListState,
    config?: IListDataFactoryArguments
): SourceController => {
    if (config !== undefined) {
        return createSourceControllerByLoadConfig(stateOrLoadResult, config);
    } else {
        return createSourceControllerByState(stateOrLoadResult as IListState);
    }
};

function createSourceControllerByLoadConfig(
    loadResult: IListLoadResult,
    config: IListDataFactoryArguments
): SourceController {
    return createSourceControllerByProps({
        items: loadResult.items,
        error: loadResult.error,
        expandedItems: loadResult.expandedItems || config.expandedItems || [],
        source:
            config.source instanceof PrefetchProxy ? config.source.getOriginal() : config.source,
        navigation: config.navigation,
        filter: loadResult.filter || config.filter,
        parentProperty: config.parentProperty,
        keyProperty: config.keyProperty,
        selectFields: config.selectFields,
        sorting: loadResult.sorting || config.sorting,
        root: loadResult.root !== undefined ? loadResult.root : config.root,
        displayProperty: config.displayProperty,
        groupHistoryId: config.groupHistoryId,
        selectedKeys: config.selectedKeys,
        excludedKeys: config.excludedKeys,
        nodeHistoryType: config.nodeHistoryType,
        nodeTypeProperty: config.nodeTypeProperty,
        nodeHistoryId: config.nodeHistoryId,
        deepReload: config.deepReload,
        deepScrollLoad: config.deepScrollLoad,
        propStorageId: config.propStorageId,
    });
}

function createSourceControllerByState(state: IListState): SourceController {
    return createSourceControllerByProps(getSourceControllerOptions(state));
}

function createSourceControllerByProps(props: ISourceControllerOptions): SourceController {
    const dataSource = loadSync<typeof import('Controls/dataSource')>('Controls/dataSource');
    return new dataSource.NewSourceController(props);
}

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
