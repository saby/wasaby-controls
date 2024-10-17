/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { TAbstractAction } from './TAbstractAction';

/**
 * Тип абстрактного метода распространения действий по промежуточным слоям.
 *
 * Является дженерик-типом и принимает
 * * `TAction` - тип действия для распространения.
 *
 * @param {TAbstractAction} action Действия, который нужно распространить.
 * @see AbstractDispatcher
 *
 * @private
 * @author Родионов Е.А.
 */
export type TAbstractDispatch<TAction extends TAbstractAction = TAbstractAction> = (
    action: TAction
) => Promise<void>;
