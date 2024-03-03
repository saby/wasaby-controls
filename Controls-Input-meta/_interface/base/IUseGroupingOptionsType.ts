import * as rk from 'i18n!Controls-Input';
import { BooleanType, ObjectType } from 'Meta/types';

export const IUseGroupingOptionsType = ObjectType.id('Controls-Input-meta/inputConnected:IUseGroupingOptionsType')
    .attributes({
        useGrouping: BooleanType
            .description(rk('Определяет, следует ли использовать разделители группы.'))
            .title('Разделители триад')
            .editor(
                () => {
                    return import('Controls-editors/CheckboxEditor').then(({CheckboxEditor}) => {
                        return CheckboxEditor;
                    });
                }
            )
            .defaultValue(false)
            .optional()
    })
    .defaultValue({useGrouping: false});
