import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/gridNew/TagStyle/TagStyle';

import TagStyleFromCellData from 'Controls-demo/gridNew/TagStyle/TagStyleFromCellData/Index';
import TagStyleFromTemplateParam from 'Controls-demo/gridNew/TagStyle/TagStyleFromTemplateParam/Index';
import TagClick from 'Controls-demo/gridNew/TagStyle/TagClick/Index';
import TagHover from 'Controls-demo/gridNew/TagStyle/TagHover/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...TagStyleFromCellData.getLoadConfig(),
            ...TagStyleFromTemplateParam.getLoadConfig(),
            ...TagClick.getLoadConfig(),
            ...TagHover.getLoadConfig(),
        };
    }
}
