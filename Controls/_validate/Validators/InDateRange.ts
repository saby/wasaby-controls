/**
 * @kaizen_zone f30239e7-9eed-4273-bd85-3f5d432228f8
 */
import rk = require('i18n!Controls');
import { date as formatDate } from 'Types/formatter';
import { Logger } from 'UI/Utils';

interface IArgs {
    value: Date;
    minValue?: Date;
    maxValue?: Date;
}

/**
 * Функция проверяет, попадает ли дата в заданный диапазон.
 * @class Controls/_validate/Validators/InDateRange
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
 * <Controls.dateRange:Input>
 *     <ws:startValueValidators>
 *         <ws:Array>
 *             <ws:Function value="{{ _startValue }}" minValue="{{ _minValue }}" maxValue="{{ _maxValue }}">Controls/validate:inDateRange</ws:Function>
 *         </ws:Array>
 *     </ws:startValueValidators>
 *     <ws:endValueValidators>
 *         <ws:Array>
 *             <ws:Function value="{{ _endValue }}" minValue="{{ _minValue }}" maxValue="{{ _maxValue }}">Controls/validate:inDateRange</ws:Function>
 *         </ws:Array>
 *     </ws:endValueValidators>
 * </Controls.dateRange:Input>
 * </pre>
 * <pre>
 *  this._minValue = new Date(2015, 0);
 *  this._maxValue = new Date(2030, 0);
 * </pre>
 */

export default function (args: IArgs): boolean | string {
    if (args.minValue && args.maxValue && args.maxValue < args.minValue) {
        Logger.error('Controls.validate:inDateRange: maxValue не может быть меньше чем minValue');
    }

    if (
        !args.value ||
        !(args.minValue || args.maxValue) ||
        !(args.value < args.minValue || args.value > args.maxValue)
    ) {
        return true;
    }
    let errorText = rk('Значение должно попадать в диапазон');
    if (args.minValue) {
        errorText += ` ${rk('от')} ${formatDate(args.minValue, formatDate.FULL_DATE)}`;
    }
    if (args.maxValue) {
        errorText += ` ${rk('до')} ${formatDate(args.maxValue, formatDate.FULL_DATE)}`;
    }
    return errorText;
}
