import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/filterPanelPopup/Editors/Date/Index';
import { Memory } from 'Types/source';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _filterButtonSource: unknown[] = [];
    protected _source: Memory = null;

    protected _beforeMount(): void {
        this._filterButtonSource = [
            {
                caption: 'Дата отправки',
                name: 'dateEditor',
                editorTemplateName: 'Controls/filterPanel:DateEditor',
                resetValue: null,
                viewMode: 'frequent',
                value: new Date(2022, 0, 10),
                type: 'date',
                editorOptions: {
                    _date: new Date(2022, 0, 10),
                    closeButtonVisibility: 'hidden',
                    extendedCaption: 'Дата',
                },
            },
        ];
    }
    static _styles: string[] = ['Controls-demo/Filter_new/Filter'];
}
