/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { Collection as ICollection } from 'Controls/display';
import type { IAbstractListSliceState } from './_interface/IAbstractListSliceState';

import { TAbstractAction, TAbstractMiddlewareContext } from 'Controls-DataEnv/dispatcher';
import {
    AbstractListSlice as DataAbstractListSlice,
    TAbstractListActions,
    IAbstractListState,
} from 'Controls-DataEnv/abstractList';
import { getFilterModuleSync } from './utils/getFilterModuleSync';
import type { IFilterItem } from 'Controls/filter';
import { EventRaisingMixin } from 'Types/entity';
import { INavigationChanges } from 'Controls/_dataSource/NavigationController';
import { calculateFilterByFilterDescription } from './utils/calculateFilterByFilterDescription';

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
    TAction extends TAbstractListActions.TAnyAbstractAction<TState> | TAbstractAction,
    TMiddlewareContext extends TAbstractMiddlewareContext<TState, TAction>,
> extends DataAbstractListSlice<TState, TAction, TMiddlewareContext> {
    // TODO: Перенести в чистый Abstract
    //# region Чистый Abstract

    get collection() {
        return this._collection;
    }
    protected _collection: ICollection;
    protected _isPendingSetCollection = true;

    protected _onAfterInitState(state: TState) {
        super._onAfterInitState(state);

        if (state.collection) {
            this._collection = state.collection;
        } else {
            this._isPendingSetCollection = true;
        }
    }

    protected _onSnapshot(nextState: TState): TState {
        if (this._collection !== nextState.collection) {
            if (this._collection !== nextState.collection && this._isPendingSetCollection) {
                nextState.collection = this._collection;
            } else {
                this._collection = nextState.collection;
            }
        }
        // TODO: Проверка будет удалена по проекту (старый список без CollectionType).
        if (!this._collection) {
            return nextState;
        } else {
            this._applyChangesToCollection(nextState);
            this._applyChangesToSourceController(nextState.navigationChanges);
            return {
                // Новые изменения старой логики слайса
                ...nextState,
                // Не костыль, специчный код, вызванный мутабельностью RecordSet, SourceController.
                itemsChanges: undefined,
                navigationChanges: undefined,
            };
        }
    }

    protected _applyChangesToSourceController(navigationChanges?: INavigationChanges): void {}
    //# endregion Чистый Abstract

    //# region API Публичного контроллера

    applyFilterDescription(
        filterDescription: IFilterItem[],
        newState?: Partial<TState>,
        appliedFrom?: string
    ): IFilterItem[] | void {
        const nextState = calculateFilterByFilterDescription(
            this.state,
            filterDescription,
            newState,
            appliedFrom
        );
        if (nextState?.filterDescription) {
            this._updateStateWithFilter(nextState);
        }
        return nextState?.filterDescription;
    }

    resetFilterDescription(): void {
        const { resetFilterDescription } = getFilterModuleSync().FilterDescription;
        const newFilterDescription = resetFilterDescription(this.state.filterDescription, true);
        this.applyFilterDescription(newFilterDescription);
    }

    //# endregion API Публичного контроллера

    // TODO: УДАЛИТЬ В НОЯБРЕ
    //# region Рельсы работы с аспектами

    // Поднимается в true во всех списках с BaseControl.
    // В них на модель и в RecordSet записи добавляет сам BaseControl.
    protected _skipSetCollection: boolean = false;
    protected _muteRS: boolean = false;

    //  Метод, применяющий список изменений к коллекции
    protected _applyChangesToCollection(nextState: TState): void {
        // Проверка на destroyed нужна пока:
        // 1) BaseControl сам создает и разрушает коллекцию в схеме с синтетическим слайсом;
        // 2) Не будет отвечено на вопрос как к одному слайсу присоединить больше одной вьюхи (а значит и вьюмодели).
        // https://online.sbis.ru/opendoc.html?guid=d82beb6c-0173-4b5b-b465-82bc76e2b8c5&client=3
        if (this._collection.destroyed) {
            return;
        }

        // Глушим события, если они уже не заглушены.
        const collectionMute = eventRaisingMuteWrapper(this._collection).mute();
        // Изначально, нужно было глушить и рекордсет, но этого не сделали.
        // Теперь включать опасно, дела только для мобильного слайса.
        const rsMute = this._muteRS
            ? eventRaisingMuteWrapper(this._collection.getSourceCollection()).mute()
            : null;

        if ('items' in nextState && nextState.items) {
            const prevMetaData = this.state.items?.getMetaData?.();
            const nextMetaData = nextState.items.getMetaData();
            if (prevMetaData?.path !== nextMetaData?.path) {
                const recordSet = this._collection.getSourceCollection();
                recordSet.setMetaData({
                    ...recordSet.getMetaData(),
                    path: nextState.breadCrumbsItems,
                });
            }
        }

        const collectionOptions = [
            'itemActionsMap',
            'selectionModel',
            'root',
            'collapsedItems',
            'expandedItems',
            'markedKey',
            'expansionModel',
        ];
        this._collection.updateInteractorStateProps(
            collectionOptions.reduce((acc, fieldName) => {
                if (this.state[fieldName] !== nextState[fieldName]) {
                    acc[fieldName] = nextState[fieldName];
                }
                return acc;
            }, {})
        );

        // items middleware
        if (this._collectionType) {
            if (this.state.items !== nextState.items && !this._skipSetCollection) {
                this._collection.setCollection(nextState.items);
            }

            if (this.state.keyProperty !== nextState.keyProperty) {
                this._collection.setKeyProperty(nextState.keyProperty);
            }

            if (this.state.metaData !== nextState.metaData) {
                this._collection.setMetaData(nextState.metaData);
            }
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
}
