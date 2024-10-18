import { Control, TemplateFunction } from 'UI/Base';
import Template from 'wml!Controls-demo/treeGridNew/EditArrow/EditArrow';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import EditArrowBackgroundStyle from 'Controls-demo/treeGridNew/EditArrow/BackgroundStyle/Index';
import EditArrowBase from 'Controls-demo/treeGridNew/EditArrow/Base/Index';
import EditArrowWithColumnTemplate from 'Controls-demo/treeGridNew/EditArrow/WithColumnTemplate/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...EditArrowBackgroundStyle.getLoadConfig(),
            ...EditArrowBase.getLoadConfig(),
            ...EditArrowWithColumnTemplate.getLoadConfig(),
        };
    }
}
