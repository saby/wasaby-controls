/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { RecordSet } from 'Types/collection';
import { TKey } from 'Controls-DataEnv/interface';
import { Direction, IBaseSourceConfig } from 'Controls/interface';
import { NewSourceController as SourceController } from 'Controls/dataSource';
import { IListState } from 'Controls/_dataFactory/interface/IListState';
import { IListAspects } from 'Controls/_dataFactory/AbstractList/_interface/IAspectTypes';
import { TAbstractAction } from 'Controls/_dataFactory/AbstractDispatcher/types/TAbstractAction';
import { TListAction } from 'Controls/_dataFactory/ListWebDispatcher/types/TListAction';

export type TBeforeApplyStateAction = TAbstractAction<
    'beforeApplyState',
    {
        nextState: IListState;
        _propsForMigration: TMiddlewaresPropsForMigrationToDispatcher;
        actionsToDispatch?: Map<string, TListAction>;
    }
>;

export const beforeApplyState = (
    nextState: IListState,
    _propsForMigration: TMiddlewaresPropsForMigrationToDispatcher,
    actionsToDispatch?: Map<string, TListAction>
): TBeforeApplyStateAction => ({
    type: 'beforeApplyState',
    payload: {
        nextState,
        _propsForMigration,
        actionsToDispatch,
    },
});

export type TOldBeforeApplyStateAction = TAbstractAction<
    'oldBeforeApplyState',
    {
        prevState: IListState;
        nextState: IListState;
        _propsForMigration: TMiddlewaresPropsForMigrationToDispatcher;
    }
>;

export const oldBeforeApplyState = (
    prevState: IListState,
    nextState: IListState,
    _propsForMigration: TMiddlewaresPropsForMigrationToDispatcher
): TOldBeforeApplyStateAction => ({
    type: 'oldBeforeApplyState',
    payload: {
        prevState,
        nextState,
        _propsForMigration,
    },
});

export type TBeforeApplyStateActions = TBeforeApplyStateAction | TOldBeforeApplyStateAction;

// TODO: Всё ниже должно отсюда быть удалено.
// Типы для совместимости, которые будут разбираться по мидлварам до полного исчезновения.
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
