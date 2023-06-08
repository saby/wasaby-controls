import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/filterPanelPopup/Sticky/Orientation/Index';
import * as stackTemplate from 'wml!Controls-demo/filterPanel/resources/MultiSelectStackTemplate/StackTemplate';
import { lookupConfig } from 'Controls-demo/filterPanelPopup/Editors/Lookup/Index';
import 'Controls-demo/Filter_new/resources/HistorySourceDemo';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _stackTemplate: TemplateFunction = stackTemplate;
    protected _filterButtonData: unknown[] = [];

    protected _beforeMount(): void {
        this._filterButtonData = [lookupConfig];
    }

    static _styles: string[] = [
        'DemoStand/Controls-demo',
        'Controls-demo/Filter_new/Filter',
    ];
}
