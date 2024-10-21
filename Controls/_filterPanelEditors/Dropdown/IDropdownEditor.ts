import { RecordSet } from 'Types/collection';
import { IMenuPopupOptions } from 'Controls/menu';
import { IFrequentItem } from 'Controls/_filterPanelEditors/FrequentItem/IFrequentItem';

export interface IDropdownOptions extends IMenuPopupOptions, IFrequentItem {
    propertyValue: number[] | string[];
    keyProperty: string;
    displayProperty: string;
    multiSelect: boolean;
    fontSize: string;
    items: RecordSet;
}
