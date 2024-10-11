import { BooleanType, ObjectType, StringType } from 'Meta/types';
import { IItem } from 'Controls-Input/interface';

export const IItemType = ObjectType.id('Controls-Input-meta/dropdownConnected:IItem')
    .properties<IItem>({
        id: StringType,
        text: StringType.optional(),
        title: StringType.required(),
        parent: StringType.optional(),
        node: BooleanType.optional(),
        name: StringType.optional(), //?
    })
    .defaultValue({});
