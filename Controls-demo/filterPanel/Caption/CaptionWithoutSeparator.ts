import { Control, TemplateFunction } from 'UI/Base';
import { IFilterItem } from 'Controls/filter';
import * as Template from 'wml!Controls-demo/filterPanel/Caption/Base';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _filterSource: IFilterItem[] = [];

    protected _beforeMount(): void {
        this._filterSource = [
            {
                caption: 'Зар. плата',
                name: 'amount',
                editorTemplateName:
                    'Controls/filterPanelExtEditors:NumberRangeEditor',
                resetValue: [],
                value: [],
                separatorVisibility: 'hidden',
            },
        ];
    }

    static _styles: string[] = ['Controls-demo/filterPanel/Index'];
}
