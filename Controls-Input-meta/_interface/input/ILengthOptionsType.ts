import { NumberType, ObjectType } from 'Types/meta';
import * as translate from 'i18n!Controls-Input';

interface ILengthOptions {
    minLength?: number;
    maxLength?: number;
}

export const ILengthOptionsType = ObjectType
    .id('Controls-Input-meta/inputConnected:ILengthOptionsType')
    .attributes({
        length: ObjectType
            .title(translate('Многострочность'))
            .attributes<ILengthOptions>({
                minLength: NumberType,
                maxLength: NumberType,
            })
            .editor(() => {
                return import('Controls-Input-editors/InputLengthEditor').then(({InputLengthEditor}) => {
                    return InputLengthEditor;
                });
            }, {titlePosition: 'none'})
            .optional()
            .defaultValue({})
    })
    .defaultValue({});
