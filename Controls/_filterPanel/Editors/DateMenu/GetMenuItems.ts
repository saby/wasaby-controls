import { BY_PERIOD_KEY, ON_DATE_TITLE, BY_PERIOD_TITLE, IDateMenuOptions } from './IDateMenu';
import { RecordSet } from 'Types/collection';
import { IRangeSelectableOptions } from 'Controls/dateRange';

interface IDateMenuItemsProps extends IRangeSelectableOptions {
    periodItemVisible?: boolean;
    keyProperty: string;
    displayProperty: string;
    items?: RecordSet;
    dateMenuItems?: RecordSet;
}

function getDateRangeItem(options: IDateMenuItemsProps): RecordSet {
    let rawData = [];
    if (options.periodItemVisible !== false) {
        rawData = [
            {
                [options.keyProperty]: BY_PERIOD_KEY,
                [options.displayProperty]:
                    options.selectionType === 'single' ? ON_DATE_TITLE : BY_PERIOD_TITLE,
            },
        ];
    }
    return new RecordSet({
        rawData,
        keyProperty: options.keyProperty,
    });
}

export default function getMenuItems(options: IDateMenuItemsProps): RecordSet {
    const defaultItems = getDateRangeItem(options);
    const dateMenuItems = options.dateMenuItems || options.items;
    if (dateMenuItems) {
        const items = dateMenuItems.clone();
        items.append(defaultItems);
        return items;
    }
    return defaultItems;
}
