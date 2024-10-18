import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/DifferentItemTemplates';

import CustomTemplate from 'Controls-demo/tileNew/DifferentItemTemplates/CustomTemplate/Index';
import PreviewTemplate from 'Controls-demo/tileNew/DifferentItemTemplates/PreviewTemplate/Index'
import SmallTemplate from 'Controls-demo/tileNew/DifferentItemTemplates/SmallTemplate/Index'
import MediumTemplate from 'Controls-demo/tileNew/DifferentItemTemplates/MediumTemplate/Index'
import RichTemplate from 'Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/Index'

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...CustomTemplate.getLoadConfig(),
            ...PreviewTemplate.getLoadConfig(),
            ...SmallTemplate.getLoadConfig(),
            ...MediumTemplate.getLoadConfig(),
            ...RichTemplate.getLoadConfig(),
        };
    }
}
