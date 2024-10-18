import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/list_new/ItemPadding/ItemPadding';

import DifferentPadding from 'Controls-demo/list_new/ItemPadding/DifferentPadding/Index';
import Master from 'Controls-demo/list_new/ItemPadding/Master/Index';
import NoPadding from 'Controls-demo/list_new/ItemPadding/NoPadding/Index';
import VerticalPadding from 'Controls-demo/list_new/ItemPadding/VerticalPadding/Index';
import HorizontalPadding from 'Controls-demo/list_new/ItemPadding/HorizontalPadding/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...DifferentPadding.getLoadConfig(),
            ...Master.getLoadConfig(),
            ...NoPadding.getLoadConfig(),
            ...VerticalPadding.getLoadConfig(),
            ...HorizontalPadding.getLoadConfig(),
        };
    }
}
