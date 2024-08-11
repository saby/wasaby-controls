import type { TAbstractAction } from './TAbstractAction';
import type { IListState } from '../../List/_interface/IListState';

export type TAbstractComplexUpdateAction<TMiddlewareName extends string> = TAbstractAction<
    `complexUpdate${TMiddlewareName}`,
    {
        nextState: IListState;
        prevState: IListState;
    }
>;
