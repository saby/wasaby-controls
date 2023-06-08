import { NumberType, ObjectType } from 'Types/meta';
import { INumberLengthOptions } from 'Controls/input';
import * as rk from 'i18n!Controls';

export const INumberLengthOptionsType = ObjectType.id(
    'Controls-Input-meta/input:INumberLengthOptionsType'
).attributes<INumberLengthOptions>({
    integersLength: NumberType.title('Ограничивать').editor(
        () => {
            return import('Controls-editors/properties').then(({LengthEditor}) => {
                return LengthEditor;
            });
        },
        {
            options: {
                afterInputText: rk('знаков'),
                captionCheckBox: rk('Целую часть'),
            },
        }
    ),
    precision: NumberType.title(' ').editor(
        () => {
            return import('Controls-editors/properties').then(({LengthEditor}) => {
                return LengthEditor;
            });
        },
        {
            options: {
                afterInputText: rk('знака'),
                captionCheckBox: rk('Дробную часть'),
            },
        }
    ),
});

