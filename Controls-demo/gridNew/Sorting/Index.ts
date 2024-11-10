import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Sorting/Sorting';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';

import SortingButtonTextOverflow from 'Controls-demo/gridNew/Sorting/SortingButtonTextOverflow/Index';
import SortingButton from 'Controls-demo/gridNew/Sorting/SortingButton/Index';
import SortingSelectorDefault from 'Controls-demo/gridNew/Sorting/SortingSelector/Default/Index';
import SortingSelectorIcons from 'Controls-demo/gridNew/Sorting/SortingSelector/Icons/Index';
import SortingSelectorSortingSelectorWithHeader from 'Controls-demo/gridNew/Sorting/SortingSelector/SortingSelectorWithHeader/Index';
import SortingSelectorSortingSelectorWithReset from 'Controls-demo/gridNew/Sorting/SortingSelector/SortingSelectorWithReset/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;
    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...SortingButtonTextOverflow.getLoadConfig(),
            ...SortingButton.getLoadConfig(),
            ...SortingSelectorDefault.getLoadConfig(),
            ...SortingSelectorIcons.getLoadConfig(),
            ...SortingSelectorSortingSelectorWithHeader.getLoadConfig(),
            ...SortingSelectorSortingSelectorWithReset.getLoadConfig(),
        };
    }
}
