import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';

import { Tasks } from 'Controls-demo/gridNew/DemoHelpers/Data/Tasks';

import * as Template from 'wml!Controls-demo/gridNew/NewColumnScroll/WithGroups/WithSeparator/WithSeparator';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _columns: IColumn[] = [
        ...Tasks.getDefaultColumns(),
        {
            displayProperty: 'message',
            width: '150px',
        },
        {
            displayProperty: 'fullName',
            width: '150px',
        },
    ];
    protected _header: object[] = this._columns.map((c) => {
        return { caption: c.displayProperty };
    });

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: Tasks.getData(),
        });
    }
}
