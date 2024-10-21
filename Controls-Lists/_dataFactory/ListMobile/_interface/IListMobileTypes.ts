/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { IAbstractListSliceState, IListState } from 'Controls/dataFactory';

import type { TAbstractMiddleware } from 'Controls-DataEnv/dispatcher';
import { TListMobileActions } from '../actions';

/**
 * Интерфейс состояния мобильного слайса.
 * @interface Controls-Lists/_dataFactory/ListMobile/_interface/IListMobileTypes/IListMobileState
 * @public
 */
export type IListMobileState = IAbstractListSliceState & IListState;

export type TListMobileMiddleware = TAbstractMiddleware<TListMobileActions.TAnyListMobileAction>;
