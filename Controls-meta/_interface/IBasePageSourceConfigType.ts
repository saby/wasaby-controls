import { BooleanType, NumberType, ObjectType } from 'Types/meta';
import { IBasePageSourceConfig } from 'Controls/interface';

export const IBasePageSourceConfigType = ObjectType.id(
    'Controls/meta:IBasePageSourceConfigType'
).attributes<IBasePageSourceConfig>({
    page: NumberType.optional(),
    pageSize: NumberType,
    multiNavigation: BooleanType.optional(),
});
