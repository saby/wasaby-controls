/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { TAbstractAction } from './TAbstractAction';
import type { IListState } from '../../List/_interface/IListState';

export type TAbstractComplexUpdateAction<TMiddlewareName extends string> = TAbstractAction<
    `complexUpdate${TMiddlewareName}`,
    {
        nextState: IListState;
        prevState: IListState;
    }
>;
