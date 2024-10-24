import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/MenuIconSize/MenuIconSize';

import m from 'Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/MenuIconSize/m/Index';
import s from 'Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/MenuIconSize/s/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...m.getLoadConfig(),
            ...s.getLoadConfig(),
        };
    }
}
