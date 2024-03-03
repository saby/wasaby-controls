import { ObjectType, NullType } from 'Meta/types';
import { ISingleSelectableOptions } from 'Controls/interface';

export const ISingleSelectableOptionsType = ObjectType.id(
    'Controls/meta:ISingleSelectableOptionsType'
).attributes<ISingleSelectableOptions>({
    selectedKey: NullType,
    keyProperty: NullType,
});
