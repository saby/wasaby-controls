import { ObjectType } from 'Types/meta';
import { ISingleSelectableOptions } from 'Controls/interface';

export const ISingleSelectableOptionsType = ObjectType.id(
    'Controls/meta:ISingleSelectableOptionsType'
).attributes<ISingleSelectableOptions>({
    selectedKey: null,
    keyProperty: null,
});
