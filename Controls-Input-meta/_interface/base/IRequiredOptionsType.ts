import { BooleanType, ObjectType } from 'Types/meta';
import * as rk from 'i18n!Controls-Input';

export const IRequiredOptionsType = ObjectType.id('Controls-Input-meta/inputConnected:IRequiredOptionsType')
    .attributes({
        required: BooleanType
            .description(rk('Определяет, обязательность для заполнения.'))
            .title('Поле обязательно для заполнения')
            .editor(
                () => {
                    return import('Controls-editors/CheckboxEditor').then(({CheckboxEditor}) => {
                        return CheckboxEditor;
                    });
                }
            )
            .defaultValue(false)
    })
    .defaultValue({required: false});
