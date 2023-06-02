/**
 * @kaizen_zone f30239e7-9eed-4273-bd85-3f5d432228f8
 */
import rk = require('i18n!Controls');
import { date as formatDate } from 'Types/formatter';
import { Logger } from 'UI/Utils';

interface IArgs {
    value: Number;
    minValue: Number;
    maxValue: Number;
}

/**
 * Функция проверяет, попадает ли число в заданный диапазон.
 * @class Controls/_validate/Validators/InRange
 * @public
 * @remark
 * Подробнее о работе с валидацией читайте {@link /doc/platform/developmentapl/interface-development/forms-and-validation/validation/ здесь}.
 *
 * Аргументы функции:
 *
 * * value — проверяемое значение.
 * * minValue - минимальное допустимое значение
 * * maxValue - максимальное допустимое значение
 *
 * Типы возвращаемых значений:
 *
 * * true — значение прошло проверку на валидность.
 * * String — значение не прошло проверку на валидность, возвращается текст сообщения об ошибке.
 *
 * @example
 * <pre>
 *  <Controls.validate:InputContainer name="InputValidate">
 *      <ws:validators>
 *          <ws:Function value="{{ _value }}" minValue="10" maxValue="15">Controls/validate:inRange</ws:Function>
 *      </ws:validators>
 *      <ws:content>
 *          <Controls.input:Number bind:value="_value"/>
 *      </ws:content>
 *  </Controls.validate:InputContainer>
 * </pre>
 */

export default function (args: IArgs): boolean | string {
    const min = Number(args.minValue);
    const max = Number(args.maxValue);
    const value = Number(args.value);
    const createTypeError = (propertyName) => {
        Logger.error(
            `Controls.validate:inRange: ${propertyName} не является числом`
        );
    };

    if (args.minValue && isNaN(min)) {
        createTypeError('minValue');
    }
    if (args.maxValue && isNaN(max)) {
        createTypeError('maxValue');
    }
    if (args.value && isNaN(value)) {
        createTypeError('value');
    }
    if (max < min) {
        Logger.error(
            'Controls.validate:inRange: maxValue не может быть меньше чем minValue'
        );
    }

    if (!(value < min || value > max)) {
        return true;
    }
    let errorText = rk('Значение должно попадать в диапазон');
    if (min) {
        errorText += ` ${rk('от')} ${min}`;
    }
    if (max) {
        errorText += ` ${rk('до')} ${max}`;
    }
    return errorText;
}
