import { BooleanType } from 'Types/meta';
import * as rk from 'i18n!Controls-Input';

export const IRequiredOptionsType = BooleanType.id('Controls-Input-meta/inputConnected:IRequiredOptionsType')
    .description(rk('Определяет, обязательность для заполнения.'))
    .title('Поле обязательно для заполнения')
    .editor(
        () => {
            return import('Controls-editors/CheckboxEditor').then(({ CheckboxEditor }) => {
                return CheckboxEditor;
            });
        }
    ).defaultValue(false);
