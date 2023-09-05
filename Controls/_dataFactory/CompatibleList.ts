import { IListState } from './List/_interface/IListState';
import loadData from './List/loadData';
import slice from './List/Slice';

class CompatibleListSlice<T extends IListState = IListState> extends slice<T> {
    readonly '[ICompatibleSlice]': boolean = true;
}

export default {
    loadData,
    slice: CompatibleListSlice,
};
