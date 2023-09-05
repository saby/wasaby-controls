import { ObjectType, NumberType } from 'Types/meta';
import * as translate from 'i18n!Controls-Input';

interface ILengthOptions {
    minLength?: number;
    maxLength?: number;
}

export const ILengthOptionsType = ObjectType.id(
    'Controls-Input-meta/inputConnected:ILengthOptionsType'
)
    .attributes<ILengthOptions>({
        minLength: NumberType,
        maxLength: NumberType,
    })
    .title(translate('Многострочность'))
    .editor(() => {
        return import('Controls-editors/properties').then(({ InputLengthEditor }) => {
            return InputLengthEditor;
        });
    })
    .optional();
