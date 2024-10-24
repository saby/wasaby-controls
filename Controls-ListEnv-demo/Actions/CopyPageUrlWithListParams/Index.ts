import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv-demo/Actions/CopyPageUrlWithListParams/Index';
import { Memory } from 'Types/source';
import 'Controls-ListEnv-demo/Actions/CopyPageUrlWithListParams/listActions';
import 'Controls-ListEnv/actions';
import { IDataConfig, IListDataFactoryArguments } from 'Controls-DataEnv/dataFactory';
import { dropdownConfig } from 'Controls-ListEnv-demo/FilterPanel/View/Editors/DropdownEditor/Index';
import { departments } from 'Controls-ListEnv-demo/Filter/resources/DataStorage';
import * as filter from './DataFilter';
import 'Controls-ListEnv-demo/Actions/CopyPageUrlWithListParams/CopyUtils';
import 'css!Controls-ListEnv-demo/Filter/filter';

export default class WidgetWrapper extends Control<IControlOptions, void> {
    protected _template: TemplateFunction = template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            actionsFilter: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        data: departments,
                        keyProperty: 'id',
                        filter,
                    }),
                    keyProperty: 'id',
                    displayProperty: 'title',
                    root: null,
                    filterDescription: [dropdownConfig],
                    listConfigStoreId: 'actionsFilter',
                },
            },
        };
    }
}
