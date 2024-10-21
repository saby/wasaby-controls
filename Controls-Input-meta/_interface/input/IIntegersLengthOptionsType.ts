import { NumberType, ObjectType } from 'Meta/types';
import * as rk from 'i18n!Controls-Input';

export const IIntegersLengthOptionsType = ObjectType.id(
    'Controls-Input-meta/input:IIntegersLengthOptionsType'
)
    .properties({
        integersLength: NumberType.title('Ограничивать')
            .editor('Controls-Input-editors/LengthEditor:LengthEditor', {
                options: {
                    afterInputText: rk('знаков'),
                    captionCheckBox: rk('Целую часть'),
                },
                titlePosition: 'none',
            })
            .defaultValue(null),
    })
    .defaultValue({});
