import * as IAbstractListStateParts from './IAbstractListStateParts';
import type { TViewMode } from 'Controls-DataEnv/interface';
import type { Model } from 'Types/entity';
import type { IStateThatShouldGoIntoViewLayer } from './IStateThatShouldGoIntoViewLayer';

/**
 * Тип изменения RecordSet'a.
 */
export enum ChangeAction {
    ACTION_ADD = 'a',
    ACTION_REMOVE = 'rm',
    ACTION_CHANGE = 'ch',
    ACTION_REPLACE = 'rp',
    ACTION_MOVE = 'm',
    ACTION_RESET = 'rs',
}

/**
 * Тип изменения метаданных RecordSet'a.
 */
export enum MetaDataChangeAction {
    REPLACE_META_DATA = 'r',
    MERGE_META_DATA = 'm',
}

/**
 * Источник изменений RecordSet'a: снаруже или извне.
 */
export type TListChangeSource = 'INTERNAL' | 'EXTERNAL';

/**
 * Изменения(сырые) RecordSet'a.
 */
export type TItemsChange = {
    action: ChangeAction;
    newItems: Model[];
    newItemsIndex: number;
    removedItems: Model[];
    removedItemsIndex: number;
    reason?: string;
    changedPropertyItems?: object;
    changeSource?: TListChangeSource;
};

/**
 * Изменения(сырые) метаданных RecordSet'a.
 */
export type TMetaDataChange = {
    action: MetaDataChangeAction;
    metaData: unknown;
};

/**
 * Интерфейс состояния абстрактного списочного слайса.
 */
export interface IAbstractListState
    extends IAbstractListStateParts.ICoreState,
        IAbstractListStateParts.IItemsState,
        IAbstractListStateParts.ISelectionState,
        IAbstractListStateParts.IOperationsPanelState,
        IAbstractListStateParts.IActionsState,
        IAbstractListStateParts.IMarkerState,
        IAbstractListStateParts.IHierarchyState,
        IAbstractListStateParts.IFilterState,
        IAbstractListStateParts.IFilterPanelState,
        IAbstractListStateParts.IErrorState,
        IAbstractListStateParts.ISortingState,
        IAbstractListStateParts.ISearchState,
        IAbstractListStateParts.IHighlightState,
        IAbstractListStateParts.IBreadcrumbsState,
        IAbstractListStateParts.IColumnsState,
        IAbstractListStateParts.ITileState,
        IStateThatShouldGoIntoViewLayer {
    /**
     * Режим отображения списка.
     * @default undefined
     */
    viewMode?: TViewMode;
    needShowStub: boolean;
}
