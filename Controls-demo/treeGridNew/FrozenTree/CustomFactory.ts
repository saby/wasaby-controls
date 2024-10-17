import { List, ListSlice, IListState } from 'Controls/dataFactory';

// Запрещает разворот определённых узлов
class ExtendedSlice extends ListSlice {
    protected _beforeApplyState(nextState: IListState) {
        nextState.expandedItems = [1, 2];
        return super._beforeApplyState(nextState);
    }
}

const loadData = List.loadData;
const slice = ExtendedSlice;

export { loadData, slice };
