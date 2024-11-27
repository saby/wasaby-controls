/**
 * Тип объекта, описывающий абстрактное действие.
 *
 * Является дженерик-типом и принимает
 * * [string] `TAction` - тип имени действия для распространения.
 * * [object] `TPayload` - тип данных, передаваемых с действием.
 *
 * @property {string} type тип действия.
 * @property {object} payload данные, которые передаются вместе с действием.
 */
export type TAbstractAction<TTypeName extends string = string, TPayload extends object = object> = {
    type: TTypeName;
    payload: TPayload;
};
