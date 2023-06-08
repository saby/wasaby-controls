import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/filterPanel/Editors/Date/Index';
import { Memory } from 'Types/source';
import { departments } from 'Controls-demo/filterPanel/resources/DataStorage';

export const dateConfig = {
    caption: 'Дата',
    name: 'dateEditor',
    editorTemplateName: 'Controls/filterPanel:DateEditor',
    resetValue: new Date(),
    value: null,
    viewMode: 'basic',
    editorOptions: {
        extendedCaption: 'Дата',
    },
};

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected filterButtonSource: unknown[] = [];
    protected _source: Memory = null;

    protected _beforeMount(): void {
        this._source = new Memory({
            data: departments,
            keyProperty: 'id',
        });
        this.filterButtonSource = [dateConfig];
    }

    static _styles: string[] = [
        'DemoStand/Controls-demo',
        'Controls-demo/Filter_new/Filter',
        'Controls-demo/filterPanel/Index',
    ];
}
