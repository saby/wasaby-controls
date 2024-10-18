import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/treeGridNew/MultiSelect/MultiSelectVisibility/MultiSelectVisibility';

import Visible from 'Controls-demo/treeGridNew/MultiSelect/MultiSelectVisibility/Visible/Index';
import OnHover from 'Controls-demo/treeGridNew/MultiSelect/MultiSelectVisibility/OnHover/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...Visible.getLoadConfig(),
            ...OnHover.getLoadConfig(),
        };
    }
}
