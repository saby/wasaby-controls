import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';

export default function <TTypeName extends string = string, TPayload extends object = object>(
    type: TTypeName,
    payload: TPayload = {} as TPayload
): TAbstractAction<TTypeName, TPayload> {
    return {
        type,
        payload,
    };
}
