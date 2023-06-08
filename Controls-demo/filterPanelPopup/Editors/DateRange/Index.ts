import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/filterPanelPopup/Editors/DateRange/Index';
import { Memory } from 'Types/source';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _filterButtonSource: unknown[] = [];
    protected _source: Memory = null;

    protected _beforeMount(): void {
        this._filterButtonSource = [
            {
                caption: 'Период',
                name: 'dateEditor',
                editorTemplateName: 'Controls/filterPanel:DateRangeEditor',
                resetValue: [],
                viewMode: 'extended',
                value: [],
                editorOptions: {
                    extendedCaption: 'Дата',
                },
            },
        ];
    }
    static _styles: string[] = ['Controls-demo/Filter_new/Filter'];
}
