import { NumberType, ObjectType } from 'Types/meta';
import * as rk from 'i18n!Controls-Input';

export const IPrecisionOptionsType = ObjectType.id('Controls-Input-meta/input:IPrecisionOptionsType')
    .attributes({
        precision: NumberType
            .title(' ')
            .editor(
                () => {
                    return import('Controls-Input-editors/LengthEditor').then(({LengthEditor}) => {
                        return LengthEditor;
                    });
                },
                {
                    options: {
                        afterInputText: rk('знака'),
                        captionCheckBox: rk('Дробную часть'),
                    },
                    titlePosition: 'none'
                }
            )
            .defaultValue(null),
    })
    .defaultValue({});

