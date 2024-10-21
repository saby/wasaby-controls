import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-TabsLayout-demo/Floating/Panel';
import 'css!Controls-TabsLayout-demo/Floating/Index';
import { RecordSet } from 'Types/collection';
import { StackOpener } from 'Controls/popup';

export default class FloatingTabsDemo extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _items: RecordSet;
    protected _stackWidth: number = 500;
    private _stackOpener: StackOpener;

    protected _afterMount(): void {
        this._stackOpener = new StackOpener();
    }

    protected _openStack(): void {
        this._stackOpener.open({
            template: 'Controls-TabsLayout-demo/Floating/Template/StackTemplate',
            width: this._stackWidth,
            minWidth: 300,
            maxWidth: 1800,
            propStorageId: 'floatingTabsPopup',
            opener: null,
        });
    }
}
