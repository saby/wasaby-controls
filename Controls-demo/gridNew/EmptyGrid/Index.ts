import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/EmptyGrid/EmptyGrid';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import WithHeader from 'Controls-demo/gridNew/EmptyGrid/WithHeader/Index';
import WithoutHeader from 'Controls-demo/gridNew/EmptyGrid/WithoutHeader/Index';
import Editing from 'Controls-demo/gridNew/EmptyGrid/Editing/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...WithHeader.getLoadConfig(),
            ...WithoutHeader.getLoadConfig(),
            ...Editing.getLoadConfig(),
        };
    }
}

