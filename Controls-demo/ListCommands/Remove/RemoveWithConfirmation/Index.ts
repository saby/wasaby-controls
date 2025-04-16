import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-demo/ListCommands/Remove/RemoveWithConfirmation/Index';
import { getFlatData as getData } from 'Controls-demo/OperationsPanelNew/DemoHelpers/DataCatalog';
import { Memory } from 'Types/source';
import { View as ListView } from 'Controls/list';
import 'css!Controls-demo/ListCommands/ListCommands';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

export default class extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _selectedKeys: string[] = [];
    protected _children: {
        list: ListView;
    };

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

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            listData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                    multiSelectVisibility: 'visible',
                },
            },
        };
    }
}
