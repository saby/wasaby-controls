import { List, ListSlice, IListState } from 'Controls/dataFactory';

// Запрещает разворот определённых узлов
class ExtendedSlice extends ListSlice {
    protected _beforeApplyState(nextState: IListState) {
        if (nextState.markedKey !== undefined) {
            const item = nextState.items.getRecordById(nextState.markedKey);
            if (item && item.get('markable') !== true) {
                nextState.markedKey = this.state.markedKey;
            }
        }
        return super._beforeApplyState(nextState);
    }
}

const loadData = List.loadData;
const slice = ExtendedSlice;

export { loadData, slice };
