import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-ListEnv-demo/FilterPanel/View/Editors/ListEditor/WithPhoto/Index';
import { Memory } from 'Types/source';
import * as filter from './DataFilter';
import { bigListOfDepartments } from 'Controls-ListEnv-demo/Filter/resources/DataStorage';
import { IFilterItem } from 'Controls/filter';
import 'css!Controls-ListEnv-demo/FilterPanel/filterPanel';

export const listWithPhoto = {
    caption: 'Отдел',
    name: 'department',
    resetValue: null,
    value: null,
    textValue: '',
    editorTemplateName: 'Controls/filterPanel:ListEditor',
    editorOptions: {
        imageProperty: 'sourceImage',
        keyProperty: 'department',
        displayProperty: 'title',
        source: new Memory({
            data: bigListOfDepartments,
            keyProperty: 'department',
        }),
        markerStyle: 'primary',
    },
} as IFilterItem;

export default class WidgetWrapper extends Control<IControlOptions, void> {
    protected _template: TemplateFunction = template;

    static getLoadConfig(): unknown {
        return {
            departments: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        data: bigListOfDepartments,
                        keyProperty: 'department',
                        filter,
                    }),
                    displayProperty: 'title',
                    keyProperty: 'department',
                    filterDescription: [listWithPhoto],
                },
            },
        };
    }
}
