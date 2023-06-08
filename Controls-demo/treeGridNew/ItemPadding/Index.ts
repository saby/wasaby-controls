import { Control, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import { IColumn } from 'Controls/grid';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import * as Template from 'wml!Controls-demo/treeGridNew/ItemPadding/ItemPadding';
import { Flat } from 'Controls-demo/treeGridNew/DemoHelpers/Data/Flat';

import Custom from 'Controls-demo/treeGridNew/ItemPadding/Custom/Index';
import Standard from 'Controls-demo/treeGridNew/ItemPadding/Standard/Index';
import Horizontal from 'Controls-demo/treeGridNew/ItemPadding/Horizontal/Index';
import Vertical from 'Controls-demo/treeGridNew/ItemPadding/Vertical/Index'

export default class extends Control {
    protected _template: TemplateFunction = Template;
    protected _viewSource: Memory;
    protected _columns: IColumn[] = [
        {
            displayProperty: 'title',
        },
    ];

    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'key',
            data: Flat.getData(),
        });
    }

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...Custom.getLoadConfig(),
            ...Standard.getLoadConfig(),
            ...Horizontal.getLoadConfig(),
            ...Vertical.getLoadConfig(),
        };
    }
}
