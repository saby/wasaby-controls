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

// До диспатчера, аспекты затирают друг друга.
// items не могут обновиться внутри самого аспекта, т.к. другие аспекты в стейте тоже содержат их.
// В результате, берутся items с последнего аспекта.
// Аспект items обязан быть первым в текущей схеме.
// https://online.sbis.ru/opendoc.html?guid=0bdd76dd-d796-4a36-bc37-0c5e673160db&client=3
export function fixStateWithItems<T extends IStateWithItems>(
    state: T
): Omit<T, keyof IStateWithItems> {
    const copy: Omit<T, keyof IStateWithItems> & Partial<IStateWithItems> = { ...state };

    delete copy.items;
    delete copy.keyProperty;

    return copy;
}
