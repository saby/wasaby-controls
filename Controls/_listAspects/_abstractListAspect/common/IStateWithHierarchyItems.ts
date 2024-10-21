import {
    copyStateWithItems,
    fixStateWithItems,
    isStateWithItems,
    IStateWithItems,
} from './IStateWithItems';

export interface IStateWithHierarchyItems extends IStateWithItems {
    parentProperty: string;
    nodeProperty: string;
    declaredChildrenProperty?: string;
}

export function copyStateWithHierarchyItems({
    parentProperty,
    declaredChildrenProperty,
    nodeProperty,
    ...state
}: IStateWithHierarchyItems): IStateWithHierarchyItems {
    return {
        ...copyStateWithItems(state),
        nodeProperty,
        parentProperty,
        declaredChildrenProperty,
    };
}

export function isStateWithHierarchyItems(state: unknown): state is IStateWithHierarchyItems {
    return (
        isStateWithItems(state) &&
        typeof (state as IStateWithHierarchyItems).parentProperty === 'string' &&
        typeof (state as IStateWithHierarchyItems).nodeProperty === 'string'
    );
}

// До диспатчера, аспекты затирают друг друга.
// items не могут обновиться внутри самого аспекта, т.к. другие аспекты в стейте тоже содержат их.
// В результате, берутся items с последнего аспекта.
// Аспект items обязан быть первым в текущей схеме.
// https://online.sbis.ru/opendoc.html?guid=0bdd76dd-d796-4a36-bc37-0c5e673160db&client=3
export function fixStateWithHierarchyItems<T extends IStateWithHierarchyItems>(
    state: T
): Omit<T, keyof IStateWithHierarchyItems> {
    const copy = fixStateWithItems<T>(state) as Omit<T, keyof IStateWithHierarchyItems> &
        Partial<IStateWithHierarchyItems>;

    delete copy.parentProperty;
    delete copy.declaredChildrenProperty;
    delete copy.nodeProperty;

    return copy;
}
