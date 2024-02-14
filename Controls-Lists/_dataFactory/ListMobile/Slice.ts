import type { CrudEntityKey } from 'Types/source';
import type {
    IListState,
    IListChange,
    IListLoadResult,
    TCollectionType,
} from 'Controls/dataFactory';
import type { Direction, TKey } from 'Controls/interface';
import type { RecordSet } from 'Types/collection';
import type { Model } from 'Types/entity';
import type {
    IListMobileAction,
    IListMobileMiddlewareWithContext,
} from './_interface/IListMobileTypes';
import type { IListMobileDataFactoryArguments } from './_interface/IListMobileDataFactoryArguments';
import type { IListMobileMiddlewareContext } from './_interface/IListMobileTypes';
import type { IListMobileSourceControllerParams } from './_interface/IListMobileSourceControllerParams';

import { ListSlice } from 'Controls/dataFactory';
import { createAspects } from './_aspects/factory';
import { eventChannelMiddleware } from './_middlewares/eventChannelMiddleware';
import { invokerMiddleware } from './_middlewares/invokerMiddleware';
import { loggerMiddleware } from './_middlewares/loggerMiddleware';
import { receiverMiddleware } from './_middlewares/receiverMiddleware';
import { stateChangesMiddleware } from './_middlewares/stateChangesMiddleware';
import * as actions from './_actions';
import { ListMobileSource } from './_source/ListMobileSource';
import { ListMobileSourceController } from './_sourceController/ListMobileSourceController';

export default class ListMobileSlice extends ListSlice<IListState> {
    private _connectionCount: number = 0;
    private _middlewares: IListMobileMiddlewareWithContext[];

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    private _sourceController: ListMobileSourceController;

    protected _initState(
        loadResult: IListLoadResult,
        initConfig: IListMobileDataFactoryArguments
    ): IListState {
        const source = new ListMobileSource({
            collectionEndpoint: initConfig.collectionEndpoint,
            observerEndpoint: initConfig.observerEndpoint,
            keyProperty: initConfig.keyProperty,
        });
        initConfig.source = source;
        if (initConfig.pagination.direction === undefined) {
            initConfig.pagination.direction = 'down';
        }
        const state = super._initState(loadResult, initConfig);

        const sourceController = new ListMobileSourceController({
            filter: initConfig.filter,
            root: initConfig.root,
            pagination: initConfig.pagination,
            viewportSize: initConfig.viewportSize,
            source,
        });

        this._sourceController = sourceController;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        state.sourceController = sourceController;

        this._middlewares = this._createMiddlewares().map((middleware) =>
            middleware(this._createMiddlewareContext(initConfig))
        );

        return state;
    }

    protected _beforeApplyState(nextState: IListState): Promise<IListState> | IListState {
        const changes = this._resolveChanges(this.state, nextState);

        this._dispatch(actions.registerStateChanges(changes));

        return this.state;
    }

    protected _initAspects(collectionType: TCollectionType, state: IListState): void {
        this._aspectStateManagers = createAspects(collectionType, state);
    }

    // Метод, для синхронного применения изменений к state и collection
    private _applyChanges(changes: IListChange[]): void {
        this._applyChangesToCollection(changes);
        const nextState = this._getNextState(this.state, changes);
        this._applyState(nextState);
    }

    // Метод, создающий контекст для middleware
    protected _createMiddlewareContext(
        initConfig: IListMobileDataFactoryArguments
    ): IListMobileMiddlewareContext {
        const dispatch = this._dispatch.bind(this);
        const applyChanges = this._applyChanges.bind(this);

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;

        return {
            get collection() {
                return self._collection;
            },
            get state() {
                return self.state;
            },
            get initConfig() {
                return initConfig;
            },
            get applyChanges() {
                return applyChanges;
            },
            get dispatch() {
                return dispatch;
            },
            get sourceController() {
                return self._sourceController;
            },
        };
    }

    // Метод, создающий middlewares для action
    protected _createMiddlewares() {
        return [
            eventChannelMiddleware,
            invokerMiddleware,
            receiverMiddleware,
            stateChangesMiddleware,
            loggerMiddleware,
        ];
    }

    // Метод, для публикации action через цепочку middlewares
    protected _dispatch(action: IListMobileAction): void {
        let listActions: IListMobileAction[] = [action];
        let nextActions: IListMobileAction[] = [];

        const next = (nextAction: IListMobileAction) => {
            nextActions.push(nextAction);
        };

        for (const middleware of this._middlewares) {
            for (const currentAction of listActions) {
                middleware(next)(currentAction);
            }
            listActions = nextActions;
            nextActions = [];
        }
    }

    destroy() {
        delete this._middlewares;
        super.destroy();
    }

    //# region API Публичного контроллера
    connect(): void {
        if (this._connectionCount === 0) {
            this._connectionCount++;
        } else {
            return;
        }
        this._dispatch(actions.connect());
    }

    disconnect(): void {
        this._connectionCount = Math.max(this._connectionCount - 1, 0);
        if (this._connectionCount === 0) {
            this._dispatch(actions.disconnect());
        }
    }

    mark(key: CrudEntityKey): void {
        this._dispatch(actions.mark(key));
    }

    select(key: CrudEntityKey): void {
        this._dispatch(actions.select(key));
    }

    changeRoot(key: CrudEntityKey | null): void {
        this._dispatch(actions.changeRoot(key ?? null));
    }

    async reloadItem(itemKey: TKey): Promise<Model> {
        this._sourceController.updateOptions({});
        await this._sourceController.refresh();
        const itemIndex = this.state.items.getIndexByValue(this.state.keyProperty, itemKey);
        return this.state.items.at(itemIndex);
    }

    async reloadItems(): Promise<RecordSet> {
        this._sourceController.updateOptions({});
        await this._sourceController.refresh();
        return this.state.items;
    }

    async load(
        direction?: Direction,
        root?: TKey,
        filter?: IListMobileSourceControllerParams['filter']
    ): Promise<RecordSet> {
        await this._sourceController.load(direction, root, filter);
        return this.state.items;
    }

    async search(searchValue: string): Promise<void> {
        this._sourceController.updateOptions({
            filter: { search: searchValue },
        });
        await this._sourceController.refresh();
    }

    async resetSearchQuery(): Promise<void> {
        super.resetSearchQuery();
        this._sourceController.updateOptions({
            filter: { search: '' },
        });
        await this._sourceController.refresh();
    }
    //# endregion API Публичного контроллера
}
