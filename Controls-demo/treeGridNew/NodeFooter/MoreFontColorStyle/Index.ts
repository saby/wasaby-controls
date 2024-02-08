import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/treeGridNew/NodeFooter/MoreFontColorStyle/MoreFontColorStyle';

import Danger from 'Controls-demo/treeGridNew/NodeFooter/MoreFontColorStyle/Danger/Index';
import Default from 'Controls-demo/treeGridNew/NodeFooter/MoreFontColorStyle/Default/Index';
import Info from 'Controls-demo/treeGridNew/NodeFooter/MoreFontColorStyle/Info/Index';
import Label from 'Controls-demo/treeGridNew/NodeFooter/MoreFontColorStyle/Label/Index';
import Link from 'Controls-demo/treeGridNew/NodeFooter/MoreFontColorStyle/Link/Index';
import Primary from 'Controls-demo/treeGridNew/NodeFooter/MoreFontColorStyle/Primary/Index';
import Secondary from 'Controls-demo/treeGridNew/NodeFooter/MoreFontColorStyle/Secondary/Index';
import Success from 'Controls-demo/treeGridNew/NodeFooter/MoreFontColorStyle/Success/Index';
import Unaccented from 'Controls-demo/treeGridNew/NodeFooter/MoreFontColorStyle/Unaccented/Index';
import Warning from 'Controls-demo/treeGridNew/NodeFooter/MoreFontColorStyle/Warning/Index';
import DefaultValue from 'Controls-demo/treeGridNew/NodeFooter/MoreFontColorStyle/DefaultValue/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...Danger.getLoadConfig(),
            ...Default.getLoadConfig(),
            ...Info.getLoadConfig(),
            ...Label.getLoadConfig(),
            ...Link.getLoadConfig(),
            ...Primary.getLoadConfig(),
            ...Secondary.getLoadConfig(),
            ...Success.getLoadConfig(),
            ...Unaccented.getLoadConfig(),
            ...Warning.getLoadConfig(),
            ...DefaultValue.getLoadConfig(),
        };
    }
}
