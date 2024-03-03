import { ObjectType, NullType } from 'Meta/types';
import { IMultiSelectableOptions } from 'Controls/interface';

export const IMultiSelectableOptionsType = ObjectType.id(
    'Controls/meta:IMultiSelectableOptionsType'
).attributes<IMultiSelectableOptions>({
    selectedKeys: NullType,
});
