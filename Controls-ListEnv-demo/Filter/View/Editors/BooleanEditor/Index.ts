import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls-DataEnv/dataFactory';
import { Memory } from 'Types/source';
import * as filter from './DataFilter';
import * as template from 'wml!Controls-ListEnv-demo/Filter/View/Editors/BooleanEditor/Index';

export const BooleanEditorConfig = {
    caption: '',
    name: 'booleanEditor',
    editorTemplateName: 'Controls/filterPanelEditors:Boolean',
    resetValue: false,
    viewMode: 'extended',
    textValue: '',
    value: false,
    extendedCaption: 'Без рабочих групп',
    editorOptions: {
        filterValue: true,
    },
};

export default class BooleanEditor extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            booleanData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        data: [
                            {
                                name: 'С рабочими группами',
                                booleanEditor: true,
                            },
                            { name: 'Без рабочих групп', booleanEditor: false },
                        ],
                        filter,
                        keyProperty: 'name',
                    }),
                    keyProperty: 'name',
                    displayProperty: 'name',
                    filterDescription: [BooleanEditorConfig],
                },
            },
        };
    }
}
