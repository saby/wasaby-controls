import { RecordSet } from 'Types/collection';
import { TKey } from 'Controls-DataEnv/interface';
import { Direction, IBaseSourceConfig, TFilter } from 'Controls/interface';
import {
    ISourceControllerOptions,
    NewSourceController as SourceController,
} from 'Controls/dataSource';
import { TLoadResult } from 'Controls/_dataFactory/List/Slice';
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
    dataCallbacks: {
        nodeDataLoaded: (
            items: RecordSet,
            key: TKey,
            direction: Direction,
            nextState: IListState
        ) => Partial<IListState> | Promise<Partial<IListState>>;
        dataLoaded: (
            items: RecordSet,
            direction: Direction,
            nextState: IListState
        ) => Partial<IListState> | Promise<Partial<IListState>>;
    };
    sliceCallbacks: {
        setState: (state: Partial<IListState>) => void;
        applyState: (state: Partial<IListState>) => void;
        isDestroyed: () => boolean;
        openOperationsPanel: () => void;
        updateSubscriptionOnItems: (oldItems: RecordSet | null, newItems: RecordSet | null) => void;
        unsubscribeFromSourceController: () => void;
        getSourceController: (props: ISourceControllerOptions) => SourceController;

        load: (
            state?: IListState,
            direction?: Direction,
            key?: TKey,
            filter?: TFilter,
            addItemsAfterLoad?: boolean,
            navigationSourceConfig?: IBaseSourceConfig,
            disableSetState?: boolean
        ) => Promise<TLoadResult>;
    };
    sliceProperties: {
        sourceController?: SourceController;
        aspectStateManagers: IListAspects;
        newItems: RecordSet | null;
        newItemsDirection?: Direction;
        previousViewMode?: string | null;
        loadConfig: { sourceConfig?: IBaseSourceConfig; keepNavigation?: boolean } | null;
    };
};
