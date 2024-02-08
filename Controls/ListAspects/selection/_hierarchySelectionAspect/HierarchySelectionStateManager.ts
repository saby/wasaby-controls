import {
    TAbstractSelectionStateManagerProps,
    AbstractSelectionStateManager,
} from 'Controls/abstractSelectionAspect';
import { IHierarchySelectionState, copyHierarchySelectionState } from './IHierarchySelectionState';
import { HierarchySelectionStrategy } from './HierarchySelectionStrategy';

type TFlatSelectionStateManagerProps = Omit<
    TAbstractSelectionStateManagerProps<IHierarchySelectionState>,
    'strategy'
>;

export class HierarchySelectionStateManager extends AbstractSelectionStateManager<IHierarchySelectionState> {
    constructor(props: TFlatSelectionStateManagerProps) {
        super({
            ...props,
            strategy: new HierarchySelectionStrategy(),
        });
    }
    protected _copySelectionState(state: IHierarchySelectionState): IHierarchySelectionState {
        return copyHierarchySelectionState(state);
    }
}

export function hierarchySelectionStateManagerFactory(): HierarchySelectionStateManager {
    return new HierarchySelectionStateManager({});
}