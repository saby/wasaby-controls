import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/MultiSelect/ExcludedKeys/ExcludedKeys';
import { Memory } from 'Types/source';
import { getFewCategories as getData } from '../../DemoHelpers/DataCatalog';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _selectedKeys: number[] = [null];
    protected _excludedKeys: number[] = [1, 2];

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: getData(),
        });
    }
}
