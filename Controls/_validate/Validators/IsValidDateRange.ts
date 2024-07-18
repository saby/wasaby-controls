/**
 * @kaizen_zone f30239e7-9eed-4273-bd85-3f5d432228f8
 */
import rk = require('i18n!Controls');

/**
 * На БЛ, минимальное значение для года - 1400.
 */
const MIN_YEAR_VALUE = 1400;
const additionalYears = 1000;
const MAX_YEAR_VALUE = new Date().getFullYear() + additionalYears;

/**
 * Функция проверяет, что начало периода не больше конца периода.
 * @class Controls/_validate/Validators/IsValidDateRange
 * @public
 * @remark
 * Валидатор используется по умолчанию в платформенных полях ввода даты и времени, задавать его вручную не нужно.
 * Подробнее о работе с валидацией читайте {@link /doc/platform/developmentapl/interface-development/forms-and-validation/validation/ здесь}.
 *
 * Аргументы функции:
 *
 * * startValue — начало периода.
 * * endValue — конец периода.
 * * doNotValidate:Boolean — требуется ли валидация
 *
 * Возвращаемые значения:
 *
 * * true — значение прошло проверку на валидность.
 * * String — значение не прошло проверку на валидность, возвращается текст сообщения об ошибке.
 *
 * @example
 * <pre>
 *   <Controls.validate:InputContainer name="InputValidate">
 *     <ws:validators>
 *      <ws:Function startValue="{{_startValue}}" endValue="{{_endValue}}">Controls/validate:isValidDateRange</ws:Function>
 *      </ws:validators>
 *      <ws:content>
 *        <Controls.dateRange:Input bind:startValue="_startValue" bind:endValue="_endValue"/>
 *      </ws:content>
 *  </Controls.validate:InputContainer>
 * </pre>
 *
 */

// todo: will be fixed by https://online.sbis.ru/opendoc.html?guid=9aea41a1-bac1-47b9-a2b5-fa81a3a2e979
function isValidDateDefault(date: Date): boolean {
    // If date is Invalid Date, "instanceof Date" will return true, so check getTime
    return (
        date instanceof Date &&
        !isNaN(date.getTime()) &&
        date.getFullYear() >= MIN_YEAR_VALUE &&
        date.getFullYear() <= MAX_YEAR_VALUE
    );
}

function isValidDate(startValue: Date, endValue: Date, ignoreTime: boolean = true): boolean {
    const start = new Date(startValue.getTime());
    const end = new Date(endValue.getTime());
    if (ignoreTime) {
        start.setHours(0, 0, 0, 0); // Убираю часы, минуты, секунды
        end.setHours(0, 0, 0, 0); // Убираю часы, минуты, секунды
    }
    return start.getTime() <= end.getTime();
}

export default function isValidDateRange(args): boolean {
    if (
        args.doNotValidate ||
        !args.startValue ||
        !args.endValue ||
        !isValidDateDefault(args.startValue) ||
        !isValidDateDefault(args.endValue) ||
        isValidDate(args.startValue, args.endValue, args.ignoreTime)
    ) {
        return true;
    }

    return rk('Дата конца периода должна быть больше даты начала');
}
