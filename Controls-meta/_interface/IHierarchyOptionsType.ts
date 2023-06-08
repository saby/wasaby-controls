import { ObjectType } from 'Types/meta';
import { IHierarchyOptions } from 'Controls/interface';

export const IHierarchyOptionsType = ObjectType.id(
    'Controls/meta:IHierarchyOptionsType'
).attributes<IHierarchyOptions>({
    nodeProperty: null,
    parentProperty: null,
    nodeHistoryId: null,
    nodeHistoryType: null,
});
