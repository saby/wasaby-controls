import {
    AbstractSelectionStateManager,
    TAbstractSelectionStateManagerProps,
} from 'Controls/abstractSelectionAspect';
import { copyFlatSelectionState, IFlatSelectionState } from './IFlatSelectionState';
import { FlatSelectionStrategy } from './FlatSelectionStrategy';

type TFlatSelectionStateManagerProps = Omit<
    TAbstractSelectionStateManagerProps<IFlatSelectionState>,
    'strategy'
>;

export class FlatSelectionStateManager extends AbstractSelectionStateManager<IFlatSelectionState> {
    constructor(props: TFlatSelectionStateManagerProps) {
        super({
            ...props,
            strategy: new FlatSelectionStrategy(),
        });
    }
    protected _copySelectionState(state: IFlatSelectionState): IFlatSelectionState {
        return copyFlatSelectionState(state);
    }
}

export function flatSelectionStateManagerFactory(): FlatSelectionStateManager {
    return new FlatSelectionStateManager({});
}
