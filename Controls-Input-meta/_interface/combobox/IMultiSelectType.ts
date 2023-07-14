import { BooleanType } from 'Types/meta';
import * as rk from 'i18n!Controls';

export const IMultiSelectType = BooleanType.id('Controls-Input-meta/input:IMultiSelectType')
    .description(rk('Определяет множественность выбора.'))
    .title('Множественный выбор')
    .order(4)
    .editor(
        () => {
            return import('Controls-editors/properties').then(({BooleanEditorCheckbox}) => {
                return BooleanEditorCheckbox;
            });
        }
    );
