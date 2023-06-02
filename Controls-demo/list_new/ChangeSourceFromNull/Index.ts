import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/ChangeSourceFromNull/ChangeSourceFromNull';
import { Memory } from 'Types/source';
import { getFewCategories as getData } from '../DemoHelpers/DataCatalog';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory = null;

    protected _setSource(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: getData(),
        });
    }
}
