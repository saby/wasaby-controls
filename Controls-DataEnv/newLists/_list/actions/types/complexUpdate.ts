import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';

import type { IListState } from '../../interface/IListState';
import type { RecordSet } from 'Types/collection';
import type { Direction, IBaseSourceConfig } from 'Controls-DataEnv/listTypes';
import type { NewSourceController as SourceController } from 'Controls/dataSource';
import type { TAbstractComplexUpdateAction } from './TAbstractComplexUpdateAction';

/**
 * Тип действия, для сборки нового состояния по переданному объекту.
 */
export type TReduceStateAction = TAbstractAction<
    'reduceState',
    {
        prevState: IListState;
        nextState: IListState;
    }
>;

/**
 * Тип действия, для выполнения старого кода комплексного обновления.
 * Непереведенный код списочного слайса.
 */
export type TOldBeforeApplyStateAction = TAbstractAction<
    'oldBeforeApplyState',
    {
        prevState: IListState;
        nextState: IListState;
    }
>;

/**
 * Тип действия, для комплексного обновления состояния текущего корня.
 */
export type TComplexUpdateRootAction = TAbstractComplexUpdateAction<'Root'>;
/**
 * Тип действия, для комплексного обновления раскрытых состояния раскрытых узлов.
 */
export type TComplexUpdateExpandCollapseAction = TAbstractComplexUpdateAction<'ExpandCollapse'>;
/**
 * Тип действия, для обновления фильтра.
 */
export type TComplexUpdateFilterAction = TAbstractComplexUpdateAction<'Filter'>;

/**
 * Тип действия для комплексного обновления действий над записью.
 */
export type TComplexUpdateItemActionsAction = TAbstractComplexUpdateAction<'ItemActions'>;

/**
 * Тип действия, для комплексного обновления записей.
 */
export type TComplexUpdateItemsAction = TAbstractComplexUpdateAction<'Items'>;

/**
 * Тип действия для комплексного обновления маркера.
 */
export type TComplexUpdateMarkerAction = TAbstractComplexUpdateAction<'Marker'>;
/**
 * Тип действия, для комплексного обновления ПМО.
 */
export type TComplexUpdateOperationsPanelAction = TAbstractComplexUpdateAction<'OperationsPanel'>;
/**
 * Тип действия, для комплексного обновления состояния текущего поиска.
 */
export type TComplexUpdateSearchAction = TAbstractComplexUpdateAction<'Search'>;

/**
 * Тип действия, для комплексного обновления состояния множественного выделения.
 */
export type TComplexUpdateSelectionAction = TAbstractComplexUpdateAction<'Selection'>;

/**
 * Тип действия TComplexUpdateSourceAction.
 */
export type TComplexUpdateSourceAction = TAbstractComplexUpdateAction<'Source'>;

/**
 * Тип действий комплексного обновления состояния, доступные в WEB списке.
 */
export type TAnyComplexUpdateAction =
    | TOldBeforeApplyStateAction
    | TReduceStateAction
    | TComplexUpdateRootAction
    | TComplexUpdateExpandCollapseAction
    | TComplexUpdateFilterAction
    | TComplexUpdateItemActionsAction
    | TComplexUpdateItemsAction
    | TComplexUpdateMarkerAction
    | TComplexUpdateOperationsPanelAction
    | TComplexUpdateSearchAction
    | TComplexUpdateSelectionAction
    | TComplexUpdateSourceAction;
// FIXME: Всё ниже должно отсюда быть удалено.
// Типы для совместимости, которые будут разбираться по мидлварам до полного исчезновения.

// FIXME: Всё ниже должно отсюда быть удалено.
// Типы для совместимости, которые будут разбираться по мидлварам до полного исчезновения.
/**
 * TMiddlewaresPropsForMigrationToDispatcher.
 */
export type TMiddlewaresPropsForMigrationToDispatcher<TState extends IListState = IListState> = {
    sliceCallbacks: {
        setState?: (state: Partial<TState>) => void;
        applyState?: (state: Partial<TState>) => void;

        // Удалить после реализации правильного rejectSetState и destroy
        isDestroyed: () => boolean;
        openOperationsPanel?: () => void;
        // TODO: Удалить когда весь код про работу с рекордсетом будет сконцентрирован в единственной мидлваре
        updateSubscriptionOnItems?: (
            oldItems: RecordSet | null,
            newItems: RecordSet | null
        ) => void;
    };
    sliceProperties: {
        // TODO: В снапшот на смену режима отображения выбранных записей.
        previousViewMode?: string | null;
        // TODO: Удалить когда весь код работы с источником будет в единственной мидлваре.
        sourceController?: SourceController;
        newItems: RecordSet | null;
        newItemsDirection?: Direction;
        loadConfig: { sourceConfig?: IBaseSourceConfig; keepNavigation?: boolean } | null;
    } | null;
};
