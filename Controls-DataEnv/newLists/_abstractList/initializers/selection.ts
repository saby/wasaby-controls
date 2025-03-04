import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';
import dedupeArray from './utils/dedupeArray';
import { LibPaths } from 'Controls-DataEnv/staticLoader';

import type { IAbstractListDataFactoryLoadResult } from '../interface/factory/IAbstractListDataFactoryLoadResult';
import type { IAbstractListDataFactoryArguments } from '../interface/factory/IAbstractListDataFactoryArguments';
import type { ISelectionState } from '../interface/IAbstractListStateParts';
import type { Initializer } from '../Initializer';
import type { TSelectionModel } from '../interface/IAbstractListStateParts/ISelectionState';
import type {
    IHierarchySelectionState,
    IFlatSelectionState,
    NewFlatSelectionStrategy,
    NewHierarchySelectionStrategy,
} from 'Controls/multiselection';
import type { IAbstractListState } from '../interface/IAbstractListState';
import { isHierarchyDefined } from '../validators/predicates';

export default function initState(
    _: Initializer,
    __: IAbstractListDataFactoryLoadResult,
    config: IAbstractListDataFactoryArguments
): ISelectionState {
    return {
        selectedKeys: dedupeArray(config.selectedKeys, 'selectedKeys') || [],
        excludedKeys: dedupeArray(config.excludedKeys, 'excludedKeys') || [],
        // пока стратегии создания модели требуют наличие коллекции, а сама коллекция создается вне инициалайзера,
        // модель будет рассчитываться после создания коллекции в слайсе
        selectionModel: new Map(),
        multiSelectVisibility: config.multiSelectVisibility || 'hidden',
    };
}

/**
 * Метод для получения стратегии множественного выделения
 * @param state Состояние слайса
 */
export function getSelectionStrategy(
    state: IAbstractListState
): NewFlatSelectionStrategy | NewHierarchySelectionStrategy {
    const { NewFlatSelectionStrategy, NewHierarchySelectionStrategy } = loadSync<
        typeof import('Controls/multiselection')
    >(LibPaths.MultiSelection);
    if (isHierarchyDefined(state)) {
        return new NewHierarchySelectionStrategy();
    }
    return new NewFlatSelectionStrategy();
}

/**
 * Конструктор модели выделенных элементов
 * @param state Состояние слайса
 */
export function createSelectionModel(state: IAbstractListState): TSelectionModel {
    if (!isLoaded(LibPaths.MultiSelection) || !state.selectedKeys.length) {
        return new Map();
    }
    return getSelectionStrategy(state).getSelectionModel(
        state as unknown as IFlatSelectionState & IHierarchySelectionState
    );
}
