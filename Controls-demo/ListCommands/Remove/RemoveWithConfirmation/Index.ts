import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/ListCommands/Remove/RemoveWithConfirmation/Index';
import { getFlatData } from 'Controls-demo/OperationsPanelNew/DemoHelpers/DataCatalog';
import { Memory } from 'Types/source';
import { View as ListView } from 'Controls/list';
import 'css!Controls-demo/ListCommands/ListCommands';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _selectedKeys: string[] = [];
    protected _children: {
        list: ListView;
    };

    protected _source: Memory = new Memory({
        keyProperty: 'key',
        data: getFlatData(),
    });

    protected _delete(): void {
        this._children.list
            .removeItemsWithConfirmation({
                selected: this._selectedKeys,
                excluded: [],
            })
            .then(() => {
                this._children.list.reload();
                this._selectedKeys = [];
            });
    }
}
