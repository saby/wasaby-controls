import { ObjectType, StringType } from 'Meta/types';

export const IMaskOptionsType = ObjectType.id('Controls-Input-meta/input:IMaskOptionsType')
    .attributes({
        mask: StringType.optional()
            .title('Маска')
            .editor('Controls-Input-editors/MaskEditor:MaskEditor')
            .defaultValue(''),
    })
    .defaultValue({});
