import { IDateMenuOptions, BY_PERIOD_KEY } from './IDateMenu';
import { RecordSet } from 'Types/collection';

export default function (
    items: RecordSet,
    { propertyValue, resetValue }: Partial<IDateMenuOptions>
) {
    const selectedKeys = [];
    if (propertyValue !== undefined) {
        const item = items.getRecordById(propertyValue as string);
        if (item) {
            selectedKeys.push(item.getKey());
        }
        if (!selectedKeys.length && propertyValue !== resetValue) {
            selectedKeys.push(BY_PERIOD_KEY);
        }
    }
    return selectedKeys;
}
