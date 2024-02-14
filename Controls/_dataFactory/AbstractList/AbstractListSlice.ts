import type { Collection as ICollection } from 'Controls/display';
import type { CrudEntityKey } from 'Types/source';
import type { IAbstractListSliceState } from './_interface/IAbstractListSliceState';
import type { AbstractAspectStateManager } from './aspects/abstract/AbstractAspectStateManager';
import type { IListChange } from './_interface/IListChanges';
import type { TCollectionType } from './_interface/IAbstractListSliceTypes';

import { Slice } from 'Controls-DataEnv/slice';
import { createCollection } from './collections/factory';
import { createAspects } from './aspects/factory';

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
    protected _collection: ICollection;

    get collection() {
        return this._collection;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected _aspectStateManagers: Record<string, AbstractAspectStateManager<any, any>>;

    //# region API

    //# region API работы с аспектами

    // TODO ISliceOnCollectionScheme: Как отследить клик по крошке, надо ли это, где.
    //  Передавать массив?

    // Метод, вычисляющий список изменений между старым и новым стейтом
    protected _resolveChanges(prevState: TState, nextState: TState): IListChange[] {
        return Object.keys(this._aspectStateManagers).reduce((changes, aspectName) => {
            const aspect = this._aspectStateManagers[aspectName];
            changes.push(...aspect.resolveChanges(prevState, nextState));
            return changes;
        }, [] as IListChange[]);
    }

    //  Метод, вычисляющий новый стейт на основе старого стейта и списка изменений
    protected _getNextState(state: TState, changes: IListChange[]): TState {
        return Object.keys(this._aspectStateManagers).reduce(
            (nextStateAccumulator: TState, aspectName) => {
                return {
                    ...nextStateAccumulator,
                    ...(this._aspectStateManagers[aspectName].getNextState(
                        state,
                        changes
                    ) as unknown as Partial<TState>),
                };
            },
            {
                /* nextStateAccumulator */
            } as unknown as TState
        );
    }

    //  Метод, применяющий список изменений к коллекции
    protected _applyChangesToCollection(changes: IListChange[]): void {
        if (!Object.keys(this._aspectStateManagers).length) {
            return;
        }
        this._collection.setEventRaising(false, true);
        Object.keys(this._aspectStateManagers).forEach((aspectName) =>
            this._aspectStateManagers[aspectName].applyChangesToCollection(
                this._collection,
                changes
            )
        );
        this._collection.nextVersion();
        this._collection.setEventRaising(true, true);
    }

    //# endregion API работы с аспектами

    //# region API Публичного контроллера

    // Запустить подписки на внешние ресурсы
    connect(): void {}

    // Остановить подписки на внешние ресурсы
    disconnect(): void {}

    // Обработка клика по чекбоксу.
    abstract select(key: CrudEntityKey): void;

    // Обработка клика, комплексная операция, по которой нужно сделать много разных действий.
    abstract mark(key: CrudEntityKey): void;

    abstract changeRoot(key: CrudEntityKey): void;

    // Обработка клика по экспандеру
    abstract expand(key: CrudEntityKey): void;
    abstract collapse(ket: CrudEntityKey): void;

    protected selectAll(): void {}
    protected resetSelection(): void {}
    protected invertSelection(): void {}
    /*
    * void Next( Int64 pos );
    * void Prev( Int64 pos );
    * void Refresh();
    * Selection GetSelection();
    * */

    //# endregion API Публичного контроллера

    //# endregion API

    destroy() {
        super.destroy();
        if (this._collection) {
            this._collection.destroy();
            delete this._collection;
        }
    }

    protected _initCollection(collectionType: TCollectionType, state: TState): void {
        if (collectionType != null) {
            this._collection = createCollection(collectionType, state);
        }
    }

    protected _initAspects(collectionType: TCollectionType, state: TState): void {
        if (collectionType != null) {
            this._aspectStateManagers = createAspects(collectionType, {
                ...state,
                // TODO: Уйдет в процессе проекта, когда стратегии станут стейтлесс.
                //  Коллекция должна лежать на слайсе, а не на стейте.
                collection: this._collection,
            });
        } else {
            this._aspectStateManagers = {};
        }
    }
}
