import { NumberType, ObjectType } from 'Meta/types';

export const ILengthOptionsType = ObjectType.id(
    'Controls-Input-meta/inputConnected:ILengthOptionsType'
)
    .properties({
        maxLength: NumberType
            .editor('Controls-Input-editors/InputLengthEditor:InputLengthEditor', {titlePosition: 'none',})
            .optional()
            .defaultValue(null)
    })
    .defaultValue({});
