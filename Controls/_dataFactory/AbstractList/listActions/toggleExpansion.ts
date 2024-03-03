import { AbstractListSlice, IAbstractListSliceState } from '../AbstractListSlice';
import { CrudEntityKey } from 'Types/source';
import { loadAsync } from 'WasabyLoader/ModulesLoader';

export function toggleExpansion(
    slice: AbstractListSlice<IAbstractListSliceState>,
    key: CrudEntityKey,
    {
        markItem = true,
    }: {
        markItem?: boolean;
    } = {}
): void {
    loadAsync<typeof import('Controls/expandCollapseListAspect')>(
        'Controls/expandCollapseListAspect'
    ).then((lib) => {
        if (lib.ExpandCollapseUILogic.isExpanded(slice.state, key)) {
            slice.collapse(key, {
                markItem,
            });
        } else {
            slice.expand(key, {
                markItem,
            });
        }
    });
}
