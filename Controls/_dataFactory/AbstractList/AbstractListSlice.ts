/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { Collection as ICollection } from 'Controls/display';
import type { AbstractAspectStateManager, IListChange } from 'Controls/listAspects';
import type {
    IAbstractListSliceState,
    IStateThatShouldGoIntoViewLayer,
} from './_interface/IAbstractListSliceState';
import type { TCollectionType } from './_interface/IAbstractListSliceTypes';
import type { IListAspects } from './_interface/IAspectTypes';

import { TAbstractAction, TAbstractMiddlewareContext } from 'Controls-DataEnv/dispatcher';
import {
    AbstractListSlice as DataAbstractListSlice,
    TAbstractListActions,
    IAbstractListState,
} from 'Controls-DataEnv/abstractList';
import { createAspects } from './aspectsFactory';
import { IListLoadResult } from 'Controls/_dataFactory/List/_interface/IListLoadResult';
import { IListDataFactoryArguments } from 'Controls/_dataFactory/List/_interface/IListDataFactoryArguments';
import { ControllerClass as OperationsController } from 'Controls/operations';
import { SyntheticEvent } from 'UICommon/Events';
import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';
import { TItemsOrder } from 'Controls/interface';
import { getFilterModuleSync } from './utils/getFilterModuleSync';
import type { IFilterItem } from 'Controls/filter';
import { logger as AppLogger } from 'Application/Env';
import { EventRaisingMixin } from 'Types/entity';
import { AspectsNames } from 'Controls/_dataFactory/AbstractList/_interface/AspectsNames';

export { IAbstractListSliceState };

interface IMuteWrapper {
    mute: () => IMuteWrapper;
    unmute: () => IMuteWrapper;
}
const eventRaisingMuteWrapper = (inst: EventRaisingMixin): IMuteWrapper => {
    let wasRaising: boolean;

    const self: IMuteWrapper = {
        mute: (): IMuteWrapper => {
            if (!inst || !inst.isEventRaising()) {
                return self;
            }

            wasRaising = true;
            inst.setEventRaising(false, true);
            return self;
        },
        unmute: () => {
            if (wasRaising && !inst.isEventRaising()) {
                inst.setEventRaising(true, true);
            }

            return self;
        },
    };
    return self;
};

export abstract class AbstractListSlice<
    TState extends IAbstractListState,
    TAction extends TAbstractListActions.TAnyAbstractAction | TAbstractAction,
    TMiddlewareContext extends TAbstractMiddlewareContext<TState, TAction>,
> extends DataAbstractListSlice<TState, TAction, TMiddlewareContext> {
    // TODO: Перенести в чистый Abstract
    //# region чистый Abstract

    get collection() {
        return this._collection;
    }
    protected _collection: ICollection;

    setItemsOrder(itemsOrder: TItemsOrder): void;

    protected _initState(
        loadResult: IListLoadResult,
        // FIXME: Вывести тип, пока его нет используется тип толстого интерактора
        config: IListDataFactoryArguments & IStateThatShouldGoIntoViewLayer
    ): TState {
        let { listActions, itemActions } = config;
        const {
            root = null,
            selectedKeys = [],
            excludedKeys = [],
            header,
            columns,
            operationsPanelVisible,
            operationsController: operationsControllerFromArgs,

            stickyHeader,
            rowSeparatorSize,
            rowSeparatorVisibility,
            emptyTemplate,
            emptyTemplateOptions,
            emptyView,
            emptyViewConfig,
            itemActionVisibilityCallback,
            headerVisibility,
        } = config;

        const operationsController = this._getOperationsController({
            operationsController: operationsControllerFromArgs,
            root,
            selectedKeys,
            excludedKeys,
        });

        // TODO эти две конфигурации нужно будет объединить
        if (listActions) {
            listActions = Array.isArray(listActions) ? listActions : loadSync(listActions);
        }
        if (itemActions) {
            itemActions = Array.isArray(itemActions) ? itemActions : loadSync(itemActions);
        }

        let filterDescription = this._getFilterDescription(loadResult, config);

        if (filterDescription) {
            filterDescription =
                getFilterModuleSync().FilterLoader.initFilterDescriptionFromData(filterDescription);
        }

        const itemsOrder = loadResult.itemsOrder || config.itemsOrder;

        return {
            ...super._initState(loadResult, config),
            filterDescription,

            selectedKeys,
            excludedKeys,
            header,
            columns,

            operationsPanelVisible: !!operationsPanelVisible,
            operationsController,

            listActions,
            itemActions,
            itemActionVisibilityCallback,

            highlightedFieldsMap: new Map(),

            stickyHeader,
            headerVisibility,
            rowSeparatorSize,
            rowSeparatorVisibility,
            emptyView,
            emptyTemplate,
            emptyTemplateOptions,
            emptyViewConfig,
            itemsOrder,
        };
    }

    protected _onAfterInitState(state: TState) {
        super._onAfterInitState(state);

        if (state.collection) {
            this._collection = state.collection;
        }
    }

    protected _beforeApplyState(nextState: TState): TState {
        this._updateControllersByNewState(nextState);
        return nextState;
    }

    protected async _beforeApplyStateNew(nextState: TState): Promise<TState> {
        return super._beforeApplyState(nextState);
    }

    destroy() {
        this._unsubscribeFromControllersChanged(this.state);
        this._destroyOperationsController();
        super.destroy();
    }
    //# endregion чистый Abstract

    //# region API Публичного контроллера

    applyFilterDescription(
        filterDescription: IFilterItem[],
        newState?: Partial<TState>,
        appliedFrom?: string
    ): IFilterItem[] | void {
        const { FilterCalculator, FilterDescription, FilterHistory } = getFilterModuleSync();

        let filterDescriptionWithCount = filterDescription;

        if (newState?.countFilterValue) {
            const isCurrentDateRangeChanged = FilterDescription.isDateRangeFilterChanged(
                this.state.filterDescription
            );
            const isNewDateRangeChanged =
                FilterDescription.isDateRangeFilterChanged(filterDescription);
            const countFilterValue =
                isCurrentDateRangeChanged !== isNewDateRangeChanged
                    ? null
                    : newState?.countFilterValue;
            filterDescriptionWithCount = FilterDescription.applyFilterCounter(
                countFilterValue,
                filterDescription,
                newState
            );
        }

        const descriptionWithAppliedFrom = FilterDescription.setAppliedFrom(
            this.state.filterDescription,
            filterDescriptionWithCount,
            appliedFrom
        );

        const newFilterDescription = FilterDescription.applyFilterDescription(
            this.state.filterDescription,
            descriptionWithAppliedFrom,
            this.state.filter
        );
        if (newFilterDescription) {
            const newFilter = FilterCalculator.getFilterByFilterDescription(
                this.state.filter,
                newFilterDescription
            );
            FilterDescription.applyFilterDescriptionToURL(
                newFilterDescription,
                this.state.saveToUrl
            );
            if (this.state.historyId) {
                FilterHistory.update(newFilterDescription, this.state.historyId);
            }
            this._updateStateWithFilter({
                filterDescription: newFilterDescription,
                filter: newFilter,
                ...newState,
            });
        }
        return newFilterDescription;
    }

    resetFilterDescription(): void {
        const { resetFilterDescription } = getFilterModuleSync().FilterDescription;
        const newFilterDescription = resetFilterDescription(this.state.filterDescription, true);
        this.applyFilterDescription(newFilterDescription);
    }

    //# endregion API Публичного контроллера

    // TODO: УДАЛИТЬ В НОЯБРЕ
    //# region Рельсы работы с аспектами

    protected _aspectStateManagers: IListAspects;
    protected _muteRS: boolean = false;

    protected _initAspects(
        collectionType: TCollectionType | undefined,
        state: TState,
        removedAspects?: AspectsNames[]
    ): void {
        if (typeof collectionType === 'string') {
            this._aspectStateManagers = createAspects(
                collectionType,
                {
                    ...state,
                    // TODO: Уйдет в процессе проекта, когда стратегии станут стейтлесс.
                    //  Коллекция должна лежать на слайсе, а не на стейте.
                    collection: this._collection,
                },
                removedAspects
            );
        } else {
            this._aspectStateManagers = new Map();
        }
    }

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

        // Глушим события, если они уже не заглушены.
        const collectionMute = eventRaisingMuteWrapper(this._collection).mute();
        // Изначально, нужно было глушить и рекордсет, но этого не сделали.
        // Теперь включать опасно, дела только для мобильного слайса.
        const rsMute = this._muteRS
            ? eventRaisingMuteWrapper(this._collection.getSourceCollection()).mute()
            : null;

        try {
            changes.forEach((change) =>
                this._aspectStateManagers.forEach((aspect: AbstractAspectStateManager<any>) => {
                    aspect.applyChangesToCollection(this._collection, [change], nextState);
                })
            );
            this._collection.nextVersion();
        } catch (e) {
            AppLogger.error(e);
        }

        // Проверка будет удалена после удаления всех аспектов из ListSlice и разведения логики
        // установки в коллекцию по своим слайсам
        if (
            !this._aspectStateManagers.has(AspectsNames.Marker) &&
            this.state.markedKey !== nextState.markedKey
        ) {
            this._collection.setMarkedKey(nextState.markedKey);
        }

        // Возвращаем способность отстрела событиями как была до нас.
        // Первым включаем RecordSet, т.к. сначала должен отстрелить он,
        // а не зависимая от него ViewModel.

        if (rsMute) {
            rsMute.unmute();
        }
        collectionMute.unmute();
    }

    //# endregion Рельсы работы с аспектами

    protected _updateStateWithFilter(nextState: Partial<TState>): void {
        this.setState(nextState);
    }

    // Метод переопределяется в Web слайсе, чтобы удалять контроллер, только если он создан слайсом.
    protected _destroyOperationsController() {
        if (this.state.operationsController) {
            this.state.operationsController.destroy();
        }
    }

    protected _updateControllersByNewState(nextState: TState): void {
        if (
            nextState.operationsController &&
            nextState.operationsPanelVisible !== this.state.operationsPanelVisible
        ) {
            if (nextState.operationsPanelVisible) {
                nextState.operationsController.openOperationsPanel();
            } else {
                nextState.operationsController.closeOperationsPanel();
                if (nextState.operationsController.getOperationsPanelVisible()) {
                    nextState.operationsController.setOperationsPanelVisible(false);
                }
            }
        }
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

    private _getFilterDescription(
        loadResult: Pick<IListLoadResult, 'filterDescription' | 'filterButtonSource'>,
        config: Pick<IListDataFactoryArguments, 'filterDescription' | 'filterButtonSource'>
    ): IFilterItem[] | undefined {
        return (
            loadResult.filterDescription ||
            loadResult.filterButtonSource ||
            config.filterButtonSource ||
            config.filterDescription
        );
    }

    private _getOperationsController(
        props: Pick<TState, 'root' | 'selectedKeys' | 'excludedKeys' | 'operationsController'>
    ): OperationsController | undefined {
        if (!props.operationsController && isLoaded('Controls/operations')) {
            return new (loadSync<typeof import('Controls/operations')>(
                'Controls/operations'
            ).ControllerClass)(props);
        }
        return props.operationsController;
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
}
