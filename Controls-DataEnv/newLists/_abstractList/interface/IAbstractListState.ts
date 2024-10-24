/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { IAbstractSelectionState } from './IState/IAbstractSelectionState';
import type { IAbstractMarkerState } from './IState/IAbstractMarkerState';
import type { IHierarchyState } from './IState/IHierarchyState';
import type { IItemsState } from './IState/IItemsState';

import type { Collection as ICollection } from 'Controls/display';
import type { TViewMode } from 'Controls-DataEnv/interface';
import type { TAbstractListActions } from '../actions';

/**
 * Интерфейс состояния абстрактного списочного слайса.
 */
export interface IAbstractListState
    extends IItemsState,
        IAbstractSelectionState,
        IAbstractMarkerState,
        IHierarchyState {
    collection: ICollection;
    viewMode?: TViewMode;

    /**
     * Определяет, используется ли самая свежая версия интерактора.
     * Должна быть установлена в false в любом платформенном
     * классе наследнике за пределами модуля Controls-DataEnv.
     */
    isLatestInteractorVersion: boolean;

    // TODO: Надо как то со стейта убрать.
    //  Если получится свести типы, то надо заприватить через символ.
    _actionToDispatch?: Map<string, TAbstractListActions.TAnyAbstractAction>;
}
