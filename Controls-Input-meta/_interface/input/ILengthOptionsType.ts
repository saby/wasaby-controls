import { NumberType, ObjectType } from 'Meta/types';
import * as translate from 'i18n!Controls-Input';

interface ILengthOptions {
    minLength?: number;
    maxLength?: number;
}

export const ILengthOptionsType = ObjectType.id(
    'Controls-Input-meta/inputConnected:ILengthOptionsType'
)
    .properties({
        length: ObjectType.title(translate('Многострочность'))
            .properties<ILengthOptions>({
                minLength: NumberType,
                maxLength: NumberType,
            })
            .editor('Controls-Input-editors/InputLengthEditor:InputLengthEditor', {
                titlePosition: 'none',
            })
            .optional()
            .defaultValue({}),
    })
    .defaultValue({});
