import { ObjectType } from 'Meta/types';
import { IBorderVisibilityOptions } from 'Controls/input';
import { TBorderVisibilityType } from '../_interface/TBorderVisibilityType';

export const IBorderVisibilityOptionsType = ObjectType.id(
    'Controls/meta:IBorderVisibilityOptionsType'
).attributes<IBorderVisibilityOptions>({
    borderVisibility: TBorderVisibilityType.optional(),
});
