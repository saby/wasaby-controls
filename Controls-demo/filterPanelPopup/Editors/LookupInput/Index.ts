import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/filterPanelPopup/Editors/LookupInput/Index';
import { Memory } from 'Types/source';

const data = [
    { id: 'Yaroslavl', title: 'Yaroslavl' },
    { id: 'Moscow', title: 'Moscow' },
    { id: 'Kazan', title: 'Kazan' },
];

export const lookupConfig = {
    name: 'city',
    editorTemplateName: 'Controls/filterPanel:LookupInputEditor',
    resetValue: [],
    value: ['Yaroslavl'],
    textValue: '',
    viewMode: 'basic',
    editorOptions: {
        source: new Memory({
            keyProperty: 'id',
            data,
        }),
        displayProperty: 'title',
        keyProperty: 'id',
        selectorTemplate: {
            templateName:
                'Controls-demo/filterPanel/resources/MultiSelectStackTemplate/StackTemplate',
            templateOptions: {
                items: data,
            },
        },
    },
};

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _filterButtonSource: unknown[] = [];
    protected _viewSource: Memory = null;

    protected _beforeMount(): void {
        this._filterButtonSource = [lookupConfig];

        this._viewSource = new Memory({
            data,
            keyProperty: 'id',
            filter: (item, queryFilter) => {
                return (
                    queryFilter.city?.includes(item.get('id')) ||
                    !queryFilter.city?.length
                );
            },
        });
    }
    static _styles: string[] = ['Controls-demo/Filter_new/Filter'];
}
