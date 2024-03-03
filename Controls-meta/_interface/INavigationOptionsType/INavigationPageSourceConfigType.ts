import { BooleanType, ObjectType } from 'Meta/types';
import { INavigationPageSourceConfig } from 'Controls/interface';
import { IBasePageSourceConfigType } from '../IBasePageSourceConfigType';

export const INavigationPageSourceConfigType = ObjectType.id(
    'Controls/meta:INavigationPageSourceConfigType'
).attributes<INavigationPageSourceConfig>({
    ...IBasePageSourceConfigType.attributes(),
    hasMore: BooleanType.optional(),
});
