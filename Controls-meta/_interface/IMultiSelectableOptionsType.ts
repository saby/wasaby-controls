import { ObjectType, NullType } from 'Types/meta';
import { IMultiSelectableOptions } from 'Controls/interface';

export const IMultiSelectableOptionsType = ObjectType.id(
    'Controls/meta:IMultiSelectableOptionsType'
).attributes<IMultiSelectableOptions>({
    selectedKeys: NullType,
});
