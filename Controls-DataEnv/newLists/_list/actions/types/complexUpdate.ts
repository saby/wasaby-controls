/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import type { RecordSet } from 'Types/collection';
import type { Direction, IBaseSourceConfig } from 'Controls/interface';
import type { NewSourceController as SourceController } from 'Controls/dataSource';

import type { IListState } from '../../interface/IListState';
import type { TListActions } from '../../actions';

/**
 * Тип действия, для комплексного обновления.
 * Аналог beforeApplyState в прошлой итерации списочного слайса.
 */
export type TBeforeApplyStateAction = TAbstractAction<
    'beforeApplyState',
    {
        nextState: IListState;
        _propsForMigration: TMiddlewaresPropsForMigrationToDispatcher;
        actionsToDispatch?: Map<string, TListActions.TAnyListAction>;
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
        _propsForMigration: TMiddlewaresPropsForMigrationToDispatcher;
    }
>;

/**
 * Тип действий комплексного обновления состояния, доступные в WEB списке.
 */
export type TAnyComplexUpdateAction = TBeforeApplyStateAction | TOldBeforeApplyStateAction;

// FIXME: Всё ниже должно отсюда быть удалено.
// Типы для совместимости, которые будут разбираться по мидлварам до полного исчезновения.
/**
 * TMiddlewaresPropsForMigrationToDispatcher.
 */
export type TMiddlewaresPropsForMigrationToDispatcher = {
    sliceCallbacks: {
        setState: (state: Partial<IListState>) => void;
        applyState: (state: Partial<IListState>) => void;

        // Удалить после реализации правильного rejectSetState и destroy
        isDestroyed: () => boolean;
        openOperationsPanel: () => void;
        // TODO: Удалить когда весь код про работу с рекордсетом будет сконцентрирован в единственной мидлваре
        updateSubscriptionOnItems: (oldItems: RecordSet | null, newItems: RecordSet | null) => void;
    };
    sliceProperties: {
        // TODO: В снапшот на смену режима отображения выбранных записей.
        previousViewMode?: string | null;
        // TODO: Удалить когда весь код работы с источником будет в единственной мидлваре.
        sourceController?: SourceController;
        newItems: RecordSet | null;
        newItemsDirection?: Direction;
        loadConfig: { sourceConfig?: IBaseSourceConfig; keepNavigation?: boolean } | null;
    };
};
