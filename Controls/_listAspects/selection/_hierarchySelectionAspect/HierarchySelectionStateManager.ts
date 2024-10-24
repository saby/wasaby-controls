import {
    AbstractSelectionStateManager,
    TAbstractSelectionStateManagerProps,
} from '../_abstractSelectionAspect/AbstractSelectionStateManager';

import type { IListChange } from '../../_abstractListAspect/common/ListChanges';
import {
    copyHierarchySelectionState,
    IHierarchySelectionState as TState,
} from './IHierarchySelectionState';
import { HierarchySelectionStrategy } from './HierarchySelectionStrategy';
import {
    ISelectionChange,
    SelectionObjectChangeName,
} from '../_abstractSelectionAspect/TSelectionChanges';

type TFlatSelectionStateManagerProps = Omit<
    TAbstractSelectionStateManagerProps<TState>,
    'strategy'
>;

export class HierarchySelectionStateManager extends AbstractSelectionStateManager<TState> {
    constructor(props: TFlatSelectionStateManagerProps) {
        super({
            ...props,
            strategy: new HierarchySelectionStrategy(),
        });
    }
    resolveChanges(prevState: TState, nextState: TState): IListChange[] {
        const changes = super.resolveChanges(prevState, nextState);

        const selectionChanges = changes.filter(
            (c) => c.name === SelectionObjectChangeName
        ) as ISelectionChange[];

        if (selectionChanges.length) {
            selectionChanges.forEach((c) => {
                c.args.selectionObject.recursive = nextState.recursiveSelection;
            });
        } else if (prevState.recursiveSelection !== nextState.recursiveSelection) {
            selectionChanges.push({
                name: SelectionObjectChangeName,
                args: {
                    selectionObject: {
                        selected: nextState.selectedKeys,
                        excluded: nextState.excludedKeys,
                        recursive: nextState.recursiveSelection,
                    },
                },
            });
            changes.push(...selectionChanges);
        }

        return changes;
    }

    getNextState(state: TState, changes: IListChange[]): TState {
        const nextState = super.getNextState(state, changes);

        for (const change of changes) {
            switch (change.name) {
                case SelectionObjectChangeName: {
                    nextState.recursiveSelection = change.args.selectionObject.recursive;
                }
            }
        }
        return nextState;
    }

    protected _copySelectionState(state: TState): TState {
        return copyHierarchySelectionState(state);
    }
}

export function hierarchySelectionStateManagerFactory(): HierarchySelectionStateManager {
    return new HierarchySelectionStateManager({});
}
