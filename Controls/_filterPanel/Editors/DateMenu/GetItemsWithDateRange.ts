import { BY_PERIOD_KEY, ON_DATE_TITLE, BY_PERIOD_TITLE, IDateMenuOptions } from './IDateMenu';
import { RecordSet } from 'Types/collection';

export default function getItemsWithDateRange(options: IDateMenuOptions): RecordSet {
    const defaultItems = new RecordSet({
        rawData: [
            {
                [options.keyProperty]: BY_PERIOD_KEY,
                [options.displayProperty]:
                    options.selectionType === 'single' ? ON_DATE_TITLE : BY_PERIOD_TITLE,
            },
        ],
        keyProperty: options.keyProperty,
    });
    const dateMenuItems = options.dateMenuItems || options.items;
    if (dateMenuItems) {
        const items = dateMenuItems.clone();
        items.append(defaultItems);
        return items;
    }
    return defaultItems;
}
