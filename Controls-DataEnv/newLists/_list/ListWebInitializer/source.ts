import { PrefetchProxy } from 'Types/source';
import { TKey } from 'Controls-DataEnv/interface';
import type {
    ISourceControllerOptions,
    NewSourceController as SourceController,
} from 'Controls/dataSource';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import type { Direction } from 'Controls-DataEnv/listTypes';

import type { IListState } from '../interface/IListState';
import type { IListDataFactoryArguments } from '../interface/factory/IListDataFactoryArguments';
import type { IListDataFactoryLoadResult } from '../interface/factory/IListDataFactoryLoadResult';

/**
 * Коллекция элемента в развернутом списке
 * */
export interface IHasMore {
    forward: boolean;
    backward: boolean;
}

/**
 * Коллекция элементов в развернутом списке
 * */
export interface IHasMoreStorage {
    [key: string]: IHasMore;
}

/**
 * Функция определения наличия элементов в развернутом списке
 * */
// FIXME: Убрать null или превратить объект в Map.
//  В текущих списках повсеместная проблема с объектами-картами типа ключ-значение:
//  ключ может быть null, тогда при записи в объякт он бует преобразован в 'null', что не является типо-безопасным.
export function initHasMoreStorage(
    nextState: Pick<IListState, 'expandedItems' | 'sourceController'>
): IHasMoreStorage {
    return (nextState.expandedItems || []).reduce<IHasMoreStorage>(
        (result: IHasMoreStorage, key: TKey) => {
            result[key as keyof IHasMoreStorage] = {
                forward: !!nextState.sourceController?.hasMoreData('down', key),
                backward: !!nextState.sourceController?.hasMoreData('up', key),
            };
            return result;
        },
        {}
    );
}

/**
 * Интерфейс функции для загрузки контроллера-загрузчика данных по текущей конфигурации списка
 * */
type TCreateSourceController = {
    (state: IListState): SourceController;
    (loadResult: IListDataFactoryLoadResult, config: IListDataFactoryArguments): SourceController;
};

/**
 * Загрузка контроллера-загрузчика данных по текущей конфигурации списка
 * */
export const createSourceController: TCreateSourceController = (
    stateOrLoadResult: IListDataFactoryLoadResult | IListState,
    config?: IListDataFactoryArguments
): SourceController => {
    if (config !== undefined) {
        return createSourceControllerByLoadConfig(
            stateOrLoadResult as IListDataFactoryLoadResult,
            config
        );
    } else {
        return createSourceControllerByState(stateOrLoadResult as IListState);
    }
};

/**
 * Получение конфигурации из конфигурации загрузки списка для контроллера-загрузчика данных
 * */
function createSourceControllerByLoadConfig(
    loadResult: IListDataFactoryLoadResult,
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

/**
 * Загрузка контроллера-загрузчика данных по текущему состоянию списка
 * */
function createSourceControllerByState(state: IListState): SourceController {
    return createSourceControllerByProps(getSourceControllerOptions(state));
}

/**
 * Загрузка контроллера-загрузчика данных
 * */
function createSourceControllerByProps(props: ISourceControllerOptions): SourceController {
    const dataSource = loadSync<typeof import('Controls/dataSource')>('Controls/dataSource');
    return new dataSource.NewSourceController(props);
}

/**
 * Получение конфигурации из состояния для контроллера-загрузчика данных
 * */
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

export function getLoadDirection(
    direction: Direction,
    itemsOrder: IListState['itemsOrder']
): Direction {
    return itemsOrder !== 'default' ? (direction === 'up' ? 'down' : 'up') : direction;
}
