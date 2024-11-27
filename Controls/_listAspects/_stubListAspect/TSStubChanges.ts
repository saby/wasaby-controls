export const AddStubChangeName = 'ADD_STUB';
export const RemoveStubChangeName = 'REMOVE_STUB';
export type TAddStubChangeName = typeof AddStubChangeName;
export type TRemoveStubChangeName = typeof RemoveStubChangeName;

export interface IAddStubChange {
    name: TAddStubChangeName;
    args: {};
}

export interface IRemoveStubChange {
    name: TRemoveStubChangeName;
    args: {};
}

export type TStubChanges = IAddStubChange | IRemoveStubChange;
