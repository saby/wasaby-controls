import { NumberType, ObjectType } from 'Meta/types';
import * as rk from 'i18n!Controls-Input';

export const IPrecisionOptionsType = ObjectType.id(
    'Controls-Input-meta/input:IPrecisionOptionsType'
)
    .attributes({
        precision: NumberType.title(' ')
            .editor('Controls-Input-editors/LengthEditor:LengthEditor', {
                options: {
                    afterInputText: rk('знака'),
                    captionCheckBox: rk('Дробную часть'),
                },
                titlePosition: 'none',
            })
            .defaultValue(null),
    })
    .defaultValue({});
