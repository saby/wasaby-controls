import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Base/Base';
import { RecordSet } from 'Types/collection';
import { IColumn } from 'Controls/grid';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[] = Countries.getColumns();
    protected _items = new RecordSet({
        keyProperty: 'key',
        rawData: Countries.getData(),
    });
}
