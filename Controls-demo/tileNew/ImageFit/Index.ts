import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/tileNew/ImageFit/ImageFit';

import Contain from 'Controls-demo/tileNew/ImageFit/Contain/Index';
import Cover from 'Controls-demo/tileNew/ImageFit/Cover/Index';
import None from 'Controls-demo/tileNew/ImageFit/None/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...Contain.getLoadConfig(),
            ...Cover.getLoadConfig(),
            ...None.getLoadConfig(),
        };
    }
}
