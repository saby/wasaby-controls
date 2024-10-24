/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { TListAction } from 'Controls-DataEnv/list';
import { IListState as IListSliceState } from '../List/_interface/IListState';

// TODO: не должно быть наследования.
export interface IListState extends IListSliceState {
    _actionToDispatch?: Map<string, TListAction>;
}
