import { BooleanType } from 'Types/meta';
import * as rk from 'i18n!Controls-Input';

export const IMultiSelectType = BooleanType.id('Controls-Input-meta/input:IMultiSelectType')
    .description(rk('Определяет множественность выбора.'))
    .title('Множественный выбор')
    .order(4)
    .editor(
        () => {
            return import('Controls-editors/CheckboxEditor').then(({ CheckboxEditor }) => {
                return CheckboxEditor;
            });
        }
    );
