import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/treeGridNew/TagStyle/TagStyle';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import TagStyleFromCellData from 'Controls-demo/treeGridNew/TagStyle/TagStyleFromCellData/Index';
import TagStyleFromTemplateParam from 'Controls-demo/treeGridNew/TagStyle/TagStyleFromTemplateParam/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...TagStyleFromCellData.getLoadConfig(),
            ...TagStyleFromTemplateParam.getLoadConfig(),
        };
    }
}
