import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls-DataEnv/dataFactory';
import { Memory } from 'Types/source';
import * as filter from './DataFilter';
import * as template from 'wml!Controls-ListEnv-demo/Filter/View/Editors/NumberRangeEditor/Index';

export const NumberRangeEditorConfig = {
    caption: 'Зар. плата',
    name: 'salary',
    editorTemplateName: 'Controls/filterPanelExtEditors:NumberRangeEditor',
    resetValue: [],
    value: [],
    textValue: '',
    viewMode: 'extended',
    extendedCaption: 'Зар. плата',
};

export default class NumberRangeEditor extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            numberRangeData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        data: [
                            { name: 'Зарлата 20т.р', salary: 20 },
                            { name: 'Зарлата 50т.р', salary: 50 },
                        ],
                        filter,
                        keyProperty: 'name',
                    }),
                    keyProperty: 'name',
                    displayProperty: 'name',
                    filterDescription: [NumberRangeEditorConfig],
                },
            },
        };
    }
}
