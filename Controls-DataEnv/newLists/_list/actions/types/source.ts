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
/**
 * Тип действия, для загрузки предыдущей пачки данных.
 */
export type TLoadPrevAction = TAbstractListActions.source.TLoadPrevAction;
/**
 * Тип действия, для загрузки следующей пачки данных.
 */
export type TLoadNextAction = TAbstractListActions.source.TLoadNextAction;
// Экспорты для публичных типов.

/**
 * Тип действия TSetSavedSourceStateAction.
 */
export type TSetSavedSourceStateAction = TAbstractAction<
    'setSavedSourceState',
    {
        id: string;
        state: IListSavedState;
    }
>;

/**
 * Тип действия TUpdateSavedSourceStateAction.
 */
export type TUpdateSavedSourceStateAction = TAbstractAction<'updateSavedSourceState', {}>;

/**
 * Тип действия TReloadAction.
 */
export type TReloadAction = TAbstractAction<
    'reload',
    {
        sourceConfig?: INavigationSourceConfig;
        keepNavigation?: boolean;
        onResolve?: Function;
        onReject?: Function;
    }
>;

/**
 * Тип действия TNewItemsReceivedAction.
 */
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

/**
 * Тип действия TComplexUpdateSourceAction.
 */
export type TComplexUpdateSourceAction = TAbstractComplexUpdateAction<'Source'>;

/**
 * Тип действия TLoadAction.
 */
export type TLoadAction = TAbstractAction<
    'load',
    {
        sourceConfig?: IBaseSourceConfig;
    }
>;

/**
 * Тип действия TOldSliceLoadAction.
 */
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

/**
 * Тип действия TDataLoadedSuccessAction.
 */
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

/**
 * Тип действия TFetchAction.
 */
export type TFetchAction = TAbstractAction<'fetch', {}>;

/**
 * Тип действия TRequestFetchAction.
 */
export type TRequestFetchAction = TAbstractAction<'requestFetch', {}>;

/**
 * Тип действия TInitSourceAction.
 */
export type TInitSourceAction = TAbstractAction<'initSource', {}>;

/**
 * Тип действия TAwaitAllRequests.
 */
export type TAwaitAllRequests = TAbstractAction<'awaitAllRequests', {}>;

/**
 * Тип действия TLoadOnSourceControllerAction.
 */
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

/**
 * Тип действия TReloadOnSourceControllerAction.
 */
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

/**
 * Тип действия TLoadNodesAction.
 */
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

/**
 * Тип действия TLoadToDirectionOldAction.
 */
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

/**
 * Тип действия TLoadToDirectionNewAction.
 */
export type TLoadToDirectionNewAction = TAbstractAction<
    'loadToDirectionNew',
    {
        direction: Direction;

        onResolve?: Function;
        onReject?: Function;
    }
>;

/**
 * Тип действия TSetPreloadedItemsAction.
 */
export type TSetPreloadedItemsAction = TAbstractAction<
    'setPreloadedItems',
    {
        direction?: Direction;
        items: RecordSet;
        onResolve?: Function;
        onReject?: Function;
    }
>;

/**
 * Тип действия TResolveStateAfterUpdateItemsAction.
 */
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

/**
 * Тип действия TReloadItemAction.
 */
export type TReloadItemAction = TAbstractAction<
    'reloadItem',
    {
        key: CrudEntityKey;
        options?: IReloadItemOptions;
        onResolve?: Function;
        onReject?: Function;
    }
>;

/**
 * Тип действия TReloadItemsAction.
 */
export type TReloadItemsAction = TAbstractAction<
    'reloadItems',
    {
        keys: CrudEntityKey[];
        onResolve?: Function;
        onReject?: Function;
    }
>;

/*
 * LOG разработки.
 * 1) Экшен при успешной дозагрузке, нотифицирующий прикладника.
 * Сейчас это dataLoadedSuccess, было - dataLoadedInner.
 * 2) Приватный экшен вызова загрузки на sourceController.
 * Сейчас это loadOnSourceController.
 * Все обращения к контроллеру должны быть единичными, т.е. вызываться из уничерсального экшена.
 * */
/**
 * Тип действий для работы с источником данных, доступные в WEB списке.
 */
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
