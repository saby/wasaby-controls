import rk = require('i18n!Controls');
import { date as formatDate } from 'Types/formatter';
import { Base as dateUtils } from 'Controls/dateUtils';

interface IOptions {
    doNotValidate?: boolean;
    value: Date;
    startValue?: Date;
    endValue?: Date;
}

export default function isInRange(args: IOptions): boolean | string {
    let result: boolean = true;
    if (args.doNotValidate) {
        return true;
    }
    if (args.value && dateUtils.isValidDate(args.value)) {
        if (args.startValue && args.value < args.startValue) {
            result = false;
        }
        if (args.endValue && args.value > args.endValue) {
            result = false;
        }
    }

    return (
        result ||
        rk(
            `Введенное значение должно быть больше ${formatDate(
                args.startValue,
                formatDate.FULL_DATE
            )} и меньше ${formatDate(args.endValue, formatDate.FULL_DATE)}`
        )
    );
}
