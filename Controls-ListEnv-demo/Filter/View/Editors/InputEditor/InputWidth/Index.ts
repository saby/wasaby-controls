import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-ListEnv-demo/Filter/View/Editors/InputEditor/InputWidth/Index';
import { Memory } from 'Types/source';
import { IFilterItem } from 'Controls/filter';
import { IDataConfig, IListDataFactoryArguments } from 'Controls-DataEnv/dataFactory';

const inputMinConfig = {
    name: 'departmentInputBasic',
    caption: 'Зар.плата',
    editorTemplateName: 'Controls-ListEnv/filterPanelExtEditors:InputEditor',
    resetValue: '',
    value: '123',
    textValue: '123',
    viewMode: 'basic',
    editorOptions: {
        inputWidth: 's',
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
                        data: [],
                        keyProperty: 'id',
                    }),
                    keyProperty: 'id',
                    displayProperty: 'title',
                    filterDescription: [inputMinConfig],
                },
            },
        };
    }
}
