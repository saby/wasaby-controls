import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { _departmentsDataLong } from 'Controls-ListEnv-demo/SuggestSearch/resources/DataCatalog';
import controlTemplate = require('wml!Controls-ListEnv-demo/SuggestSearch/FooterTemplate/resources/ContentTemplate');

export default class extends Control {
    protected _template: TemplateFunction = controlTemplate;
    private _source: Memory;

    protected _beforeMount(): void {
        this._source = new Memory({
            keyProperty: 'id',
            data: _departmentsDataLong,
        });
    }
}
