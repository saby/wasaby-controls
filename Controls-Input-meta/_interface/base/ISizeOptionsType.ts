import * as rk from 'i18n!Controls-Input';
import { ObjectType, StringType } from 'Meta/types';

export const ISizeOptionsType = ObjectType.id('Controls-Input-meta/inputConnected:ISizeOptionsType')
    .title('Размер шрифта')
    .description(rk('Размер шрифта'))
    .properties({
        reference: StringType.title('Размер шрифта')
            .editor('Controls-Input-editors/SizeEditor:ReferenceEditor')
            .optional()
            .order(100),
        /* 'font-size_input_local': NumberType.title('')
            .editor('Controls-Input-editors/SizeEditor:FontSizeEditor')
            .optional()
            .editorProps({
                minValue: 12,
                maxValue: 20
            })
            .order(101),*/
    })
    .optional()
    .order(100);
