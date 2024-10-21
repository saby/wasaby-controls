import { IDateMenuOptions, BY_PERIOD_KEY } from './IDateMenu';
import { RecordSet } from 'Types/collection';

function isDatePropertyValue(propertyValue: unknown): boolean {
    const values = propertyValue instanceof Array ? propertyValue : [propertyValue];
    return values.some((value) => {
        return value instanceof Date;
    });
}

/**
 * Функция получения ключей для меню с выбором периода по значению.
 * @private
 */
export default function ({ propertyValue, resetValue }: Partial<IDateMenuOptions>) {
    const selectedKeys = [];
    if (propertyValue !== undefined) {
        if (propertyValue !== resetValue && isDatePropertyValue(propertyValue)) {
            selectedKeys.push(BY_PERIOD_KEY);
        } else {
            selectedKeys.push(propertyValue);
        }
    }
    return selectedKeys;
}
