import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import {
    IDataConfig,
    IListDataFactoryArguments,
} from 'Controls-DataEnv/dataFactory';
import { Memory } from 'Types/source';
import * as filter from 'Controls-ListEnv-demo/Filter/View/Editors/NumberRangeEditor/DataFilter';
import { NumberRangeEditorConfig } from 'Controls-ListEnv-demo/Filter/View/Editors/NumberRangeEditor/Index';
import { BooleanEditorConfig } from 'Controls-ListEnv-demo/Filter/View/Editors/BooleanEditor/Index';
import * as template from 'wml!Controls-ListEnv-demo/Filter/View/FilterVisibilityCallback/Index';

const editorWithVisibilityCallback = {
    ...BooleanEditorConfig,
    ...{
        filterVisibilityCallback:
            'Controls-ListEnv-demo/Filter/View/FilterVisibilityCallback/FilterVisibilityCallback',
    },
};

export default class FilterEditors extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;

    static getLoadConfig(): Record<
        string,
        IDataConfig<IListDataFactoryArguments>
    > {
        return {
            filterData: {
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
                    filterDescription: [
                        NumberRangeEditorConfig,
                        editorWithVisibilityCallback,
                    ],
                },
            },
        };
    }
}
