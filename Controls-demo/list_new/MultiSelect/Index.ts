import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import * as Template from 'wml!Controls-demo/list_new/MultiSelect/MultiSelect';

import MultiSelectVisibilityOnHover from 'Controls-demo/list_new/MultiSelect/MultiSelectVisibility/OnHover/Index';
import MultiSelectVisibilityVisible from 'Controls-demo/list_new/MultiSelect/MultiSelectVisibility/Visible/Index';
import AllSelected from 'Controls-demo/list_new/MultiSelect/AllSelected/Index';
import CustomPosition from 'Controls-demo/list_new/MultiSelect/CustomPosition/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...MultiSelectVisibilityOnHover.getLoadConfig(),
            ...MultiSelectVisibilityVisible.getLoadConfig(),
            ...AllSelected.getLoadConfig(),
            ...CustomPosition.getLoadConfig(),
        };
    }
}
