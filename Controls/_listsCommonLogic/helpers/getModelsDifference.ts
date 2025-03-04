import { CrudEntityKey } from 'Types/source';

type TBooleanValueType = true | false;
type TNillBooleanValueType = TBooleanValueType | null | undefined;

type TModel<T extends TBooleanValueType | TNillBooleanValueType> = Map<CrudEntityKey, T>;

const DEFAULT_VALUE = false;

export function getModelsDifference<
    TValue extends TBooleanValueType | TNillBooleanValueType =
        | TBooleanValueType
        | TNillBooleanValueType,
>(prevModel: TModel<TValue>, nextModel: TModel<TValue>) {
    const changes = new Map<CrudEntityKey, TValue>(prevModel);

    for (const key of new Set([...changes.keys(), ...nextModel.keys()])) {
        const nextValue = nextModel.get(key);
        if (changes.get(key) === nextValue) {
            changes.delete(key);
        } else {
            changes.set(
                key,
                typeof nextValue === 'undefined' ? (DEFAULT_VALUE as TValue) : nextValue
            );
        }
    }

    return changes;
}
