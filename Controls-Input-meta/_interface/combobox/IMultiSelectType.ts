import { BooleanType, ObjectType } from 'Types/meta';
import * as rk from 'i18n!Controls-Input';

export const IMultiSelectType = ObjectType.id('Controls-Input-meta/input:IMultiSelectType')
    .attributes({
        multiSelect: BooleanType
            .description(rk('Определяет множественность выбора.'))
            .title('Множественный выбор')
            .order(4)
            .editor(
                () => {
                    return import('Controls-editors/CheckboxEditor').then(({CheckboxEditor}) => {
                        return CheckboxEditor;
                    });
                }
            )
    });
