import { AbstractListSlice, IAbstractListSliceState } from '../AbstractListSlice';
import { CrudEntityKey } from 'Types/source';
import { loadSync } from 'WasabyLoader/ModulesLoader';

export function onItemClick(
    slice: AbstractListSlice<IAbstractListSliceState>,
    key: CrudEntityKey,
    props: {
        changeRootByItemClick?: boolean;
    }
): void {
    if (
        props.changeRootByItemClick &&
        loadSync<typeof import('Controls/rootListAspect')>(
            'Controls/rootListAspect'
        ).RootUILogic.canBeRoot(slice.state, key)
    ) {
        slice.changeRoot(key);
    } else {
        slice.mark(key);
    }
}
