import { Control, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/dropdown_new/Button/WithoutItems/Simple/Index');
import { Memory } from 'Types/source';

export default class extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _source: Memory;

    protected _beforeMount(): void {
        this._source = new Memory({
            keyProperty: 'key',
            data: [],
        });
    }
    static _styles: string[] = ['Controls-demo/dropdown_new/Button/Index'];
}
