import * as rk from 'i18n!Controls-Input';
import { BooleanType } from 'Types/meta';

export const IUseGroupingOptionsType = BooleanType.id('Controls-Input-meta/inputConnected:IUseGroupingOptionsType')
    .description(rk('Определяет, следует ли использовать разделители группы.'))
    .title('Разделители триад')
    .editor(
        () => {
            return import('Controls-editors/CheckboxEditor').then(({ CheckboxEditor }) => {
                return CheckboxEditor;
            });
        }
    )
    .defaultValue(false);
