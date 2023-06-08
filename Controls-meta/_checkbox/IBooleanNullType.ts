import { BooleanType, Meta } from 'Types/meta';

export const IBooleanNullType = BooleanType.id(
    'Controls/meta:IBooleanNullType'
).editor(() => {
    return import('Controls-editors/properties').then(({ BooleanEditor }) => {
        return BooleanEditor;
    });
}) as Meta<boolean | null>;
