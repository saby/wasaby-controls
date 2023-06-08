import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/Navigation/MoreFontColorStyle/Success/Success';
import { Memory } from 'Types/source';
import { generateData } from 'Controls-demo/list_new/DemoHelpers/DataCatalog';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    private _dataArray: unknown = generateData({
        count: 30,
        entityTemplate: { title: 'lorem' },
    });

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: this._dataArray,
        });
    }
}
