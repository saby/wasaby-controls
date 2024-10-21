export interface IStubState {
    needShowStub: boolean;
}

export function copyStubState({ needShowStub }: IStubState): IStubState {
    return {
        needShowStub,
    };
}
