import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/explorerNew/Index';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import backgroundStylecustom from 'Controls-demo/explorerNew/backgroundStyle/custom/Index';
import ChangeRoot from 'Controls-demo/explorerNew/ChangeRoot/Index';
import BreadcrumbsNewDesign from 'Controls-demo/explorerNew/BreadcrumbsNewDesign/Index';
import ColumnScroll from 'Controls-demo/explorerNew/ColumnScroll/Index';
import DragNDropWithTile from 'Controls-demo/explorerNew/DragNDropWithTile/Index';
import Default from 'Controls-demo/explorerNew/Default/Index';
import Falling from 'Controls-demo/explorerNew/Falling/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...backgroundStylecustom.getLoadConfig(),
            ...ChangeRoot.getLoadConfig(),
            ...BreadcrumbsNewDesign.getLoadConfig(),
            ...ColumnScroll.getLoadConfig(),
            ...DragNDropWithTile.getLoadConfig(),
            ...Default.getLoadConfig(),
            ...Falling.getLoadConfig(),
        };
    }
}
