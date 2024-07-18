import type { Collection as ICollection } from 'Controls/display';
import type { CrudEntityKey } from 'Types/source';
import type { IListChange } from 'Controls/abstractListAspect';
import type { IAbstractListSliceState } from './_interface/IAbstractListSliceState';
import type { TCollectionType } from './_interface/IAbstractListSliceTypes';
import type { IListAspects } from './_interface/IAspectTypes';

import { Slice } from 'Controls-DataEnv/slice';
import { createCollection } from './collections/factory';
import { createAspects } from './aspectsFactory';
import { IListLoadResult } from 'Controls/_dataFactory/List/_interface/IListLoadResult';
import { IListDataFactoryArguments } from 'Controls/_dataFactory/List/_interface/IListDataFactoryArguments';
import { ControllerClass as OperationsController } from 'Controls/operations';
import { SyntheticEvent } from 'UICommon/Events';
import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';
import type { AbstractAspectStateManager } from 'Controls/abstractListAspect';

export { IAbstractListSliceState };

/**
 * @remark
 * Полезные ссылки:
 * * Подробнее про слайс для работы со списочными компонентами читайте в {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/ статье}
 * @class Controls/_dataFactory/AbstractList/AbstractListSlice
 * @extends Controls-DataEnv/slice:Slice
 * @see Controls-ListEnv
 * @public
 */
export abstract class AbstractListSlice<
    TState extends IAbstractListSliceState
> extends Slice<TState> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected _aspectStateManagers: IListAspects;
    private _collectionType: TCollectionType;

    protected _collection: ICollection;

    //# region API Публичного контроллера

    get collection() {
        return this._collection;
    }

    openOperationsPanel(): void {
        this.setState({
            operationsPanelVisible: true,
        });
        this.state.operationsController?.openOperationsPanel();
    }

    closeOperationsPanel(): void {
        this.setState({
            operationsPanelVisible: false,
        });
        this.state.operationsController?.closeOperationsPanel();
    }

    destroy() {
        this._unsubscribeFromControllersChanged(this.state);
        this._destroyOperationsController();
        if (this._collection) {
            // Дестроим только если сами создали коллекцию. Если ее нам проставил список, то ее трогать нельзя.
            if (this._collectionType) {
                this._collection.destroy();
            }
            // The operand of a 'delete' operator must be optional.
            // We don't expect that collection can be optional.
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            delete this._collection;
        }
        super.destroy();
    }

    // Метод переопределяется в Web слайсе, чтобы удалять контроллер, только если он создан слайсом.
    protected _destroyOperationsController() {
        if (this.state.operationsController) {
            this.state.operationsController.destroy();
        }
    }

    //# region API работы с аспектами

    abstract select(key: CrudEntityKey): void;

    abstract mark(key: CrudEntityKey): void;

    abstract changeRoot(key: CrudEntityKey): void;

    abstract expand(key: CrudEntityKey): void;

    abstract collapse(ket: CrudEntityKey): void;

    abstract next(): void;

    abstract prev(): void;

    protected selectAll(): void {}

    protected resetSelection(): void {}

    protected invertSelection(): void {}

    // TODO ISliceOnCollectionScheme: Как отследить клик по крошке, надо ли это, где.
    //  Передавать массив?

    //# endregion API работы с аспектами

    //# endregion API Публичного контроллера

    //# region Рельсы работы с аспектами

    // Запустить подписки на внешние ресурсы
    connect(): void {}

    // Остановить подписки на внешние ресурсы
    disconnect(): void {}

    // Метод, вычисляющий список изменений между старым и новым стейтом
    protected _resolveChanges(prevState: TState, nextState: TState): IListChange[] {
        const changes: IListChange[] = [];
        for (const aspect of this._aspectStateManagers.values()) {
            changes.push(
                ...aspect.resolveChanges(
                    {
                        ...prevState,
                        collection: this._collection,
                    },
                    {
                        ...nextState,
                        collection: this._collection,
                    }
                )
            );
        }
        return changes;
    }

    //  Метод, вычисляющий новый стейт на основе старого стейта и списка изменений
    protected _getNextState(state: TState, changes: IListChange[]): TState {
        let nextStateAccumulator = {} as unknown as TState;
        for (const aspect of this._aspectStateManagers.values()) {
            const aspectPartialState = aspect.getNextState(
                {
                    ...state,
                    collection: this._collection,
                } as unknown as Partial<TState>,
                changes
            );
            nextStateAccumulator = {
                ...nextStateAccumulator,
                ...aspectPartialState,
            };
        }
        return nextStateAccumulator;
    }

    //  Метод, применяющий список изменений к коллекции
    protected _applyChangesToCollection(changes: IListChange[], nextState: TState): void {
        // Проверка на destroyed нужна пока:
        // 1) BaseControl сам создает и разрушает коллекцию в схеме с синтетическим слайсом;
        // 2) Не будет отвечено на вопрос как к одному слайсу присоединить больше одной вьюхи (а значит и вьюмодели).
        // https://online.sbis.ru/opendoc.html?guid=d82beb6c-0173-4b5b-b465-82bc76e2b8c5&client=3
        if (!this._aspectStateManagers.size || this._collection.destroyed) {
            return;
        }
        const wasRaising = this._collection.isEventRaising();
        if (wasRaising) {
            this._collection.setEventRaising(false, true);
        }
        changes.forEach((change) =>
            this._aspectStateManagers.forEach((aspect: AbstractAspectStateManager<any>) => {
                aspect.applyChangesToCollection(this._collection, [change], nextState);
            })
        );
        this._collection.nextVersion();
        if (wasRaising && !this._collection.isEventRaising()) {
            this._collection.setEventRaising(true, true);
        }
    }
    /*
     * void Next( Int64 pos );
     * void Prev( Int64 pos );
     * void Refresh();
     * Selection GetSelection();
     * */

    //# endregion Рельсы работы с аспектами

    protected _getInitialState(
        _loadResult: IListLoadResult,
        // FIXME: Вывести тип, пока его нет используется тип толстого интерактора
        {
            root = null,
            selectedKeys = [],
            excludedKeys = [],
            listActions,
            header,
            columns,
            operationsPanelVisible,
            operationsController: operationsControllerFromArgs,
        }: IListDataFactoryArguments
    ): Partial<TState> {
        const operationsController = this._getOperationsController({
            operationsController: operationsControllerFromArgs,
            root,
            selectedKeys,
            excludedKeys,
        });

        if (listActions) {
            listActions = Array.isArray(listActions) ? listActions : loadSync(listActions);
        }

        return {
            header,
            columns,
            operationsPanelVisible: !!operationsPanelVisible,

            operationsController,
            listActions,
        };
    }

    protected _initCollection(collectionType: TCollectionType | undefined, state: TState): void {
        if (typeof collectionType === 'string') {
            // Запоминаем, чтобы знать что она создана нами. Потом ее нужно задестроить.
            this._collectionType = collectionType;
            this._collection = createCollection(collectionType, state);
        }
    }

    protected _initAspects(collectionType: TCollectionType | undefined, state: TState): void {
        if (typeof collectionType === 'string') {
            this._aspectStateManagers = createAspects(collectionType, {
                ...state,
                // TODO: Уйдет в процессе проекта, когда стратегии станут стейтлесс.
                //  Коллекция должна лежать на слайсе, а не на стейте.
                collection: this._collection,
            });
        } else {
            this._aspectStateManagers = new Map();
        }
    }

    private _getOperationsController(
        props: Pick<TState, 'root' | 'selectedKeys' | 'excludedKeys' | 'operationsController'>
    ): OperationsController | undefined {
        if (!props.operationsController && isLoaded('Controls/operations')) {
            return new (AbstractListSlice.getOperationsModuleSync().ControllerClass)(props);
        }
        return props.operationsController;
    }

    protected _subscribeOnControllersChanges(
        controllers: Pick<TState, 'operationsController'>
    ): void {
        if (controllers.operationsController) {
            controllers.operationsController.subscribe(
                'operationsPanelVisibleChanged',
                this._operationsPanelExpandedChanged,
                this
            );
        }
    }

    protected _unsubscribeFromControllersChanged(
        controllers: Pick<TState, 'operationsController'>
    ): void {
        if (controllers.operationsController) {
            controllers.operationsController.unsubscribe(
                'operationsPanelVisibleChanged',
                this._operationsPanelExpandedChanged,
                this
            );
        }
    }

    private _operationsPanelExpandedChanged(_: SyntheticEvent, expanded: boolean): void {
        if (this.state.operationsPanelVisible !== expanded) {
            if (expanded) {
                this.openOperationsPanel();
            } else {
                this.closeOperationsPanel();
            }
        }
    }

    static getOperationsModuleSync(): typeof import('Controls/operations') {
        return loadSync<typeof import('Controls/operations')>('Controls/operations');
    }
}
