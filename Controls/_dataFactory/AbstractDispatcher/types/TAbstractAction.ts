export type TAbstractAction<TTypeName extends string = string, TPayload extends object = object> = {
    type: TTypeName;
    payload: TPayload;
};
