import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import 'css!Controls/masterDetail';
import 'css!Controls/CommonClasses';

import { master } from 'Controls-demo/MasterDetail/Data';

import * as Template from 'wml!Controls-demo/MasterDetail/MasterResults/Master';
import * as numberResultTpl from 'wml!Controls-demo/gridNew/resources/ResultCellTemplates/Number';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _columns: IColumn[] = [
        {
            displayProperty: 'name',
            width: '1fr',
        },
        {
            displayProperty: 'counter',
            width: 'auto',
            resultTemplate: numberResultTpl,
            result: '100000',
        },
    ];

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'id',
            data: master,
        });
    }
}
