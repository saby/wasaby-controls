import { IFilterItem } from 'Controls/filter';
import 'Controls/filterPanelEditors';

export function getExtendedItems(count: number): IFilterItem[] {
    const filterItems = [];

    for (let i = 0; i < count; i++) {
        filterItems.push({
            name: 'extendedFilter-' + i,
            value: false,
            resetValue: false,
            viewMode: 'extended',
            extendedCaption: 'extendedFilterCaption-' + i,
            editorTemplateName: 'Controls/filterPanelEditors:Boolean',
            editorOptions: {
                value: true,
            },
        });
    }

    return filterItems;
}
