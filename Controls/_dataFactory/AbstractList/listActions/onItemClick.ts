import { AbstractListSlice, IAbstractListSliceState } from '../AbstractListSlice';
import { CrudEntityKey } from 'Types/source';
import { RootUILogic } from 'Controls/rootListAspect';

export function onItemClick(
    slice: AbstractListSlice<IAbstractListSliceState>,
    key: CrudEntityKey,
    props: {
        changeRootByItemClick?: boolean;
    }
): void {
    if (props.changeRootByItemClick && RootUILogic.canBeRoot(slice.state, key)) {
        slice.changeRoot(key);
    } else {
        slice.mark(key);
    }
}
