import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/Toolbar/PopupFooterTemplate/Template');
import { RecordSet } from 'Types/collection';
import { data } from '../resources/toolbarItems';

class FooterTemplate extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _items: RecordSet;

    protected _beforeMount(): void {
        this._items = new RecordSet({
            keyProperty: 'id',
            rawData: data.getDefaultItems(),
        });
    }
}
export default FooterTemplate;
