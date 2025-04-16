import { BooleanType, extended, ObjectType } from 'Meta/types';
import * as rk from 'i18n!Controls-Input';

const options = [
    { value: false, caption: rk('Все') },
    { value: true, caption: rk('Только положительные') },
];

export const IOnlyPositiveOptionsType = ObjectType.id(
    'Controls-Input-meta/input:IOnlyPositiveOptionsType'
)
    .properties({
        onlyPositive: BooleanType.title(rk('Только положительные'))
            .description(rk('Определяет, будут ли отображаться только неотрицательные числа'))
            .oneOf([false, true])
            .editor('Controls-editors/CheckboxEditor:CheckboxEditor', { options })
            .optional()
            .order(6)
            .defaultValue(false),
    })
    .defaultValue({ onlyPositive: false });
