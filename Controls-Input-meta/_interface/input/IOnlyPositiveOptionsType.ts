import { BooleanType, ObjectType } from 'Meta/types';
import * as rk from 'i18n!Controls-Input';

const options = [
    {value: false, caption: rk('Все')},
    {value: true, caption: rk('Только положительные')},
];

export const IOnlyPositiveOptionsType = ObjectType
    .id('Controls-Input-meta/input:IOnlyPositiveOptionsType')
    .attributes({
        onlyPositive: BooleanType
            .title(rk('Только положительные'))
            .description(rk('Определяет, будут ли отображаться только неотрицательные числа'))
            .oneOf([false, true])
            .editor(
                () => {
                    return import('Controls-editors/CheckboxEditor').then(({CheckboxEditor}) => {
                        return CheckboxEditor;
                    });
                },
                {options}
            )
            .optional()
            .defaultValue(false)
    })
    .defaultValue({onlyPositive: false});
