/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
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
    loadAsync<typeof import('Controls/listAspects')>('Controls/listAspects').then((lib) => {
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
