import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/ItemTemplate/CheckboxReadOnly/CheckboxReadOnly';
import { Memory } from 'Types/source';
import { getFewCategories as getData } from '../../DemoHelpers/DataCatalog';

// Демка для теста https://online.sbis.ru/opendoc.html?guid=1e54d20d-1c75-4ab1-81e7-415a4aa98013
export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _selectedKeys: [] = [4, 5];
    protected _excludedKeys: [] = [];

    protected _beforeMount(): void {
        const data = getData();

        this._viewSource = new Memory({
            keyProperty: 'key',
            data,
        });
    }
}
