import type { ISelectionStrategy } from 'Controls/multiselection';
import type { TKey } from 'Controls/interface';
import type { ISelectionState } from './ISelectionState';
import type { Collection as ICollection } from 'Controls/display';
import type { IListChange } from '../../_interface/IListChanges';
import type { TCollectionType } from '../../_interface/IAbstractListSliceTypes';

import { IListChangeName } from '../../_interface/IListChanges';
import { AbstractAspectStateManager } from '../abstract/AbstractAspectStateManager';

import { isEqual } from 'Types/object';
import { loadSync } from 'WasabyLoader/ModulesLoader';

function copyState(state: ISelectionState): ISelectionState {
    return {
        selectionType: state.selectionType,
        selectedKeys: state.selectedKeys,
        excludedKeys: state.excludedKeys,
    };
}

export class SelectionStateManager extends AbstractAspectStateManager<ISelectionState> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected _strategy: ISelectionStrategy<any>;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor({ strategy }: { strategy?: ISelectionStrategy<any> } = {}) {
        super();
        this._strategy = strategy;
    }

    resolveChanges(prevState: ISelectionState, nextState: ISelectionState): IListChange[] {
        const changes: IListChange[] = [];
        // TODO логика должна быть сложнее. Учесть excludedKeys. Использовать _strategy
        if (
            'selectedKeys' in nextState &&
            !isEqual(prevState.selectedKeys, nextState.selectedKeys)
        ) {
            const change: IListChange = {
                name: IListChangeName.SET_SELECTED,
                args: {
                    selections: new Map(),
                },
            };
            changes.push(change);

            const selections = change.args.selections;

            for (const key of prevState.selectedKeys) {
                if (!nextState.selectedKeys.includes(key)) {
                    selections.set(key, false);
                }
            }
            for (const key of nextState.selectedKeys) {
                if (!prevState.selectedKeys.includes(key)) {
                    selections.set(key, true);
                }
            }
            // TODO. Использовать _strategy, чтобы вычислить selectedKeys, excludedKeys
            // for(const key of SelectionController.getSelectedKeys()) {
            //   selections.set(key, true);
            // }
            // for(const key of SelectionController.getExcludedKeys()) {
            //   selections.set(key, false);
            // }
            // for(const key of SelectionController.getNullSelectedKeys()) {
            //   selections.set(key, null);
            // }
        }
        return changes;
    }

    getNextState(state: ISelectionState, changes: IListChange[]): ISelectionState {
        const nextState = copyState(state);
        for (const change of changes) {
            switch (change.name) {
                case IListChangeName.SET_SELECTED: {
                    const nextSelectedKeys = [...nextState.selectedKeys];
                    change.args.selections.forEach((value, key) => {
                        switch (value) {
                            case true: {
                                if (!nextSelectedKeys.includes(key)) {
                                    nextSelectedKeys.push(key);
                                }
                                break;
                            }
                            case false: {
                                const index = nextSelectedKeys.indexOf(key);
                                if (index !== -1) {
                                    nextSelectedKeys.splice(index, 1);
                                }
                                break;
                            }
                            case null: {
                                // TODO. Нужно в state отметить квадратик
                                break;
                            }
                        }
                    });
                    nextState.selectedKeys = nextSelectedKeys;
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
                case IListChangeName.SET_SELECTED: {
                    const { selections } = change.args;
                    selections.forEach((value, key) => {
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

    toggleItemSelection(state: ISelectionState, key: TKey): ISelectionState {
        const nextState = copyState(state);

        if (nextState.selectedKeys == null) {
            nextState.selectedKeys = [];
        }
        nextState.selectedKeys = state.selectedKeys.includes(key)
            ? state.selectedKeys.filter((item) => item !== key)
            : [...state.selectedKeys, key];

        return nextState;
    }
}

export function selectionStateManagerFactory(
    collectionType: TCollectionType,
    state: ISelectionState & {
        // TODO: Уйдет в процессе проекта, когда стратегия станет стейтлесс.
        //  Коллекция должна лежать на слайсе, а не на стейте.
        collection: ICollection;
    }
): SelectionStateManager {
    const selectionLib =
        loadSync<typeof import('Controls/multiselection')>('Controls/multiselection');
    return new SelectionStateManager({
        strategy: new selectionLib.TreeSelectionStrategy({
            model: state.collection,
            selectAncestors: true,
            selectDescendants: true,
            rootKey: null,
            recursiveSelection: true,
            // TODO не хватает поля
            selectionType: state.selectionType,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...({} as any),
        }),
    });
}
