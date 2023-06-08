import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-ListEnv-demo/Filter/View/Editors/RadioGroupEditor/Index';
import { Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { IFilterItem } from 'Controls/filter';
import { IDataConfig, IListDataFactoryArguments } from 'Controls-DataEnv/dataFactory';
import * as filter from './DataFilter';

interface IFilter {
    radioGender: string;
}

export const radioGroupConfig = {
    name: 'radioGender',
    caption: 'Пол',
    value: '1',
    resetValue: '1',
    textValue: '',
    viewMode: 'basic',
    editorTemplateName: 'Controls/filterPanelExtEditors:RadioGroupEditor',
    editorOptions: {
        items: new RecordSet({
            keyProperty: 'id',
            rawData: [
                {
                    id: '1',
                    title: 'Мужской',
                },
                {
                    id: '2',
                    title: 'Женский',
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
                                title: 'Мужской',
                            },
                            {
                                id: '2',
                                title: 'Женский',
                            },
                        ],
                        keyProperty: 'id',
                        filter,
                    }),
                    keyProperty: 'id',
                    displayProperty: 'title',
                    filterDescription: [radioGroupConfig],
                },
            },
        };
    }
}
