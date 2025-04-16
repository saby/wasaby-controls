import type { TKey } from 'Controls-DataEnv/interface';
import type {
    ISourceControllerOptions,
    NewSourceController as SourceController,
} from 'Controls/dataSource';
import type { Direction } from 'Controls-DataEnv/listTypes';
import type { IListState } from '../interface/IListState';
import type { IListDataFactoryArguments } from '../interface/factory/IListDataFactoryArguments';
import type { IListDataFactoryLoadResult } from '../interface/factory/IListDataFactoryLoadResult';

import { PrefetchProxy } from 'Types/source';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { _private_extractUtil } from 'Controls-DataEnv/abstractList';
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
    const { expandedItems, sourceController } = nextState;
    return (expandedItems || []).reduce<IHasMoreStorage>((result: IHasMoreStorage, key: TKey) => {
        result[key as keyof IHasMoreStorage] = {
            forward: !!sourceController?.hasMoreData('down', key),
            backward: !!sourceController?.hasMoreData('up', key),
        };
        return result;
    }, {});
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
        expandedItems: loadResult.expandedItems || config.expandedItems || [],
        filter: loadResult.filter || config.filter,
        sorting: loadResult.sorting || config.sorting,
        root: loadResult.root !== undefined ? loadResult.root : config.root,
        ..._private_extractUtil(loadResult, ['items', 'error']),

        source:
            config.source instanceof PrefetchProxy ? config.source.getOriginal() : config.source,

        ..._private_extractUtil(config, [
            'navigation',
            'parentProperty',
            'keyProperty',
            'hasChildrenProperty',
            'selectFields',
            'displayProperty',
            'groupHistoryId',
            'selectedKeys',
            'excludedKeys',
            'nodeHistoryType',
            'nodeTypeProperty',
            'nodeHistoryId',
            'deepReload',
            'deepScrollLoad',
            'propStorageId',
        ]),
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
    return _private_extractUtil(state, [
        'filter',
        'source',
        'keyProperty',
        'sorting',
        'root',
        'navigation',
        'displayProperty',
        'parentProperty',
        'nodeProperty',
        'groupHistoryId',
        'selectFields',
        'selectedKeys',
        'excludedKeys',
        'propStorageId',
        'nodeHistoryId',
        'nodeHistoryType',
        'nodeTypeProperty',
        'expandedItems',
        'deepReload',
        'deepScrollLoad',
    ]);
}

export function getLoadDirection(
    direction: Direction,
    itemsOrder: IListState['itemsOrder']
): Direction {
    return itemsOrder !== 'default' ? (direction === 'up' ? 'down' : 'up') : direction;
}
