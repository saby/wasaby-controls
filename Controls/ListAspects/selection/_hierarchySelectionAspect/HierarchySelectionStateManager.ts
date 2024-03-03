import {
    TAbstractSelectionStateManagerProps,
    AbstractSelectionStateManager,
    SelectionChangeName,
    ISelectionChange,
} from 'Controls/abstractSelectionAspect';
import {
    IHierarchySelectionState as TState,
    copyHierarchySelectionState,
} from './IHierarchySelectionState';
import { HierarchySelectionStrategy } from './HierarchySelectionStrategy';
import { IListChange } from 'Controls/abstractListAspect';

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
            (c) => c.name === SelectionChangeName
        ) as ISelectionChange[];
        if (selectionChanges.length) {
            selectionChanges.forEach((c) => {
                c.args.selectionObject.recursive = nextState.recursiveSelection;
            });
        } else if (prevState.recursiveSelection !== nextState.recursiveSelection) {
            selectionChanges.push({
                name: SelectionChangeName,
                args: {
                    selectionModel: nextState.selectionModel,
                    selectionObject: {
                        selected: nextState.selectedKeys,
                        excluded: nextState.excludedKeys,
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
                case SelectionChangeName: {
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
