import { TListAction } from '../ListWebDispatcher/types/TListAction';
import { IListState as IListSliceState } from '../List/_interface/IListState';

// TODO: не должно быть наследования.
export interface IListState extends IListSliceState {
    _actionToDispatch?: TListAction;
}
