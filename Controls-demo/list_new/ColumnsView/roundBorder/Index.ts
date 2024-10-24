import {Control, TemplateFunction} from 'UI/Base';
import {IDataConfig, IListDataFactoryArguments} from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/list_new/ColumnsView/roundBorder/RoundBorder';

import Default from 'Controls-demo/list_new/ColumnsView/roundBorder/default/Index';
import Xs from 'Controls-demo/list_new/ColumnsView/roundBorder/xs/Index';
import S from 'Controls-demo/list_new/ColumnsView/roundBorder/s/Index';
import M from 'Controls-demo/list_new/ColumnsView/roundBorder/m/Index';
import L from 'Controls-demo/list_new/ColumnsView/roundBorder/l/Index';
import XL from 'Controls-demo/list_new/ColumnsView/roundBorder/xl/Index';

/**
 * Демка для автотеста
 */
export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...Default.getLoadConfig(),
            ...Xs.getLoadConfig(),
            ...S.getLoadConfig(),
            ...M.getLoadConfig(),
            ...L.getLoadConfig(),
            ...XL.getLoadConfig(),
        };
    }
}
