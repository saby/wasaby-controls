import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/list_new/Navigation/MoreFontColorStyle/MoreFontColorStyle';

import Danger from 'Controls-demo/list_new/Navigation/MoreFontColorStyle/Danger/Index';
import Default from 'Controls-demo/list_new/Navigation/MoreFontColorStyle/Default/Index';
import DefaultValue from 'Controls-demo/list_new/Navigation/MoreFontColorStyle/DefaultValue/Index';
import Info from 'Controls-demo/list_new/Navigation/MoreFontColorStyle/Info/Index';
import Label from 'Controls-demo/list_new/Navigation/MoreFontColorStyle/Label/Index';
import Link from 'Controls-demo/list_new/Navigation/MoreFontColorStyle/Link/Index';
import Primary from 'Controls-demo/list_new/Navigation/MoreFontColorStyle/Primary/Index';
import Secondary from 'Controls-demo/list_new/Navigation/MoreFontColorStyle/Secondary/Index';
import Success from 'Controls-demo/list_new/Navigation/MoreFontColorStyle/Success/Index';
import Unaccented from 'Controls-demo/list_new/Navigation/MoreFontColorStyle/Unaccented/Index';
import Warning from 'Controls-demo/list_new/Navigation/MoreFontColorStyle/Warning/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...Danger.getLoadConfig(),
            ...Default.getLoadConfig(),
            ...DefaultValue.getLoadConfig(),
            ...Info.getLoadConfig(),
            ...Label.getLoadConfig(),
            ...Link.getLoadConfig(),
            ...Primary.getLoadConfig(),
            ...Secondary.getLoadConfig(),
            ...Success.getLoadConfig(),
            ...Unaccented.getLoadConfig(),
            ...Warning.getLoadConfig(),
        };
    }
}
