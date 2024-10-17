import { List, ListSlice, IListState } from 'Controls/dataFactory';
import { CrudEntityKey } from 'Types/source';

// Запрещает разворот определённых узлов
class ExtendedSlice extends ListSlice {
    protected _beforeApplyState(nextState: IListState) {
        const allowedToCollapseItemKeys: CrudEntityKey[] = [];
        nextState.collapsedItems?.forEach((itemKey) => {
            if (itemKey === 1) {
                return;
            }
            allowedToCollapseItemKeys.push(itemKey);
        });
        nextState.collapsedItems = allowedToCollapseItemKeys;
        return super._beforeApplyState(nextState);
    }
}

const loadData = List.loadData;
const slice = ExtendedSlice;

export { loadData, slice };
