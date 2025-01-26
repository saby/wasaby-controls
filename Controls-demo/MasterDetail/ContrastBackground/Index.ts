import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/MasterDetail/ContrastBackground/Index';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import Grid from 'Controls-demo/MasterDetail/ContrastBackground/grid/Index';
import List from 'Controls-demo/MasterDetail/ContrastBackground/list/Index';
import TreeGrid from 'Controls-demo/MasterDetail/ContrastBackground/treeGrid/Index';
import treeGridVAlignCenter from 'Controls-demo/MasterDetail/ContrastBackground/treeGridVAlignCenter/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): IDataConfig<IListDataFactoryArguments> {
        return {
            ...Grid.getLoadConfig(),
            ...List.getLoadConfig(),
            ...TreeGrid.getLoadConfig(),
            ...treeGridVAlignCenter.getLoadConfig(),
        };
    }
}
