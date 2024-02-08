import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-ListEnv-demo/Filter/View/Editors/CheckboxGroupEditor/Index';
import { Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { IFilterItem } from 'Controls/filter';
import { IDataConfig, IListDataFactoryArguments } from 'Controls-DataEnv/dataFactory';
import * as filter from './DataFilter';

interface IFilter {
    radioGender: string;
}

export const checkboxGroupConfig = {
    name: 'radioGender',
    value: '',
    resetValue: '',
    textValue: '',
    viewMode: 'basic',
    editorTemplateName: 'Controls-ListEnv/filterPanelExtEditors:CheckboxGroupEditor',
    editorOptions: {
        items: new RecordSet({
            keyProperty: 'id',
            rawData: [
                {
                    id: '1',
                    title: 'Общее рабочее время',
                },
                {
                    id: '2',
                    title: 'Скрыть выходные',
                },
                {
                    id: '3',
                    title: 'Без прошедших плановых отпуско',
                },
            ],
        }),
        keyProperty: 'id',
        displayProperty: 'title',
    },
} as IFilterItem;

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            radioGroupData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        data: [
                            {
                                id: '1',
                                title: 'Общее рабочее время',
                            },
                            {
                                id: '2',
                                title: 'Скрыть выходные',
                            },
                            {
                                id: '3',
                                title: 'Без прошедших плановых отпуско',
                            },
                        ],
                        keyProperty: 'id',
                        filter,
                    }),
                    keyProperty: 'id',
                    displayProperty: 'title',
                    filterDescription: [checkboxGroupConfig],
                },
            },
        };
    }
}
