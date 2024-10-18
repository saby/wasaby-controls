/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import type { TAbstractListActions } from 'Controls-DataEnv/abstractList';
import type { IListSavedState } from 'Controls/dataSource';
import type { TAbstractComplexUpdateAction } from './TAbstractComplexUpdateAction';
import type { IBaseSourceConfig, Direction, INavigationSourceConfig } from 'Controls/interface';
import type { TFilter, TKey } from 'Controls-DataEnv/interface';
import type { RecordSet } from 'Types/collection';
import type { CrudEntityKey } from 'Types/source';
import type { IReloadItemOptions } from 'Controls/listCommands';
import type { IListState } from '../../interface/IListState';

// Экспорты для публичных типов.
export type TLoadPrevAction = TAbstractListActions.source.TLoadPrevAction;
export type TLoadNextAction = TAbstractListActions.source.TLoadNextAction;
// Экспорты для публичных типов.

export type TSetSavedSourceStateAction = TAbstractAction<
    'setSavedSourceState',
    {
        id: string;
        state: IListSavedState;
    }
>;

export type TUpdateSavedSourceStateAction = TAbstractAction<'updateSavedSourceState', {}>;

export type TReloadAction = TAbstractAction<
    'reload',
    {
        sourceConfig?: INavigationSourceConfig;
        keepNavigation?: boolean;
        onResolve?: Function;
        onReject?: Function;
    }
>;

export type TNewItemsReceivedAction = TAbstractAction<
    'newItemsReceived',
    {
        nextState?: IListState;
        currentState?: IListState;
        items: RecordSet;
        additionalPromise?: Promise<unknown>;
        itemsDirection?: Direction;
        loadConfig?: { sourceConfig?: IBaseSourceConfig; keepNavigation?: boolean } | null;

        onResolve?: Function;
        onReject?: Function;
    }
>;

export type TComplexUpdateSourceAction = TAbstractComplexUpdateAction<'Source'>;

export type TLoadAction = TAbstractAction<
    'load',
    {
        sourceConfig?: IBaseSourceConfig;
    }
>;

export type TOldSliceLoadAction = TAbstractAction<
    'oldSliceLoad',
    {
        state?: IListState;
        direction?: Direction;
        key?: TKey;
        filter?: TFilter;
        addItemsAfterLoad?: boolean;
        navigationSourceConfig?: IBaseSourceConfig;
        disableSetState?: boolean;

        awaitLoad?: boolean;
        onResolve?: Function;
        onReject?: Function;
    }
>;

export type TDataLoadedSuccessAction = TAbstractAction<
    'dataLoadedSuccess',
    {
        items: RecordSet;
        direction?: Direction;
        key?: TKey;
        nextState: IListState;
        additionalPromise?: Promise<unknown>;
        currentState: IListState;

        onResolve?: Function;
        onReject?: Function;
    }
>;

export type TFetchAction = TAbstractAction<'fetch', {}>;

export type TRequestFetchAction = TAbstractAction<'requestFetch', {}>;

export type TInitSourceAction = TAbstractAction<'initSource', {}>;

export type TAwaitAllRequests = TAbstractAction<'awaitAllRequests', {}>;

export type TLoadOnSourceControllerAction = TAbstractAction<
    'loadOnSourceController',
    {
        state?: IListState;
        direction?: Direction;
        key?: TKey;
        filter?: TFilter;
        addItemsAfterLoad?: boolean;
        navigationSourceConfig?: IBaseSourceConfig;
        keepNavigation?: boolean;
        useServicePool?: boolean;

        awaitLoad?: boolean;
        onResolve?: Function;
        onReject?: Function;
    }
>;

export type TReloadOnSourceControllerAction = TAbstractAction<
    'reloadOnSourceController',
    {
        sourceController: Exclude<IListState['sourceController'], undefined>;
        sourceConfig?: IBaseSourceConfig;
        isFirstLoad?: boolean;
        addItemsAfterLoad?: boolean;
        keepNavigation?: boolean;

        onResolve?: Function;
        onReject?: Function;
    }
>;

export type TLoadNodesAction = TAbstractAction<
    'loadNodes',
    {
        keys: TKey[];
        currentState: IListState;
        nextState: IListState;

        awaitLoad?: boolean;
        onResolve?: Function;
        onReject?: Function;
    }
>;

export type TLoadToDirectionOldAction = TAbstractAction<
    'loadToDirectionOld',
    {
        direction: Direction;
        addItemsAfterLoad?: boolean;
        useServicePool?: boolean;

        retryAction?: () => void;

        onResolve?: Function;
        onReject?: Function;
    }
>;

export type TLoadToDirectionNewAction = TAbstractAction<
    'loadToDirectionNew',
    {
        direction: Direction;

        onResolve?: Function;
        onReject?: Function;
    }
>;

export type TSetPreloadedItemsAction = TAbstractAction<
    'setPreloadedItems',
    {
        direction?: Direction;
        items: RecordSet;
        onResolve?: Function;
        onReject?: Function;
    }
>;

export type TResolveStateAfterUpdateItemsAction = TAbstractAction<
    'resolveStateAfterUpdateItems',
    {
        currentState: IListState;
        nextState?: IListState;

        resultRef: {
            current: object;
        };
    }
>;

export type TReloadItemAction = TAbstractAction<
    'reloadItem',
    {
        key: CrudEntityKey;
        options?: IReloadItemOptions;
        onResolve?: Function;
        onReject?: Function;
    }
>;

export type TReloadItemsAction = TAbstractAction<
    'reloadItems',
    {
        keys: CrudEntityKey[];
        onResolve?: Function;
        onReject?: Function;
    }
>;

/*
 * ДОКАЗАНО.
 * 1) Экшен при успешной дозагрузке, нотифицирующий прикладника.
 * Сейчас это dataLoadedSuccess, было - dataLoadedInner.
 * 2) Приватный экшен вызова загрузки на sourceController.
 * Сейчас это loadOnSourceController.
 * Все обращения к контроллеру должны быть единичными, т.е. вызываться из уничерсального экшена.
 * */
export type TAnySourceAction =
    | TAbstractListActions.source.TAnySourceAction
    | TSetSavedSourceStateAction
    | TUpdateSavedSourceStateAction
    | TReloadAction
    | TComplexUpdateSourceAction
    | TFetchAction
    | TNewItemsReceivedAction
    | TLoadOnSourceControllerAction
    | TReloadItemAction
    | TReloadItemsAction
    | TReloadOnSourceControllerAction
    | TResolveStateAfterUpdateItemsAction
    | TLoadNodesAction
    | TLoadAction
    | TLoadToDirectionOldAction
    | TLoadToDirectionNewAction
    | TDataLoadedSuccessAction
    | TSetPreloadedItemsAction
    | TOldSliceLoadAction
    | TRequestFetchAction
    | TAwaitAllRequests
    | TInitSourceAction;
