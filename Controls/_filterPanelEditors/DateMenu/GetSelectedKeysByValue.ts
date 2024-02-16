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
export default function (
    items: RecordSet,
    { propertyValue, resetValue, emptyText, emptyKey }: Partial<IDateMenuOptions>
) {
    const selectedKeys = [];
    if (propertyValue !== undefined) {
        const item = items.getRecordById(propertyValue as string);
        if (item) {
            selectedKeys.push(item.getKey());
        } else if ((emptyText && propertyValue === emptyKey) || propertyValue === null) {
            selectedKeys.push(propertyValue);
        } else if (
            !selectedKeys.length &&
            propertyValue !== resetValue &&
            isDatePropertyValue(propertyValue)
        ) {
            selectedKeys.push(BY_PERIOD_KEY);
        }
    }
    return selectedKeys;
}
