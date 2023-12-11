import * as rk from 'i18n!Controls';
import { IRangeSelectableOptions } from 'Controls/dateRange';
import { RecordSet } from 'Types/collection';
import { IDayAvailableOptions } from 'Controls/calendar';

export const BY_PERIOD_KEY = 'byPeriod';
export const BY_PERIOD_TITLE = rk('За период');
export const ON_DATE_TITLE = rk('На дату');

export interface IDateMenuOptions extends IRangeSelectableOptions, IDayAvailableOptions {
    periodItemVisible?: boolean;
    propertyValue: Date | string;
    resetValue?: Date | string;
    items?: RecordSet;
    dateMenuItems?: RecordSet;
    viewMode?: string;
    editorMode?: string;
    startValue?: Date;
    endValue?: Date;
    displayProperty: string;
    keyProperty: string;
}
