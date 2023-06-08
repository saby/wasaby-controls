import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/filterPanel/Editors/DateRange/Index';
import { Memory } from 'Types/source';
import { departments } from 'Controls-demo/filterPanel/resources/DataStorage';

export const dateRangeConfig = {
    caption: 'Период',
    name: 'dateEditor',
    editorTemplateName: 'Controls/filterPanel:DateRangeEditor',
    resetValue: [],
    viewMode: 'basic',
    value: [new Date()],
    editorOptions: {
        extendedCaption: 'Период',
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
        this.filterButtonSource = [dateRangeConfig];
    }

    static _styles: string[] = [
        'DemoStand/Controls-demo',
        'Controls-demo/Filter_new/Filter',
        'Controls-demo/filterPanel/Index',
    ];
}
