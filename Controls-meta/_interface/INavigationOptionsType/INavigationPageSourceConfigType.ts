import { BooleanType, ObjectType } from 'Types/meta';
import { INavigationPageSourceConfig } from 'Controls/interface';
import { IBasePageSourceConfigType } from '../IBasePageSourceConfigType';

export const INavigationPageSourceConfigType = ObjectType.id(
    'Controls/meta:INavigationPageSourceConfigType'
).attributes<INavigationPageSourceConfig>({
    ...IBasePageSourceConfigType.attributes(),
    hasMore: BooleanType.optional(),
});
