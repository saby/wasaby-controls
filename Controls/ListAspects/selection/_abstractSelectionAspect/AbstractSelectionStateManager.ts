import type { Collection as ICollection } from 'Controls/display';
import {
    AbstractAspectStateManager,
    IListChange,
    TAbstractAspectStateManagerProps,
} from 'Controls/abstractListAspect';
import { IAbstractSelectionState } from './IAbstractSelectionState';
import { ISelectionChange, SelectionChangeName } from './TSelectionChanges';
import { getSelectionModelsDifference } from './Utils';
import { ISelectionStrategy } from './ISelectionStrategy';
import { isEqual } from 'Types/object';
import { CrudEntityKey } from 'Types/source';

export type TAbstractSelectionStateManagerProps<T extends IAbstractSelectionState> =
    TAbstractAspectStateManagerProps & {
        strategy: ISelectionStrategy<T>;
    };

export abstract class AbstractSelectionStateManager<
    T extends IAbstractSelectionState
> extends AbstractAspectStateManager<T> {
    private _strategy: ISelectionStrategy<T>;

    protected constructor({ strategy, ...props }: TAbstractSelectionStateManagerProps<T>) {
        super(props);
        this._strategy = strategy;
    }
    resolveChanges(prevState: T, nextState: T): IListChange[] {
        const changes: IListChange[] = [];
        const isKeysChanged =
            ('selectedKeys' in nextState &&
                !isEqual(prevState.selectedKeys, nextState.selectedKeys)) ||
            ('excludedKeys' in nextState &&
                !isEqual(prevState.excludedKeys, nextState.excludedKeys));

        // TODO: Расписать комментарий зачем это.
        //  Пока слой источника в слайсе, в эту ветску мы не попадем,
        //  пересчитываемся мы сейчас от стейта источника, а не стейта списка
        const shouldWorkByMapChanges =
            !isKeysChanged &&
            'selectionModel' in nextState &&
            !isEqual(
                [...prevState.selectionModel.entries()],
                [...nextState.selectionModel.entries()]
            );

        if (isKeysChanged || shouldWorkByMapChanges) {
            // Когда-то мы будем работать от карты, но пока пересобираем ее по стейту источника данных.
            const selectionModelsDifference = shouldWorkByMapChanges
                ? getSelectionModelsDifference(prevState.selectionModel, nextState.selectionModel)
                : getSelectionModelsDifference(
                      this._strategy.getSelectionModel(prevState),
                      this._strategy.getSelectionModel(nextState)
                  );

            const change: ISelectionChange = {
                name: SelectionChangeName,
                args: {
                    selectionModel: selectionModelsDifference,
                    selectionObject: {
                        selected: nextState.selectedKeys || [],
                        excluded: nextState.excludedKeys || [],
                    },
                },
            };
            changes.push(change);
        }
        return changes;
    }

    getNextState(state: T, changes: IListChange[]): T {
        const nextState = this._copySelectionState(state);

        for (const change of changes) {
            switch (change.name) {
                case SelectionChangeName: {
                    nextState.selectedKeys = change.args.selectionObject.selected || [];
                    nextState.excludedKeys = change.args.selectionObject.excluded || [];
                    change.args.selectionModel.forEach((value, key) => {
                        nextState.selectionModel.set(key, value);
                    });
                }
            }
        }
        return nextState;
    }

    applyChangesToCollection<TCollection extends ICollection>(
        collection: TCollection,
        changes: IListChange[]
    ): void {
        for (const change of changes) {
            switch (change.name) {
                case SelectionChangeName: {
                    const { selectionModel } = change.args;
                    selectionModel.forEach((value, key) => {
                        const item = collection.getItemBySourceKey(key);
                        if (item) {
                            item.setSelected(value);
                        }
                    });

                    break;
                }
            }
        }
    }

    toggleItemSelection(state: T, key: CrudEntityKey): T {
        let nextState = this._copySelectionState(state);

        const status = nextState.selectionModel.get(key);

        if (status || status === null) {
            // if (this._limit) {
            //     // Если сняли выбор с элемента из пачки, то нужно уменьшить размер пачки
            //     if (!this._separatedSelectedItems.includes(key)) {
            //         this._limit--;
            //     }
            // }
            nextState = {
                ...nextState,
                ...this._strategy.unselect(nextState, key /*, this._searchMode*/),
            };
        } else {
            // if (this._limit) {
            //     this._separatedSelectedItems.push(key);
            // }
            nextState = {
                ...nextState,
                ...this._strategy.select(nextState, key /*, this._searchMode*/),
            };
        }

        return nextState;
    }

    protected abstract _copySelectionState(state: T): T;
}
