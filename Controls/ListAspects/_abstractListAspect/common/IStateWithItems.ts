import type { RecordSet } from 'Types/collection';

export interface IStateWithItems<T extends RecordSet = RecordSet> {
    items: T;
    keyProperty: string;
}

export function copyStateWithItems({ keyProperty, items }: IStateWithItems): IStateWithItems {
    return {
        keyProperty,
        items,
    };
}

export function isStateWithItems(state: unknown): state is IStateWithItems {
    return typeof (state as IStateWithItems).keyProperty === 'string';
}
