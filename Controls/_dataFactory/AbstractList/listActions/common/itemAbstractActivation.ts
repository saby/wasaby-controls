import { AbstractListSlice, IAbstractListSliceState } from '../../AbstractListSlice';
import { CrudEntityKey } from 'Types/source';
import { loadSync } from 'WasabyLoader/ModulesLoader';

export function itemAbstractActivation(
    slice: AbstractListSlice<IAbstractListSliceState>,
    key: CrudEntityKey,
    props: {
        changeRootByItemClick?: boolean;
        onActivate?: () => void;
    }
): void {
    const rootAspect = loadSync<typeof import('Controls/listAspects')>('Controls/listAspects');

    if (props.changeRootByItemClick && rootAspect?.RootUILogic.canBeRoot(slice.state, key)) {
        slice.changeRoot(key);
    } else {
        slice.mark(key);
        props.onActivate?.();
    }
}
