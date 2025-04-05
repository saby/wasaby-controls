import { NumberType, ObjectType } from 'Meta/types';
import * as rk from 'i18n!Controls-Input';

export const IPrecisionOptionsType = ObjectType.id(
    'Controls-Input-meta/input:IPrecisionOptionsType'
)
    .properties({
        precision: NumberType.title('Дробная часть')
            .editor('Controls-Input-editors/LengthEditor:LengthEditor', {
                options: {
                    afterInputText: rk('знака'),
                    captionCheckBox: rk('Дробная часть'),
                },
                titlePosition: 'none',
            })
            .order(8)
            .defaultValue(null),
    })
    .defaultValue({});
