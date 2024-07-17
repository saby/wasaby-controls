import { TAbstractAction } from './TAbstractAction';

export type TAbstractDispatch<TAction extends TAbstractAction = TAbstractAction> = (
    action: TAction
) => Promise<void>;
