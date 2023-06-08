import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/filterPanelPopup/Base/Index';
import { Memory } from 'Types/source';

export const dropdownConfig = {
    name: 'city',
    value: ['Yaroslavl'],
    resetValue: [],
    editorTemplateName: 'Controls/filterPanel:DropdownEditor',
    viewMode: 'basic',
    editorOptions: {
        source: new Memory({
            data: [
                { id: 'Yaroslavl', title: 'Yaroslavl' },
                { id: 'Moscow', title: 'Moscow' },
                { id: 'Kazan', title: 'Kazan' },
            ],
            keyProperty: 'id',
        }),
        extendedCaption: 'Город',
        displayProperty: 'title',
        keyProperty: 'id',
    },
};

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _filterSource: unknown[] = [];
    protected _viewSource: Memory = null;

    protected _beforeMount(): void {
        this._filterSource = [dropdownConfig];

        this._viewSource = new Memory({
            data: [
                { id: 'Yaroslavl', title: 'Yaroslavl' },
                { id: 'Moscow', title: 'Moscow' },
                { id: 'Kazan', title: 'Kazan' },
            ],
            keyProperty: 'department',
            filter: (item, queryFilter) => {
                return (
                    queryFilter.city.includes(item.get('id')) ||
                    !queryFilter.city.length
                );
            },
        });
    }
    static _styles: string[] = ['Controls-demo/Filter_new/Filter'];
}
