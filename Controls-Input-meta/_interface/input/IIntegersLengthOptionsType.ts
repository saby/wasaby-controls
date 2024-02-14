import { NumberType, ObjectType } from 'Types/meta';
import * as rk from 'i18n!Controls-Input';

export const IIntegersLengthOptionsType = ObjectType
    .id('Controls-Input-meta/input:IIntegersLengthOptionsType')
    .attributes({
        integersLength: NumberType
            .title('Ограничивать')
            .editor(
                () => {
                    return import('Controls-Input-editors/LengthEditor').then(({LengthEditor}) => {
                        return LengthEditor;
                    });
                },
                {
                    options: {
                        afterInputText: rk('знаков'),
                        captionCheckBox: rk('Целую часть'),
                    },
                    titlePosition: 'none'
                }
            )
            .defaultValue(null)
    })
    .defaultValue({});

