import type { TAbstractAction } from './TAbstractAction';

/**
 * Тип абстрактного метода распространения действий по промежуточным слоям.
 *
 * Является дженерик-типом и принимает
 * * `TAction` - тип действия для распространения.
 *
 * @param {TAbstractAction} action Действия, который нужно распространить.
 * @see Controls-DataEnv/newLists/_dispatcher/Dispatcher
 */
export type TAbstractDispatch<TAction extends TAbstractAction> = (action: TAction) => Promise<void>;
