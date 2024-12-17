import type { Collection as ICollection } from 'Controls/display';
import { IAbstractSelectionState } from './IAbstractSelectionState';
import {
    SelectedCountChangeName,
    SelectionMapChangeName,
    SelectionObjectChangeName,
} from './TSelectionChanges';
import { getModelsDifference } from '../../_abstractListAspect/common/Utils';
import { ISelectionStrategy } from './ISelectionStrategy';
import { isEqual } from 'Types/object';
import { CrudEntityKey } from 'Types/source';
import {
    AbstractAspectStateManager,
    TAbstractAspectStateManagerProps,
} from '../../_abstractListAspect/abstract/AbstractAspectStateManager';
import { IListChange } from '../../_abstractListAspect/common/ListChanges';
import { fixStateWithHierarchyItems } from '../../_abstractListAspect/common/IStateWithHierarchyItems';

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
                ? getModelsDifference(prevState.selectionModel, nextState.selectionModel)
                : getModelsDifference(
                      this._strategy.getSelectionModel(prevState),
                      this._strategy.getSelectionModel(nextState)
                  );

            if (
                !shouldWorkByMapChanges &&
                prevState.selectedKeys.length &&
                !nextState.selectedKeys.length
            ) {
                prevState.selectionModel.forEach((value, key) => {
                    if (value !== false) {
                        selectionModelsDifference.set(key, false);
                    }
                });
            }

            changes.push(
                {
                    name: SelectionObjectChangeName,
                    args: {
                        selectionObject: {
                            selected: nextState.selectedKeys || [],
                            excluded: nextState.excludedKeys || [],
                        },
                    },
                },
                {
                    name: SelectionMapChangeName,
                    args: {
                        selectionModel: selectionModelsDifference,
                    },
                }
            );
        }
        return changes;
    }

    getNextState(state: T, changes: IListChange[]): T {
        const nextState = this._copySelectionState(state);

        for (const change of changes) {
            switch (change.name) {
                case SelectionObjectChangeName: {
                    nextState.selectedKeys = change.args.selectionObject.selected || [];
                    nextState.excludedKeys = change.args.selectionObject.excluded || [];
                    break;
                }
                case SelectionMapChangeName: {
                    change.args.selectionModel.forEach((value, key) => {
                        nextState.selectionModel.set(key, value);
                    });
                    break;
                }
                case SelectedCountChangeName: {
                    nextState.count = change.args.count;
                    break;
                }
            }
        }
        return fixStateWithHierarchyItems(nextState) as T;
    }

    applyChangesToCollection<TCollection extends ICollection>(
        collection: TCollection,
        changes: IListChange[],
        nextState: T
    ): void {
        for (const change of changes) {
            switch (change.name) {
                case SelectionMapChangeName: {
                    collection.setSelectionModel(nextState.selectionModel);
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
