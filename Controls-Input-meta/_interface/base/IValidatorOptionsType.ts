import * as rk from 'i18n!Controls-Input';
import { ArrayType, ObjectType, StringType } from 'Meta/types';

export const IValidatorOptionsType = ObjectType.id(
    'Controls-Input-meta/inputConnected:IValidatorOptionsType'
).attributes({
    validator: ArrayType.of(StringType)
        .title('Проверка значения')
        .description(rk('Выбранные функции-валидаторы'))
        .editor('Controls-Input-editors/ValidatorSelector:ValidatorSelector', {
            validators: [
                {
                    caption: 'Обязательный',
                    validatorModule: 'Controls/validate:isRequired',
                },
            ],
        }),
});
