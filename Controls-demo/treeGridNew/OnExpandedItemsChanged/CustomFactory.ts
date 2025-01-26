import { List, ListSlice, IListState } from 'Controls/dataFactory';
import { CrudEntityKey } from 'Types/source';

// Запрещает разворот определённых узлов
class ExtendedSlice extends ListSlice {
    protected _beforeApplyState(nextState: IListState) {
        const allowedToExpandItemKeys: CrudEntityKey[] = [];
        nextState.expandedItems?.forEach((itemKey) => {
            if (itemKey === 1) {
                return;
            }
            allowedToExpandItemKeys.push(itemKey);
        });
        nextState.expandedItems = allowedToExpandItemKeys;
        return super._beforeApplyState(nextState);
    }
}

const loadData = List.loadData;
const slice = ExtendedSlice;

export { loadData, slice };
