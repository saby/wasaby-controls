import { Control, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/list_new/ColumnsView/ItemsContainerPadding/Index');
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import ColumnsViewItemsContainerPaddingdefault from 'Controls-demo/list_new/ColumnsView/ItemsContainerPadding/default/Index';
import ColumnsViewItemsContainerPaddingnull from 'Controls-demo/list_new/ColumnsView/ItemsContainerPadding/null/Index';
import ColumnsViewItemsContainerPaddingl from 'Controls-demo/list_new/ColumnsView/ItemsContainerPadding/l/Index';
import ColumnsViewItemsContainerPaddingm from 'Controls-demo/list_new/ColumnsView/ItemsContainerPadding/m/Index';
import ColumnsViewItemsContainerPaddingxl from 'Controls-demo/list_new/ColumnsView/ItemsContainerPadding/xl/Index';
import ColumnsViewItemsContainerPaddings from 'Controls-demo/list_new/ColumnsView/ItemsContainerPadding/s/Index';
import ColumnsViewItemsContainerPaddingxs from 'Controls-demo/list_new/ColumnsView/ItemsContainerPadding/xs/Index';

export default class RenderDemo extends Control {
    protected _template: TemplateFunction = template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...ColumnsViewItemsContainerPaddingdefault.getLoadConfig(),
            ...ColumnsViewItemsContainerPaddingnull.getLoadConfig(),
            ...ColumnsViewItemsContainerPaddingl.getLoadConfig(),
            ...ColumnsViewItemsContainerPaddingm.getLoadConfig(),
            ...ColumnsViewItemsContainerPaddingxl.getLoadConfig(),
            ...ColumnsViewItemsContainerPaddings.getLoadConfig(),
            ...ColumnsViewItemsContainerPaddingxs.getLoadConfig(),
        };
    }
}
