import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/filterPanel/ExpanderVisible/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _filterSource: object[] = [];

    protected _beforeMount(): void {
        this._filterSource = [
            {
                name: 'amount',
                editorTemplateName:
                    'Controls/filterPanelExtEditors:NumberRangeEditor',
                resetValue: [],
                value: [],
                expanderVisible: true,
            },
        ];
    }

    static _styles: string[] = ['Controls-demo/filterPanel/Index'];
}
