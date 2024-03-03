import { copyStateWithItems, isStateWithItems, IStateWithItems } from './IStateWithItems';

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
