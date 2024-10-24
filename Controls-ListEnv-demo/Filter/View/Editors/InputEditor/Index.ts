import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-ListEnv-demo/Filter/View/Editors/InputEditor/Index';
import { Memory } from 'Types/source';
import { departments } from 'Controls-ListEnv-demo/Filter/resources/DataStorage';
import { IFilterItem } from 'Controls/filter';
import * as filter from './DataFilter';
import { IDataConfig, IListDataFactoryArguments } from 'Controls-DataEnv/dataFactory';

export const inputConfig = {
    name: 'departmentInput',
    caption: 'Отдел',
    editorTemplateName: 'Controls-ListEnv/filterPanelExtEditors:InputEditor',
    resetValue: '',
    value: '',
    textValue: '',
    viewMode: 'extended',
    editorOptions: {
        extendedCaption: 'Поле ввода отделов',
    },
} as IFilterItem;

export const inputBasicConfig = {
    name: 'departmentInputBasic',
    caption: 'Отдел',
    editorTemplateName: 'Controls-ListEnv/filterPanelExtEditors:InputEditor',
    resetValue: '',
    value: 'Разработка',
    textValue: 'Разработка',
    viewMode: 'basic',
    editorOptions: {
        extendedCaption: 'Поле ввода отделов',
    },
} as IFilterItem;

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            inputData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        data: departments,
                        keyProperty: 'id',
                        filter,
                    }),
                    keyProperty: 'id',
                    displayProperty: 'title',
                    filterDescription: [inputConfig],
                },
            },
        };
    }
}
