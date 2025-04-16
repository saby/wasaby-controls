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
import { instanceOfTreeCollection } from '../collection/utils/predicates';

export default function initState(
    initializer: Initializer,
    __: IAbstractListDataFactoryLoadResult,
    config: IAbstractListDataFactoryArguments
): ISelectionState {
    let multiSelectVisibility = config.multiSelectVisibility || 'hidden';

    // При включенной ПМО показываем чекбоксы всегда.
    if (
        initializer.getStatic().operationsPanel.needOpenOperationsPanel(config) &&
        multiSelectVisibility === 'hidden'
    ) {
        multiSelectVisibility = 'visible';
    }

    return {
        selectedKeys: dedupeArray(config.selectedKeys, 'selectedKeys') || [],
        excludedKeys: dedupeArray(config.excludedKeys, 'excludedKeys') || [],
        // пока стратегии создания модели требуют наличие коллекции, а сама коллекция создается вне инициалайзера,
        // модель будет рассчитываться после создания коллекции в слайсе
        selectionModel: new Map(),
        multiSelectVisibility,
        multiSelectAccessibilityProperty: config.multiSelectAccessibilityProperty,
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
    if (isHierarchyDefined(state) && instanceOfTreeCollection(state.collection)) {
        // FIXME: sourceController отсутствует в абстрактном состоянии
        const { sourceController } = state as any;
        return new NewHierarchySelectionStrategy({
            hasMoreUtil: (key) => {
                return (
                    !!sourceController &&
                    (sourceController.hasMoreData('up', key) ||
                        sourceController.hasMoreData('down', key))
                );
            },
            isLoadedUtil: (key) => {
                return !sourceController || sourceController.hasLoaded(key);
            },
        });
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
