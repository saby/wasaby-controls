import * as rk from 'i18n!Controls-Input';
import { ArrayType, ObjectType, StringType } from 'Types/meta';

export const IValidatorOptionsType = ObjectType
    .id('Controls-Input-meta/inputConnected:IValidatorOptionsType')
    .attributes({
        validator: ArrayType.of(StringType)
            .title('Проверка значения')
            .description(rk('Выбранные функции-валидаторы'))
            .editor(
                () => {
                    return import('Controls-Input-editors/ValidatorSelector').then((ValidatorSelector) => {
                        return ValidatorSelector;
                    });
                },
                {
                    validators: [
                        {
                            caption: 'Обязательный',
                            validatorModule: 'Controls/validate:isRequired',
                        },
                    ],
                }
            )
    });
