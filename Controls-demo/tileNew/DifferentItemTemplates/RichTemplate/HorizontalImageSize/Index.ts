import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import * as Template from 'wml!Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/HorizontalImageSize/HorizontalImageSize';

import HorizontalImageSize2xl from 'Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/HorizontalImageSize/2xl/Index';
import HorizontalImageSize3xl from 'Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/HorizontalImageSize/3xl/Index';
import HorizontalImageSize4xl from 'Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/HorizontalImageSize/4xl/Index';
import HorizontalImageSize5xl from 'Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/HorizontalImageSize/5xl/Index';
import HorizontalImageSize6xl from 'Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/HorizontalImageSize/6xl/Index';
import HorizontalImageSize7xl from 'Controls-demo/tileNew/DifferentItemTemplates/RichTemplate/HorizontalImageSize/7xl/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...HorizontalImageSize2xl.getLoadConfig(),
            ...HorizontalImageSize3xl.getLoadConfig(),
            ...HorizontalImageSize4xl.getLoadConfig(),
            ...HorizontalImageSize5xl.getLoadConfig(),
            ...HorizontalImageSize6xl.getLoadConfig(),
            ...HorizontalImageSize7xl.getLoadConfig(),
        };
    }
}
