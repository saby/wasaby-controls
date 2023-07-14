import { ObjectType, StringType, AnyType } from 'Types/meta';
import { IMaskOptions } from 'Controls/baseDecorator';

export const IMaskOptionsType = ObjectType.id(
    'Controls-Input-meta/input:IMaskOptionsType'
).attributes<IMaskOptions>({
    mask: StringType
        .optional()
        .title('Маска')
        .editor(() => {
            return import('Controls-editors/properties').then(({MaskEditor}) => {
                return MaskEditor;
            });
        })
        .defaultValue(''),
    replacer: StringType.optional().hidden(),
    formatMaskChars: AnyType.optional().hidden(),
});
