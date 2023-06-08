import { ObjectType, NullType } from 'Types/meta';
import { IHierarchyOptions } from 'Controls/interface';

export const IHierarchyOptionsType = ObjectType.id(
    'Controls/meta:IHierarchyOptionsType'
).attributes<IHierarchyOptions>({
    nodeProperty: NullType,
    parentProperty: NullType,
    nodeHistoryId: NullType,
    nodeHistoryType: NullType,
});
