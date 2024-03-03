import { BooleanType, ObjectType } from 'Meta/types';
import { IIgnoreNavigationConfig } from 'Controls/interface';

export const INavigationPositionSourceConfigType = ObjectType.id(
    'Controls/meta:INavigationPositionSourceConfigType'
).attributes<IIgnoreNavigationConfig>({
    ignoreNavigation: BooleanType,
});
