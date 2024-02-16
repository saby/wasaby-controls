import { Control, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/list_new/ColumnsView/ItemPadding/Index');
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import ColumnsViewItemPaddingdefault from 'Controls-demo/list_new/ColumnsView/ItemPadding/default/Index';
import ColumnsViewItemPaddingl from 'Controls-demo/list_new/ColumnsView/ItemPadding/l/Index';
import ColumnsViewItemPaddingnull from 'Controls-demo/list_new/ColumnsView/ItemPadding/null/Index';
import ColumnsViewItemPaddings from 'Controls-demo/list_new/ColumnsView/ItemPadding/s/Index';
import ColumnsViewItemPaddingm from 'Controls-demo/list_new/ColumnsView/ItemPadding/m/Index';
import ColumnsViewItemPaddingSwitch from 'Controls-demo/list_new/ColumnsView/ItemPadding/Switch/Index';
import ColumnsViewItemPaddingxs from 'Controls-demo/list_new/ColumnsView/ItemPadding/xs/Index';
import ColumnsViewItemPaddingxl from 'Controls-demo/list_new/ColumnsView/ItemPadding/xl/Index';

export default class RenderDemo extends Control {
    protected _template: TemplateFunction = template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...ColumnsViewItemPaddingdefault.getLoadConfig(),
            ...ColumnsViewItemPaddingl.getLoadConfig(),
            ...ColumnsViewItemPaddingnull.getLoadConfig(),
            ...ColumnsViewItemPaddings.getLoadConfig(),
            ...ColumnsViewItemPaddingm.getLoadConfig(),
            ...ColumnsViewItemPaddingSwitch.getLoadConfig(),
            ...ColumnsViewItemPaddingxs.getLoadConfig(),
            ...ColumnsViewItemPaddingxl.getLoadConfig(),
        };
    }
}
