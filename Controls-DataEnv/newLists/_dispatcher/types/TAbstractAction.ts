/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
/**
 * Тип объекта, описывающий абстрактное действие.
 *
 * Является дженерик-типом и принимает
 * * [string] `TAction` - тип имени действия для распространения.
 * * [object] `TPayload` - тип данных, передаваемых с действием.
 *
 * @property {string} type тип действия.
 * @property {object} payload данные, которые передаются вместе с действием.
 *
 * @author Родионов Е.А.
 */
export type TAbstractAction<TTypeName extends string = string, TPayload extends object = object> = {
    type: TTypeName;
    payload: TPayload;
};
