import { BY_PERIOD_KEY, ON_DATE_TITLE, BY_PERIOD_TITLE } from './IDateMenu';
import { RecordSet } from 'Types/collection';
import { IRangeSelectableOptions } from 'Controls/dateRange';
import { loadSync } from 'WasabyLoader/ModulesLoader';

interface IDateMenuItemsProps extends IRangeSelectableOptions {
    periodItemVisible?: boolean;
    keyProperty: string;
    displayProperty: string;
    items?: RecordSet;
    dateMenuItems?: RecordSet;
}

const GET_PERIOD_ITEMS = 'Controls/filterDateRangeEditor:getPeriodItems';

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
    if (!options.dateMenuItems && !options.items) {
        return loadSync(GET_PERIOD_ITEMS)({
            periodType: options.periodType,
            excludedPeriods: options.excludedPeriods,
            timePeriods: options.timePeriods,
            customPeriod: options.customPeriod ?? options.periodItemVisible,
            userPeriods: options.userPeriods,
            selectionType: options.selectionType,
        });
    }
    const defaultItems = getDateRangeItem(options);
    const dateMenuItems = options.dateMenuItems || options.items;
    if (dateMenuItems) {
        const items = dateMenuItems.clone();
        items.append(defaultItems);
        return items;
    }
    return defaultItems;
}
