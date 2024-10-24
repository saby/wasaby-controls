/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { AbstractDispatcher } from '../AbstractDispatcher/AbstractDispatcher';
import { TListMiddleware, TListMiddlewareCreator } from './types/TListMiddleware';
import { TGetStateStrategies, TListMiddlewareContextGetter } from './types/TListMiddlewareContext';
import { IListState } from '../interface/IListState';
import { TListAction } from './types/TListAction';
import { SnapshotsStore } from './SnapshotsStore';
import type { IListAspects } from '../AbstractList/_interface/IAspectTypes';
import type { Collection as ICollection } from 'Controls/display';

import { state } from './middlewares/state';
import { beforeApplyState } from './middlewares/beforeApplyState';
import { marker } from './middlewares/marker';
import { selection } from './middlewares/selection';
import { operationsPanel } from './middlewares/operationsPanel';
import { source } from './middlewares/source';
import { search } from './middlewares/search';
import { log } from './middlewares/log';
import { filter } from './middlewares/filter';
import { root } from './middlewares/root';

import { Logger } from 'UI/Utils';
import { RecordSet } from 'Types/collection';
import { TKey } from 'Controls-DataEnv/_interface/UtilityTypes';
import { Direction } from 'Controls/_interface/IQueryParams';

export type TChangeStateHooks = {
    setState: (state: IListState, applyStateStrategy: 'internal' | 'async' | 'immediate') => void;
    getState: () => IListState;
    onNodeDataLoaded?: (
        items: RecordSet,
        key: TKey,
        direction: Direction,
        nextState: IListState
    ) => Partial<IListState> | Promise<Partial<IListState>>;
    onDataLoaded?: (
        items: RecordSet,
        direction: Direction,
        nextState: IListState
    ) => Partial<IListState> | Promise<Partial<IListState>>;
};

export class ListWebDispatcher extends AbstractDispatcher<TListAction, TListMiddleware> {
    private _stateMiddlewareFactoryResult?: ReturnType<typeof state>;
    private _changeStateHooks: TChangeStateHooks;
    private _snapshotsStore: SnapshotsStore = new SnapshotsStore();
    private readonly _getAspects: () => IListAspects;
    private readonly _getCollection: () => ICollection;
    private readonly _getTrashBox: () => unknown;
    private readonly _scheduleDispatch: (action: TListAction) => void;

    constructor(
        changeStateHooks: TChangeStateHooks,
        getAspects: () => IListAspects,
        getCollection: () => ICollection,
        getTrashBox: () => unknown,
        scheduleDispatch: (action: TListAction) => void
    ) {
        super();
        this._changeStateHooks = changeStateHooks;
        this._getAspects = getAspects;
        this._getCollection = getCollection;
        this._getTrashBox = getTrashBox;
        this._scheduleDispatch = scheduleDispatch;
    }

    init() {
        const dispatch = this.dispatch.bind(this);
        this._stateMiddlewareFactoryResult = state({
            getState: () => this._changeStateHooks.getState(),
            setState: (...args) => this._changeStateHooks.setState(...args),
            // @ts-ignore
            dispatch,
        });
        super.init();
        this._middlewares.unshift(this._stateMiddlewareFactoryResult[0]);
        this._middlewares.unshift(
            log({
                ...this._getContextGetter()(),
                dispatch,
            })
        );
        this._stateMiddlewareFactoryResult = undefined;
    }

    protected _getContextGetter(): TListMiddlewareContextGetter {
        let getState: (getStateStrategy?: TGetStateStrategies) => IListState;

        if (this._stateMiddlewareFactoryResult) {
            // удалить, когда будет вынесен search в диспатчер
            // https://online.sbis.ru/opendoc.html?guid=a057d9c6-6ac1-4d7c-a02b-dc2f98a270df&client=3
            const getStateStrategies: Record<TGetStateStrategies, () => IListState> = {
                inner: this._stateMiddlewareFactoryResult[1],
                original: this._changeStateHooks.getState,
            };
            getState = (getStateStrategy: TGetStateStrategies = 'inner') =>
                getStateStrategies[getStateStrategy]();
        } else {
            Logger.error(
                'Внутренняя ошибка Controls/_dataFactory/ListWebDispatcher/ListWebDispatcher\n' +
                    'Не проинициализирована миддлвара управления состоянием.' +
                    'Корректная работа невозможна.'
            );
            getState = () => this._changeStateHooks.getState();
        }

        return (middlewareCreator) => ({
            getState,
            getAspects: this._getAspects,
            getCollection: this._getCollection,
            // @ts-ignore
            getTrashBox: this._getTrashBox,
            originalSliceSetState: (newState) => this._changeStateHooks.setState(newState, 'async'),
            snapshots: this._snapshotsStore,
            scheduleDispatch: this._scheduleDispatch.bind(this),

            ...(middlewareCreator === source
                ? {
                      onNodeDataLoaded: this._changeStateHooks.onNodeDataLoaded?.bind(this),
                      onDataLoaded: this._changeStateHooks.onDataLoaded?.bind(this),
                  }
                : {}),
        });
    }

    // @ts-ignore
    protected _getMiddlewaresCreators(): TListMiddlewareCreator[] {
        return [
            /* Динамически добавляется log и state middlewares */
            beforeApplyState,
            marker,
            selection,
            operationsPanel,
            source,
            search,
            filter,
            root,
        ];
    }
}