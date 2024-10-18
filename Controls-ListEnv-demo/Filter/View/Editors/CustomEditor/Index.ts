import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-ListEnv-demo/Filter/View/Editors/CustomEditor/Index';
import { Memory } from 'Types/source';
import { departments } from 'Controls-ListEnv-demo/Filter/resources/DataStorage';
import { IDataConfig, IListDataFactoryArguments } from 'Controls-DataEnv/dataFactory';

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
                    }),
                    keyProperty: 'id',
                    displayProperty: 'title',
                    filterDescription: [
                        {
                            name: 'staff',
                            editorTemplateName:
                                'Controls-ListEnv-demo/Filter/View/Editors/CustomEditor/CustomFilter',
                            value: ['1', '1'],
                            resetValue: ['1', '1'],
                            textValue: '',
                            viewMode: 'basic',
                            editorOptions: {},
                        },
                    ],
                },
            },
        };
    }
}
