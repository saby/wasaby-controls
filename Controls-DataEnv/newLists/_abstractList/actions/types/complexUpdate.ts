import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import type { IAbstractListState } from '../../interface/IAbstractListState';
import type { TAbstractListActions } from '../../actions';
import type { RecordSet } from 'Types/collection';
import type { Direction, IBaseSourceConfig } from 'Controls/interface';
import type { NewSourceController as SourceController } from 'Controls/dataSource';

/**
 * Тип действия для установки нового состояния.
 */
export type TPublicSetStateAction<TState extends IAbstractListState> = TAbstractAction<
    'publicSetState',
    {
        nextState: Partial<TState> | ((prevState: TState) => Partial<TState>);
    }
>;

/**
 * Тип действия для первой фазы комплексного обновления состояния.
 */
export type TStartUpdateAction = TAbstractAction<
    'startUpdate',
    {
        actions: TAbstractListActions.TAnyAbstractListAction[];
    }
>;

/**
 * Тип действия, для комплексного обновления.
 * Аналог beforeApplyState в прошлой итерации списочного слайса.
 */
export type TBeforeApplyStateAction = TAbstractAction<
    'beforeApplyState',
    {
        nextState: IAbstractListState;
        _propsForMigration: TMiddlewaresPropsForMigrationToDispatcher;
    }
>;

/**
 * Тип действия для последней фазы комплексного обновления состояния.
 */
export type TEndUpdateAction = TAbstractAction<
    'endUpdate',
    {
        nextState: IAbstractListState;
        _propsForMigration: TMiddlewaresPropsForMigrationToDispatcher;
    }
>;

/**
 * Тип действий комплексного обновления состояния, доступные в любом списке,
 * независимо от типа ViewModel, к которой он подключен (web/mobile).
 */
export type TAnyComplexUpdateAction<TState extends IAbstractListState> =
    | TPublicSetStateAction<TState>
    | TStartUpdateAction
    | TBeforeApplyStateAction
    | TEndUpdateAction;

// FIXME: Всё ниже должно отсюда быть удалено.
// Типы для совместимости, которые будут разбираться по мидлварам до полного исчезновения.
/**
 * TMiddlewaresPropsForMigrationToDispatcher.
 */
export type TMiddlewaresPropsForMigrationToDispatcher = {
    sliceCallbacks: {
        setState: (state: Partial<IAbstractListState>) => void;
        applyState: (state: Partial<IAbstractListState>) => void;

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
