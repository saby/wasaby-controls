import { ObjectType, StringType } from 'Meta/types';

export const IMaskOptionsType = ObjectType.id('Controls-Input-meta/input:IMaskOptionsType')
    .attributes({
        mask: StringType
            .optional()
            .title('Маска')
            .editor(() => {
                return import('Controls-Input-editors/MaskEditor').then(({MaskEditor}) => {
                    return MaskEditor;
                });
            })
            .defaultValue(''),
    })
    .defaultValue({});
