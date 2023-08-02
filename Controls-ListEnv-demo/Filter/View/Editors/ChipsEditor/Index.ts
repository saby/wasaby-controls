import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls-DataEnv/dataFactory';
import { RecordSet } from 'Types/collection';
import { Memory } from 'Types/source';
import * as filter from './DataFilter';
import * as template from 'wml!Controls-ListEnv-demo/Filter/View/Editors/ChipsEditor/Index';

export const ChipsConfig = {
    caption: 'Пол',
    name: 'gender',
    value: null,
    resetValue: [],
    textValue: '',
    viewMode: 'basic',
    editorTemplateName: 'Controls/filterPanelExtEditors:ChipsEditor',
    editorOptions: {
        items: new RecordSet({
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
            keyProperty: 'id',
        }),
    },
};

export default class ChipsEditor extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            chipsData: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    source: new Memory({
                        data: [
                            { caption: 'Мужской', gender: '1' },
                            { caption: 'Женский', gender: '2' },
                        ],
                        filter,
                        keyProperty: 'caption',
                    }),
                    keyProperty: 'caption',
                    displayProperty: 'caption',
                    filterDescription: [ChipsConfig],
                },
            },
        };
    }
}
