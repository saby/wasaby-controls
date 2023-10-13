import * as rk from 'i18n!Controls-Input';
import { ArrayType, StringType } from 'Types/meta';

export const IValidatorOptionsType = ArrayType.of(StringType)
    .id('Controls-Input-meta/inputConnected:IValidatorOptionsType')
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
    );
