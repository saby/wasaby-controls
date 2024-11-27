import { CrudEntityKey } from 'Types/source';
import { IListState } from 'Controls/_dataFactory/List/_interface/IListState';

export function initMarker(state: IListState): CrudEntityKey {
    if (state.markerVisibility === 'hidden') {
        return undefined;
    }

    let newMarkedKey = state.markedKey;

    if (state.markerVisibility === 'visible' && state.items) {
        const item = state.markedKey && state.items.getRecordById(state.markedKey);
        if (state.items.getCount() && !item) {
            newMarkedKey = state.items.at(0).getKey();
        }
    }

    return newMarkedKey;
}
